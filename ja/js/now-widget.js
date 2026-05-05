(function () {
  var NOW_URL   = '/ja/now/';
  var API_BASE  = 'https://now-api.719783307e.workers.dev';
  var LINK_TEXT = 'Now ページを見る →';
  var LOADING   = '読み込み中…';
  var UPDATED   = '更新：';

  function timeAgo(isoStr) {
    if (!isoStr) return '';
    var diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
    if (diff < 60)    return diff + '秒前';
    if (diff < 3600)  return Math.floor(diff/60) + '分前';
    if (diff < 86400) return Math.floor(diff/3600) + '時間前';
    return Math.floor(diff/86400) + '日前';
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
        'margin-bottom:20px;' +
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
    