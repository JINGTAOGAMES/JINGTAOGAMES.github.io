(function () {
  'use strict';

  var CHARACTERS = [
    {
      id: 'jiaqiu',
      type: 'sprite',
      idleSrc: '/ja/img/pets/jiaqiu-idle.webm',
      clickSrc: '/ja/img/pets/jiaqiu-click.webm',
      width: 110,
      height: 100,
      canMove: false,
      quotes: ['君主自ら出ようじゃないか。', '知っていることに知らぬ振りは出来ないからな。', '知らぬことを知っていると言ってはならなかったか。']
    },
    {
      id: 'exusiai',
      type: 'multistate',
      width: 75,
      height: 75,
      canMove: true,
      media: {
        move: '/ja/img/pets/exusiaiMove-x1.webm',
        interact: '/ja/img/pets/exusiaiInteract-x1.webm',
        sleep: '/ja/img/pets/exusiaiSleep-x1.webm',
        relax: '/ja/img/pets/exusiaiRelax-x1.webm',
        special: '/ja/img/pets/exusiaiSpecial-x1.webm'
      },
      quotes: [
        '主よ、リーダーに長く幸せな夢を見せ給え。願わくはその夢が……いつの日か実現せんことを。',
        '念のためもっかい聞くけど、美しき人の世と地獄のパノラマビューはどっちにしたいんだっけ？',
        'ヴェルス・ディオ・ヴォーレント！',
        'チャーシュー・アップルパイ！',
        '一日一リンゴ、一週間七リンゴ！'
      ]
    }
  ];

  var MIN_SCALE = 0.5, MAX_SCALE = 4, SCALE_STEP = 0.1;
  var SCALE_KEY = 'blogPetScale';
  var POS_KEY = 'blogPetPos';
  var CHAR_KEY = 'blogPetCharId';
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
      '.bp-media.bp-media-click{transform:translate(-20%,-20%) scale(1.15);}',
      '.bp-quote{position:absolute;left:50%;transform:translate(calc(-50% - 16px),0);background:radial-gradient(ellipse at center, rgba(0,0,0,.82) 0%, rgba(0,0,0,.55) 65%, rgba(0,0,0,0) 100%);color:#fff;font-size:12px;font-weight:600;line-height:1.4;padding:8px 22px;border-radius:999px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s;}',
      '.bp-quote.show{opacity:1;}',
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
      '}'
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

  // performance APIでこのページ読み込みが「手動リロード」かどうかを判定する。
  // リロードならペットをランダムに選び直し、そうでない場合（リンクをクリックして
  // 別ページへ移動した場合）は同じ個体を維持する。選択結果は同一タブ内での
  // ページ遷移をまたいでsessionStorageで引き継ぎ、タブ／ブラウザを閉じると
  // sessionStorageは自動的にクリアされるので、次にアクセスした際は自然に選び直される。
  function isReloadNavigation() {
    try {
      if (performance && performance.getEntriesByType) {
        var navEntries = performance.getEntriesByType('navigation');
        if (navEntries && navEntries.length && navEntries[0].type) {
          return navEntries[0].type === 'reload';
        }
      }
      if (performance && performance.navigation) {
        return performance.navigation.type === 1;
      }
    } catch (e) {}
    return false;
  }

  function pickCharacter() {
    var savedId = null;
    if (isReloadNavigation()) {
      try { sessionStorage.removeItem(CHAR_KEY); } catch (e) {}
    } else {
      try { savedId = sessionStorage.getItem(CHAR_KEY); } catch (e) {}
    }
    var found = null;
    if (savedId) {
      for (var i = 0; i < CHARACTERS.length; i++) {
        if (CHARACTERS[i].id === savedId) { found = CHARACTERS[i]; break; }
      }
    }
    var chosen = found || CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    try { sessionStorage.setItem(CHAR_KEY, chosen.id); } catch (e) {}
    return chosen;
  }

  function init() {
    if (document.getElementById('blog-pet-root')) return;

    var character = pickCharacter();
    var isSprite = character.type === 'sprite';
    var isMultistate = character.type === 'multistate';
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
    if (isSprite || isMultistate) {
      media = document.createElement('video');
      media.className = 'bp-media';
      media.src = isMultistate ? character.media.relax : character.idleSrc;
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

    var quote = document.createElement('div');
    quote.className = 'bp-quote';
    quote.style.bottom = (boxH * scale + 8) + 'px';
    sprite.appendChild(quote);

    root.appendChild(sprite);

    if (media) {
      media.play().catch(function () {});
    }

    // ---------- 位置：ドロップ位置／記憶した位置 ----------
    // 拡大縮小の基準点はビジュアル層の「下辺中央」（transform-origin:50% 100%）。
    // 拡大した分は上方向にのみ伸び、横方向は中心から左右対称に広がる。
    // 足元の位置は変わらないため、境界計算は実際の描画範囲に合わせる必要がある。
    function minLeftBound() { return boxW * (scale - 1) / 2; }
    function maxLeftBound() { return window.innerWidth - boxW * (scale + 1) / 2; }
    function minTopBound() { return boxH * (scale - 1); }
    function maxTopBound() { return window.innerHeight - boxH; }

    var savedPos = loadPos();
    var left, top;
    if (savedPos) {
      left = savedPos.left;
      top = savedPos.top;
    } else {
      var bottomGap = window.innerWidth < 600 ? 70 : 24;
      var initMinLeft = minLeftBound();
      var initMaxLeft = Math.max(maxLeftBound(), initMinLeft);
      left = initMinLeft + Math.random() * (initMaxLeft - initMinLeft);
      top = window.innerHeight - bottomGap - boxH;
    }

    function clampPosition() {
      var minLeft = minLeftBound();
      var maxLeft = Math.max(maxLeftBound(), minLeft);
      var minTop = minTopBound();
      var maxTop = Math.max(maxTopBound(), minTop);
      left = Math.min(Math.max(left, minLeft), maxLeft);
      top = Math.min(Math.max(top, minTop), maxTop);
    }

    function applyPosition() {
      root.style.left = left + 'px';
      root.style.top = top + 'px';
    }

    clampPosition();
    applyPosition();
    document.body.appendChild(root);

    // ---------- 拡大縮小：マウスホイール ----------
    sprite.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP;
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round((scale + delta) * 100) / 100));
      visual.style.setProperty('--bp-scale', scale);
      quote.style.bottom = (boxH * scale + 8) + 'px';
      clampPosition();
      applyPosition();
      saveScale(scale);
      savePos(left, top);
    }, { passive: false });

    // ---------- 複数状態の生き物挙動（exusiaiなど：defaultX/move/interact/sleep/relax/special）----------
    var msState = 'relax';
    var msFacingLeft = false;
    var msTimer = null;
    var moveRafId = null;

    function msSetMedia(src, loop) {
      media.loop = !!loop;
      media.src = src;
      media.load();
      media.play().catch(function () {});
    }

    function msEnterRelax() {
      msState = 'relax';
      msSetMedia(character.media.relax, true);
      clearTimeout(msTimer);
      var delay = 2000 + Math.random() * 3000;
      msTimer = setTimeout(function () {
        if (Math.random() < 0.3) msEnterSleep();
        else msEnterMove();
      }, delay);
    }

    function msEnterMove() {
      msState = 'move';
      msSetMedia(character.media.move, true);

      var moveSpeed = 0.5;
      var minDurationMs = 1000; // 最低でも1秒は同じ方向へ歩き、頻繁な向き変えを防ぐ
      var maxDurationMs = 3500;
      var estFrameMs = 16.7;    // 約60fps時の1フレームあたりの時間（必要な余白の見積もりに使用）
      var minDist = moveSpeed * (minDurationMs / estFrameMs);

      var boundMinLeft = minLeftBound();
      var boundMaxLeft = Math.max(maxLeftBound(), boundMinLeft);
      var roomLeft = left - boundMinLeft;
      var roomRight = boundMaxLeft - left;
      var canLeft = roomLeft >= minDist;
      var canRight = roomRight >= minDist;

      var dir;
      if (canLeft && canRight) {
        dir = Math.random() < 0.5 ? -1 : 1;
      } else if (canRight) {
        dir = 1;
      } else if (canLeft) {
        dir = -1;
      } else {
        // どちら側にも1秒分の余白がない（画面が狭すぎる）場合は、広い方を選ぶ
        dir = roomRight >= roomLeft ? 1 : -1;
      }

      msFacingLeft = dir < 0;
      setFacing(msFacingLeft);

      var duration = minDurationMs + Math.random() * (maxDurationMs - minDurationMs);
      var startTime = null;

      function step(now) {
        if (msState !== 'move') return;
        if (startTime === null) startTime = now;
        left += dir * moveSpeed;
        var curMinLeft = minLeftBound();
        var curMaxLeft = Math.max(maxLeftBound(), curMinLeft);
        var hitWall = false;
        if (dir < 0 && left <= curMinLeft) { left = curMinLeft; hitWall = true; }
        if (dir > 0 && left >= curMaxLeft) { left = curMaxLeft; hitWall = true; }
        applyPosition();
        if (hitWall || now - startTime >= duration) {
          savePos(left, top);
          msEnterRelax();
        } else {
          moveRafId = requestAnimationFrame(step);
        }
      }
      moveRafId = requestAnimationFrame(step);
    }

    function msEnterSleep() {
      msState = 'sleep';
      // 直前に移動していた向きのまま維持する（ここでは --bp-face を変更しない）
      msSetMedia(character.media.sleep, true);
      clearTimeout(msTimer);
      var duration = 6000 + Math.random() * 8000;
      msTimer = setTimeout(function () { msEnterRelax(); }, duration);
    }

    function msResumeSleep() {
      msState = 'sleep';
      msSetMedia(character.media.sleep, true);
      clearTimeout(msTimer);
      var duration = 6000 + Math.random() * 8000;
      msTimer = setTimeout(function () { msEnterRelax(); }, duration);
    }

    function msPlayInteract(onDone) {
      msState = 'interact';
      clearTimeout(msTimer);
      if (moveRafId) cancelAnimationFrame(moveRafId);
      msSetMedia(character.media.interact, false);
      media.onended = function () {
        media.onended = null;
        onDone();
      };
    }

    function msPlaySpecial(onDone) {
      msState = 'special';
      clearTimeout(msTimer);
      if (moveRafId) cancelAnimationFrame(moveRafId);
      msSetMedia(character.media.special, false);
      media.onended = function () {
        media.onended = null;
        onDone();
      };
    }

    // ---------- ドラッグ：マウス＋タッチ ----------
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
      if (isMultistate) {
        clearTimeout(msTimer);
        if (moveRafId) cancelAnimationFrame(moveRafId);
      } else {
        running = false;
      }
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
      if (isMultistate) {
        if (msState !== 'interact' && msState !== 'special') {
          msEnterRelax();
        }
      } else if (canMove && !reduceMotion) {
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

    // ---------- 拡大縮小：二本指ピンチ（モバイル） ----------
    var pinching = false;
    var pinchStartDist = 0;
    var pinchStartScale = 1;
    var touchActive = false;

    function touchDistance(t1, t2) {
      var dx = t2.clientX - t1.clientX;
      var dy = t2.clientY - t1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function onTouchMove(ev) {
      if (pinching && ev.touches.length >= 2) {
        ev.preventDefault();
        var dist = touchDistance(ev.touches[0], ev.touches[1]);
        var ratio = dist / pinchStartDist;
        scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(pinchStartScale * ratio * 100) / 100));
        visual.style.setProperty('--bp-scale', scale);
        quote.style.bottom = (boxH * scale + 8) + 'px';
        clampPosition();
        applyPosition();
      } else if (dragging && ev.touches.length === 1) {
        var t = ev.touches[0];
        dragMove(t.clientX, t.clientY);
        ev.preventDefault();
      }
    }

    function onTouchEnd(ev) {
      if (ev.touches.length >= 2) {
        pinching = true;
        pinchStartDist = touchDistance(ev.touches[0], ev.touches[1]);
        pinchStartScale = scale;
        return;
      }
      if (pinching) {
        pinching = false;
        saveScale(scale);
        savePos(left, top);
        if (!isMultistate && canMove && !reduceMotion) {
          running = true;
          rafId = requestAnimationFrame(tick);
        }
      }
      if (ev.touches.length === 0) {
        dragEnd();
        touchActive = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        document.removeEventListener('touchcancel', onTouchEnd);
      }
    }

    sprite.addEventListener('touchstart', function (e) {
      if (e.touches.length >= 2) {
        dragging = false;
        pinching = true;
        pinchStartDist = touchDistance(e.touches[0], e.touches[1]);
        pinchStartScale = scale;
        running = false;
        e.preventDefault();
      } else if (e.touches.length === 1 && !pinching) {
        var t = e.touches[0];
        dragStart(t.clientX, t.clientY);
      }
      if (!touchActive) {
        touchActive = true;
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
        document.addEventListener('touchcancel', onTouchEnd);
      }
    }, { passive: false });

    // ---------- クリック操作：ジャンプ／専用アニメーション再生 + テキスト表示 ----------
    var revertTimer = null;
    var quoteTimer = null;
    sprite.addEventListener('click', function () {
      if (moved) { moved = false; return; }

      if (isMultistate) {
        if (msState === 'special') return; // 中断不可、クリックを無視
        var wasSleep = msState === 'sleep';
        function msResumeAfterClick() {
          if (wasSleep) msResumeSleep();
          else msEnterRelax();
        }
        if (character.quotes && character.quotes.length) {
          var msLine = character.quotes[Math.floor(Math.random() * character.quotes.length)];
          quote.textContent = msLine;
          quote.classList.add('show');
          clearTimeout(quoteTimer);
          quoteTimer = setTimeout(function () {
            quote.classList.remove('show');
          }, 2600);
        }
        // プレイヤーはいつでもinteractを発動できる。一定確率でspecialに変わる
        if (Math.random() < 0.3) {
          msPlaySpecial(msResumeAfterClick);
        } else {
          msPlayInteract(msResumeAfterClick);
        }
        return;
      }

      var line = character.quotes[Math.floor(Math.random() * character.quotes.length)];
      quote.textContent = line;
      quote.classList.add('show');
      clearTimeout(quoteTimer);
      quoteTimer = setTimeout(function () {
        quote.classList.remove('show');
      }, 2600);

      if (isSprite && character.clickSrc) {
        media.loop = false;
        media.classList.add('bp-media-click');
        media.src = character.clickSrc + (character.clickSrc.indexOf('?') > -1 ? '&' : '?') + 't=' + Date.now();
        media.load();
        media.play().catch(function () {});
        media.onended = function () {
          media.loop = true;
          media.classList.remove('bp-media-click');
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

    // ---------- 徘徊ロジック ----------
    var running = false;
    var rafId;
    var direction = Math.random() < 0.5 ? -1 : 1;
    var speed = 0.6;
    var pauseUntil = 0;

    function setFacing(faceLeft) {
      visual.style.setProperty('--bp-face', faceLeft ? -1 : 1);
    }
    if (!isMultistate) setFacing(canMove && direction < 0);

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
        var minLeft = minLeftBound();
        var maxLeft = Math.max(maxLeftBound(), minLeft);
        if (left < minLeft) { left = minLeft; direction = 1; setFacing(false); }
        if (left > maxLeft) { left = maxLeft; direction = -1; setFacing(true); }
        applyPosition();
      }
      rafId = requestAnimationFrame(tick);
    }

    if (isMultistate) {
      if (!reduceMotion) msEnterRelax();
    } else if (!reduceMotion && canMove) {
      running = true;
      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener('visibilitychange', function () {
      if (reduceMotion) return;
      if (isMultistate) {
        if (document.hidden) {
          clearTimeout(msTimer);
          if (moveRafId) cancelAnimationFrame(moveRafId);
        } else if (!dragging && msState !== 'interact' && msState !== 'special') {
          msEnterRelax();
        }
        return;
      }
      if (!canMove) return;
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
