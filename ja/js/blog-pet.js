(function () {
  'use strict';

  // ============================================================
  // 浮遊ブログペット・仮素材版（oneko.js の発想をベースに再構築）
  // 本物の gif / webm / スプライトシートに差し替える場合は：
  //   1. CHARACTERS の color を spriteUrl に置き換える
  //   2. bp-body の background を <img>/<video> に置き換える
  // だけでよく、ロジック（ランダム選出・徘徊・クリック反応）はそのまま使える。
  // ============================================================

  var STORAGE_HIDE_KEY = 'blogPetHidden';
  if (window.localStorage && localStorage.getItem(STORAGE_HIDE_KEY) === '1') return;

  var CHARACTERS = [
    { id: 'red', color: '#e74c3c', quotes: ['やあ！', 'がんばれ！', 'いい記事だね', 'ゲームの進み具合はどう？'] },
    { id: 'blue', color: '#3498db', quotes: ['通りすがりです~', 'ちょっと休憩は？', 'ここでうろうろ中', '見つかっちゃった！'] },
    { id: 'green', color: '#27ae60', quotes: ['今日も元気いっぱい！', '新しい記事が出たよ', 'ねえ、こっち見て', '読み続けてね~'] },
    { id: 'yellow', color: '#f1c40f', quotes: ['✨登場✨', '踏まないでね', '私はただの仮キャラです', 'ゲームは面白い選択の連続だ'] },
    { id: 'purple', color: '#9b59b6', quotes: ['しー…潜んでます', 'なんで押すの', '暇だなあ', 'お話ししよう？'] }
  ];

  var CLOSE_TITLE = '隠す';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (document.getElementById('blog-pet-root')) return;

    var character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

    var style = document.createElement('style');
    style.textContent = [
      '#blog-pet-root{position:fixed;left:0;bottom:24px;z-index:1000;pointer-events:none;}',
      '@media (max-width:600px){#blog-pet-root{bottom:70px;transform:scale(.8);}}',
      '.bp-sprite{position:relative;width:36px;height:36px;pointer-events:auto;cursor:pointer;}',
      '.bp-body{position:absolute;left:6px;top:8px;width:24px;height:20px;border-radius:6px 6px 3px 3px;box-shadow:0 3px 0 rgba(0,0,0,.15) inset;}',
      '.bp-eye{position:absolute;top:14px;width:4px;height:4px;background:#222;border-radius:50%;}',
      '.bp-eye.l{left:11px;} .bp-eye.r{left:21px;}',
      '.bp-leg{position:absolute;bottom:0;width:6px;height:8px;background:rgba(0,0,0,.25);border-radius:2px;}',
      '.bp-leg.l{left:9px;} .bp-leg.r{left:21px;}',
      '.bp-walk .bp-leg.l{animation:bp-leg-l .5s steps(2) infinite;}',
      '.bp-walk .bp-leg.r{animation:bp-leg-r .5s steps(2) infinite;}',
      '@keyframes bp-leg-l{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}',
      '@keyframes bp-leg-r{0%,100%{transform:translateY(-3px)}50%{transform:translateY(0)}}',
      '.bp-idle{animation:bp-bob 1.6s ease-in-out infinite;}',
      '@keyframes bp-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}',
      '.bp-jump{animation:bp-jump .5s ease-out;}',
      '@keyframes bp-jump{0%{transform:translateY(0) scale(1)}40%{transform:translateY(-16px) scale(1.05,.95)}100%{transform:translateY(0) scale(1)}}',
      '.bp-face-left{transform:scaleX(-1);}',
      '.bp-bubble{position:absolute;bottom:44px;left:50%;transform:translateX(-50%);background:var(--card-bg-color,#fff);color:var(--font-color,#333);border:1px solid var(--card-border,rgba(0,0,0,.1));border-radius:8px;padding:5px 10px;font-size:12px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.12);opacity:0;pointer-events:none;transition:opacity .2s;}',
      '.bp-bubble::after{content:"";position:absolute;top:100%;left:50%;margin-left:-4px;border:4px solid transparent;border-top-color:var(--card-bg-color,#fff);}',
      '.bp-bubble.show{opacity:1;}',
      '.bp-close{position:absolute;top:-8px;right:-8px;width:16px;height:16px;line-height:16px;text-align:center;font-size:11px;border-radius:50%;background:rgba(0,0,0,.4);color:#fff;cursor:pointer;opacity:0;transition:opacity .2s;pointer-events:auto;}',
      '.bp-sprite:hover .bp-close{opacity:1;}'
    ].join('');
    document.head.appendChild(style);

    var root = document.createElement('div');
    root.id = 'blog-pet-root';

    var sprite = document.createElement('div');
    sprite.className = 'bp-sprite' + (reduceMotion ? '' : ' bp-walk');

    var body = document.createElement('div');
    body.className = 'bp-body';
    body.style.background = character.color;
    sprite.appendChild(body);

    ['l', 'r'].forEach(function (side) {
      var eye = document.createElement('div');
      eye.className = 'bp-eye ' + side;
      sprite.appendChild(eye);
      var leg = document.createElement('div');
      leg.className = 'bp-leg ' + side;
      sprite.appendChild(leg);
    });

    var bubble = document.createElement('div');
    bubble.className = 'bp-bubble';
    sprite.appendChild(bubble);

    var close = document.createElement('div');
    close.className = 'bp-close';
    close.textContent = '×';
    close.title = CLOSE_TITLE;
    close.addEventListener('click', function (e) {
      e.stopPropagation();
      root.remove();
      try { localStorage.setItem(STORAGE_HIDE_KEY, '1'); } catch (err) {}
    });
    sprite.appendChild(close);

    root.appendChild(sprite);
    document.body.appendChild(root);

    var bubbleTimer = null;
    sprite.addEventListener('click', function () {
      sprite.classList.remove('bp-jump');
      void sprite.offsetWidth;
      if (!reduceMotion) sprite.classList.add('bp-jump');

      var line = character.quotes[Math.floor(Math.random() * character.quotes.length)];
      bubble.textContent = line;
      bubble.classList.add('show');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(function () {
        bubble.classList.remove('show');
      }, 2200);
    });

    if (reduceMotion) {
      sprite.classList.add('bp-idle');
      root.style.left = (Math.random() * Math.max(window.innerWidth - 60, 0)) + 'px';
      return;
    }

    var x = Math.random() * Math.max(window.innerWidth - 60, 0);
    var direction = Math.random() < 0.5 ? -1 : 1;
    var speed = 0.6;
    var pauseUntil = 0;
    var running = true;
    var rafId;

    if (direction < 0) sprite.classList.add('bp-face-left');

    function maybeChangeDirection(now) {
      if (now > pauseUntil && Math.random() < 0.004) {
        direction *= -1;
        sprite.classList.toggle('bp-face-left', direction < 0);
        if (Math.random() < 0.3) {
          pauseUntil = now + 1500 + Math.random() * 2000;
          sprite.classList.remove('bp-walk');
          sprite.classList.add('bp-idle');
        }
      }
      if (now > pauseUntil) {
        sprite.classList.remove('bp-idle');
        sprite.classList.add('bp-walk');
      }
    }

    function tick(now) {
      if (!running) return;
      maybeChangeDirection(now);
      if (now > pauseUntil) {
        x += direction * speed;
        var max = Math.max(window.innerWidth - 60, 0);
        if (x < 0) { x = 0; direction = 1; sprite.classList.remove('bp-face-left'); }
        if (x > max) { x = max; direction = -1; sprite.classList.add('bp-face-left'); }
        root.style.left = x + 'px';
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) rafId = requestAnimationFrame(tick);
      else cancelAnimationFrame(rafId);
    });

    window.addEventListener('resize', function () {
      var max = Math.max(window.innerWidth - 60, 0);
      if (x > max) x = max;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
