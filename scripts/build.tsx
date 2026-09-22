// Renders every guide and the index to self-contained HTML files in the repo root.
//   npm run build            build once
//   npm run dev              rebuild on change and serve on http://localhost:5178
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { guides } from '../src/guides';
import { GUIDES, guide as meta, guideFile, type AreaId } from '../src/registry';
import { GuidePage } from '../src/shell/guide';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f: string) => readFileSync(join(root, 'src', f), 'utf8');
const readIf = (f: string) => (existsSync(join(root, 'src', f)) ? read(f) : '');

/** Stylesheets per area, in cascade order. Guide pages add shell/story.css and guides/<slug>.css after these. */
const STYLES: Record<'base' | AreaId, string[]> = {
  base: ['ui/tokens.css', 'ui/base.css'],
  testing: ['ui/map.css', 'ui/click.css', ...['app', 'library', 'run', 'report', 'verify', 'ai'].map(f => `ui/testing/${f}.css`)],
  intel: ['ui/map.css', 'ui/click.css', ...['app', 'ask', 'chat', 'sessions', 'filters', 'panel', 'detail', 'documents', 'connectors', 'concept'].map(f => `ui/intel/${f}.css`)],
};

/** Always shipped: the tokens and the app frame every screen sits in. */
const ALWAYS = new Set(['ui/tokens.css', 'ui/base.css']);

/** Classes story.js adds at runtime, so they never appear in the rendered markup. */
const RUNTIME = ['on', 'off', 'done', 'in-dialog', 'tip', 'armed', 'play'];

/** Every class the markup uses, including the data-fx classes story.js toggles. */
function classesUsed(html: string) {
  const used = new Set(RUNTIME);
  for (const m of html.matchAll(/class="([^"]*)"/g)) for (const c of m[1].split(/\s+/)) if (c) used.add(c);
  for (const m of html.matchAll(/data-fx="([^"]*)"/g)) for (const p of m[1].split(/\s+/)) { const k = p.split(':')[0]; if (k) used.add(k); }
  return used;
}

/**
 * Does the page use every class this selector needs? Classes inside :not(), :is() and :where()
 * do not have to exist for the rule to apply, so they are ignored.
 */
function selectorUsed(selector: string, used: Set<string>) {
  const plain = selector.replace(/:(?:not|is|where)\([^)]*\)/g, '');
  return [...plain.matchAll(/\.([A-Za-z0-9_-]+)/g)].every(m => used.has(m[1]));
}

/**
 * Drops the rules for classes this page never renders. A guide carries one area's whole kit,
 * and most of it belongs to the other guides in that area — this is what keeps a page from
 * shipping the screens of four tests it never shows.
 *
 * Selector lists are pruned part by part, at-rules are recursed into, and @keyframes and
 * @font-face are kept whole (they are referenced by name, not by class).
 */
function purge(css: string, used: Set<string>): string {
  let out = '';
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) { out += css.slice(i); break; }
    const prelude = css.slice(i, open);
    // find the matching close brace
    let depth = 1, j = open + 1;
    for (; j < css.length && depth; j++) depth += css[j] === '{' ? 1 : css[j] === '}' ? -1 : 0;
    const body = css.slice(open + 1, j - 1);
    // Comments are stripped, not carried: a comma inside one would split with the selector
    // list and leave the comment unterminated, which swallows every rule after it.
    const head = prelude.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    i = j;

    if (head.startsWith('@keyframes') || head.startsWith('@font-face') || head.startsWith('@property')) {
      out += `${prelude}{${body}}`;
    } else if (head.startsWith('@')) {
      const inner = purge(body, used);
      if (inner.trim()) out += `${prelude}{${inner}}`;
    } else {
      const keep = head.split(',').filter(s => selectorUsed(s, used));
      if (keep.length) out += `${keep.join(',')}{${body}}\n`;
    }
  }
  return out;
}

/** The kit stylesheets a page needs, each cut down to the rules it actually uses. */
function stylesFor(sheets: string[], markup: string) {
  const used = classesUsed(markup);
  return sheets.map(f => (ALWAYS.has(f) ? read(f) : purge(read(f), used))).filter(css => css.trim());
}

function write(file: string, page: ReactElement) {
  const html = '<!doctype html>\n' + renderToStaticMarkup(page);
  writeFileSync(join(root, file), html);
  console.log(`built ${file} (${(html.length / 1024).toFixed(0)} KB)`);
}

function build() {
  for (const g of guides) {
    const m = meta(g.slug);
    // A guide is either guides/<slug>.tsx (+ .css/.js next to it) or a folder guides/<slug>/ (+ style.css/script.js).
    const own = (ext: 'css' | 'js') => readIf(`guides/${g.slug}.${ext}`) || readIf(`guides/${g.slug}/${ext === 'css' ? 'style.css' : 'script.js'}`);
    const js = [read('shell/story.js'), own('js')].filter(Boolean).join('\n');
    const all = [...STYLES.base, ...STYLES[m.area]];
    // First pass renders the page with no CSS, only to see which classes it uses.
    const markup = renderToStaticMarkup(<GuidePage guide={g} css="" js="" />);
    const kit = stylesFor(all, markup);
    const css = [...kit, read('shell/story.css'), own('css')].filter(Boolean).join('\n');
    const full = all.map(read).join('\n').length;
    const cut = full - kit.join('\n').length;
    write(guideFile(m), <GuidePage guide={g} css={css} js={js} />);
    console.log(`  kit ${(full / 1024).toFixed(0)} KB → ${((full - cut) / 1024).toFixed(0)} KB (${((cut / full) * 100).toFixed(0)}% unused dropped)`);
  }
  // The landing page is hand-written, not rendered: index-new.html is the file to edit, and
  // the build copies it to index.html so it ships the same way the guides do.
  const landing = readFileSync(join(root, 'index-new.html'), 'utf8');
  writeFileSync(join(root, 'index.html'), landing);
  console.log(`built index.html (${(landing.length / 1024).toFixed(0)} KB, copied from index-new.html)`);
  // Remove pages left over from renamed or renumbered guides.
  const current = new Set(GUIDES.map(guideFile));
  for (const f of readdirSync(root)) if (/^\d\d-.+\.html$/.test(f) && !current.has(f)) { rmSync(join(root, f)); console.log(`removed ${f}`); }
  const missing = GUIDES.filter(m => !guides.some(g => g.slug === m.slug));
  if (missing.length) console.warn(`not built yet: ${missing.map(m => m.slug).join(', ')}`);
}

build();

if (process.argv.includes('--serve')) {
  const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
  createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
    const file = normalize(join(root, path.endsWith('/') ? path + 'index.html' : path));
    let body: Buffer;
    try { body = await readFile(file); } catch { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  }).listen(5178, () => console.log('serving http://localhost:5178'));
}
