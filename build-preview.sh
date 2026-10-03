#!/usr/bin/env bash
# Builds preview.html from the real sources (same code → identical render), no Node needed.
cd "$(dirname "$0")"
{
cat <<'HEAD'
<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<script>(function(){var r=document.documentElement,w=r.clientWidth||innerWidth,D=1325,z=w<1024?1:w<=D?w/D:Math.min(1.6,1+(w/D-1)*0.6);if(z!==1)r.style.zoom=z.toFixed(4);r.style.setProperty("--z",z.toFixed(4))})()</script>
<title>רביד נחום | אדריכלות ועיצוב פנים</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = { theme: { extend: {
  colors: { petrol: "hsl(var(--petrol) / <alpha-value>)", terra: "hsl(var(--terra) / <alpha-value>)", stone: "hsl(var(--stone) / <alpha-value>)" },
  fontFamily: { arfilit: ['"Num"', '"Arfilit"', "system-ui", "sans-serif"] }
} } };
</script>
<style>
HEAD
grep -v '^@import\|^@tailwind' src/index.css | sed 's#url("/fonts/#url("public/fonts/#g'
sed 's|url("/assets/|url("public/assets/|g' src/site-effects.css
cat <<'HEAD2'
</style>
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.26.4/babel.min.js"></script>
</head>
<body>
<div id="root"></div>
<script id="src" type="text/plain">
const { useState, useRef, useEffect, useLayoutEffect } = React;
HEAD2
cat src/components/site/shared.tsx src/pages/Index.tsx |
  perl -0pe 's/^import[^;]*;\n//mg; s/^export (default )?//mg' |
  sed -e 's#"/assets/#"public/assets/#g'
cat <<'TAIL'
</script>
<script>
  const code = Babel.transform(document.getElementById("src").textContent, {
    filename: "Index.tsx",
    presets: [["typescript", { isTSX: true, allExtensions: true }], "react"],
  }).code;
  new Function("React", "ReactDOM", code + '\nReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Index));')(React, ReactDOM);
  // preview-only: ?y=1234 jumps to a scroll position (used for screenshots)
  (function(){ var y = new URLSearchParams(location.search).get("y"); if (y) setTimeout(function(){ document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, +y); }, 400); })();
</script>
</body>
</html>
TAIL
} > preview.html
echo "built preview.html"
cp preview.html index.html   # GitHub Pages entry point
