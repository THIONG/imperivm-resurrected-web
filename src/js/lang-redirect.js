(function () {
  'use strict';

  var LANGUAGES = ['es', 'en', 'it'];
  if (document.documentElement.lang !== 'es') return;
  if (/[?&]lang=/.test(location.search)) return;
  if (/bot|crawl|spider|slurp|bing|google|yandex|baidu|duckduck|facebookexternalhit|preview/i.test(navigator.userAgent)) return;

  var wanted = null;
  try { var g = localStorage.getItem('language'); if (LANGUAGES.indexOf(g) >= 0) wanted = g; } catch (e) { }
  if (!wanted) {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    wanted = 'en';
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).slice(0, 2).toLowerCase();
      if (LANGUAGES.indexOf(code) >= 0) { wanted = code; break; }
    }
  }
  if (wanted === 'es') return;
  var file = location.pathname.split('/').pop();
  location.replace(wanted + '/' + file + location.search + location.hash);
})();
