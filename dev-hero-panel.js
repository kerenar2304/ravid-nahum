/* TEMPORARY positioning panel for the phone hero image. Active only with ?edit in the URL. Not part of the site. */
(function () {
  if (!/[?&]edit\b/.test(location.search)) return;
  function start() {
    var img = document.querySelector('img[src*="hero-mobile"]');
    if (!img) return setTimeout(start, 300);
    var v = { width: 100, up: 0, side: 0 };
    try { Object.assign(v, JSON.parse(localStorage.getItem("rn-hero-mobile") || "{}")); } catch (e) {}
    var apply = function () {
      img.style.width = v.width + "%";
      img.style.maxWidth = "none";
      img.style.marginTop = (-v.up) + "px";
      img.style.transform = "translateX(" + v.side + "px)";
      try { localStorage.setItem("rn-hero-mobile", JSON.stringify(v)); } catch (e) {}
    };
    var p = document.createElement("div");
    p.dir = "rtl";
    p.style.cssText = "position:fixed;z-index:9999;left:8px;right:8px;bottom:8px;background:rgba(4,42,43,.95);color:#e0e0cf;font:14px system-ui,sans-serif;padding:12px 14px;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.25)";
    var rows = [["width", "גודל התמונה", 60, 140], ["up", "הזזה למעלה ↑", -150, 250], ["side", "הזזה לצדדים", -120, 120]];
    p.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b>התאמת תמונת הירו</b><button id="rn-ok" style="background:#a56332;color:#fff;border:0;border-radius:20px;padding:7px 16px;font:inherit">אישור</button></div>' +
      rows.map(function (r) { return '<label style="display:flex;align-items:center;gap:8px;margin:6px 0"><span style="width:96px">' + r[1] + '</span><input type="range" dir="ltr" data-k="' + r[0] + '" min="' + r[2] + '" max="' + r[3] + '" value="' + v[r[0]] + '" style="flex:1"><span data-o="' + r[0] + '" style="width:36px;text-align:left">' + v[r[0]] + '</span></label>'; }).join("");
    document.body.appendChild(p);
    p.querySelectorAll("input").forEach(function (inp) {
      inp.addEventListener("input", function () { v[inp.dataset.k] = +inp.value; p.querySelector('[data-o="' + inp.dataset.k + '"]').textContent = inp.value; apply(); });
    });
    p.querySelector("#rn-ok").onclick = function () {
      p.innerHTML = '<b>נשמר ✓</b><br>שלחי לי בצ׳אט: <span style="font-family:monospace;direction:ltr;display:inline-block">גודל ' + v.width + ' · למעלה ' + v.up + ' · צד ' + v.side + '</span>';
    };
    apply();
  }
  start();
})();
