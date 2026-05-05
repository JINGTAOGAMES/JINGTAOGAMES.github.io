(function () {
  var NOW_URL  = '/now/';
  var API_BASE = 'https://now-api.719783307e.workers.dev';
  var LABEL    = 'Now →';

  // 注入样式
  var style = document.createElement('style');
  style.textContent = [
    '#now-widget{margin-bottom:20px}',
    '.nw-inner{display:flex;align-items:center;gap:12px;padding:12px 20px;',
    'background:var(--card-bg-color,#fff);border-radius:12px;',
    'border:1px solid var(--card-border,rgba(0,0,0,.08));',
    'box-shadow:var(--card-box-shadow,0 2px 8px rgba(0,0,0,.06));',
    'text-decoration:none;color:var(--font-color,#333);font-size:.9rem;',
    'transition:box-shadow .2s;}',
    '.nw-inner:hover{box-shadow:0 4px 16px rgba(0,0,0,.12);}',
    '.nw-sep{color:var(--text-highlight-color,#ccc);flex-shrink:0;}',
    '.nw-arrow{margin-left:auto;color:var(--link-color,#6366f1);',
    'font-weight:500;flex-shrink:0;}',
    '.nw-item{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px;}',
  ].join('');
  document.head.appendChild(style);

  function init() {
    // 只在首页（有 #recent-posts）运行
    var postList = document.getElementById('recent-posts');
    if (!postList) return;

    // 创建组件
    var widget = document.createElement('div');
    widget.id = 'now-widget';
    widget.innerHTML =
      '<a href="' + NOW_URL + '" class="nw-inner">' +
        '<span class="nw-item" id="nw-loc">📍 …</span>' +
        '<span class="nw-sep">·</span>' +
        '<span class="nw-item" id="nw-status">💭 …</span>' +
        '<span class="nw-arrow">' + LABEL + '</span>' +
      '</a>';

    postList.parentNode.insertBefore(widget, postList);

    // 拉取数据
    fetch(API_BASE + '/api/status')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.location && data.location.area) {
          document.getElementById('nw-loc').textContent = '📍 ' + data.location.area;
        }
        if (data.status && data.status.text) {
          document.getElementById('nw-status').textContent =
            (data.status.emoji || '💭') + ' ' + data.status.text;
        }
      })
      .catch(function () {
        // 加载失败时静默，不影响页面
        var w = document.getElementById('now-widget');
        if (w) w.style.display = 'none';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
