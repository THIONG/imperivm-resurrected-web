const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(SRC, 'sdk');
const SDK = path.resolve(process.argv[2] || path.join(ROOT, '..', 'imperivm-resurrected', 'sdk'));
const ES_DIR = path.join(ROOT, 'docs', 'sdk-es');
const DOMAIN = 'https://www.imperivmresurrected.com';
const REPO = 'https://github.com/imperivm-resurrected/imperivm-resurrected';
const TEMPLATE_ORDER = ['scenario', 'adventure', 'conquest', 'units', 'civilization', 'gameplay', 'audio', 'translation', 'graphics', 'full'];
const ENGLISH_ONLY = ['LICENSE.md'];

const LABELS = {
  en: { skip: 'Skip to content', guides: 'SDK guides', templates: 'Templates', overview: 'Overview', changes: 'Changes', license: 'License', functions: 'Game functions', back: 'For modders', backFooter: 'Back to For modders', suffix: ' — SDK', lang: 'en' },
  es: { skip: 'Saltar al contenido', guides: 'Guías del SDK', templates: 'Plantillas', overview: 'Resumen', changes: 'Cambios', license: 'Licencia (en inglés)', functions: 'Funciones del juego (en inglés)', back: 'Para modders', backFooter: 'Volver a Para modders', suffix: ' — SDK', lang: 'es' },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (t) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '-');
const read = (file) => fs.readFileSync(file, 'utf8');

if (!fs.existsSync(path.join(SDK, 'README.md'))) {
  console.error('The SDK folder was not found: ' + SDK);
  process.exit(1);
}

const state = { source: '', page: '', lang: 'en', ids: null, h: 0, spanish: new Set() };

function pageOf(target) {
  const m = /^templates\/([^/]+)\/README\.md$/.exec(target);
  if (m) return 'templates/' + m[1] + '.html';
  if (/^templates\/([^/]+)\/?$/.test(target) && fs.existsSync(path.join(SDK, target, 'README.md'))) return 'templates/' + target.split('/')[1] + '.html';
  if (/^[^/]+\.md$/.test(target)) return target.replace(/\.md$/, '.html');
  return null;
}

function relative(fromPage, toPage) {
  return path.posix.relative(path.posix.dirname(fromPage), toPage) || path.posix.basename(toPage);
}

function protectBackslashSpans(md) {
  let fenced = false;
  return md.split('\n').map((line) => {
    if (/^\s*```/.test(line)) { fenced = !fenced; return line; }
    if (fenced) return line;
    return line.replace(/`([^`\n]*\\)`/g, (m, code) => '<code>' + code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\/g, '&#92;') + '</code>');
  }).join('\n');
}

function headingIds(md) {
  const ids = [];
  const walk = (tokens) => {
    for (const t of tokens || []) {
      if (t.type === 'heading') ids.push(slug(t.tokens.map((x) => x.raw || x.text || '').join('')));
      if (t.tokens && t.type !== 'heading') walk(t.tokens);
      if (t.items) for (const i of t.items) walk(i.tokens);
    }
  };
  walk(marked.lexer(md));
  return ids;
}

marked.use({
  renderer: {
    link({ href, tokens }) {
      const text = this.parser.parseInline(tokens);
      if (/^(https?:|mailto:)/i.test(href)) return `<a href="${esc(href)}" target="_blank" rel="noopener">${text}</a>`;
      if (href.startsWith('#')) return `<a href="${esc(href)}">${text}</a>`;
      const [file, hash] = href.split('#');
      const anchor = hash ? '#' + hash : '';
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(state.source), decodeURI(file)));
      const page = pageOf(target);
      const prefix = (p) => (state.lang === 'es' && state.spanish.has(p) ? 'es/' : '') + p;
      if (page) return `<a href="${relative(state.page, prefix(page))}${anchor}">${text}</a>`;
      if (/\.txt$/.test(target) && fs.existsSync(path.join(SDK, target))) return `<a href="${relative(state.page, target)}">${text}</a>`;
      if (target === 'templates') return `<a href="${relative(state.page, prefix('README.html'))}#templates">${text}</a>`;
      const full = path.join(SDK, target);
      const kind = fs.existsSync(full) && fs.statSync(full).isFile() ? 'blob' : 'tree';
      return `<a href="${REPO}/${kind}/main/sdk/${target}" target="_blank" rel="noopener">${text}</a>`;
    },
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens);
      const raw = tokens.map((t) => t.raw || t.text || '').join('');
      const id = state.ids && state.ids[state.h] !== undefined ? state.ids[state.h] : slug(raw);
      state.h++;
      return `<h${depth} id="${id}">${html}</h${depth}>\n`;
    },
  },
});

function sections(md) {
  const found = [];
  let current = null;
  for (const t of marked.lexer(md)) {
    if (t.type === 'heading' && t.depth === 2) { current = { title: t.text.replace(/`/g, ''), id: slug(t.tokens.map((x) => x.raw || x.text || '').join('')), tokens: [] }; found.push(current); }
    else if (current) current.tokens.push(t);
  }
  return found;
}

function describe(dir) {
  const readme = read(path.join(dir, 'README.md'));
  const all = sections(readme);
  const english = sections(read(path.join(SDK, 'README.md')));
  const at = (title) => {
    const i = english.findIndex((x) => x.title.toLowerCase() === title.toLowerCase());
    if (i < 0) throw new Error('README section missing: ' + title);
    return all[i];
  };
  const guides = [];
  for (const list of at('Guides').tokens.filter((x) => x.type === 'list')) {
    for (const item of list.items) {
      const m = item.raw.match(/^\s*[-*]\s+\[(.+?)\]\((.+?)\)\s*:?\s*([\s\S]*?)\s*$/);
      if (!m) throw new Error('A guide line cannot be read: ' + item.raw);
      guides.push({ id: m[2].replace(/\.md$/, ''), title: m[1].replace(/`/g, ''), file: m[2].replace(/\.md$/, '.html'), desc: marked.parseInline(m[3]) });
    }
  }
  const templateRows = at('Templates').tokens.find((x) => x.type === 'table').rows.map((row) => {
    const id = row[1].text.match(/\(templates\/([^)]+)\)/)[1];
    const heading = read(path.join(dir, 'templates', id, 'README.md')).match(/^#\s+(.+)$/m)[1];
    return { id, title: heading, file: 'templates/' + id + '.html', desc: marked.parseInline(row[0].text) };
  });
  const byId = Object.fromEntries(templateRows.map((t) => [t.id, t]));
  const templates = TEMPLATE_ORDER.filter((id) => byId[id]).map((id) => byId[id]);
  const tools = at('Tools').tokens.find((x) => x.type === 'table').rows.map((row) => {
    const use = row[1].text;
    const g = use.match(/\]\(([^)]+\.md)\)/);
    const clean = use.replace(/\s*\(\[[^\]]+\]\([^)]+\)\)/, '').replace(/\s*\([^)]*\)\s*$/, '');
    return { want: marked.parseInline(row[0].text), use: marked.parseInline(clean), guide: g ? g[1].replace(/\.md$/, '.html') : null };
  });
  return { guides, templates, tools };
}

const credits = { en: read(path.join(SRC, 'en', 'credits.html')), es: read(path.join(SRC, 'credits.html')) };
const noI18n = (html) => html.replace(/\sdata-i18n(?:-html|-attr)?="[^"]*"/g, '');

function frame(lang, page, title, body, info, available) {
  const L = LABELS[lang];
  const here = (lang === 'es' ? 'es/' : '') + page;
  const depth = here.split('/').length - 1;
  const up = '../'.repeat(depth + 1);
  const site = lang === 'en' ? up + 'en/' : up;
  const url = DOMAIN + '/sdk/' + (lang === 'es' ? 'es/' : '') + page;
  const plain = (s) => s.replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
  let description = plain((body.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || '') || title;
  if (description.length > 155) description = description.slice(0, 155).replace(/\s+\S*$/, '') + '…';
  const heading = /SDK/.test(title) ? title : title + L.suffix;
  const headerSource = credits[lang].match(/<header class="header">[\s\S]*?<\/header>/)[0];
  const footerSource = credits[lang].match(/<footer class="footer">[\s\S]*?<\/footer>/)[0];
  const header = noI18n(headerSource)
    .replace(/ aria-current="page"/g, '')
    .replace('href="index.html"', `href="${site}${lang === 'en' ? '' : 'index.html'}"`)
    .replace('href="guide.html"', `href="${site}guide.html"`)
    .replace('<a href="sdk.html">', `<a href="${site}sdk.html" aria-current="page">`)
    .replace(/src="(?:\.\.\/)?img\//g, `src="${up}img/`);
  const footer = noI18n(footerSource)
    .replace('href="index.html" aria-label', `href="${site}${lang === 'en' ? '' : 'index.html'}" aria-label`)
    .replace('href="credits.html"', `href="${site}credits.html"`)
    .replace(/<a class="footer__back" href="index.html">[^<]*<\/a>/, `<a class="footer__back" href="${site}sdk.html">${L.backFooter}</a>`)
    .replace(/src="(?:\.\.\/)?img\//g, `src="${up}img/`);
  const link = (item, current) => `<li><a href="${relative(here, (lang === 'es' ? 'es/' : '') + item.file)}"${current ? ' aria-current="page"' : ''}>${esc(item.title)}</a></li>`;
  const license = { title: L.license, file: 'LICENSE.html' };
  const licenseLink = lang === 'es' ? `<li><a href="${relative(here, 'LICENSE.html')}"${page === 'LICENSE.html' ? ' aria-current="page"' : ''}>${esc(L.license)}</a></li>` : link(license, page === 'LICENSE.html');
  const items = [{ title: L.overview, file: 'README.html' }].concat(info.guides, [{ title: L.changes, file: 'CHANGELOG.html' }]);
  const guideList = items.map((g) => link(g, g.file === page)).join('\n          ') + '\n          ' + licenseLink;
  const templateList = info.templates.map((t) => link(t, t.file === page)).join('\n          ');
  const functions = `<li><a href="${relative(here, 'game-functions.txt')}">${L.functions}</a></li>`;
  const equivalents = lang === 'en'
    ? { en: path.posix.basename(page), es: available.es ? relative(here, 'es/' + page) : up + 'sdk.html', it: up + 'it/sdk.html' }
    : { es: path.posix.basename(page), en: relative(here, page), it: up + 'it/sdk.html' };
  const alternates = available.es
    ? `<link rel="alternate" hreflang="en" href="${DOMAIN}/sdk/${page}">\n<link rel="alternate" hreflang="es" href="${DOMAIN}/sdk/es/${page}">\n<link rel="alternate" hreflang="x-default" href="${DOMAIN}/sdk/${page}">\n`
    : '';
  return `<!doctype html>
<html lang="${L.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(heading)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${alternates}<meta property="og:type" content="article">
<meta property="og:site_name" content="Imperivm Resurrected">
<meta property="og:title" content="${esc(heading)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${DOMAIN}/img/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#faf9f6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#121110" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/png" sizes="32x32" href="${up}img/favicon-32.png">
<link rel="icon" type="image/png" sizes="64x64" href="${up}img/favicon-64.png">
<link rel="apple-touch-icon" href="${up}img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Archivo:wdth,wght@62..125,400..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${up}css/styles.css">
<script src="${up}js/theme.js"></script>
</head>
<body>
<a class="skip-link" href="#content">${L.skip}</a>
<div class="page">

${header}

  <main id="content" class="doc-layout">
    <aside class="doc-nav" aria-label="${L.guides}">
      <p class="guide-index__title">${L.guides}</p>
      <ol>
          ${guideList}
          ${functions}
      </ol>
      <p class="guide-index__title">${L.templates}</p>
      <ol>
          ${templateList}
      </ol>
      <a class="guide-link doc-back" href="${site}sdk.html">&larr; ${L.back}</a>
    </aside>
    <article class="doc">
${body}
    </article>
  </main>

${footer}

</div>

<script>window.GUIDE = ${JSON.stringify({ lang: L.lang, equivalents })};</script>
<script src="${up}js/i18n.js"></script>
<script src="${up}js/download.js"></script>
<script src="${up}js/motion.js"></script>
<script src="${up}js/support-data.js"></script>
<script src="${up}js/support.js"></script>
<script src="${up}js/menu.js"></script>
</body>
</html>
`;
}

const english = describe(SDK);
const spanishExists = fs.existsSync(path.join(ES_DIR, 'README.md'));
const spanish = spanishExists ? describe(ES_DIR) : null;

const sourceFiles = (info) => ['README.md', 'CHANGELOG.md', 'LICENSE.md']
  .map((f) => ({ file: f, page: f.replace(/\.md$/, '.html') }))
  .concat(info.guides.map((g) => ({ file: g.id + '.md', page: g.file })))
  .concat(info.templates.map((t) => ({ file: 'templates/' + t.id + '/README.md', page: t.file })));

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'templates'), { recursive: true });

const englishSources = sourceFiles(english);
if (spanishExists) {
  for (const s of englishSources) {
    if (ENGLISH_ONLY.includes(s.file)) continue;
    if (fs.existsSync(path.join(ES_DIR, s.file))) state.spanish.add(s.page);
  }
}

let pages = 0;
for (const lang of spanishExists ? ['en', 'es'] : ['en']) {
  const info = lang === 'en' ? english : spanish;
  const dir = lang === 'en' ? SDK : ES_DIR;
  const out = lang === 'en' ? OUT : path.join(OUT, 'es');
  fs.mkdirSync(path.join(out, 'templates'), { recursive: true });
  for (const s of englishSources) {
    if (lang === 'es' && !state.spanish.has(s.page)) continue;
    const md = read(path.join(dir, s.file));
    const title = (md.match(/^#\s+(.+)$/m) || [null, s.page])[1].replace(/`/g, '');
    state.lang = lang;
    state.source = s.file;
    state.page = (lang === 'es' ? 'es/' : '') + s.page;
    state.h = 0;
    state.ids = lang === 'es' ? headingIds(read(path.join(SDK, s.file))) : null;
    const html = marked.parse(protectBackslashSpans(md)).replace(/<table>/g, '<div class="table"><table>').replace(/<\/table>/g, '</table></div>');
    fs.writeFileSync(path.join(out, s.page), frame(lang, s.page, title, html, info, { es: state.spanish.has(s.page) }));
    pages++;
  }
}
fs.copyFileSync(path.join(SDK, 'game-functions.txt'), path.join(OUT, 'game-functions.txt'));

const changelog = read(path.join(SDK, 'CHANGELOG.md'));
const version = (changelog.match(/^##\s+(\d+\.\d+(?:\.\d+)?)/m) || [])[1];
const requires = (changelog.match(/(\d+\.\d+\.\d+)\s+or later/) || [null, ''])[1];
if (!version) throw new Error('No version in CHANGELOG.md');
const zip = `imperivm-resurrected-sdk-${version}.zip`;

const pack = (info) => ({
  guides: Object.fromEntries(info.guides.map((g) => [g.id, { title: g.title, file: g.file, desc: g.desc }])),
  templates: info.templates,
  tools: info.tools,
});
const readmeSections = sections(read(path.join(SDK, 'README.md')));
const anchor = (title) => (readmeSections.find((x) => x.title.toLowerCase() === title.toLowerCase()) || { id: '' }).id;
const index = {
  version,
  requires,
  zip,
  readme: 'README.html',
  extra: { changes: 'CHANGELOG.html', license: 'LICENSE.html' },
  anchors: { start: anchor('Start here'), mod: anchor('What a mod looks like'), templates: anchor('Templates') },
  languages: Object.assign({ en: pack(english) }, spanish ? { es: pack(spanish) } : {}),
};
fs.writeFileSync(path.join(OUT, 'index.js'), 'window.SDK_INDEX = ' + JSON.stringify(index, null, 1) + ';\n');

const zipFile = path.join(OUT, zip);
const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
const made = spawnSync(tar, ['-a', '-c', '-f', zipFile, '-C', SDK, ...fs.readdirSync(SDK)], { encoding: 'utf8' });
if (made.status !== 0) throw new Error('tar failed: ' + (made.stderr || made.error));

console.log(`${pages} pages (${spanishExists ? 'English and Spanish' : 'English only'}), SDK ${version}, requires ${requires || '?'}, ${zip} (${(fs.statSync(zipFile).size / 1048576).toFixed(1)} MB)`);
