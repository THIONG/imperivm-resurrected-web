const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SDK = path.resolve(process.env.SDK_DIR || path.join(ROOT, '..', 'imperivm-resurrected', 'sdk'));
const ES = path.join(ROOT, 'docs', 'sdk-es');

function parse(md) {
  const blocks = [];
  const headings = [];
  const links = [];
  const codes = [];
  const prose = [];
  const tables = [];
  let items = 0;
  let fenced = false;
  let block = null;
  for (const line of md.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      if (fenced) { blocks.push(block.join('\n')); block = null; } else block = [line.trim()];
      fenced = !fenced;
      continue;
    }
    if (fenced) { block.push(line); continue; }
    const h = /^(#{1,6})\s/.exec(line);
    if (h) headings.push(h[1].length);
    if (/^\s*([-*]|\d+\.)\s/.test(line)) items++;
    if (/^\s*\|/.test(line)) tables.push((line.replace(/\\\|/g, '').match(/\|/g) || []).length);
    for (const m of line.matchAll(/\]\(([^)\s]+)\)/g)) links.push(m[1]);
    prose.push(line);
  }
  for (const m of prose.join('\n').matchAll(/`([^`]+)`/g)) codes.push(m[1].replace(/\s*\n\s*/g, ' '));
  return { blocks, headings, links, codes: codes.sort(), tables, items };
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function diff(name, a, b) {
  if (same(a, b)) return null;
  if ([...a, ...b].length && [...a, ...b].every((x) => typeof x === 'string')) {
    const missing = a.filter((x) => !b.includes(x));
    const extra = b.filter((x) => !a.includes(x));
    return name + ': ' + a.length + ' in English, ' + b.length + ' in Spanish. Missing: ' + JSON.stringify(missing.slice(0, 6)) + ' Extra: ' + JSON.stringify(extra.slice(0, 6));
  }
  return name + ': English ' + JSON.stringify(a).slice(0, 80) + ' Spanish ' + JSON.stringify(b).slice(0, 80);
}

function files() {
  const out = [];
  const add = (rel) => out.push(rel);
  for (const f of fs.readdirSync(SDK)) if (f.endsWith('.md') && f !== 'LICENSE.md') add(f);
  for (const d of fs.readdirSync(path.join(SDK, 'templates'))) if (fs.existsSync(path.join(SDK, 'templates', d, 'README.md'))) add('templates/' + d + '/README.md');
  return out;
}

const only = process.argv.slice(2).map((x) => x.replace(/\\/g, '/'));
let bad = 0;
let done = 0;
for (const rel of files()) {
  if (only.length && !only.some((o) => rel === o || rel.endsWith('/' + o))) continue;
  const spanish = path.join(ES, rel);
  if (!fs.existsSync(spanish)) { if (only.length) { console.log('MISSING ' + rel); bad++; } continue; }
  const a = parse(fs.readFileSync(path.join(SDK, rel), 'utf8'));
  const b = parse(fs.readFileSync(spanish, 'utf8'));
  const problems = [
    diff('headings', a.headings, b.headings),
    diff('code blocks', a.blocks, b.blocks),
    diff('link targets', a.links, b.links),
    diff('inline code', a.codes, b.codes),
    diff('table rows', a.tables, b.tables),
    diff('list items', a.items, b.items),
  ].filter(Boolean);
  done++;
  if (problems.length) { bad++; console.log('FAIL ' + rel + '\n  ' + problems.join('\n  ')); }
}
console.log(bad ? bad + ' file(s) with differences, ' + done + ' checked' : 'all ' + done + ' translated files match the English structure');
process.exit(bad ? 1 : 0);
