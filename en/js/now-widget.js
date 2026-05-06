(function () {
  var NOW_URL   = '/en/now/';
  var API_BASE  = 'https://now-api.719783307e.workers.dev';
  var LINK_TEXT = 'View Now Page →';
  var LOADING   = 'Loading…';
  var UPDATED   = 'Updated ';

  function timeAgo(isoStr) {
    if (!isoStr) return '';
    var diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
    if (diff < 60)    return diff + 's ago';
    if (diff < 3600)  return Math.floor(diff/60) + 'm ago';
    if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
    return Math.floor(diff/86400) + 'd ago';
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

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
    var contentInner = document.getElementById('content-inner');
    if (!contentInner) return;
    if (!document.getElementById('recent-posts')) return; // 只在首页运行

    // ── 注入样式 ──
    var style = document.createElement('style');
    style.textContent =
      '#now-widget{' +
        'box-sizing:border-box;' +
        'margin-top:20px;margin-bottom:20px;' +
        'border-radius:12px;' +
        'overflow:hidden;' +
        'background:var(--card-bg-color,#fff);' +
        'border:1px solid var(--card-border,rgba(0,0,0,.08));' +
        'box-shadow:var(--card-box-shadow,0 2px 8px rgba(0,0,0,.06));' +
        'display:flex;flex-direction:row;' +
      '}' +
      '#nw-map{width:45%;min-width:240px;height:220px;flex-shrink:0;}' +
      '.nw-info{' +
        'flex:1;padding:22px 26px;display:flex;' +
        'flex-direction:column;justify-content:center;gap:14px;min-width:0;' +
      '}' +
      '.nw-row{display:flex;align-items:center;gap:10px;font-size:1rem;color:var(--font-color,#333);}' +
      '.nw-updated{font-size:.75rem;color:var(--font-second-color,#aaa);}' +
      '.nw-link{' +
        'display:inline-flex;align-items:center;gap:6px;' +
        'color:var(--link-color,#6366f1);text-decoration:none;' +
        'font-size:.85rem;font-weight:500;margin-top:4px;' +
      '}' +
      '.nw-link:hover{text-decoration:underline;}' +
      '@media(max-width:680px){' +
        '#now-widget{flex-direction:column;}' +
        '#nw-map{width:100%;min-width:unset;height:200px;}' +
        '.nw-info{padding:16px 18px;}' +
      '}';
    document.head.appendChild(style);

    // ── 创建组件 HTML ──
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

    // ── 插入到 #content-inner 之前（作为兄弟节点，完全绕开 grid）──
    // 同时复制 #content-inner 的宽度约束，保持视觉对齐
    contentInner.parentNode.insertBefore(widget, contentInner);
    var cs = window.getComputedStyle(contentInner);
    widget.style.maxWidth  = cs.maxWidth  !== 'none' ? cs.maxWidth  : '';
    widget.style.width     = '100%';
    widget.style.marginLeft   = cs.marginLeft;
    widget.style.marginRight  = cs.marginRight;
    widget.style.paddingLeft  = cs.paddingLeft;
    widget.style.paddingRight = cs.paddingRight;

    // ── 加载 Leaflet 并拉取数据 ──
    loadLeaflet(function () {
      fetch(API_BASE + '/api/status')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.location && data.location.lat) {
            var lat  = data.location.lat;
            var lng  = data.location.lng;
            var area = data.location.area || '';

            var map = L.map('nw-map', {
              zoomControl: false,
              scrollWheelZoom: false,
              dragging: true,
              touchZoom: true,
            }).setView([lat, lng], 13);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
              attribution: '© <a href="https://openstreetmap.org">OSM</a> © <a href="https://carto.com">CARTO</a>',
              maxZoom: 19,
            }).addTo(map);

            L.marker([lat, lng]).addTo(map)
              .bindPopup('<b>' + escHtml(area) + '</b>').openPopup();

            document.getElementById('nw-loc').innerHTML =
              '📍 <span>' + escHtml(area) + '</span>';
            document.getElementById('nw-time').textContent =
              UPDATED + timeAgo(data.location.updated_at);
          }

          if (data.status && data.status.text) {
            document.getElementById('nw-status').innerHTML =
              (data.status.emoji || '💭') +
              ' <span>' + escHtml(data.status.text) + '</span>';
          } else {
            document.getElementById('nw-status').style.display = 'none';
          }
        })
        .catch(function () {
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
