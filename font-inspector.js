/* PREVIEW-ONLY font inspector: add ?fonts to the address.
   Every text on screen gets a small fixed label right above it: font · weight · size · scale level.
   Not part of the site. */
(function () {
  if (!/[?&]fonts\b/.test(location.search)) return;

  var NAMES = { 300: "Light", 400: "Regular", 600: "SemiBold" };
  function fontName(cs) {
    var fam = cs.fontFamily.replace(/"/g, "").split(",").map(function (s) { return s.trim(); })
      .filter(function (f) { return f !== "Num"; })[0];
    if (!fam) return "Montserrat (ספרות)";
    var w = parseInt(cs.fontWeight, 10);
    if (fam === "Leon Product") return "Leon Product " + (w >= 600 ? "Bold" : "Regular");
    if (fam === "Leon") return "Leon " + (w >= 600 ? "Bold" : w >= 400 ? "Regular" : "Thin");
    return fam + " " + (NAMES[w] || w);
  }
  function level(el) {
    var c = el.closest('[class*="t-"]');
    var m = c && String(c.className).match(/\bt-(1|2|3s|3|4)\b/);
    return m ? " · t-" + m[1] : "";
  }
  /* the element that directly holds visible text */
  function textHolders() {
    var out = [], seen = new Set();
    var walk = document.createTreeWalker(document.getElementById("root") || document.body, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = walk.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      var el = n.parentElement;
      if (!el || seen.has(el) || el.closest("[data-fi]")) continue;
      // letters split for animation: label the whole word/line, not each letter
      var flip = el.closest(".rn-flip");
      if (flip) el = flip.parentElement.closest("span[aria-label]") || flip.parentElement;
      if (seen.has(el)) continue;
      seen.add(el);
      out.push(el);
    }
    return out;
  }

  var layer = document.createElement("div");
  layer.setAttribute("data-fi", "");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:10000";
  var badge = document.createElement("div");
  badge.setAttribute("data-fi", "");
  badge.textContent = "מצב בדיקת פונטים";
  badge.style.cssText = "position:fixed;z-index:10001;left:10px;bottom:10px;background:#a56332;color:#fff;font:13px system-ui,sans-serif;padding:6px 12px;border-radius:20px;pointer-events:none";
  document.body.appendChild(layer);
  document.body.appendChild(badge);

  var labels = new Map();
  function labelFor(el) {
    var l = labels.get(el);
    if (!l) {
      l = document.createElement("span");
      l.style.cssText = "position:absolute;left:0;top:0;will-change:transform;background:#042a2b;color:#e0e0cf;font:600 10px/1.4 system-ui,sans-serif;padding:1px 5px;border-radius:3px;white-space:nowrap;direction:ltr;box-shadow:0 1px 4px rgba(0,0,0,.25)";
      layer.appendChild(l);
      labels.set(el, l);
    }
    return l;
  }

  var raf = 0, holders = [];
  // labels are written once per scan; scrolling only moves them (read all rects first, then write) so the page stays smooth
  function scan() {
    holders = textHolders();
    holders.forEach(function (el) {
      var cs = getComputedStyle(el);
      var l = labelFor(el);
      l.textContent = fontName(cs) + " · " + Math.round(parseFloat(cs.fontSize)) + "px" + level(el);
      l.dataset.hide = cs.visibility === "hidden" || parseFloat(cs.opacity) === 0 ? "1" : "";
      l.style.display = "block";
      l.dataset.w = String(l.offsetWidth);
    });
    req();
  }
  function paint() {
    raf = 0;
    var vh = innerHeight * 2, vw = layer.clientWidth;
    var rects = holders.map(function (el) { return el.getBoundingClientRect(); });
    holders.forEach(function (el, i) {
      var r = rects[i], l = labels.get(el);
      if (!l) return;
      var on = !l.dataset.hide && r.width > 0 && r.bottom > 0 && r.top < vh;
      l.style.display = on ? "block" : "none";
      if (!on) return;
      var lw = +l.dataset.w || 120;
      l.style.transform = "translate(" + Math.max(2, Math.min(r.right - lw, vw - lw - 2)) + "px," + Math.max(2, r.top - 15) + "px)";
    });
  }
  function req() { if (!raf) raf = requestAnimationFrame(paint); }

  setTimeout(scan, 600);
  setTimeout(scan, 2500); // after the entrance animations
  addEventListener("scroll", req, { passive: true });
  addEventListener("resize", req);
})();
