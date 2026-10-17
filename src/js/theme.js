(function () {
  'use strict';

  var KEY = 'theme';
  var root = document.documentElement;

  function saved() {
    try { var t = localStorage.getItem(KEY); if (t === 'dark' || t === 'light') return t; } catch (e) { }
    return null;
  }
  function fromSystem() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function current() { return root.getAttribute('data-theme') || fromSystem(); }

  var g = saved();
  if (g) root.setAttribute('data-theme', g);

  var LABEL = { es: 'Cambiar entre tema claro y oscuro', en: 'Switch between light and dark theme', it: 'Passa dal tema chiaro a quello scuro' };
  var MOON = '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  var SUN = '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  document.addEventListener('DOMContentLoaded', function () {
    var menu = document.querySelector('.menu');
    if (!menu) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'theme';

    function render() {
      var dark = current() === 'dark';
      if (!b.firstChild) b.innerHTML = MOON + SUN;
      b.setAttribute('data-state', dark ? 'dark' : 'light');
      b.setAttribute('aria-pressed', dark ? 'true' : 'false');
      var l = root.lang;
      b.setAttribute('aria-label', LABEL[l] || LABEL.es);
      b.title = b.getAttribute('aria-label');
    }

    function applyTheme(next) {
      root.setAttribute('data-theme', next);
      render();
    }

    b.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) { }

      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) { applyTheme(next); return; }

      if (!document.startViewTransition) {
        root.classList.add('theme-fade');
        setTimeout(function () { root.classList.remove('theme-fade'); }, 550);
        applyTheme(next);
        return;
      }

      var r = b.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var w = window.innerWidth, h = window.innerHeight;
      if (!w || !h) { applyTheme(next); return; }
      var radius = Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y));
      root.style.setProperty('--theme-x', (x / w * 100) + '%');
      root.style.setProperty('--theme-y', (y / h * 100) + '%');
      root.style.setProperty('--theme-radius', (radius / (Math.hypot(w, h) / Math.SQRT2) * 100) + '%');
      root.setAttribute('data-theme-transition', 'true');

      var t = document.startViewTransition(function () { applyTheme(next); });
      var cleanup = function () {
        root.style.removeProperty('--theme-x');
        root.style.removeProperty('--theme-y');
        root.style.removeProperty('--theme-radius');
        root.removeAttribute('data-theme-transition');
      };
      t.finished.then(cleanup, cleanup);
    });

    var ref = menu.querySelector('.languages');
    menu.insertBefore(b, ref || null);
    render();
    document.addEventListener('language-change', render);
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () { if (!saved()) render(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
    }
  });
})();
