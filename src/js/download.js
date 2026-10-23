(function () {
  'use strict';

  var REPO = 'imperivm-resurrected/imperivm-resurrected';
  var RELEASES = 'https://github.com/' + REPO + '/releases';
  var API = 'https://api.github.com/repos/' + REPO + '/releases/latest';
  var KEY = 'latest-download';
  var CACHE_TTL = 10 * 60 * 1000;
  var MOD_ZIP = /^imperivm-resurrected-\d[\w.-]*\.zip$/i;
  var SETUP = /^imperivm-resurrected-setup-\d[\w.-]*\.exe$/i;

  var links = document.querySelectorAll('a[data-download]');
  if (!links.length) return;

  function point(url) {
    for (var i = 0; i < links.length; i++) links[i].setAttribute('href', url);
  }

  point(RELEASES);

  var cached = null;
  try { cached = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { }
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    if (cached.url) point(cached.url);
    return;
  }
  if (!window.fetch) return;

  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (release) {
      var url = null;
      var assets = (release && release.assets) || [];
      for (var i = 0; i < assets.length; i++) {
        if (SETUP.test(assets[i].name)) { url = assets[i].browser_download_url; break; }
        if (!url && MOD_ZIP.test(assets[i].name) && !/-sdk-/i.test(assets[i].name)) url = assets[i].browser_download_url;
      }
      try { sessionStorage.setItem(KEY, JSON.stringify({ time: Date.now(), url: url })); } catch (e) { }
      if (url) point(url);
    })
    .catch(function () { });
})();
