(function () {
  'use strict';

  var D = window.SDK_INDEX;
  if (!D) return;

  var LABELS = {
    es: { changes: 'Cambios del SDK', license: 'Licencia (en inglés)' },
    en: { changes: 'SDK changes', license: 'License' },
    it: { changes: 'Cambiamenti dell\'SDK', license: 'Licenza' }
  };

  function language() { var l = document.documentElement.lang; return LABELS[l] ? l : 'es'; }
  function capitalize(h) { return h.replace(/^([a-zà-ÿ])/, function (c) { return c.toUpperCase(); }); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function render() {
    var l = language(), prefix = l === 'es' ? '' : '../', root = prefix + 'sdk/';
    var spanish = l === 'es' && D.languages.es;
    var d = spanish ? D.languages.es : D.languages.en, base = root + (spanish ? 'es/' : ''), i, list;

    list = document.querySelectorAll('[data-group]');
    for (i = 0; i < list.length; i++) {
      var ids = list[i].getAttribute('data-group').split(' ');
      list[i].querySelector('.guide-list').innerHTML = ids.map(function (id) {
        var g = d.guides[id];
        return g ? '<li><a href="' + base + g.file + '">' + esc(g.title) + '</a><span>' + capitalize(g.desc) + '</span></li>' : '';
      }).join('');
    }

    var templates = document.getElementById('templates-list');
    if (templates) {
      templates.innerHTML = d.templates.map(function (t) {
        return '<li><a href="' + base + t.file + '">' + esc(t.title) + '</a><span>' + capitalize(t.desc) + '</span></li>';
      }).join('');
    }

    var byFile = {};
    Object.keys(d.guides).forEach(function (id) { byFile[d.guides[id].file] = d.guides[id].title; });
    document.getElementById('tools-table').innerHTML = d.tools.map(function (h) {
      var g = h.guide ? '<a href="' + base + h.guide + '">' + esc(byFile[h.guide] || h.guide) + '</a>' : '';
      return '<tr><td>' + h.want + '</td><td>' + h.use + '</td><td>' + g + '</td></tr>';
    }).join('');

    var more = ['reference', 'validating', 'publishing'].map(function (id) {
      var g = d.guides[id];
      return '<li><a href="' + base + g.file + '">' + esc(g.title) + '</a><span>' + capitalize(g.desc) + '</span></li>';
    });
    more.push('<li><a href="' + base + D.extra.changes + '">' + LABELS[l].changes + '</a></li>');
    more.push('<li><a href="' + root + D.extra.license + '">' + LABELS[l].license + '</a></li>');
    document.getElementById('more-list').innerHTML = more.join('');

    list = document.querySelectorAll('[data-go]');
    for (i = 0; i < list.length; i++) {
      var v = list[i].getAttribute('data-go').split(':'), href;
      if (v[0] === 'readme') href = base + D.readme + (v[1] ? '#' + D.anchors[v[1]] : '');
      else href = base + d.guides[v[0]].file;
      list[i].setAttribute('href', href);
    }

    list = document.querySelectorAll('[data-sdk-zip]');
    for (i = 0; i < list.length; i++) list[i].setAttribute('href', root + D.zip);
    list = document.querySelectorAll('[data-sdk-version]');
    for (i = 0; i < list.length; i++) list[i].textContent = D.version;
    list = document.querySelectorAll('[data-sdk-requires]');
    for (i = 0; i < list.length; i++) list[i].textContent = D.requires;
  }

  document.addEventListener('language-change', render);
  render();
})();
