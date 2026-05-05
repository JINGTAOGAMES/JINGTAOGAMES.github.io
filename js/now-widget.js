(function () {
  var NOW_URL  = '/now/';
  var API_BASE = 'https://now-api.719783307e.workers.dev';
  var LINK_TEXT = '查看 Now 页面 →';
  var LOADING   = '加载中…';
  var UPDATED   = '更新于 ';

  function timeAgo(isoStr) {
    if (!isoStr) return '';
    var diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
    if (diff < 60)    return diff + '秒前';
    if (diff < 3600)  return Math.floor(diff / 60) + '分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
    return Math.floor(diff / 86400) + '天前';
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // 动态加载 Leaflet（仅首页需要时加载）
  function loadLeaflet(cb) {
    if (window.L) { cb(); return; }
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload = cb;
    document.head.appendChild(js);
  }

  function init() {
    // 只在首页（同时有 #content-inner 和 #recent-posts）运行
    var contentInner = document.getElementById('content-inner');
    var recentPosts  = document.getElementById('recent-posts');
    if (!contentInner || !recentPosts) return;

    // 注入样式
    var style = document.createElement('style');
    style.textContent =
      '#now-widget{' +
        'grid-column:1/-1;' +          /* 横跨 grid 全部列 */
        'margin-bottom:20px;' +
        'border-radius:12px;' +
        'overflow:hidden;' +
        'background:var(--card-bg-color,#fff);' +
        'border:1px solid var(--card-border,rgba(0,0,0,.08));' +
        'box-shadow:var(--card-box-shadow,0 2px 8px rgba(0,0,0,.06));' +
        'display:flex;flex-direction:row;' +
      '}' +
      '#nw-map{' +
        'width:45%;min-width:240px;height:220px;flex-shrink:0;' +
      '}' +
      '.nw-info{' +
        'flex:1;padding:22px 26px;display:flex;' +
        'flex-direction:column;justify-content:center;gap:14px;' +
      '}' +
      '.nw-row{' +
        'display:flex;align-items:center;gap:10px;' +
        'font-size:1rem;color:var(--font-color,#333);' +
      '}' +
      '.nw-updated{font-size:.75rem;color:var(--font-second-color,#aaa);}' +
      '.nw-link{' +
        'display:inline-flex;align-items:center;gap:6px;' +
        'color:var(--link-color,#6366f1);text-decoration:none;' +
        'font-size:.85rem;font-weight:500;margin-top:4px;' +
      '}' +
      '.nw-link:hover{text-decoration:underline;}' +
      /* 移动端：地图堆叠在上方，全宽展开 */
      '@media(max-width:680px){' +
        '#now-widget{flex-direction:column;}' +
        '#nw-map{width:100%;min-width:unset;height:200px;}' +
        '.nw-info{padding:16px 18px;}' +
      '}';
    document.head.appendChild(style);

    // 创建组件 HTML
    var widget = document.createElement('div');
    widget.id = 'now-widget';
    widget.innerHTML =
      '<div id="nw-map"></div>' +
      '<div class="nw-info">' +
        '<div class="nw-row" id="nw-loc">📍 <span>' + LOADING + '</span></div>' +
        '<div class="nw-row" id="nw-status">💭 <span>' + LOADING + '</span></div>' +
        '<div class="nw-updated" id="nw-time"></div>' +
        '<a href="' + NOW_URL + '" class="nw-link">' + LINK_TEXT + '</a>' +
      '</div>';

    // 插入为 #content-inner 的第一个子节点（横跨全宽）
    contentInner.insertBefore(widget, contentInner.firstChild);

    // 加载 Leaflet 后再拉取数据
    loadLeaflet(function () {
      fetch(API_BASE + '/api/status')
        .then(function (r) { return r.json(); })
        .then(function (data) {

          // 地图 & 位置
          if (data.location && data.location.lat) {
            var lat  = data.location.lat;
            var lng  = data.location.lng;
            var area = data.location.area || '';

            var map = L.map('nw-map', {
              zoomControl: false,
              scrollWheelZoom: false,   // 禁止滚轮缩放（防止页面滚动被打断）
              dragging: true,
              touchZoom: true,
            }).setView([lat, lng], 13);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
              attribution: '© <a href="https://openstreetmap.org">OSM</a> © <a href="https://carto.com">CARTO</a>',
              maxZoom: 19,
            }).addTo(map);

            L.marker([lat, lng]).addTo(map).bindPopup('<b>' + escHtml(area) + '</b>').openPopup();

            document.getElementById('nw-loc').innerHTML =
              '📍 <span>' + escHtml(area) + '</span>';
            document.getElementById('nw-time').textContent =
              UPDATED + timeAgo(data.location.updated_at);
          }

          // 自定义状态
          if (data.status && data.status.text) {
            document.getElementById('nw-status').innerHTML =
              (data.status.emoji || '💭') + ' <span>' + escHtml(data.status.text) + '</span>';
          } else {
            document.getElementById('nw-status').style.display = 'none';
          }
        })
        .catch(function () {
          // 加载失败静默隐藏，不影响博客主体
          var w = document.getElementById('now-widget');
          if (w) w.style.display = 'none';
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
