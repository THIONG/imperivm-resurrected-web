(function () {
  'use strict';

  var list = window.SUPPORTERS;
  var box = document.getElementById('supporters');
  var ul = document.getElementById('supporters-list');
  if (!box || !ul || !Array.isArray(list) || !list.length) return;

  list.forEach(function (entry) {
    var name = typeof entry === 'string' ? entry : entry && entry.name;
    if (!name) return;
    var li = document.createElement('li');
    var span = document.createElement('span');
    span.textContent = name;
    li.appendChild(span);
    ul.appendChild(li);
  });

  if (ul.children.length) box.hidden = false;
})();
