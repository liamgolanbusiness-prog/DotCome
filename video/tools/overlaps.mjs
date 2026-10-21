// Counts overlapping constellation items at a given time. Usage: node tools/overlaps.mjs <variant> <t>
import path from "node:path";
import puppeteer from "puppeteer-core";
const [variant = "port-text", t = "78"] = process.argv.slice(2);
const [w, h] = variant.startsWith("port") ? [1080, 1920] : [1920, 1080];
const exe = process.env.HYPERFRAMES_BROWSER_PATH || "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ["--allow-file-access-from-files", "--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: w, height: h });
await page.evaluateOnNewDocument(() => { window.__timelines = {}; });
await page.goto("file://" + path.resolve(`builds/${variant}/index.html`));
await page.waitForFunction("window.__built === true");
const res = await page.evaluate((t, pad) => {
  window.__timelines.main.seek(+t);
  const els = [...document.querySelectorAll("#sc-integrations .tile, #sc-integrations .tchip, #sc-integrations .cat, #sc-integrations .hub, #sc-integrations .int-h .h1")];
  const r = els.map((e) => ({ n: e.textContent.trim().slice(0, 14) || e.querySelector("svg")?.getAttribute("aria-label") || e.className, b: e.getBoundingClientRect() }));
  const hits = [], out = [];
  for (let i = 0; i < r.length; i++) {
    const a = r[i].b;
    if (a.left < 0 || a.top < 0 || a.right > innerWidth || a.bottom > innerHeight) out.push(r[i].n);
    for (let j = i + 1; j < r.length; j++) {
      const b = r[j].b;
      if (a.left < b.right + pad && b.left < a.right + pad && a.top < b.bottom + pad && b.top < a.bottom + pad) hits.push(`${r[i].n} × ${r[j].n}`);
    }
  }
  return { hits, out };
}, t, +(process.env.PAD ?? 2));
await browser.close();
console.log(JSON.stringify(res));
