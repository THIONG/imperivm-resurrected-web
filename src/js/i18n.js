(function () {
  'use strict';

  var LANGUAGES = ['es', 'en', 'it'];
  var LABEL = { es: 'ES', en: 'EN', it: 'IT' };
  var NAME = { es: 'Español', en: 'English', it: 'Italiano' };
  var runtime = document.documentElement.hasAttribute('data-runtime-i18n');
  var current = document.documentElement.lang || 'es';

  var T = window.TRANSLATIONS || {};
  function saved() {
    try { var g = localStorage.getItem('language'); if (LANGUAGES.indexOf(g) >= 0) return g; } catch (e) { }
    return null;
  }
  function fromBrowser() {
    var l = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < l.length; i++) {
      var c = String(l[i]).slice(0, 2).toLowerCase();
      if (LANGUAGES.indexOf(c) >= 0) return c;
    }
    return 'en';
  }

  var nodes = [];
  function collect() {
    var list = document.querySelectorAll('[data-i18n],[data-i18n-html],[data-i18n-attr]');
    for (var i = 0; i < list.length; i++) {
      var el = list[i], o = { el: el };
      if (el.hasAttribute('data-i18n')) { o.kt = el.getAttribute('data-i18n'); o.t = el.textContent; }
      if (el.hasAttribute('data-i18n-html')) { o.kh = el.getAttribute('data-i18n-html'); o.h = el.innerHTML; }
      if (el.hasAttribute('data-i18n-attr')) {
        o.a = [];
        el.getAttribute('data-i18n-attr').split(';').forEach(function (par) {
          var p = par.split(':');
          o.a.push({ name: p[0], key: p[1], es: el.getAttribute(p[0]) });
        });
      }
      nodes.push(o);
    }
  }
  function translate(id, key, original) {
    if (id === 'es' || !T[id] || T[id][key] === undefined) return original;
    return T[id][key];
  }
  function applyLanguage(id) {
    nodes.forEach(function (o) {
      if (o.kt) o.el.textContent = translate(id, o.kt, o.t);
      if (o.kh) o.el.innerHTML = translate(id, o.kh, o.h);
      if (o.a) o.a.forEach(function (x) { o.el.setAttribute(x.name, translate(id, x.key, x.es)); });
    });
    document.documentElement.lang = id;
    updateSelector(id);
    document.dispatchEvent(new CustomEvent('language-change', { detail: id }));
  }

  function updateSelector(id) {
    var boxes = document.querySelectorAll('.languages');
    for (var c = 0; c < boxes.length; c++) {
      var code = boxes[c].querySelector('.languages__code'), btn = boxes[c].querySelector('.languages__button'), ops = boxes[c].querySelectorAll('[role="option"]');
      if (code) code.textContent = LABEL[id];
      if (btn) btn.setAttribute('aria-label', LABEL[id] + ', ' + NAME[id] + ' (' + LANGUAGE_LABEL[id] + ')');
      for (var k = 0; k < ops.length; k++) ops[k].setAttribute('aria-selected', ops[k].getAttribute('data-lang') === id ? 'true' : 'false');
    }
  }

  function destination(id) {
    var guide = window.GUIDE;
    if (guide && guide.equivalents && guide.equivalents[id]) return guide.equivalents[id] + location.hash;
    var rest = location.pathname.replace(/^\/(?:en|it)(?=\/|$)/, '') || '/';
    if (rest.charAt(rest.length - 1) !== '/' && rest.indexOf('.') < 0) rest += '/';
    return (id === 'es' ? '' : '/' + id) + rest + (id === 'es' ? '?lang=es' : '') + location.hash;
  }

  var LANGUAGE_LABEL = { es: 'Idioma', en: 'Language', it: 'Lingua' };
  var GLOBE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>';
  var CHEVRON = '<svg class="languages__arrow" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>';

  function build(box) {
    var uid = 'idi' + Math.random().toString(36).slice(2, 7);
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'languages__button';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', uid);
    button.innerHTML = GLOBE + '<span class="languages__code"></span>' + CHEVRON;
    var list = document.createElement('ul');
    list.id = uid;
    list.className = 'languages__list';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', LANGUAGE_LABEL[current] || LANGUAGE_LABEL.en);
    list.hidden = true;
    LANGUAGES.forEach(function (id) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('data-lang', id);
      li.setAttribute('lang', id);
      li.tabIndex = -1;
      li.innerHTML = '<span>' + NAME[id] + '</span><b>' + LABEL[id] + '</b>';
      list.appendChild(li);
    });
    box.appendChild(button);
    box.appendChild(list);

    function isOpen() { return !list.hidden; }
    function openList() { list.hidden = false; button.setAttribute('aria-expanded', 'true'); (list.querySelector('[aria-selected="true"]') || list.firstChild).focus(); }
    function closeList(returnFocus) { list.hidden = true; button.setAttribute('aria-expanded', 'false'); if (returnFocus) button.focus(); }
    function choose(li) {
      var id = li.getAttribute('data-lang');
      try { localStorage.setItem('language', id); } catch (e) { }
      closeList(true);
      if (runtime) { applyLanguage(id); return; }
      if (id !== current) location.href = destination(id);
    }
    button.addEventListener('click', function () { if (isOpen()) closeList(false); else openList(); });
    button.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openList(); } });
    list.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) choose(li); });
    list.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(list.children), i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (i >= 0) choose(items[i]); }
      else if (e.key === 'Escape') { e.preventDefault(); closeList(true); }
      else if (e.key === 'Tab') { closeList(false); }
    });
    document.addEventListener('click', function (e) { if (isOpen() && !box.contains(e.target)) closeList(false); });
  }

  function selector() {
    var boxes = document.querySelectorAll('.languages');
    for (var i = 0; i < boxes.length; i++) build(boxes[i]);
  }

  if (runtime) {
    collect();
    selector();
    applyLanguage(saved() || fromBrowser());
  } else {
    selector();
    updateSelector(current);
  }
})();
