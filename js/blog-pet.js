(function () {
  'use strict';

  var CHARACTERS = [
    { id: 'red', type: 'placeholder', color: '#e74c3c', quotes: ['嗨！', '继续加油鸭', '这篇文章写得不错~', '游戏做到哪一步了？'] },
    {
      id: 'jiaqiu',
      type: 'sprite',
      idleSrc: '/img/pets/jiaqiu-idle.gif',
      clickSrc: '/img/pets/jiaqiu-click.gif',
      width: 110,
      height: 100,
      canMove: false,
      quotes: ['君主御驾亲征。', '勿以知之为不知。', '勿以不知为知之，是知也。']
    }
  ];

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildStyle() {
    var style = document.createElement('style');
    style.textContent = [
      '#blog-pet-root{position:fixed;left:0;bottom:24px;z-index:1000;pointer-events:none;}',
      '@media (max-width:600px){#blog-pet-root{bottom:70px;transform:scale(.8);}}',
      '.bp-sprite{position:relative;width:36px;height:36px;pointer-events:auto;cursor:pointer;}',
      '.bp-sprite-img{width:100%;height:100%;}',
      '.bp-img{width:100%;height:100%;object-fit:contain;display:block;}',
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
      '.bp-bubble{position:absolute;left:50%;transform:translateX(-50%);background:var(--card-bg-color,#fff);color:var(--font-color,#333);border:1px solid var(--card-border,rgba(0,0,0,.1));border-radius:8px;padding:5px 10px;font-size:12px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.12);opacity:0;pointer-events:none;transition:opacity .2s;}',
      '.bp-bubble::after{content:"";position:absolute;top:100%;left:50%;margin-left:-4px;border:4px solid transparent;border-top-color:var(--card-bg-color,#fff);}',
      '.bp-bubble.show{opacity:1;}'
    ].join('');
    document.head.appendChild(style);
  }

  function init() {
    if (document.getElementById('blog-pet-root')) return;

    var character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    var isSprite = character.type === 'sprite';
    var canMove = character.canMove !== false;
    var boxW = character.width || 36;
    var boxH = character.height || 36;

    buildStyle();

    var root = document.createElement('div');
    root.id = 'blog-pet-root';

    var sprite = document.createElement('div');
    sprite.className = 'bp-sprite' + (isSprite ? ' bp-sprite-img' : '') + (reduceMotion ? '' : (canMove ? ' bp-walk' : ' bp-idle'));
    if (isSprite) {
      sprite.style.width = boxW + 'px';
      sprite.style.height = boxH + 'px';
    }

    var img = null;
    if (isSprite) {
      img = document.createElement('img');
      img.className = 'bp-img';
      img.src = character.idleSrc;
      img.alt = '';
      sprite.appendChild(img);
    } else {
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
    }

    var bubble = document.createElement('div');
    bubble.className = 'bp-bubble';
    bubble.style.bottom = (boxH + 8) + 'px';
    sprite.appendChild(bubble);

    root.appendChild(sprite);
    document.body.appendChild(root);

    var bubbleTimer = null;
    var revertTimer = null;
    sprite.addEventListener('click', function () {
      var line = character.quotes[Math.floor(Math.random() * character.quotes.length)];
      bubble.textContent = line;
      bubble.classList.add('show');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(function () {
        bubble.classList.remove('show');
      }, 2600);

      if (isSprite && character.clickSrc) {
        img.src = character.clickSrc + (character.clickSrc.indexOf('?') > -1 ? '&' : '?') + 't=' + Date.now();
        clearTimeout(revertTimer);
        revertTimer = setTimeout(function () {
          img.src = character.idleSrc;
        }, 2600);
      } else if (!reduceMotion) {
        sprite.classList.remove('bp-jump');
        void sprite.offsetWidth;
        sprite.classList.add('bp-jump');
      }
    });

    if (reduceMotion || !canMove) {
      root.style.left = (Math.random() * Math.max(window.innerWidth - boxW - 10, 0)) + 'px';
      return;
    }

    var x = Math.random() * Math.max(window.innerWidth - boxW, 0);
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
        var max = Math.max(window.innerWidth - boxW, 0);
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
      var max = Math.max(window.innerWidth - boxW, 0);
      if (x > max) x = max;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
