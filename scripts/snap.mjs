// Visual check for the guides.
//
//   node scripts/snap.mjs capture <label> [page…]  screenshot every scene of every built page (or only matching pages) into .snap/<label>/
//   node scripts/snap.mjs compare <a> <b>        pixel-compare two captures, write diffs into .snap/diff-<a>-<b>/
//
// Animations are frozen and timers stubbed so two captures of the same page are identical.
import { createServer } from 'node:http';
import { mkdirSync, readdirSync, readFileSync, existsSync, writeFileSync, rmSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const snapDir = join(root, '.snap');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
/** The index and every built guide page. */
const PAGES = ['index.html', ...readdirSync(root).filter(f => /^\d\d-.+\.html$/.test(f)).sort()];

const FREEZE = `
  window.setInterval = () => 0;
  document.addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('style');
    s.textContent = '*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important;caret-color:transparent!important}';
    document.head.appendChild(s);
  });
`;

function serve() {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = normalize(join(root, path.endsWith('/') ? path + 'index.html' : path));
    let body;
    try { body = await readFile(file); } catch { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    res.end(body);
  });
  return new Promise(ok => server.listen(0, () => ok(server)));
}

const settle = page => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 120)))));

async function shoot(page, dir, name) {
  await settle(page);
  await page.screenshot({ path: join(dir, `${name}.png`) });
}

async function capturePage(browser, base, file, dir, mobile) {
  const page = await browser.newPage();
  await page.setViewport(mobile ? { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true } : { width: 1440, height: 900 });
  await page.evaluateOnNewDocument(FREEZE);
  await page.goto(`${base}/${file}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const tag = `${file.replace('.html', '')}${mobile ? '--m' : ''}`;

  if (file === 'index.html') {
    await page.screenshot({ path: join(dir, `${tag}--full.png`), fullPage: true });
    return page.close();
  }

  await page.evaluate(() => scrollTo(0, 0));
  await shoot(page, dir, `${tag}--00-top`);
  if (await page.$('.glance')) {
    await page.evaluate(() => scrollTo(0, document.querySelector('.glance').getBoundingClientRect().top + scrollY - 20));
    await shoot(page, dir, `${tag}--01-glance`);
  }
  const n = await page.evaluate(() => document.querySelectorAll('[data-story] .card').length);
  const beats = mobile ? [0, Math.floor(n / 2), n - 1] : [...Array(n).keys()];
  for (const k of beats) {
    await page.evaluate((k, n) => {
      const r = document.querySelector('[data-story]');
      const top = r.getBoundingClientRect().top + scrollY;
      scrollTo(0, top + (r.offsetHeight - innerHeight) * ((k + 0.5) / n));
    }, k, n);
    await shoot(page, dir, `${tag}--beat-${String(k).padStart(2, '0')}`);
  }
  await page.evaluate(() => scrollTo(0, document.querySelector('.recap').getBoundingClientRect().top + scrollY - 20));
  await shoot(page, dir, `${tag}--zz-recap`);
  await page.close();
}

async function capture(label, only = []) {
  const dir = join(snapDir, label);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const server = await serve();
  const base = `http://localhost:${server.address().port}`;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars', '--font-render-hinting=none'] });
  try {
    for (const file of PAGES) {
      if (!existsSync(join(root, file)) || (only.length && !only.some(o => file.includes(o)))) continue;
      await capturePage(browser, base, file, dir, false);
      await capturePage(browser, base, file, dir, true);
      process.stdout.write(`captured ${file}\n`);
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`${readdirSync(dir).length} screenshots in .snap/${label}`);
}

function compare(a, b) {
  const da = join(snapDir, a), db = join(snapDir, b), dd = join(snapDir, `diff-${a}-${b}`);
  rmSync(dd, { recursive: true, force: true });
  mkdirSync(dd, { recursive: true });
  const names = readdirSync(db).sort();
  let bad = 0;
  for (const name of names) {
    if (!existsSync(join(da, name)) || !existsSync(join(db, name))) { console.log(`MISSING   ${name}`); bad++; continue; }
    const ia = PNG.sync.read(readFileSync(join(da, name)));
    const ib = PNG.sync.read(readFileSync(join(db, name)));
    if (ia.width !== ib.width || ia.height !== ib.height) {
      console.log(`SIZE      ${name}  ${ia.width}x${ia.height} vs ${ib.width}x${ib.height}`);
      bad++;
      continue;
    }
    const diff = new PNG({ width: ia.width, height: ia.height });
    const px = pixelmatch(ia.data, ib.data, diff.data, ia.width, ia.height, { threshold: 0.1 });
    if (px > 0) {
      writeFileSync(join(dd, name), PNG.sync.write(diff));
      console.log(`DIFF      ${name}  ${px}px`);
      bad++;
    }
  }
  console.log(bad ? `\n${bad} of ${names.length} screenshots differ (diffs in .snap/diff-${a}-${b})` : `\nAll ${names.length} screenshots match.`);
  process.exitCode = bad ? 1 : 0;
}

const [cmd, x, y] = process.argv.slice(2);
if (cmd === 'capture' && x) await capture(x, process.argv.slice(4));
else if (cmd === 'compare' && x && y) compare(x, y);
else console.log('usage: node scripts/snap.mjs capture <label> | compare <a> <b>');
