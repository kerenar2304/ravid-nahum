/* PREVIEW-ONLY font inspector: add ?fonts to the address. Hover any text to see its font, size and weight. Not part of the site. */
(function () {
  if (!/[?&]fonts\b/.test(location.search)) return;
  var tip = document.createElement("div");
  tip.style.cssText = "position:fixed;z-index:10000;pointer-events:none;background:#042a2b;color:#e0e0cf;font:12px/1.5 system-ui,sans-serif;padding:6px 9px;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,.3);direction:ltr;white-space:nowrap;display:none";
  var badge = document.createElement("div");
  badge.textContent = "מצב בדיקת פונטים · רחפי מעל טקסט";
  badge.style.cssText = "position:fixed;z-index:10000;left:10px;bottom:10px;background:#a56332;color:#fff;font:13px system-ui,sans-serif;padding:6px 12px;border-radius:20px";
  document.body.appendChild(tip); document.body.appendChild(badge);
  var last = null;
  var names = { 300: "Light", 400: "Regular", 600: "SemiBold" };
  function fontName(cs) {
    var fam = cs.fontFamily.replace(/"/g, "").split(",").map(function (s) { return s.trim(); }).filter(function (f) { return f !== "Num"; })[0];
    var w = parseInt(cs.fontWeight, 10);
    if (fam === "Leon Product") return "Leon Product " + (w >= 600 ? "Bold" : "Regular");
    if (fam === "Leon") return "Leon " + (w >= 600 ? "Bold" : w >= 400 ? "Regular" : "Thin");
    return fam + " " + (names[w] || w);
  }
  function scale(el) {
    var c = el.closest('[class*="t-1"],[class*="t-2"],[class*="t-3"],[class*="t-4"]');
    if (!c) return "";
    var m = c.className.match(/\bt-(1|2|3s|3|4)\b/);
    return m ? "  ·  רמה t-" + m[1] : "";
  }
  document.addEventListener("mousemove", function (e) {
    var el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || !el.textContent || !el.textContent.trim() || el === tip || el === badge) { tip.style.display = "none"; return; }
    if (last && last !== el) last.style.outline = "";
    last = el; el.style.outline = "1px dashed #a56332";
    var cs = getComputedStyle(el), z = parseFloat(getComputedStyle(document.documentElement).zoom || "1") || 1;
    var px = parseFloat(cs.fontSize);
    tip.textContent = fontName(cs) + "  ·  " + Math.round(px) + "px" + (z !== 1 ? " (on screen ≈" + Math.round(px * z) + "px)" : "") + scale(el);
    tip.style.display = "block";
    var x = Math.min(e.clientX + 14, innerWidth - tip.offsetWidth - 8), y = e.clientY + 18;
    tip.style.left = x + "px"; tip.style.top = (y + tip.offsetHeight > innerHeight ? e.clientY - tip.offsetHeight - 10 : y) + "px";
  }, { passive: true });
})();
