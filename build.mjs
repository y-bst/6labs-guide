// Builds each guide twice from one source — a scroll story and a step-by-step
// version — inlining the shared CSS/JS so every output is one shareable file.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = f => readFileSync(join(root, 'src', f), 'utf8');

const assets = {
  '<link rel="stylesheet" href="studio.css">': `<style>\n${src('studio.css')}</style>`,
  '<link rel="stylesheet" href="story.css">': `<style>\n${src('story.css')}</style>`,
  '<script src="story.js"></script>': `<script>\n${src('story.js')}</script>`,
};

const pages = [
  ['gameplay-library.html', '01-gameplay-library'],
  ['user-test.html', '02-user-test'],
];

{
  let index = src('index.html').replace('<link rel="stylesheet" href="story.css">', () => assets['<link rel="stylesheet" href="story.css">']);
  writeFileSync(join(root, 'index.html'), index);
  console.log('built index.html');
}

for (const [from, name] of pages) {
  let html = src(from);
  if (!html.includes('href="story.css"')) {
    console.log(`skipped ${from} (not converted yet)`);
    continue;
  }
  for (const [tag, inline] of Object.entries(assets)) html = html.replace(tag, () => inline);
  if (/href="(studio|story)\.css"|src="story\.js"/.test(html)) throw new Error(`${from}: asset not inlined`);

  writeFileSync(join(root, `${name}.html`), html);

  const steps = html
    .replace('<body data-layout="scroll">', '<body data-layout="steps">')
    .replace(/(data-doc[^>]*?href=")([\w-]+)\.html"/g, '$1$2-steps.html"');
  writeFileSync(join(root, `${name}-steps.html`), steps);

  console.log(`built ${name}.html + ${name}-steps.html (${(html.length / 1024).toFixed(0)} KB)`);
}
