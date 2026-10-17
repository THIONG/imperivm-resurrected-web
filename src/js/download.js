(function () {
  'use strict';

  var REPO = 'THIONG/imperivm-resurrected';
  var RELEASES = 'https://github.com/' + REPO + '/releases';
  var API = 'https://api.github.com/repos/' + REPO + '/releases/latest';
  var KEY = 'latest-release-2';
  var CACHE_TTL = 10 * 60 * 1000;
  var HEX = /^[0-9a-f]{64}$/i;

  var state = { status: 'checking', version: null, iso: null, bytes: null, url: null, page: null, name: null, sha: null };
  var announced = null;

  function language() { return document.documentElement.lang || 'es'; }

  function date(iso) {
    var d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    if (isNaN(d.getTime())) return null;
    try { return new Intl.DateTimeFormat(language(), { day: 'numeric', month: 'long', year: 'numeric' }).format(d); }
    catch (e) { return null; }
  }

  function size(bytes) {
    var n = Number(bytes);
    if (!n) return null;
    try { return new Intl.NumberFormat(language(), { maximumFractionDigits: 1 }).format(n / 1048576) + ' MB'; }
    catch (e) { return (n / 1048576).toFixed(1) + ' MB'; }
  }

  function activeTokens() {
    var t = {};
    t[state.status] = true;
    if (state.status === 'release') {
      if (state.sha === false) t.nosha = true; else t.sha = true;
    }
    return t;
  }

  function render() {
    var i, el, list, f, t;
    var release = state.status === 'release';
    var tokens = activeTokens();

    list = document.querySelectorAll('[data-when]');
    for (i = 0; i < list.length; i++) {
      el = list[i];
      var wanted = el.getAttribute('data-when').split(/\s+/), show = false;
      for (var k = 0; k < wanted.length; k++) if (tokens[wanted[k]]) show = true;
      if (show) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    }

    if (release) {
      list = document.querySelectorAll('[data-version]');
      for (i = 0; i < list.length; i++) list[i].textContent = state.version;

      list = document.querySelectorAll('[data-date]');
      for (i = 0; i < list.length; i++) {
        f = state.iso ? date(state.iso) : null;
        if (f) list[i].textContent = f;
      }

      list = document.querySelectorAll('[data-size]');
      for (i = 0; i < list.length; i++) {
        t = size(state.bytes);
        if (t) list[i].textContent = t;
      }

      list = document.querySelectorAll('[data-zip-name]');
      for (i = 0; i < list.length; i++) list[i].textContent = state.name;

      list = document.querySelectorAll('[data-sha]');
      for (i = 0; i < list.length; i++) list[i].textContent = typeof state.sha === 'string' ? state.sha : '…';
    }

    list = document.querySelectorAll('a[data-download]');
    for (i = 0; i < list.length; i++) list[i].setAttribute('href', release && state.url ? state.url : RELEASES);

    list = document.querySelectorAll('a[data-release-page]');
    for (i = 0; i < list.length; i++) list[i].setAttribute('href', release && state.page ? state.page : RELEASES);

    document.documentElement.setAttribute('data-release', state.status);
    if (announced !== state.status) {
      announced = state.status;
      try { document.dispatchEvent(new CustomEvent('release-change', { detail: state.status })); } catch (e) { }
    }
  }

  function findZip(assets) {
    for (var i = 0; i < assets.length; i++) {
      var n = String(assets[i].name || '');
      if (/^imperivm-resurrected-.+\.zip$/i.test(n) && !/-sdk-/i.test(n)) return assets[i];
    }
    return null;
  }

  function findAsset(assets, name) {
    for (var i = 0; i < assets.length; i++) if (assets[i].name === name) return assets[i];
    return null;
  }

  function sumFor(text, name) {
    var lines = String(text).split(/\r?\n/);
    for (var i = 0; i < lines.length; i++) {
      var m = /^([0-9a-f]{64})\s+\*?(.+?)\s*$/i.exec(lines[i]);
      if (m && m[2] === name) return m[1].toLowerCase();
    }
    return null;
  }

  function hashFromJson(text, name) {
    try {
      var info = JSON.parse(text);
      var z = info && info.zip;
      if (z && HEX.test(String(z.sha256 || '')) && (!z.url || String(z.url).slice(-name.length) === name)) return String(z.sha256).toLowerCase();
    } catch (e) { }
    return null;
  }

  function readAsset(a) {
    function ok(r) { return r.ok ? r.text() : Promise.reject(r.status); }
    var viaApi = a.url ? fetch(a.url, { headers: { Accept: 'application/octet-stream' } }).then(ok) : Promise.reject(0);
    return viaApi.catch(function () { return fetch(a.browser_download_url).then(ok); });
  }

  function resolveSha(assets, name) {
    var sums = findAsset(assets, 'SHA256SUMS.txt');
    var info = findAsset(assets, 'version.json');
    var fromInfo = function () {
      if (!info) return null;
      return readAsset(info).then(function (t) { return hashFromJson(t, name); }).catch(function () { return null; });
    };
    if (!window.fetch) return Promise.resolve(null);
    if (!sums) return Promise.resolve(fromInfo());
    return readAsset(sums)
      .then(function (t) { return sumFor(t, name); })
      .catch(function () { return null; })
      .then(function (h) { return h || fromInfo(); });
  }

  function compact(rel, assets) {
    return {
      tag_name: rel.tag_name,
      published_at: rel.published_at,
      html_url: rel.html_url,
      assets: assets.map(function (a) { return { name: a.name, size: a.size, url: a.url, browser_download_url: a.browser_download_url }; })
    };
  }

  function writeCache(entry) {
    try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: entry })); } catch (e) { }
  }

  function useRelease(rel, knownSha) {
    var assets = rel && rel.assets ? rel.assets : [];
    var zip = findZip(assets);
    var version = rel ? String(rel.tag_name || '').replace(/^v/i, '') : '';
    if (!zip || !version || !zip.browser_download_url) { useNone(); return; }
    state.status = 'release';
    state.version = version;
    state.iso = rel.published_at ? String(rel.published_at).slice(0, 10) : null;
    state.bytes = zip.size || null;
    state.url = zip.browser_download_url;
    state.page = /^https:\/\/github\.com\//.test(String(rel.html_url || '')) ? rel.html_url : null;
    state.name = zip.name;
    state.sha = HEX.test(String(knownSha || '')) ? String(knownSha).toLowerCase() : null;
    render();
    if (state.sha) return;
    resolveSha(assets, zip.name).then(function (h) {
      state.sha = h && HEX.test(h) ? h : false;
      if (state.sha) writeCache({ release: compact(rel, assets), sha: state.sha });
      render();
    });
  }

  function useNone() {
    state.status = 'none';
    render();
  }

  function useUnknown() {
    state.status = 'unknown';
    render();
  }

  function readCache() {
    try {
      var c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (c && Date.now() - c.t < CACHE_TTL) return c.d;
    } catch (e) { }
    return null;
  }

  function fetchLatest() {
    var c = readCache();
    if (c) {
      if (c.none) useNone(); else useRelease(c.release, c.sha);
      return;
    }
    if (!window.fetch) { useUnknown(); return; }
    fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) {
        if (r.status === 404) return null;
        return r.ok ? r.json() : Promise.reject(r.status);
      })
      .then(function (d) {
        if (!d) { writeCache({ none: true }); useNone(); return; }
        var assets = d.assets || [];
        if (!findZip(assets)) { useNone(); return; }
        writeCache({ release: compact(d, assets), sha: null });
        useRelease(d, null);
      })
      .catch(useUnknown);
  }

  document.addEventListener('language-change', render);
  render();
  fetchLatest();
})();
