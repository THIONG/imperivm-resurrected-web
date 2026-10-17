const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const root = path.resolve(__dirname, '..', 'src');
let failures = 0;
const fail = (message) => { failures++; console.log('  FAIL: ' + message); };

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full); else files.push(full);
  }
})(root);
const rel = (file) => path.relative(root, file).split(path.sep).join('/');
const read = (file) => fs.readFileSync(file, 'utf8');
const htmls = files.filter((f) => f.endsWith('.html'));
const scripts = files.filter((f) => f.endsWith('.js'));
const styles = files.filter((f) => f.endsWith('.css'));
const inline = (text) => [...text.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const parse = (code, onComment) => acorn.parse(code, { ecmaVersion: 2022, onComment });

console.log('1) script syntax');
let parsed = 0;
for (const file of scripts) {
  try { parse(read(file)); parsed++; } catch (e) { fail(rel(file) + ': ' + e.message); }
}
for (const file of htmls) {
  for (const code of inline(read(file))) {
    try { parse(code); parsed++; } catch (e) { fail(rel(file) + ' (inline): ' + e.message); }
  }
}
console.log('   ' + parsed + ' scripts parsed');

console.log('2) comments');
for (const file of scripts) {
  let count = 0;
  try { parse(read(file), () => count++); } catch (e) { continue; }
  if (count) fail(rel(file) + ': ' + count + ' JS comments');
}
for (const file of htmls) {
  const text = read(file);
  if (text.includes('<!--')) fail(rel(file) + ': HTML comment');
  for (const code of inline(text)) {
    let count = 0;
    try { parse(code, () => count++); } catch (e) { continue; }
    if (count) fail(rel(file) + ': inline JS comment');
  }
}
for (const file of styles) if (read(file).includes('/*')) fail(rel(file) + ': CSS comment');

console.log('3) translation keys');
const dictionaries = scripts.filter((f) => /(i18n(-[a-z]+)?|dictionary)\.js$/.test(f) && !/support/.test(f));
const keysIn = (text) => new Set([...text.matchAll(/\b([a-z][a-z0-9_]*): `/g)].map((m) => m[1]));
const slice = (text, start, end) => {
  const a = text.indexOf(start);
  const b = end ? text.indexOf(end, a + 1) : text.length;
  return text.slice(a, b);
};
const english = new Set();
const italian = new Set();
for (const file of dictionaries) {
  const text = read(file);
  const indent = /^ {4}en: \{/m.test(text) ? '    ' : '  ';
  keysIn(slice(text, indent + 'en: {', indent + 'it: {')).forEach((k) => english.add(k));
  keysIn(slice(text, indent + 'it: {')).forEach((k) => italian.add(k));
}
const used = new Set();
for (const file of htmls.filter((f) => !rel(f).startsWith('sdk/') && !/^(en|it)\//.test(rel(f)))) {
  const text = read(file);
  for (const m of text.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) used.add(m[1]);
  for (const m of text.matchAll(/data-i18n-attr="([^"]+)"/g)) m[1].split(';').forEach((p) => used.add(p.split(':')[1]));
}
const missingEn = [...used].filter((k) => !english.has(k));
const missingIt = [...used].filter((k) => !italian.has(k));
console.log('   ' + used.size + ' keys used, ' + english.size + ' English, ' + italian.size + ' Italian');
if (missingEn.length) fail('missing in English: ' + missingEn.join(' '));
if (missingIt.length) fail('missing in Italian: ' + missingIt.join(' '));

console.log('4) internal links and anchors');
const idCache = {};
const idsOf = (file) => idCache[file] || (idCache[file] = new Set([...read(file).matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])));
let links = 0;
for (const file of htmls) {
  for (const m of read(file).matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|data:|javascript:)/i.test(url)) continue;
    links++;
    const [target, hash] = url.split('#');
    const clean = decodeURIComponent((target || '').split('?')[0]);
    let dest;
    if (!clean) dest = file;
    else if (clean.startsWith('/')) dest = path.join(root, clean);
    else dest = path.resolve(path.dirname(file), clean);
    if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) dest = path.join(dest, 'index.html');
    if (!fs.existsSync(dest)) { fail(rel(file) + ' -> ' + url + ' (missing file)'); continue; }
    if (hash && dest.endsWith('.html') && !idsOf(dest).has(decodeURIComponent(hash))) fail(rel(file) + ' -> ' + url + ' (missing anchor)');
  }
}
console.log('   ' + links + ' links checked');

console.log(failures === 0 ? '\nALL CHECKS PASSED' : '\nFAILURES: ' + failures);
process.exit(failures === 0 ? 0 : 1);
