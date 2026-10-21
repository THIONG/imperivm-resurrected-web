(function () {
  'use strict';

  var REPO = 'imperivm-resurrected/imperivm-resurrected';
  var RELEASES = 'https://github.com/' + REPO + '/releases';
  var API = 'https://api.github.com/repos/' + REPO + '/releases/latest';
  var KEY = 'latest-release';
  var CACHE_TTL = 10 * 60 * 1000;
  var MOD_ZIP = /^imperivm-resurrected-\d[\w.-]*\.zip$/i;

  var links = document.querySelectorAll('a[data-download]');
  if (!links.length) return;
  var strip = document.querySelector('[data-release]');

  function point(url) {
    for (var i = 0; i < links.length; i++) links[i].setAttribute('href', url);
  }

  function report(tag, sha) {
    if (!strip || !tag || !sha) return;
    strip.querySelector('[data-release-version]').textContent = tag;
    var code = strip.querySelector('[data-release-sha]');
    code.textContent = sha.slice(0, 8) + '\u2026' + sha.slice(-8);
    code.title = sha;
    strip.querySelector('[data-release-scan]').setAttribute('href', 'https://www.virustotal.com/gui/file/' + sha);
    strip.hidden = false;
  }

  point(RELEASES);

  var cached = null;
  try { cached = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { }
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    if (cached.url) point(cached.url);
    report(cached.tag, cached.sha);
    return;
  }
  if (!window.fetch) return;

  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (release) {
      var url = null, sha = null, tag = release && release.tag_name;
      var assets = (release && release.assets) || [];
      for (var i = 0; i < assets.length; i++) {
        if (MOD_ZIP.test(assets[i].name) && !/-sdk-/i.test(assets[i].name)) { url = assets[i].browser_download_url; sha = /^sha256:([0-9a-f]{64})$/.exec(assets[i].digest || ''); sha = sha && sha[1]; break; }
      }
      try { sessionStorage.setItem(KEY, JSON.stringify({ time: Date.now(), url: url, sha: sha, tag: tag })); } catch (e) { }
      if (url) point(url);
      report(tag, sha);
    })
    .catch(function () { });
})();
