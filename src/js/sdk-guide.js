(function () {
  'use strict';
  document.addEventListener('language-change', function (e) {
    var G = window.GUIDE;
    if (!G || !e.detail || e.detail === G.lang) return;
    var destination = G.equivalents && G.equivalents[e.detail];
    if (destination) location.href = destination + location.hash;
  });
})();
