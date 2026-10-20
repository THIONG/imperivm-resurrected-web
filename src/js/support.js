(function () {
  'use strict';

  var D = window.SUPPORT_DATA;
  if (!D) return;

  var T = {
    es: { link: 'Donaciones', title: 'Apoya el proyecto', intro: 'Imperivm Resurrected es gratuito. Si te gusta y quieres ayudar a mantenerlo, puedes hacer una aportación voluntaria.', paypal: 'PayPal', btc: 'Dirección de Bitcoin', open: 'Abrir', copy: 'Copiar', copied: 'Copiado', close: 'Cerrar', thanks: 'Gracias.' },
    en: { link: 'Donate', title: 'Support the project', intro: 'Imperivm Resurrected is free. If you like it and want to help keep it going, you can make a voluntary contribution.', paypal: 'PayPal', btc: 'Bitcoin address', open: 'Open', copy: 'Copy', copied: 'Copied', close: 'Close', thanks: 'Thank you.' },
    it: { link: 'Donazioni', title: 'Sostieni il progetto', intro: 'Imperivm Resurrected è gratuito. Se ti piace e vuoi aiutare a mantenerlo, puoi fare un contributo volontario.', paypal: 'PayPal', btc: 'Indirizzo Bitcoin', open: 'Apri', copy: 'Copia', copied: 'Copiato', close: 'Chiudi', thanks: 'Grazie.' }
  };

  function t() { return T[document.documentElement.lang] || T.es; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var done = false;
  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();

  function init() {
    if (done) return;
    var nav = document.querySelector('.footer__links');
    if (!nav) return;
    done = true;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'footer__support';
    button.setAttribute('aria-haspopup', 'dialog');
    nav.insertBefore(button, nav.firstChild);

    var headerButton = null, menu = document.querySelector('.menu');
    if (menu) {
      headerButton = document.createElement('button');
      headerButton.type = 'button';
      headerButton.className = 'support-header';
      headerButton.setAttribute('aria-haspopup', 'dialog');
      menu.insertBefore(headerButton, menu.querySelector('.external-link') || menu.querySelector('.theme') || menu.querySelector('.languages') || null);
    }

    var mods = menu && menu.querySelector('.external-link');
    if (mods) {
      var discord = document.createElement('a');
      discord.className = 'external-link discord-header';
      discord.href = 'https://discord.gg/6kCatX3Zbc';
      discord.target = '_blank';
      discord.rel = 'noopener';
      discord.textContent = 'Discord';
      menu.insertBefore(discord, mods);
    }

    var dlg = document.createElement('dialog');
    dlg.className = 'support';
    dlg.setAttribute('aria-labelledby', 'support-title');
    document.body.appendChild(dlg);

    var rows = [];
    if (D.paypal) rows.push(['paypal', D.paypal, true]);
    if (D.btc) rows.push(['btc', D.btc, false]);
    var copiedTimer = null;

    function render() {
      var x = t();
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span>' + esc(x.link) + '</span>';
      if (headerButton) headerButton.textContent = x.link;
      dlg.innerHTML =
        '<h2 id="support-title">' + esc(x.title) + '</h2>' +
        '<p class="support__intro">' + esc(x.intro) + '</p>' +
        '<ul class="support__list">' + rows.map(function (f) {
          return '<li><span class="support__label">' + esc(x[f[0]]) + '</span>' +
                 '<code class="support__value">' + esc(f[2] ? f[1].replace(/^https?:\/\//, '') : f[1]) + '</code>' +
                 (f[2]
                   ? '<a class="support__copy support__open" href="' + esc(f[1]) + '" target="_blank" rel="noopener">' + esc(x.open) + '</a></li>'
                   : '<button type="button" class="support__copy" data-value="' + esc(f[1]) + '">' + esc(x.copy) + '</button></li>');
        }).join('') + '</ul>' +
        '<div class="support__footer"><span class="support__thanks">' + esc(x.thanks) + '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span><button type="button" class="support__close">' + esc(x.close) + '</button></div>' +
        '<p class="support__status" role="status" aria-live="polite"></p>';
    }

    function copy(text, b) {
      var ready = function () {
        var x = t();
        b.textContent = x.copied;
        b.classList.add('support__copy--ok');
        dlg.querySelector('.support__status').textContent = x.copied;
        clearTimeout(copiedTimer);
        copiedTimer = setTimeout(function () { b.textContent = x.copy; b.classList.remove('support__copy--ok'); dlg.querySelector('.support__status').textContent = ''; }, 1600);
      };
      var fallback = function () { if (fallbackCopy(text)) ready(); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ready, fallback);
      } else { fallback(); }
    }
    function fallbackCopy(text) {
      var a = document.createElement('textarea'), done = false;
      a.value = text; a.setAttribute('readonly', ''); a.style.position = 'fixed'; a.style.opacity = '0';
      document.body.appendChild(a); a.select();
      try { done = document.execCommand('copy'); } catch (e) { }
      document.body.removeChild(a);
      return done;
    }

    var native = typeof dlg.showModal === 'function';
    var openDialog = function () { if (native) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', ''); };
    var closeDialog = function () { if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open'); };
    button.addEventListener('click', openDialog);
    if (headerButton) headerButton.addEventListener('click', openDialog);
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) {
        var r = dlg.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog();
        return;
      }
      var c = e.target.closest('button.support__copy');
      if (c) { copy(c.getAttribute('data-value'), c); return; }
      if (e.target.closest('.support__close')) closeDialog();
    });
    document.addEventListener('keydown', function (e) { if (!native && e.key === 'Escape' && dlg.hasAttribute('open')) closeDialog(); });

    render();
    document.addEventListener('language-change', render);
  }
})();
