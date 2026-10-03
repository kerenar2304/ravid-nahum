/* TEMPORARY positioning panel for the phone/tablet hero image. Active only with ?edit in the URL. Not part of the site. */
(function () {
  if (!/[?&]edit\b/.test(location.search)) return;
  function start() {
    var img = document.querySelector('img[src*="hero-mobile"]');
    if (!img) return setTimeout(start, 300);
    var v = { size: 100, up: 0, side: 0 };
    var apply = function () {
      img.style.width = "calc(" + v.size + "% + 12vw)";
      img.style.marginTop = (-v.up) + "px";
      img.style.transform = "translateX(" + v.side + "px)";
      out.textContent = "רוחב מסך " + document.documentElement.clientWidth + " · גודל " + v.size + " · למעלה " + v.up + " · צד " + v.side;
    };
    var p = document.createElement("div");
    p.dir = "rtl";
    p.style.cssText = "position:fixed;z-index:9999;left:8px;right:8px;bottom:8px;background:rgba(4,42,43,.95);color:#e0e0cf;font:14px system-ui,sans-serif;padding:12px 14px;border-radius:14px";
    var rows = [["size", "גודל", 60, 160], ["up", "למעלה ↑", -200, 500], ["side", "לצדדים", -300, 300]];
    p.innerHTML = '<b>התאמת תמונת הירו</b>' + rows.map(function (r) { return '<label style="display:flex;align-items:center;gap:8px;margin:6px 0"><span style="width:70px">' + r[1] + '</span><input type="range" dir="ltr" data-k="' + r[0] + '" min="' + r[2] + '" max="' + r[3] + '" value="' + v[r[0]] + '" style="flex:1"></label>'; }).join("") + '<div id="rn-out" style="margin-top:6px;font:13px monospace;direction:rtl;background:rgba(224,224,207,.12);padding:6px 8px;border-radius:8px"></div><div style="font-size:12px;opacity:.75;margin-top:4px">כשזה נראה טוב: צלמי מסך של השורה הזאת ושלחי לי</div>';
    document.body.appendChild(p);
    var out = p.querySelector("#rn-out");
    p.querySelectorAll("input").forEach(function (inp) { inp.addEventListener("input", function () { v[inp.dataset.k] = +inp.value; apply(); }); });
    apply();
  }
  start();
})();
