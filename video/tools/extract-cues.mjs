// Loads a built composition headlessly and dumps window.__cues (SFX cue list) + timing to JSON.
// Usage: node tools/extract-cues.mjs <mode>   → build/cues.<mode>.json
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const mode = process.argv[2] || "text";
const html = path.resolve(`builds/land-${mode}/index.html`);
const exe = process.env.HYPERFRAMES_BROWSER_PATH || "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ["--allow-file-access-from-files", "--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.evaluateOnNewDocument(() => { window.__timelines = {}; });
page.on("pageerror", (e) => console.error("pageerror:", e.message));
await page.goto("file://" + html);
await page.waitForFunction("window.__built === true", { timeout: 20000 });
const out = await page.evaluate(() => ({ T: window.CFG.T, cues: window.__cues }));
await browser.close();
fs.mkdirSync("build", { recursive: true });
fs.writeFileSync(`build/cues.${mode}.json`, JSON.stringify(out, null, 1));
console.log(`build/cues.${mode}.json: ${out.cues.length} cues`);
