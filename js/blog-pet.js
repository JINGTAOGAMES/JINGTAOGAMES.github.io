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
      quotes: ['君主御驾亲征。', '勿以知之为不知。', '勿以不知为知之，是知也。']
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
        '主啊，希望你能让老板做个长长的美梦，希望那个美梦......终有一日能成真。',
        '我再确认下，美好人世间和地狱全景房，你到底想选哪一个啊？',
        '正宗天意！',
        '叉烧苹果派！',
        '一天一苹果，一周七苹果！'
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
      },
      quotes: [
        '嗯，我来保护博士。',
        '遵命。',
        '......我会尽力。',
        '我在。',
        '欸欸？！'
      ]
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
      },
      quotes: [
        '跟着我的灯光走，小心潮水和海雾。',
        '看到我的灯了吗？我在这里。',
        '我的灯将净化邪恶！',
        '我的剑将劈开海潮！',
        '我的眼将找出真相！',
        '我的心会作出判决。',
        '恐鱼？！哦，是你啊。'
      ]
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
      },
      quotes: [
        '所幸......这并不是另一个梦。',
        '没有问题。',
        '我相信你。',
        '也许我们能够看到那个属于所有人的未来。',
        '不必频繁确认我的状态，这副躯体与常人无异。',
        '如果你的确很在意的话，我现在很好。'
      ]
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
      },
      quotes: [
        '感觉什么地方不舒服？请让我来帮你看一看吧。',
        '嗨，你好，博士。你在期待我能对你多说些什么，但我不能，毕竟我只是一台医疗机器人......',
        '医疗设备消毒，ok。电力，ok。随时可以出发。',
        '啊啊啊......'
      ]
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
      },
      quotes: [
        '美好的日子真是怎么过都过不完啊。',
        '今天又轮到谁粉身碎骨了呢？',
        '砰！是谁告诉你，我每次都会倒数的？',
        '喜欢我指甲的颜色嘛，猜猜看是用什么染的？',
        '又看到你这张脸了呢，博士，真是个好的开始。',
        '终于活腻味了？'
      ]
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
      '.bp-media{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;opacity:0;transition:opacity .2s ease;}',
      '.bp-media.bp-media-active{opacity:1;}',
      '.bp-visual.bp-click-mode .bp-media.bp-media-active{transform:translate(-20%,-20%) scale(1.15);}',
      '.bp-quote{position:absolute;left:50%;transform:translate(calc(-50% - 16px),0);background:radial-gradient(ellipse at center, rgba(0,0,0,.82) 0%, rgba(0,0,0,.55) 65%, rgba(0,0,0,0) 100%);color:#fff;font-size:12px;font-weight:600;line-height:1.4;padding:8px 22px;border-radius:999px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s;}',
      '.bp-quote.show{opacity:1;}',
      '.bp-controls{position:absolute;left:50%;top:100%;transform:translateX(-50%);display:flex;gap:6px;padding-top:10px;opacity:0;pointer-events:none;transition:opacity .15s;}',
      '.bp-pet.bp-controls-visible .bp-controls{opacity:1;pointer-events:auto;}',
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

    // 双缓冲：两个video叠在一起，谁是"当前显示"由activeMedia/inactiveMedia记录，
    // 换动作时把新素材加载到闲置的那个上面，等它真的能播放了才淡入换上来，
    // 播放中的画面全程不间断，不会像单video换src那样黑屏闪一下。
    var media = null;
    var mediaA = null, mediaB = null;
    var activeMedia = null, inactiveMedia = null;
    if (isSprite || isMultistate) {
      mediaA = document.createElement('video');
      mediaA.className = 'bp-media';
      mediaB = document.createElement('video');
      mediaB.className = 'bp-media';
      [mediaA, mediaB].forEach(function (m) {
        m.muted = true;
        m.playsInline = true;
        m.setAttribute('playsinline', '');
        m.setAttribute('muted', '');
        visual.appendChild(m);
      });
      activeMedia = mediaA;
      inactiveMedia = mediaB;
      media = activeMedia;
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
    btnAdd.title = '添加一只还没有的宠物';
    var btnDel = document.createElement('div');
    btnDel.className = 'bp-ctrl-btn';
    btnDel.textContent = '−';
    btnDel.title = '删除这只宠物';
    var btnDup = document.createElement('div');
    btnDup.className = 'bp-ctrl-btn';
    btnDup.textContent = '⧉';
    btnDup.title = '复制这只宠物';
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

    // 一开始两个video都还没素材，真正的播放从下面的playEntranceThenStart()/swapMedia()开始

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
    var mediaSwapTimer = null;

    function swapMedia(src, loop, onEnded) {
      if (!activeMedia || !inactiveMedia) return;
      var incoming = inactiveMedia;
      var outgoing = activeMedia;
      incoming.onended = null;
      incoming.loop = !!loop;
      incoming.src = src;
      incoming.load();

      var swapped = false;
      var fallbackTimer;
      function doSwap() {
        if (swapped) return;
        swapped = true;
        incoming.removeEventListener('canplay', onCanPlay);
        clearTimeout(fallbackTimer);
        incoming.play().catch(function () {});
        incoming.classList.add('bp-media-active');
        outgoing.classList.remove('bp-media-active');
        activeMedia = incoming;
        inactiveMedia = outgoing;
        media = activeMedia;
        if (onEnded) {
          incoming.onended = function () {
            incoming.onended = null;
            onEnded();
          };
        }
        clearTimeout(mediaSwapTimer);
        mediaSwapTimer = setTimeout(function () {
          if (outgoing !== activeMedia) outgoing.pause();
        }, 260);
      }
      function onCanPlay() { doSwap(); }
      incoming.addEventListener('canplay', onCanPlay);
      // 兜底：万一canplay一直不触发（网络异常之类），最多等待800ms就强制切换，避免卡死在旧动画上
      fallbackTimer = setTimeout(doSwap, 800);
    }

    function msSetMedia(src, loop, onEnded) {
      swapMedia(src, loop, onEnded);
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
      msSetMedia(character.media.interact, false, onDone);
    }

    function msPlaySpecial(onDone) {
      msState = 'special';
      clearTimeout(msTimer);
      if (moveRafId) cancelAnimationFrame(moveRafId);
      msSetMedia(character.media.special, false, onDone);
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

    // 桌面端不再用纯CSS的:hover来控制菜单显隐——sprite和controls之间哪怕只有几像素的空隙，
    // 鼠标斜着移动过去也很容易被判定成"离开了"，导致刚移过去菜单就消失、根本点不到。
    // 改成JS控制 + 一个短暂的隐藏延迟：进入就显示、离开先不急着隐藏，等一小段时间
    // 如果没有重新进入（sprite或controls任意一处）才真正隐藏，给鼠标移动留出容错时间。
    root.addEventListener('mouseenter', function () {
      clearTimeout(controlsHideTimer);
      root.classList.add('bp-controls-visible');
      if (manager.hasMissing()) btnAdd.classList.remove('bp-ctrl-disabled');
      else btnAdd.classList.add('bp-ctrl-disabled');
    });
    root.addEventListener('mouseleave', function () {
      clearTimeout(controlsHideTimer);
      controlsHideTimer = setTimeout(function () {
        root.classList.remove('bp-controls-visible');
      }, 350);
    });

    var revertTimer = null;
    var quoteTimer = null;
    var lastQuoteIndex = -1;
    function pickQuote(quotes) {
      // 不要连续两次说同一句：候选池长度大于1时，排除上一次说过的那一条再抽
      if (!quotes || !quotes.length) return '';
      if (quotes.length === 1) { lastQuoteIndex = 0; return quotes[0]; }
      var idx;
      do {
        idx = Math.floor(Math.random() * quotes.length);
      } while (idx === lastQuoteIndex);
      lastQuoteIndex = idx;
      return quotes[idx];
    }
    sprite.addEventListener('click', function () {
      if (moved) { moved = false; return; }

      if (isMultistate) {
        // special不能被点击打断，要等它自己播完
        if (msState === 'special') return;
        var wasResting = (msState === 'sleep' || msState === 'sit') ? msState : null;
        function msResumeAfterClick() {
          if (wasResting === 'sleep') msResumeSleep();
          else if (wasResting === 'sit') msResumeSit();
          else msEnterRelax();
        }
        if (character.quotes && character.quotes.length) {
          var msLine = pickQuote(character.quotes);
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

      var line = pickQuote(character.quotes);
      quote.textContent = line;
      quote.classList.add('show');
      clearTimeout(quoteTimer);
      quoteTimer = setTimeout(function () {
        quote.classList.remove('show');
      }, 2600);

      if (isSprite && character.clickSrc) {
        visual.classList.add('bp-click-mode');
        swapMedia(character.clickSrc + (character.clickSrc.indexOf('?') > -1 ? '&' : '?') + 't=' + Date.now(), false, function () {
          visual.classList.remove('bp-click-mode');
          swapMedia(character.idleSrc, true, null);
        });
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
        swapMedia(enterSrc, false, function () {
          entered = true;
          persist();
          startBehavior();
        });
      } else {
        entered = true;
        if (media) {
          // 两个video刚创建时都还没有素材，这里把常态画面摆上去，
          // 双缓冲本身就能兜住这次"从无到有"的展示
          swapMedia(isMultistate ? character.media.relax : character.idleSrc, true, null);
        }
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
      clearTimeout(mediaSwapTimer);
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
      // persist:false —— 还没被用户碰过的默认宠物不写入localStorage，
      // 这样每次没有自定义配置时都会走sessionStorage的"刷新重随机/跳转保持"逻辑；
      // 一旦用户拖动/缩放/加减/复制过，会通过onChange或spawn的正常持久化落盘，
      // 之后就固定下来，刷新也不会再变。
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
