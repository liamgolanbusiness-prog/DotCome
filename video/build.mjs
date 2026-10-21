// Generates the four render projects builds/{land,port}-{text,vo}/ (each its own index.html + assets copy)
// and a preview index.html at the project root (16:9, text-only). Usage: node build.mjs
import fs from "node:fs";
import { renderScenes } from "./src/scenes.mjs";

const FORMATS = { land: [1920, 1080], port: [1080, 1920] };
const MODES = ["text", "vo"];

const HEBREW_RANGE = "U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F";
const LATIN_RANGE =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const FACES = [
  ["Rubik", "rubik", [500, 700, 800, 900]],
  ["Heebo", "heebo", [400, 500, 700]],
];
const fontFaces = FACES.flatMap(([family, file, weights]) =>
  weights.flatMap((w) => [
    `@font-face{font-family:"${family}";font-style:normal;font-weight:${w};font-display:block;src:url(assets/fonts/${file}-hebrew-${w}-normal.woff2) format("woff2");unicode-range:${HEBREW_RANGE};}`,
    `@font-face{font-family:"${family}";font-style:normal;font-weight:${w};font-display:block;src:url(assets/fonts/${file}-latin-${w}-normal.woff2) format("woff2");unicode-range:${LATIN_RANGE};}`,
  ]),
).join("\n");

const css = fs.readFileSync("src/styles.css", "utf8");
const timelineJs = fs.readFileSync("src/timeline.js", "utf8");

function timingFor(mode) {
  const f = `src/timing.${mode}.json`;
  return JSON.parse(fs.readFileSync(fs.existsSync(f) ? f : "src/timing.text.json", "utf8"));
}

function audioTag(mode, T) {
  const f = `assets/audio/mix-${mode}.m4a`;
  if (!fs.existsSync(f)) return "";
  return `<audio id="mix" src="${f}" data-start="0" data-duration="${T.total}" data-track-index="10" data-volume="1"></audio>`;
}

for (const [fmt, [w, h]] of Object.entries(FORMATS)) {
  for (const mode of MODES) {
    const T = timingFor(mode);
    const html = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${w}, height=${h}" />
<title>DotCome · דני — ${fmt === "land" ? "16:9" : "9:16"} · ${mode === "vo" ? "קריינות" : "טקסט ומוזיקה"}</title>
<script src="assets/js/gsap.min.js"></script>
<style>
${fontFaces}
html, body { width: ${w}px; height: ${h}px; }
${css}
</style>
</head>
<body class="fmt-${fmt} mode-${mode}">
<div id="root" data-composition-id="main" data-start="0" data-width="${w}" data-height="${h}" data-duration="${T.total}">
${renderScenes(fmt, T)}
${audioTag(mode, T)}
</div>
<script>window.CFG = ${JSON.stringify({ fmt, mode, T })};</script>
<script>
${timelineJs}
</script>
</body>
</html>
`;
    const dir = `builds/${fmt}-${mode}`;
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/index.html`, html);
    fs.cpSync("assets", `${dir}/assets`, { recursive: true });
    fs.copyFileSync("hyperframes.json", `${dir}/hyperframes.json`);
    if (fmt === "land" && mode === "text") fs.writeFileSync("index.html", html);
    console.log(`wrote ${dir}/index.html (${T.total}s)`);
  }
}
