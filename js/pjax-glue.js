// pjax 适配脚本：三种语言共用这一份（/js/pjax-glue.js，所有主题配置的 inject.bottom 都引用）。
// Butterfly 开了 pjax 后，站内链接只替换 #body-wrap，不重新加载整页，下面几类情况要特殊处理：
//  1. 跨语言链接（/ ↔ /en/ ↔ /ja/）：每种语言的 GLOBAL_CONFIG、搜索索引、界面文字都不同，
//     必须整页跳转。
//  2. 独立 HTML 页面（不走主题布局的 now 页、zh 的 about 页）：没有 #body-wrap，pjax 换不了。
//  3. 语言菜单（图标带 .multiple-language-switch）在 #body-wrap 里，pjax 替换后 switch-language.js
//     绑的点击事件就没了，所以这里在捕获阶段统一接管，直接调它的 handleLanguageSwitch。
//  4. 文章里的 APlayer 播放器所在 DOM 被替换掉后音频还会继续响，离开页面前先销毁。
//     （APlayer 本身由主题配置 inject 注入；Butterfly 5.7 起去掉了内置的 aplayerInject。）
(function () {
  'use strict';

  function langOf(pathname) {
    var m = /^\/(en|ja)(\/|$)/.exec(pathname);
    return m ? m[1] : 'zh';
  }
  var FULL_RELOAD_RE = /^\/((en|ja)\/)?(now|about)(\/|\/index\.html)?$/;

  // 捕获阶段拦截，在 pjax 绑在链接上的监听器之前执行；stopPropagation 后 pjax 收不到这次点击，
  // 浏览器按默认行为整页跳转。
  window.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    // 语言菜单：直接交给 switch-language.js 的 handleLanguageSwitch（先 HEAD 检查目标页是否存在）。
    // 不能依赖它绑在链接上的监听器——pjax 替换菜单后那些监听器就没了，重新绑又会排在 pjax 的监听器后面。
    var icon = a.firstElementChild;
    if (icon && icon.classList.contains('multiple-language-switch')) {
      if (typeof window.handleLanguageSwitch === 'function') {
        e.preventDefault();
        e.stopPropagation();
        window.handleLanguageSwitch(a.href.split('/').pop());
      } else {
        e.stopPropagation(); // 脚本没加载到就退回普通整页跳转
      }
      return;
    }
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (langOf(url.pathname) !== langOf(location.pathname) || FULL_RELOAD_RE.test(url.pathname)) {
      e.stopPropagation();
    }
  }, true);

  document.addEventListener('pjax:send', function () {
    // 文章里的播放器把自己登记在 window.aplayers；APlayer 的 audio 不在 DOM 里，必须 destroy 才会停
    if (window.aplayers) {
      window.aplayers.forEach(function (p) { try { p.destroy(); } catch (err) {} });
      window.aplayers = [];
    }
    var wrap = document.getElementById('body-wrap');
    if (!wrap) return;
    Array.prototype.forEach.call(wrap.querySelectorAll('audio, video'), function (m) {
      try { m.pause(); } catch (err) {}
    });
  });
})();
