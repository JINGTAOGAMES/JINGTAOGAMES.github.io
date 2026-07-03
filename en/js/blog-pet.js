(function () {
  'use strict';

  var CHARACTERS = [
    { id: 'red', type: 'placeholder', color: '#e74c3c', quotes: ['Hi there!', 'Keep going!', 'Nice post!', "How's the game coming along?"] },
    {
      id: 'jiaqiu',
      type: 'sprite',
      idleSrc: '/en/img/pets/jiaqiu-idle.webm',
      clickSrc: '/en/img/pets/jiaqiu-click.webm',
      width: 110,
      height: 100,
      canMove: false,
      quotes: ['The Lord of Hongyuan marches to war.', 'I will not pretend ignorance before understanding.', 'Pretense of understanding may not have been a wise decision.']
    }
  ];

  var MIN_SCALE = 0.5, MAX_SCALE = 2.5, SCALE_STEP = 0.1;
  var SCALE_KEY = 'blogPetScale';
  var POS_KEY = 'blogPetPos';
  var DRAG_THRESHOLD = 5;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildStyle() {
    var style = document.createElement('style');
    style.textContent = [
      '#blog-pet-root{position:fixed;z-index:1000;}',
      '.bp-sprite{position:relative;pointer-events:auto;cursor:grab;}',
      '.bp-visual{position:absolute;left:0;top:0;width:100%;height:100%;transform-origin:50% 100%;',
        'transform:scale(calc(var(--bp-face,1) * var(--bp-scale,1)), var(--bp-scale,1));}',
      '.bp-media{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;}',
      '.bp-body{position:absolute;left:6px;top:8px;width:24px;height:20px;border-radius:6px 6px 3px 3px;box-shadow:0 3px 0 rgba(0,0,0,.15) inset;}',
      '.bp-eye{position:absolute;top:14px;width:4px;height:4px;background:#222;border-radius:50%;}',
      '.bp-eye.l{left:11px;} .bp-eye.r{left:21px;}',
      '.bp-leg{position:absolute;bottom:0;width:6px;height:8px;background:rgba(0,0,0,.25);border-radius:2px;}',
      '.bp-leg.l{left:9px;} .bp-leg.r{left:21px;}',
      '.bp-visual.bp-walk .bp-leg.l{animation:bp-leg-l .5s steps(2) infinite;}',
      '.bp-visual.bp-walk .bp-leg.r{animation:bp-leg-r .5s steps(2) infinite;}',
      '@keyframes bp-leg-l{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}',
      '@keyframes bp-leg-r{0%,100%{transform:translateY(-3px)}50%{transform:translateY(0)}}',
      '.bp-visual.bp-idle{animation:bp-bob 1.6s ease-in-out infinite;}',
      '@keyframes bp-bob{',
        '0%,100%{transform:scale(calc(var(--bp-face,1) * var(--bp-scale,1)), var(--bp-scale,1)) translateY(0);}',
        '50%{transform:scale(calc(var(--bp-face,1) * var(--bp-scale,1)), var(--bp-scale,1)) translateY(-2px);}',
      '}',
      '.bp-visual.bp-jump{animation:bp-jump .5s ease-out;}',
      '@keyframes bp-jump{',
        '0%{transform:scale(calc(var(--bp-face,1) * var(--bp-scale,1)), var(--bp-scale,1)) translateY(0);}',
        '40%{transform:scale(calc(var(--bp-face,1) * var(--bp-scale,1) * 1.05), calc(var(--bp-scale,1) * .95)) translateY(-16px);}',
        '100%{transform:scale(calc(var(--bp-face,1) * var(--bp-scale,1)), var(--bp-scale,1)) translateY(0);}',
      '}',
      '.bp-bubble{position:absolute;left:50%;transform:translateX(-50%);background:var(--card-bg-color,#fff);color:var(--font-color,#333);border:1px solid var(--card-border,rgba(0,0,0,.1));border-radius:8px;padding:5px 10px;font-size:12px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.12);opacity:0;pointer-events:none;transition:opacity .2s;}',
      '.bp-bubble::after{content:"";position:absolute;top:100%;left:50%;margin-left:-4px;border:4px solid transparent;border-top-color:var(--card-bg-color,#fff);}',
      '.bp-bubble.show{opacity:1;}'
    ].join('');
    document.head.appendChild(style);
  }

  function loadScale() {
    var raw = null;
    try { raw = localStorage.getItem(SCALE_KEY); } catch (e) {}
    if (raw === null) return (window.innerWidth < 600) ? 0.8 : 1;
    var s = parseFloat(raw);
    if (isNaN(s)) return 1;
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
  }

  function saveScale(s) {
    try { localStorage.setItem(SCALE_KEY, String(s)); } catch (e) {}
  }

  function loadPos() {
    try {
      var raw = localStorage.getItem(POS_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      if (typeof p.left === 'number' && typeof p.top === 'number') return p;
    } catch (e) {}
    return null;
  }

  function savePos(left, top) {
    try { localStorage.setItem(POS_KEY, JSON.stringify({ left: left, top: top })); } catch (e) {}
  }

  function init() {
    if (document.getElementById('blog-pet-root')) return;

    var character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    var isSprite = character.type === 'sprite';
    var canMove = character.canMove !== false;
    var boxW = character.width || 36;
    var boxH = character.height || 36;
    var scale = loadScale();

    buildStyle();

    var root = document.createElement('div');
    root.id = 'blog-pet-root';

    var sprite = document.createElement('div');
    sprite.className = 'bp-sprite';
    sprite.style.width = boxW + 'px';
    sprite.style.height = boxH + 'px';

    var visual = document.createElement('div');
    visual.className = 'bp-visual' + (reduceMotion ? '' : (canMove ? ' bp-walk' : ' bp-idle'));
    visual.style.setProperty('--bp-scale', scale);

    var media = null;
    if (isSprite) {
      media = document.createElement('video');
      media.className = 'bp-media';
      media.src = character.idleSrc;
      media.autoplay = true;
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
      media.setAttribute('playsinline', '');
      media.setAttribute('muted', '');
      visual.appendChild(media);
    } else {
      var body = document.createElement('div');
      body.className = 'bp-body';
      body.style.background = character.color;
      visual.appendChild(body);

      ['l', 'r'].forEach(function (side) {
        var eye = document.createElement('div');
        eye.className = 'bp-eye ' + side;
        visual.appendChild(eye);
        var leg = document.createElement('div');
        leg.className = 'bp-leg ' + side;
        visual.appendChild(leg);
      });
    }
    sprite.appendChild(visual);

    var bubble = document.createElement('div');
    bubble.className = 'bp-bubble';
    bubble.style.bottom = (boxH * scale + 8) + 'px';
    sprite.appendChild(bubble);

    root.appendChild(sprite);

    if (media) {
      media.play().catch(function () {});
    }

    // ---------- position: drop point / remembered position ----------
    function effectiveW() { return boxW * scale; }
    function effectiveH() { return boxH * scale; }

    var savedPos = loadPos();
    var left, top;
    if (savedPos) {
      left = savedPos.left;
      top = savedPos.top;
    } else {
      var bottomGap = window.innerWidth < 600 ? 70 : 24;
      left = Math.random() * Math.max(window.innerWidth - effectiveW(), 0);
      top = window.innerHeight - bottomGap - effectiveH();
    }

    function clampPosition() {
      var maxLeft = Math.max(window.innerWidth - effectiveW(), 0);
      var maxTop = Math.max(window.innerHeight - effectiveH(), 0);
      left = Math.min(Math.max(left, 0), maxLeft);
      top = Math.min(Math.max(top, 0), maxTop);
    }

    function applyPosition() {
      root.style.left = left + 'px';
      root.style.top = top + 'px';
    }

    clampPosition();
    applyPosition();
    document.body.appendChild(root);

    // ---------- zoom: mouse wheel ----------
    sprite.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP;
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round((scale + delta) * 100) / 100));
      visual.style.setProperty('--bp-scale', scale);
      bubble.style.bottom = (boxH * scale + 8) + 'px';
      clampPosition();
      applyPosition();
      saveScale(scale);
      savePos(left, top);
    }, { passive: false });

    // ---------- drag: mouse + touch ----------
    var dragging = false;
    var moved = false;
    var startClientX, startClientY, startLeft, startTop;

    function dragStart(clientX, clientY) {
      dragging = true;
      moved = false;
      startClientX = clientX;
      startClientY = clientY;
      startLeft = left;
      startTop = top;
      running = false;
      sprite.style.cursor = 'grabbing';
    }

    function dragMove(clientX, clientY) {
      if (!dragging) return;
      var dx = clientX - startClientX;
      var dy = clientY - startClientY;
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) moved = true;
      left = startLeft + dx;
      top = startTop + dy;
      clampPosition();
      applyPosition();
    }

    function dragEnd() {
      if (!dragging) return;
      dragging = false;
      sprite.style.cursor = 'grab';
      savePos(left, top);
      if (canMove && !reduceMotion) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    }

    sprite.addEventListener('mousedown', function (e) {
      e.preventDefault();
      dragStart(e.clientX, e.clientY);
      function onMove(ev) { dragMove(ev.clientX, ev.clientY); }
      function onUp() {
        dragEnd();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    sprite.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      dragStart(t.clientX, t.clientY);
      function onMove(ev) {
        var t2 = ev.touches[0];
        dragMove(t2.clientX, t2.clientY);
        ev.preventDefault();
      }
      function onEnd() {
        dragEnd();
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
      }
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    }, { passive: true });

    // ---------- click interaction: hop / play special animation + speech bubble ----------
    var bubbleTimer = null;
    var revertTimer = null;
    sprite.addEventListener('click', function () {
      if (moved) { moved = false; return; }

      var line = character.quotes[Math.floor(Math.random() * character.quotes.length)];
      bubble.textContent = line;
      bubble.classList.add('show');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(function () {
        bubble.classList.remove('show');
      }, 2600);

      if (isSprite && character.clickSrc) {
        media.loop = false;
        media.src = character.clickSrc + (character.clickSrc.indexOf('?') > -1 ? '&' : '?') + 't=' + Date.now();
        media.load();
        media.play().catch(function () {});
        media.onended = function () {
          media.loop = true;
          media.src = character.idleSrc;
          media.load();
          media.play().catch(function () {});
          media.onended = null;
        };
      } else if (!reduceMotion) {
        visual.classList.remove('bp-jump');
        void visual.offsetWidth;
        visual.classList.add('bp-jump');
      }
    });

    // ---------- walking ----------
    var running = false;
    var rafId;
    var direction = Math.random() < 0.5 ? -1 : 1;
    var speed = 0.6;
    var pauseUntil = 0;

    function setFacing(faceLeft) {
      visual.style.setProperty('--bp-face', faceLeft ? -1 : 1);
    }
    setFacing(canMove && direction < 0);

    function maybeChangeDirection(now) {
      if (now > pauseUntil && Math.random() < 0.004) {
        direction *= -1;
        setFacing(direction < 0);
        if (Math.random() < 0.3) {
          pauseUntil = now + 1500 + Math.random() * 2000;
          visual.classList.remove('bp-walk');
          visual.classList.add('bp-idle');
        }
      }
      if (now > pauseUntil) {
        visual.classList.remove('bp-idle');
        visual.classList.add('bp-walk');
      }
    }

    function tick(now) {
      if (!running) return;
      maybeChangeDirection(now);
      if (now > pauseUntil) {
        left += direction * speed;
        var maxLeft = Math.max(window.innerWidth - effectiveW(), 0);
        if (left < 0) { left = 0; direction = 1; setFacing(false); }
        if (left > maxLeft) { left = maxLeft; direction = -1; setFacing(true); }
        applyPosition();
      }
      rafId = requestAnimationFrame(tick);
    }

    if (!reduceMotion && canMove) {
      running = true;
      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener('visibilitychange', function () {
      if (reduceMotion || !canMove) return;
      running = !document.hidden && !dragging;
      if (running) rafId = requestAnimationFrame(tick);
      else cancelAnimationFrame(rafId);
    });

    window.addEventListener('resize', function () {
      clampPosition();
      applyPosition();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
