(function () {
  'use strict';

  var CHARACTERS = [
    {
      id: 'jiaqiu',
      type: 'sprite',
      idleSrc: '/img/pets/jiaqiu-idle.webm',
      clickSrc: '/img/pets/jiaqiu-click.webm',
      width: 110,
      height: 100,
      canMove: false,
      quotes: ['The Lord of Hongyuan marches to war.', 'I will not pretend ignorance before understanding.', 'Pretense of understanding may not have been a wise decision.']
    },
    {
      id: 'exusiai',
      type: 'multistate',
      width: 75,
      height: 75,
      canMove: true,
      media: {
        relax: '/img/pets/Exusiai_Relax.webm',
        move: '/img/pets/Exusiai_Move.webm',
        sit: '/img/pets/Exusiai_Sit.webm',
        sleep: '/img/pets/Exusiai_Sleep.webm',
        interact: '/img/pets/Exusiai_Interact.webm',
        special: '/img/pets/Exusiai_Special.webm',
        start: '/img/pets/Exusiai_Start.webm'
      },
      quotes: [
        'Lord, please bless the Leader with a long and wonderful dream, and let that dream... come true some day.',
        'Real estate question: this wonderful realm or a panoramic view of hell—which did you want again?',
        'Divine judgment, traditional!',
        'Apple pie, with char siu!',
        'An apple a day means seven apples a week, yay!'
      ]
    },
    {
      id: 'heavyrain',
      type: 'multistate',
      width: 75,
      height: 75,
      canMove: true,
      media: {
        relax: '/img/pets/Heavyrain_Relax.webm',
        move: '/img/pets/Heavyrain_Move.webm',
        sit: '/img/pets/Heavyrain_Sit.webm',
        sleep: '/img/pets/Heavyrain_Sleep.webm',
        interact: '/img/pets/Heavyrain_Interact.webm',
        start: '/img/pets/Heavyrain_Start.webm'
      }
    },
    {
      id: 'irene',
      type: 'multistate',
      width: 75,
      height: 75,
      canMove: true,
      media: {
        relax: '/img/pets/Irene_Relax.webm',
        move: '/img/pets/Irene_Move.webm',
        sit: '/img/pets/Irene_Sit.webm',
        sleep: '/img/pets/Irene_Sleep.webm',
        interact: '/img/pets/Irene_Interact.webm',
        special: '/img/pets/Irene_Special.webm',
        start: '/img/pets/Irene_Start.webm'
      }
    },
    {
      id: 'kaltsit',
      type: 'multistate',
      width: 75,
      height: 75,
      canMove: true,
      media: {
        relax: "/img/pets/Kal'tsit_Relax.webm",
        move: "/img/pets/Kal'tsit_Move.webm",
        sit: "/img/pets/Kal'tsit_Sit.webm",
        sleep: "/img/pets/Kal'tsit_Sleep.webm",
        interact: "/img/pets/Kal'tsit_Interact.webm",
        start: "/img/pets/Kal'tsit_Start.webm"
      }
    },
    {
      id: 'lancet2',
      type: 'multistate',
      width: 75,
      height: 75,
      canMove: true,
      media: {
        relax: '/img/pets/Lancet-2_Relax.webm',
        move: '/img/pets/Lancet-2_Move.webm',
        interact: '/img/pets/Lancet-2_Interact.webm',
        special: '/img/pets/Lancet-2_Special.webm',
        start: '/img/pets/Lancet-2_Start.webm'
      }
    },
    {
      id: 'wisdel',
      type: 'multistate',
      width: 75,
      height: 75,
      canMove: true,
      media: {
        relax: "/img/pets/Wis'del_Relax.webm",
        move: "/img/pets/Wis'del_Move.webm",
        sit: "/img/pets/Wis'del_Sit.webm",
        sleep: "/img/pets/Wis'del_Sleep.webm",
        interact: "/img/pets/Wis'del_Interact.webm",
        special: "/img/pets/Wis'del_Special.webm",
        start: "/img/pets/Wis'del_Start.webm"
      }
    }
  ];

  var MIN_SCALE = 0.5, MAX_SCALE = 4, SCALE_STEP = 0.1;
  var DRAG_THRESHOLD = 5;
  var PETS_KEY = 'blogPetInstances';
  var MAX_SAVED_PETS = 10;
  var DEFAULT_SESSION_KEY = 'blogPetDefaultState';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stylesInjected = false;
  function buildStyle() {
    if (stylesInjected) return;
    stylesInjected = true;
    var style = document.createElement('style');
    style.textContent = [
      '.bp-pet{position:fixed;z-index:1000;}',
      '.bp-sprite{position:relative;pointer-events:auto;cursor:grab;}',
      '.bp-visual{position:absolute;left:0;top:0;width:100%;height:100%;transform-origin:50% 100%;',
        'transform:scale(calc(var(--bp-face,1) * var(--bp-scale,1)), var(--bp-scale,1));}',
      '.bp-media{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;}',
      '.bp-media.bp-media-click{transform:translate(-20%,-20%) scale(1.15);}',
      '.bp-quote{position:absolute;left:50%;transform:translate(calc(-50% - 16px),0);background:radial-gradient(ellipse at center, rgba(0,0,0,.82) 0%, rgba(0,0,0,.55) 65%, rgba(0,0,0,0) 100%);color:#fff;font-size:12px;font-weight:600;line-height:1.4;padding:8px 22px;border-radius:999px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s;}',
      '.bp-quote.show{opacity:1;}',
      '.bp-controls{position:absolute;left:50%;top:100%;transform:translateX(-50%);display:flex;gap:6px;margin-top:6px;opacity:0;pointer-events:none;transition:opacity .15s;}',
      '.bp-pet:hover .bp-controls,.bp-pet.bp-controls-visible .bp-controls{opacity:1;pointer-events:auto;}',
      '.bp-ctrl-btn{width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:rgba(0,0,0,.65);color:#fff;font-size:14px;font-weight:700;cursor:pointer;user-select:none;box-shadow:0 1px 4px rgba(0,0,0,.3);}',
      '.bp-ctrl-btn:hover{background:rgba(0,0,0,.85);}',
      '.bp-ctrl-btn.bp-ctrl-disabled{opacity:.35;pointer-events:none;}',
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

  var preloadedCharIds = {};
  var preloadedMedia = [];
  function preloadCharacterMedia(character) {
    if (preloadedCharIds[character.id]) return;
    preloadedCharIds[character.id] = true;
    var urls = [];
    if (character.type === 'sprite') {
      if (character.idleSrc) urls.push(character.idleSrc);
      if (character.clickSrc) urls.push(character.clickSrc);
      if (character.enterSrc) urls.push(character.enterSrc);
    } else if (character.type === 'multistate' && character.media) {
      for (var key in character.media) {
        if (character.media.hasOwnProperty(key) && character.media[key]) urls.push(character.media[key]);
      }
    }
    urls.forEach(function (url) {
      var v = document.createElement('video');
      v.preload = 'auto';
      v.muted = true;
      v.src = url;
      v.load();
      preloadedMedia.push(v);
    });
  }

  function findCharacter(id) {
    for (var i = 0; i < CHARACTERS.length; i++) {
      if (CHARACTERS[i].id === id) return CHARACTERS[i];
    }
    return null;
  }

  function createPet(container, character, opts) {
    opts = opts || {};
    var isSprite = character.type === 'sprite';
    var isMultistate = character.type === 'multistate';
    var canMove = character.canMove !== false;
    var boxW = character.width || 36;
    var boxH = character.height || 36;
    var scale = (typeof opts.scale === 'number')
      ? Math.min(MAX_SCALE, Math.max(MIN_SCALE, opts.scale))
      : (window.innerWidth < 600 ? 0.8 : 1);
    var entered = !!opts.entered;

    var root = document.createElement('div');
    root.className = 'bp-pet';

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

    var controls = document.createElement('div');
    controls.className = 'bp-controls';
    var btnAdd = document.createElement('div');
    btnAdd.className = 'bp-ctrl-btn';
    btnAdd.textContent = '+';
    btnAdd.title = 'Add a pet you don\'t have yet';
    var btnDel = document.createElement('div');
    btnDel.className = 'bp-ctrl-btn';
    btnDel.textContent = '−';
    btnDel.title = 'Remove this pet';
    var btnDup = document.createElement('div');
    btnDup.className = 'bp-ctrl-btn';
    btnDup.textContent = '⧉';
    btnDup.title = 'Duplicate this pet';
    controls.appendChild(btnAdd);
    controls.appendChild(btnDel);
    controls.appendChild(btnDup);
    root.appendChild(controls);

    function stopBubble(e) { e.stopPropagation(); }
    controls.addEventListener('click', stopBubble);
    controls.addEventListener('mousedown', stopBubble);
    controls.addEventListener('touchstart', stopBubble);

    btnAdd.addEventListener('click', function (e) {
      stopBubble(e);
      if (!manager.addMissing()) {
        btnAdd.classList.add('bp-ctrl-disabled');
        setTimeout(function () { btnAdd.classList.remove('bp-ctrl-disabled'); }, 400);
      }
    });
    btnDel.addEventListener('click', function (e) {
      stopBubble(e);
      manager.removeByUid(opts.uid);
    });
    btnDup.addEventListener('click', function (e) {
      stopBubble(e);
      manager.duplicate(opts.uid);
    });

    container.appendChild(root);

    if (media) media.play().catch(function () {});

    function minLeftBound() { return boxW * (scale - 1) / 2; }
    function maxLeftBound() { return window.innerWidth - boxW * (scale + 1) / 2; }
    function minTopBound() { return boxH * (scale - 1); }
    function maxTopBound() { return window.innerHeight - boxH; }

    var left, top;
    if (typeof opts.left === 'number' && typeof opts.top === 'number') {
      left = opts.left;
      top = opts.top;
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

    function persist() {
      if (opts.onChange) opts.onChange();
    }

    sprite.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP;
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round((scale + delta) * 100) / 100));
      visual.style.setProperty('--bp-scale', scale);
      quote.style.bottom = (boxH * scale + 8) + 'px';
      clampPosition();
      applyPosition();
      persist();
    }, { passive: false });

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
        var options = ['move'];
        if (character.media.sleep) options.push('sleep');
        if (character.media.sit) options.push('sit');
        var pick = options[Math.floor(Math.random() * options.length)];
        if (pick === 'sleep') msEnterSleep();
        else if (pick === 'sit') msEnterSit();
        else msEnterMove();
      }, delay);
    }

    function msEnterMove() {
      msState = 'move';
      msSetMedia(character.media.move, true);

      var moveSpeed = 0.5;
      var minDurationMs = 1000;
      var maxDurationMs = 3500;
      var estFrameMs = 16.7;
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
          persist();
          msEnterRelax();
        } else {
          moveRafId = requestAnimationFrame(step);
        }
      }
      moveRafId = requestAnimationFrame(step);
    }

    function msEnterSleep() {
      msState = 'sleep';
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

    function msEnterSit() {
      msState = 'sit';
      msSetMedia(character.media.sit, true);
      clearTimeout(msTimer);
      var duration = 6000 + Math.random() * 8000;
      msTimer = setTimeout(function () { msEnterRelax(); }, duration);
    }

    function msResumeSit() {
      msState = 'sit';
      msSetMedia(character.media.sit, true);
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
      persist();
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

    var pinching = false;
    var pinchStartDist = 0;
    var pinchStartScale = 1;
    var touchActive = false;
    var controlsHideTimer = null;

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
        persist();
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
      root.classList.add('bp-controls-visible');
      clearTimeout(controlsHideTimer);
      controlsHideTimer = setTimeout(function () {
        root.classList.remove('bp-controls-visible');
      }, 4000);

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

    root.addEventListener('mouseenter', function () {
      if (manager.hasMissing()) btnAdd.classList.remove('bp-ctrl-disabled');
      else btnAdd.classList.add('bp-ctrl-disabled');
    });

    var revertTimer = null;
    var quoteTimer = null;
    sprite.addEventListener('click', function () {
      if (moved) { moved = false; return; }

      if (isMultistate) {
        var wasResting = (msState === 'sleep' || msState === 'sit') ? msState : null;
        function msResumeAfterClick() {
          if (wasResting === 'sleep') msResumeSleep();
          else if (wasResting === 'sit') msResumeSit();
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
        if (character.media.special && Math.random() < 0.3) {
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

    function startBehavior() {
      if (isMultistate) {
        if (!reduceMotion) msEnterRelax();
      } else if (!reduceMotion && canMove) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    }

    function onVisibilityChange() {
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
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    function onResize() {
      clampPosition();
      applyPosition();
    }
    window.addEventListener('resize', onResize);

    function playEntranceThenStart() {
      var enterSrc = isMultistate ? (character.media && character.media.start) : character.enterSrc;
      if (!entered && enterSrc && media) {
        msState = 'enter';
        media.loop = false;
        media.src = enterSrc;
        media.load();
        media.play().catch(function () {});
        media.onended = function () {
          media.onended = null;
          entered = true;
          persist();
          startBehavior();
        };
      } else {
        entered = true;
        startBehavior();
      }
    }
    playEntranceThenStart();

    var destroyed = false;
    function destroy() {
      if (destroyed) return;
      destroyed = true;
      clearTimeout(msTimer);
      clearTimeout(controlsHideTimer);
      clearTimeout(revertTimer);
      clearTimeout(quoteTimer);
      if (moveRafId) cancelAnimationFrame(moveRafId);
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', onResize);
      if (touchActive) {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        document.removeEventListener('touchcancel', onTouchEnd);
      }
      if (root.parentNode) root.parentNode.removeChild(root);
    }

    return {
      getState: function () { return { left: left, top: top, scale: scale }; },
      destroy: destroy
    };
  }

  var manager = {
    container: null,
    instances: [],
    uidCounter: 1,

    init: function () {
      if (document.getElementById('blog-pet-container')) return;
      buildStyle();
      this.container = document.createElement('div');
      this.container.id = 'blog-pet-container';
      document.body.appendChild(this.container);

      var saved = this.loadSaved();
      if (saved && saved.length) {
        if (saved.length > MAX_SAVED_PETS) saved = saved.slice(0, MAX_SAVED_PETS);
        for (var i = 0; i < saved.length; i++) {
          var ch = findCharacter(saved[i].charId);
          if (!ch) continue;
          this.spawn(ch, {
            left: saved[i].left,
            top: saved[i].top,
            scale: saved[i].scale,
            entered: true
          });
        }
        if (this.instances.length === 0) {
          this.spawnDefault();
        } else {
          this.save();
        }
      } else {
        this.spawnDefault();
      }
    },

    spawnDefault: function () {
      var saved = null;
      if (isReloadNavigation()) {
        try { sessionStorage.removeItem(DEFAULT_SESSION_KEY); } catch (e) {}
      } else {
        try {
          var raw = sessionStorage.getItem(DEFAULT_SESSION_KEY);
          if (raw) saved = JSON.parse(raw);
        } catch (e) {}
      }
      var character = (saved && findCharacter(saved.charId)) || CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      var entered = !!(saved && saved.charId === character.id && saved.entered);
      try {
        sessionStorage.setItem(DEFAULT_SESSION_KEY, JSON.stringify({ charId: character.id, entered: true }));
      } catch (e) {}
      // persist:false — an untouched default pet is not written to localStorage,
      // so every fresh load without customization still follows the sessionStorage-based
      // "reroll on reload / keep on navigation" logic. As soon as the user drags, resizes,
      // adds, removes, or duplicates a pet, a real save happens and it's locked in from then on.
      this.spawn(character, { entered: entered, persist: false });
    },

    spawn: function (character, opts) {
      opts = opts || {};
      var self = this;
      var uid = 'p' + (this.uidCounter++);
      var handle = createPet(this.container, character, {
        left: opts.left,
        top: opts.top,
        scale: opts.scale,
        entered: opts.entered,
        uid: uid,
        onChange: function () { self.save(); }
      });
      this.instances.push({ uid: uid, character: character, handle: handle });
      preloadCharacterMedia(character);
      if (opts.persist !== false) this.save();
      return handle;
    },

    removeByUid: function (uid) {
      for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].uid === uid) {
          this.instances[i].handle.destroy();
          this.instances.splice(i, 1);
          break;
        }
      }
      if (this.instances.length === 0) {
        this.spawnDefault();
      } else {
        this.save();
      }
    },

    duplicate: function (uid) {
      for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].uid === uid) {
          var src = this.instances[i].handle.getState();
          this.spawn(this.instances[i].character, {
            left: src.left + 24,
            top: src.top + 12,
            scale: src.scale,
            entered: false
          });
          break;
        }
      }
    },

    addMissing: function () {
      var present = {};
      for (var i = 0; i < this.instances.length; i++) present[this.instances[i].character.id] = true;
      var missing = null;
      for (var j = 0; j < CHARACTERS.length; j++) {
        if (!present[CHARACTERS[j].id]) { missing = CHARACTERS[j]; break; }
      }
      if (!missing) return false;
      this.spawn(missing, { entered: false });
      return true;
    },

    hasMissing: function () {
      var present = {};
      for (var i = 0; i < this.instances.length; i++) present[this.instances[i].character.id] = true;
      for (var j = 0; j < CHARACTERS.length; j++) {
        if (!present[CHARACTERS[j].id]) return true;
      }
      return false;
    },

    save: function () {
      try {
        var list = this.instances.map(function (inst) {
          var s = inst.handle.getState();
          return { charId: inst.character.id, left: s.left, top: s.top, scale: s.scale };
        });
        localStorage.setItem(PETS_KEY, JSON.stringify(list));
      } catch (e) {}
    },

    loadSaved: function () {
      try {
        var raw = localStorage.getItem(PETS_KEY);
        if (!raw) return null;
        var arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      } catch (e) {}
      return null;
    }
  };

  function boot() {
    manager.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
