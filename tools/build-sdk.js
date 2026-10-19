const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(SRC, 'sdk');
const SDK = path.resolve(process.argv[2] || path.join(ROOT, '..', 'imperivm-resurrected', 'sdk'));
const DOMAIN = 'https://www.imperivmresurrected.com';
const REPO = 'https://github.com/imperivm-resurrected/imperivm-resurrected';
const TEMPLATE_ORDER = ['scenario', 'adventure', 'conquest', 'units', 'civilization', 'gameplay', 'audio', 'translation', 'graphics', 'full'];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (t) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '-');
const read = (file) => fs.readFileSync(file, 'utf8');
const posix = (p) => p.split(path.sep).join('/');

if (!fs.existsSync(path.join(SDK, 'README.md'))) {
  console.error('The SDK folder was not found: ' + SDK);
  process.exit(1);
}

const state = { source: '' };

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
      if (page) return `<a href="${relative(state.page, page)}${anchor}">${text}</a>`;
      if (/\.txt$/.test(target) && fs.existsSync(path.join(SDK, target))) return `<a href="${relative(state.page, target)}">${text}</a>`;
      if (target === 'templates') return `<a href="${relative(state.page, 'README.html')}#templates">${text}</a>`;
      const full = path.join(SDK, target);
      const kind = fs.existsSync(full) && fs.statSync(full).isFile() ? 'blob' : 'tree';
      return `<a href="${REPO}/${kind}/main/sdk/${target}" target="_blank" rel="noopener">${text}</a>`;
    },
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens);
      const raw = tokens.map((t) => t.raw || t.text || '').join('');
      return `<h${depth} id="${slug(raw)}">${html}</h${depth}>\n`;
    },
  },
});

function protectBackslashSpans(md) {
  let fenced = false;
  return md.split('\n').map((line) => {
    if (/^\s*```/.test(line)) { fenced = !fenced; return line; }
    if (fenced) return line;
    return line.replace(/`([^`\n]*\\)`/g, (m, code) => '<code>' + code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>');
  }).join('\n');
}

function sections(md) {
  const found = [];
  let current = null;
  for (const t of marked.lexer(md)) {
    if (t.type === 'heading' && t.depth === 2) { current = { title: t.text.replace(/`/g, ''), id: slug(t.tokens.map((x) => x.raw || x.text || '').join('')), tokens: [] }; found.push(current); }
    else if (current) current.tokens.push(t);
  }
  return found;
}

const readme = read(path.join(SDK, 'README.md'));
const readmeSections = sections(readme);
const section = (title) => {
  const s = readmeSections.find((x) => x.title.toLowerCase() === title.toLowerCase());
  if (!s) throw new Error('README section missing: ' + title);
  return s;
};

const guides = [];
for (const list of section('Guides').tokens.filter((x) => x.type === 'list')) {
  for (const item of list.items) {
    const m = item.raw.match(/^\s*[-*]\s+\[(.+?)\]\((.+?)\)\s*:?\s*([\s\S]*?)\s*$/);
    if (!m) throw new Error('A guide line cannot be read: ' + item.raw);
    guides.push({ id: m[2].replace(/\.md$/, ''), title: m[1].replace(/`/g, ''), file: m[2].replace(/\.md$/, '.html'), desc: marked.parseInline(m[3]) });
  }
}

const templateRows = section('Templates').tokens.find((x) => x.type === 'table').rows.map((row) => {
  const id = row[1].text.match(/\(templates\/([^)]+)\)/)[1];
  const heading = read(path.join(SDK, 'templates', id, 'README.md')).match(/^#\s+(.+)$/m)[1];
  return { id, title: heading, file: 'templates/' + id + '.html', desc: marked.parseInline(row[0].text) };
});
const templatesById = Object.fromEntries(templateRows.map((t) => [t.id, t]));
const orderedTemplates = TEMPLATE_ORDER.filter((id) => templatesById[id]);

const tools = section('Tools').tokens.find((x) => x.type === 'table').rows.map((row) => {
  const want = row[0].text;
  const use = row[1].text;
  const g = use.match(/\]\(([^)]+\.md)\)/);
  const clean = use.replace(/\s*\(\[[^\]]+\]\([^)]+\)\)/, '').replace(/\s*\([^)]*\)\s*$/, '');
  return { want: marked.parseInline(want), use: marked.parseInline(clean), guide: g ? g[1].replace(/\.md$/, '.html') : null };
});

const changelog = read(path.join(SDK, 'CHANGELOG.md'));
const version = (changelog.match(/^##\s+(\d+\.\d+(?:\.\d+)?)/m) || [])[1];
const requires = (changelog.match(/(\d+\.\d+\.\d+)\s+or later/) || [null, ''])[1];
if (!version) throw new Error('No version in CHANGELOG.md');
const zip = `imperivm-resurrected-sdk-${version}.zip`;

const credits = read(path.join(SRC, 'en', 'credits.html'));
const headerBlock = credits.match(/<header class="header">[\s\S]*?<\/header>/)[0];
const footerBlock = credits.match(/<footer class="footer">[\s\S]*?<\/footer>/)[0];
const noI18n = (html) => html.replace(/\sdata-i18n(?:-html|-attr)?="[^"]*"/g, '');

function frame(page, title, body) {
  const depth = page.split('/').length - 1;
  const up = '../'.repeat(depth + 1);
  const url = DOMAIN + '/sdk/' + page;
  const plain = (s) => s.replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
  let description = plain((body.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || '') || title;
  if (description.length > 155) description = description.slice(0, 155).replace(/\s+\S*$/, '') + '…';
  const heading = /SDK/.test(title) ? title : title + ' — SDK';
  let header = noI18n(headerBlock)
    .replace(/ aria-current="page"/g, '')
    .replace('href="index.html"', `href="${up}en/"`)
    .replace('href="guide.html"', `href="${up}en/guide.html"`)
    .replace('<a href="sdk.html">', `<a href="${up}en/sdk.html" aria-current="page">`)
    .replace(/src="\.\.\/img\//g, `src="${up}img/`);
  let footer = noI18n(footerBlock)
    .replace('href="index.html" aria-label', `href="${up}en/" aria-label`)
    .replace('href="credits.html"', `href="${up}en/credits.html"`)
    .replace(/<a class="footer__back" href="index.html">[^<]*<\/a>/, `<a class="footer__back" href="${up}en/sdk.html">Back to For modders</a>`)
    .replace(/src="\.\.\/img\//g, `src="${up}img/`);
  const link = (item, current) => `<li><a href="${relative(page, item.file)}"${current ? ' aria-current="page"' : ''}>${esc(item.title)}</a></li>`;
  const guideItems = [{ title: 'Overview', file: 'README.html' }].concat(guides, [{ title: 'Changes', file: 'CHANGELOG.html' }, { title: 'License', file: 'LICENSE.html' }]);
  const guideList = guideItems.map((g) => link(g, g.file === page)).join('\n          ');
  const templateList = orderedTemplates.map((id) => link(templatesById[id], templatesById[id].file === page)).join('\n          ');
  const functions = `<li><a href="${relative(page, 'game-functions.txt')}">Game functions</a></li>`;
  const guide = JSON.stringify({ lang: 'en', equivalents: { es: up + 'sdk.html', en: path.posix.basename(page), it: up + 'it/sdk.html' } });
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(heading)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
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
<a class="skip-link" href="#content">Skip to content</a>
<div class="page">

${header}

  <main id="content" class="doc-layout">
    <aside class="doc-nav" aria-label="SDK guides">
      <p class="guide-index__title">SDK guides</p>
      <ol>
          ${guideList}
          ${functions}
      </ol>
      <p class="guide-index__title">Templates</p>
      <ol>
          ${templateList}
      </ol>
      <a class="guide-link doc-back" href="${up}en/sdk.html">&larr; For modders</a>
    </aside>
    <article class="doc">
${body}
    </article>
  </main>

${footer}

</div>

<script>window.GUIDE = ${guide};</script>
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

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'templates'), { recursive: true });

const sources = [{ file: 'README.md', page: 'README.html' }, { file: 'CHANGELOG.md', page: 'CHANGELOG.html' }, { file: 'LICENSE.md', page: 'LICENSE.html' }]
  .concat(guides.map((g) => ({ file: g.id + '.md', page: g.file })))
  .concat(orderedTemplates.map((id) => ({ file: 'templates/' + id + '/README.md', page: 'templates/' + id + '.html' })));

let pages = 0;
for (const s of sources) {
  const md = read(path.join(SDK, s.file));
  const title = (md.match(/^#\s+(.+)$/m) || [null, s.page])[1].replace(/`/g, '');
  state.source = s.file;
  state.page = s.page;
  const html = marked.parse(protectBackslashSpans(md)).replace(/<table>/g, '<div class="table"><table>').replace(/<\/table>/g, '</table></div>');
  fs.writeFileSync(path.join(OUT, s.page), frame(s.page, title, html));
  pages++;
}
fs.copyFileSync(path.join(SDK, 'game-functions.txt'), path.join(OUT, 'game-functions.txt'));

const index = {
  version,
  requires,
  zip,
  readme: 'README.html',
  extra: { changes: 'CHANGELOG.html', license: 'LICENSE.html' },
  anchors: { start: slug('Start here'), mod: slug('What a mod looks like'), templates: slug('Templates') },
  guides: Object.fromEntries(guides.map((g) => [g.id, { title: g.title, file: g.file, desc: g.desc }])),
  templates: orderedTemplates.map((id) => templatesById[id]),
  tools,
};
fs.writeFileSync(path.join(OUT, 'index.js'), 'window.SDK_INDEX = ' + JSON.stringify(index, null, 1) + ';\n');

const zipFile = path.join(OUT, zip);
const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
const made = spawnSync(tar, ['-a', '-c', '-f', zipFile, '-C', SDK, ...fs.readdirSync(SDK)], { encoding: 'utf8' });
if (made.status !== 0) throw new Error('tar failed: ' + (made.stderr || made.error));

console.log(`${pages} pages, SDK ${version}, requires ${requires || '?'}, ${zip} (${(fs.statSync(zipFile).size / 1048576).toFixed(1)} MB)`);
