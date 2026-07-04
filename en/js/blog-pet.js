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
      width: 225,
      height: 225,
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
      width: 225,
      height: 225,
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
        "Yes, I'll protect the Doctor.",
        'By your command.',
        "I'll do my best.",
        "I'm here.",
        'Ehhh?!'
      ]
    },
    {
      id: 'irene',
      type: 'multistate',
      width: 225,
      height: 225,
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
        'Follow my light. Watch out for the tides and mist.',
        "See the light of my lantern? I'm right here.",
        'My light will purge the vice!',
        'My blade will cleave the tides!',
        'My eyes will find the truth!',
        'My heart will be the judge.',
        "Sea Terror?! Oh, it's you."
      ]
    },
    {
      id: 'kaltsit',
      type: 'multistate',
      width: 225,
      height: 225,
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
      width: 225,
      height: 225,
      canMove: true,
      media: {
        relax: '/img/pets/Lancet-2_Relax.webm',
        move: '/img/pets/Lancet-2_Move.webm',
        interact: '/img/pets/Lancet-2_Interact.webm',
        special: '/img/pets/Lancet-2_Special.webm',
        start: '/img/pets/Lancet-2_Start.webm'
      },
      quotes: [
        'Are you feeling unwell? I could give you a medical examination, if you wish.',
        "Hi, nice to meet you, Doctor. I understand that you want me to say something more interesting, but I'm afraid I cannot do so. Because I'm just a medical robot…",
        'Medical supplies: confirmed. Battery charge: confirmed. Ready for deployment.',
        'Ahhh...'
      ]
    },
    {
      id: 'wisdel',
      type: 'multistate',
      width: 225,
      height: 225,
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
        'Aw. These wonderful days just never end.',
        'Whose turn is it to get blown to bits today?',
        "Boom! Who says there's always a countdown?",
        'Do you like my nails? Guess what I used to paint them.',
        "Oh joy, there's your face again, Doctor. What a great start for the day.",
        'Finally ready to die?'
      ]
    }
  ];

  var MIN_SCALE = 0.5, MAX_SCALE = 4, SCALE_STEP = 0.1;
  var DRAG_THRESHOLD = 5;
  var PETS_KEY = 'blogPetInstances';
  var MAX_SAVED_PETS = 10;
  var DEFAULT_SESSION_KEY = 'blogPetDefaultState';
  // Dragging is basically unrestricted now: the pet can go past the edge of the
  // viewport/page. We only keep this many pixels on-screen so it never fully
  // disappears and can always be grabbed back.
  var EDGE_KEEP_PX = 24;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stylesInjected = false;
  function buildStyle() {
    if (stylesInjected) return;
    stylesInjected = true;
    var style = document.createElement('style');
    style.textContent = [
      '.bp-pet{position:fixed;z-index:1000;-webkit-user-select:none;user-select:none;}',
      '.bp-sprite{position:relative;pointer-events:auto;cursor:grab;}',
      '.bp-hitbox{position:absolute;left:50%;top:6%;bottom:14.5%;width:38%;transform:translateX(-50%);pointer-events:auto;cursor:grab;}',
      '.bp-hitbox-jiaqiu{position:absolute;left:5%;top:3%;width:55%;height:60%;pointer-events:auto;cursor:grab;}',
      '.bp-visual{position:absolute;left:0;top:0;width:100%;height:100%;transform-origin:50% 100%;',
        'transform:scale(calc(var(--bp-face,1) * var(--bp-scale,1)), var(--bp-scale,1));}',
      '.bp-media{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;}',
      '.bp-media.bp-media-click{transform:translate(-20%,-20%) scale(1.15);}',
      '.bp-media-buffered{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;opacity:0;transition:opacity .2s ease;}',
      '.bp-media-buffered.bp-media-active{opacity:1;}',
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

    // Sprite characters (jiaqiu) only have idle/click clips and simple swap logic, so they keep
    // the original single-video src-swap approach — the click animation's offset/scale was tuned
    // against this exact single-video setup, and double buffering caused the outgoing clip to
    // briefly match the same transform during the crossfade, throwing the position off.
    // Double buffering is only used for multistate characters (exusiai and the rest).
    var media = null;
    var mediaA = null, mediaB = null;
    var activeMedia = null, inactiveMedia = null;
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
    } else if (isMultistate) {
      // Double buffering: two stacked video elements. activeMedia/inactiveMedia track which
      // one is currently shown; on a state change the new clip loads into the idle one and only
      // fades in once it's actually ready to play, so playback is never interrupted mid-transition.
      mediaA = document.createElement('video');
      mediaA.className = 'bp-media-buffered';
      mediaB = document.createElement('video');
      mediaB.className = 'bp-media-buffered';
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

    // The Arknights-style clips are square canvases with a lot of padding — the character itself
    // only occupies a small area in the middle. Drag/click/wheel-zoom detection now only responds
    // within this smaller centered hotspot; clicking or dragging on the empty space around the
    // character no longer does anything. The hotspot size is an approximation; individual
    // characters can be tuned further later if some are noticeably off.
    var hitTarget = sprite;
    if (isMultistate || isSprite) {
      hitTarget = document.createElement('div');
      hitTarget.className = isMultistate ? 'bp-hitbox' : 'bp-hitbox-jiaqiu';
      // Attached to visual, not sprite: visual is the layer actually scaled by the --bp-scale
      // transform, so putting the hotspot inside it means the hotspot zooms in/out together with
      // the character instead of staying pinned at its original size and position.
      visual.appendChild(hitTarget);

      // The empty area outside the hotspot has no drag/click logic attached anymore, but if we
      // don't also swallow mousedown/dragstart there, the browser treats it like ordinary page
      // content — triggering a native text-selection highlight box, or dragging the video like
      // an image ghost. This just eats the default behavior; the actual drag/click logic all
      // lives on hitTarget.
      sprite.addEventListener('mousedown', function (e) { e.preventDefault(); });
      sprite.addEventListener('dragstart', function (e) { e.preventDefault(); });
    }

    // The higher the zoom, the more the empty headroom above the character in the clip also
    // scales up — if the quote tracked boxH*scale exactly, it would drift further from the
    // character as it grows. Only apply 40% of the scale growth to the quote's offset so it
    // stays noticeably closer to the character after zooming in.
    function quoteBottom() {
      // Only the Arknights-style multistate characters' clips have a lot of headroom above the
      // character, so only they need the quote's growth dampened; jiaqiu doesn't have this issue
      // and keeps the original boxH*scale.
      var quoteScale = isMultistate ? (1 + (scale - 1) * 0.4) : scale;
      return (boxH * quoteScale + 8) + 'px';
    }

    var quote = document.createElement('div');
    quote.className = 'bp-quote';
    quote.style.bottom = quoteBottom();
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
    var btnClear = document.createElement('div');
    btnClear.className = 'bp-ctrl-btn';
    btnClear.textContent = '×';
    btnClear.title = 'Remove every pet except this one';
    controls.appendChild(btnAdd);
    controls.appendChild(btnDel);
    controls.appendChild(btnDup);
    controls.appendChild(btnClear);
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
    btnClear.addEventListener('click', function (e) {
      stopBubble(e);
      manager.removeAllExcept(opts.uid);
    });

    container.appendChild(root);

    // Sprite characters' idle video starts playing right here (same as before); multistate's
    // double buffer has no content yet — real playback starts in playEntranceThenStart()/swapMedia() below
    if (isSprite && media) media.play().catch(function () {});

    function minLeftBound() { return -boxW * scale + EDGE_KEEP_PX; }
    function maxLeftBound() { return window.innerWidth - EDGE_KEEP_PX; }
    function minTopBound() { return -boxH * scale + EDGE_KEEP_PX; }
    function maxTopBound() { return window.innerHeight - EDGE_KEEP_PX; }

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
      // Normally minXxxBound() should already be <= maxXxxBound(); but when the character itself
      // is bigger than the viewport (very high zoom, or a small viewport), these two theoretical
      // bounds flip. Regardless of which is numerically larger, just treat them as the two ends of
      // an interval (smaller one = lower bound, larger one = upper bound), so there's always a real
      // draggable range instead of collapsing to a single frozen point.
      var leftBoundA = minLeftBound();
      var leftBoundB = maxLeftBound();
      var minLeft = Math.min(leftBoundA, leftBoundB);
      var maxLeft = Math.max(leftBoundA, leftBoundB);
      var topBoundA = minTopBound();
      var topBoundB = maxTopBound();
      var minTop = Math.min(topBoundA, topBoundB);
      var maxTop = Math.max(topBoundA, topBoundB);
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

    hitTarget.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP;
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round((scale + delta) * 100) / 100));
      visual.style.setProperty('--bp-scale', scale);
      quote.style.bottom = quoteBottom();
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
      // Fallback: if canplay never fires (e.g. network hiccup), force the swap after 800ms
      // so we don't get stuck on the old animation forever.
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
      hitTarget.style.cursor = 'grabbing';
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
      hitTarget.style.cursor = 'grab';
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

    // Which pet actually responds to a given press is decided centrally by the manager on the
    // shared container (see the "closest hotspot center wins" logic there) — this function only
    // handles what happens once dragging actually starts, and the manager calls it on the winner.
    function handleHitMouseDown(e) {
      e.preventDefault();
      dragStart(e.clientX, e.clientY);
      function onMove(ev) { dragMove(ev.clientX, ev.clientY); }
      function onUp() {
        dragEnd();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        // If there was no meaningful movement, treat this as a click on this same pet instead of
        // relying on the browser's native click event (which fires on whatever happens to be
        // under the cursor at release — that can disagree with which pet "won" the press when
        // hotspots overlap).
        if (!moved) handleHitClick();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }

    var pinching = false;
    var didPinch = false; // whether a pinch-zoom happened during this touch gesture — if so, don't treat release as a click
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
        quote.style.bottom = quoteBottom();
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
        didPinch = true;
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
        // If there was no meaningful movement and no pinch happened during this gesture,
        // treat the release as a tap on this same pet, without relying on a synthesized click event.
        if (!moved && !didPinch) handleHitClick();
        touchActive = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        document.removeEventListener('touchcancel', onTouchEnd);
      }
    }

    // Again, the manager decides which pet this touch belongs to; this just handles the actual start
    function handleHitTouchStart(e) {
      if (!touchActive) didPinch = false; // fresh gesture starting, reset the flag
      root.classList.add('bp-controls-visible');
      clearTimeout(controlsHideTimer);
      controlsHideTimer = setTimeout(function () {
        root.classList.remove('bp-controls-visible');
      }, 4000);

      if (e.touches.length >= 2) {
        dragging = false;
        pinching = true;
        didPinch = true;
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
    }

    // Desktop no longer relies on pure CSS :hover to show/hide the control menu — the small gap
    // between the sprite and the controls below it made the menu vanish the instant the cursor
    // moved diagonally toward it, before it could ever be clicked. Instead we manage visibility
    // in JS with a short hide delay: show immediately on enter, and only hide after a brief grace
    // period on leave (canceled if the cursor re-enters the sprite or the controls in time).
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
      // Never say the same line twice in a row: if there's more than one candidate,
      // re-roll until we get something other than the last line shown.
      if (!quotes || !quotes.length) return '';
      if (quotes.length === 1) { lastQuoteIndex = 0; return quotes[0]; }
      var idx;
      do {
        idx = Math.floor(Math.random() * quotes.length);
      } while (idx === lastQuoteIndex);
      lastQuoteIndex = idx;
      return quotes[idx];
    }
    // Again decided by the manager
    function handleHitClick() {
      if (moved) { moved = false; return; }

      if (isMultistate) {
        // special can't be interrupted by a click — it has to finish playing on its own
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
    }

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
      if (isMultistate) {
        var enterSrc = character.media && character.media.start;
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
            // Neither buffer has anything loaded yet — put the relax clip up now;
            // the double-buffer mechanism itself handles this first "nothing to something" reveal.
            swapMedia(character.media.relax, true, null);
          }
          startBehavior();
        }
        return;
      }
      // Sprite characters (jiaqiu) don't use double buffering — same as before
      var spriteEnterSrc = character.enterSrc;
      if (!entered && spriteEnterSrc && media) {
        media.loop = false;
        media.src = spriteEnterSrc;
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
      destroy: destroy,
      // Used by the manager's "closest hotspot center wins" overlap resolution
      hitRect: function () { return hitTarget.getBoundingClientRect(); },
      hitMouseDown: handleHitMouseDown,
      hitTouchStart: handleHitTouchStart,
      hitClick: handleHitClick
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
      this.setupHitDispatch();

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

    // With more pets around they tend to overlap; when a press/tap happens, decide here which
    // pet it actually belongs to: only consider pets whose hotspot actually contains that point,
    // then pick whichever one's hotspot center is closest to it. This way it's always "whichever
    // is nearest" that responds, regardless of DOM stacking order (who happens to be painted on top).
    findClosestInstance: function (x, y) {
      var best = null;
      var bestDist = Infinity;
      for (var i = 0; i < this.instances.length; i++) {
        var handle = this.instances[i].handle;
        if (!handle.hitRect) continue;
        var r = handle.hitRect();
        if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        var dx = x - cx;
        var dy = y - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bestDist) {
          bestDist = dist;
          best = this.instances[i];
        }
      }
      return best;
    },

    setupHitDispatch: function () {
      var self = this;
      this.container.addEventListener('mousedown', function (e) {
        var winner = self.findClosestInstance(e.clientX, e.clientY);
        if (winner && winner.handle.hitMouseDown) winner.handle.hitMouseDown(e);
      });
      this.container.addEventListener('touchstart', function (e) {
        if (!e.touches || !e.touches.length) return;
        var t = e.touches[0];
        var winner = self.findClosestInstance(t.clientX, t.clientY);
        if (winner && winner.handle.hitTouchStart) winner.handle.hitTouchStart(e);
      }, { passive: false });
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

    removeAllExcept: function (uid) {
      for (var i = this.instances.length - 1; i >= 0; i--) {
        if (this.instances[i].uid !== uid) {
          this.instances[i].handle.destroy();
          this.instances.splice(i, 1);
        }
      }
      this.save();
    },

    duplicate: function (uid) {
      for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].uid === uid) {
          var src = this.instances[i].handle.getState();
          // Only offset horizontally: pick a random side (left/right), distance 300-700px,
          // keep the same vertical position as the original.
          var dir = Math.random() < 0.5 ? -1 : 1;
          var dist = 300 + Math.random() * 400;
          this.spawn(this.instances[i].character, {
            left: src.left + dir * dist,
            top: src.top,
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
