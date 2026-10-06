#!/usr/bin/env bash
# Builds the static previews from the real sources (same code → identical render), no Node needed.
#   preview.html / index.html → Index      projects.html → ProjectsPage
cd "$(dirname "$0")"

bundle() {
  # all modules in one scope: imports dropped, exports unwrapped, routes mapped to the static files
  cat src/components/site/shared.tsx src/components/site/projects-data.tsx src/components/site/contact.tsx src/pages/Index.tsx src/pages/Projects.tsx src/pages/Studio.tsx src/pages/Project.tsx |
    perl -0pe 's/^import[^;]*;\n//mg; s/^export default function (\w+)/function $1/mg; s/^export //mg' |
    sed -e 's#"/assets/#"public/assets/#g' \
        -e 's#projects: "/projects"#projects: "projects.html"#' \
        -e 's#home: "/"#home: "./"#' \
        -e 's#: "/studio"#: "studio.html"#g' \
        -e 's#"/projects/" + slug#"project.html?slug=" + slug#' \
        -e 's#: "/\#\([a-z]*\)"#: "./\#\1"#g'
}

build() {
OUT=$1
ROOT=$2
{
cat <<'HEAD'
<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
HEAD
echo '<script>(function(){if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("is-loading")})()</script>'
cat <<'HEAD'
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
bundle
echo '</script>'
echo "<script>window.__ROOT__ = \"$ROOT\";</script>"
cat <<'TAIL'
<script>
  const code = Babel.transform(document.getElementById("src").textContent, {
    filename: "Site.tsx",
    presets: [["typescript", { isTSX: true, allExtensions: true }], "react"],
  }).code;
  new Function("React", "ReactDOM", code + '\nReactDOM.createRoot(document.getElementById("root")).render(React.createElement(' + window.__ROOT__ + '));')(React, ReactDOM);
  // preview-only: ?y=1234 jumps to a scroll position (used for screenshots)
  (function(){ var y = new URLSearchParams(location.search).get("y"); if (y) setTimeout(function(){ document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, +y); }, 400); })();
</script>
<script src="font-inspector.js"></script>
</body>
</html>
TAIL
} > "$OUT"
echo "built $OUT"
}

build preview.html Index
build projects.html ProjectsPage
build studio.html StudioPage
build project.html ProjectPage
cp preview.html index.html   # GitHub Pages entry point
