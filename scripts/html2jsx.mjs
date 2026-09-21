// Converts guide HTML into JSX. Used to move hand-written HTML screens into components.
//
//   node scripts/html2jsx.mjs <file.html> --from <line> --to <line> [--scenes id1,id2,...] [--cards]
//
// --scenes   maps numeric beat ranges (data-at="5-11", data-fx="hl:3") to scene names: at('a..b'), fx({ hl: 'c' })
// --cards    reads <article class="card"> blocks and prints them as scene objects
import { readFileSync } from 'node:fs';
import { parseDocument } from 'htmlparser2';

const args = process.argv.slice(2);
const file = args[0];
const opt = name => { const i = args.indexOf(`--${name}`); return i < 0 ? undefined : args[i + 1]; };
const from = +(opt('from') ?? 1), to = +(opt('to') ?? Infinity);
const scenes = opt('scenes')?.split(',').map(s => s.trim());
const lines = readFileSync(file, 'utf8').split(/\r?\n/).slice(from - 1, to === Infinity ? undefined : to);
const doc = parseDocument(lines.join('\n'), { lowerCaseTags: false, lowerCaseAttributeNames: false, recognizeSelfClosing: true, decodeEntities: true });

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RENAME = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', crossorigin: 'crossOrigin', viewbox: 'viewBox', 'xlink:href': 'xlinkHref', readonly: 'readOnly', maxlength: 'maxLength', colspan: 'colSpan', rowspan: 'rowSpan', autocomplete: 'autoComplete' };
const BOOLEAN = new Set(['hidden', 'open', 'disabled', 'inert', 'checked', 'selected', 'readonly']);
const camel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

const escText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
const quote = s => JSON.stringify(s);

function spec(range) {
  if (!scenes) return null;
  return range.split(',').map(part => {
    const m = part.trim().match(/^(\d*)(-?)(\d*)$/);
    const a = m[1] === '' ? null : +m[1];
    const b = m[3] === '' ? null : +m[3];
    const id = n => { if (!scenes[n]) throw new Error(`beat ${n} has no scene name`); return scenes[n]; };
    if (!m[2]) return id(a);
    if (a !== null && b !== null) return a === b ? id(a) : `${id(a)}..${id(b)}`;
    if (a !== null) return a === scenes.length - 1 ? id(a) : `${id(a)}..`;
    return b === 0 ? id(0) : `..${id(b)}`;
  }).join(', ');
}

function styleObj(css) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of css) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && !depth) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  const props = out.map(d => d.trim()).filter(Boolean).map(d => {
    const i = d.indexOf(':');
    const k = d.slice(0, i).trim(), v = d.slice(i + 1).trim();
    const key = k.startsWith('--') ? quote(k) : /^-/.test(k) ? camel(k.replace(/^-(\w)/, (_, c) => c.toUpperCase())) : camel(k);
    return `${key}: ${quote(v)}`;
  });
  return `{{ ${props.join(', ')} }}`;
}

function attrs(el) {
  const parts = [];
  for (const [k, v] of Object.entries(el.attribs)) {
    if (k === 'data-at' && scenes) { parts.push(`{...at(${quote(spec(v))})}`); continue; }
    if (k === 'data-fx' && scenes) {
      const rules = v.trim().split(/\s+/).map(t => { const i = t.indexOf(':'); return `${/^[a-z]\w*$/i.test(t.slice(0, i)) ? t.slice(0, i) : quote(t.slice(0, i))}: ${quote(spec(t.slice(i + 1)))}`; });
      parts.push(`{...fx({ ${rules.join(', ')} })}`);
      continue;
    }
    if (k === 'style') { parts.push(`style=${styleObj(v)}`); continue; }
    let name = RENAME[k] ?? k;
    if (!name.startsWith('data-') && !name.startsWith('aria-') && name.includes('-')) name = camel(name);
    if (BOOLEAN.has(k) && v === '') { parts.push(name); continue; }
    parts.push(`${name}=${quote(v)}`);
  }
  return parts.length ? ' ' + parts.join(' ') : '';
}

const isText = n => n.type === 'text';
const isWs = n => isText(n) && !/\S/.test(n.data);

function inline(nodes, pre = false) {
  return nodes.map(n => {
    if (isText(n)) return pre ? `{${quote(n.data)}}` : escText(n.data.replace(/\s+/g, ' '));
    if (n.type === 'comment') return '';
    return render(n, '', true);
  }).join('');
}

function render(n, pad, flat = false) {
  if (isText(n)) return pad + escText(n.data.trim().replace(/\s+/g, ' '));
  if (n.type === 'comment') return `${pad}{/* ${n.data.trim()} */}`;
  if (n.type !== 'tag' && n.type !== 'script' && n.type !== 'style') return '';
  const open = `<${n.name}${attrs(n)}`;
  const kids = n.children.filter(c => c.type !== 'comment' || !flat);
  if (VOID.has(n.name) || (kids.every(isWs) && n.name !== 'pre')) return `${pad}${open} />`;
  if (n.name === 'pre') return `${pad}${open}>${inline(kids, true)}</${n.name}>`;
  const mixed = kids.some(c => isText(c) && !isWs(c));
  if (mixed || flat) return `${pad}${open}>${inline(kids)}</${n.name}>`;
  const body = kids.filter(c => !isWs(c)).map(c => render(c, pad + '  ')).filter(Boolean).join('\n');
  return `${pad}${open}>\n${body}\n${pad}</${n.name}>`;
}

if (args.includes('--cards')) {
  const cards = [];
  const walk = n => { if (n.type === 'tag' && n.name === 'article' && /\bcard\b/.test(n.attribs.class || '')) cards.push(n); else n.children?.forEach(walk); };
  doc.children.forEach(walk);
  cards.forEach((c, i) => {
    const kids = c.children.filter(k => !isWs(k));
    const count = kids.find(k => k.attribs?.class === 'count');
    const h2 = kids.find(k => k.name === 'h2');
    const body = kids.filter(k => k !== count && k !== h2);
    const focus = c.attribs['data-focus'];
    console.log(`  {\n    id: ${quote(scenes?.[i] ?? `scene${i}`)}, step: ${quote(c.attribs['data-node'])}, chapter: ${quote(count?.attribs['data-chapter'] ?? '')},${focus ? ` focus: [${focus.split(/\s+/).join(', ')}],` : ''}\n    title: ${quote(inline(h2.children).trim())},\n    body: (\n      <>\n${body.map(b => render(b, '        ')).join('\n')}\n      </>\n    ),\n  },`);
  });
} else {
  console.log(doc.children.filter(n => !isWs(n)).map(n => render(n, '')).join('\n'));
}
