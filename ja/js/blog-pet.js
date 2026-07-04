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
      quotes: ['君主自ら出ようじゃないか。', '知っていることに知らぬ振りは出来ないからな。', '知らぬことを知っていると言ってはならなかったか。']
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
        '主よ、リーダーに長く幸せな夢を見せ給え。願わくはその夢が……いつの日か実現せんことを。',
        '念のためもっかい聞くけど、美しき人の世と地獄のパノラマビューはどっちにしたいんだっけ？',
        'ヴェルス・ディオ・ヴォーレント！',
        'チャーシュー・アップルパイ！',
        '一日一リンゴ、一週間七リンゴ！'
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
        'はい、私がドクターを守ります。',
        '仰せのままに。',
        '……私、頑張ります。',
        '私はここに。',
        'ええ？！'
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
        '私の灯りに付いてきてください、潮と海霧に呑まれないように。',
        '私の灯りが見えますか？ここです。',
        '我が灯火が邪悪を払う！',
        '我が刃が海を斬り裂く！',
        '我が眼差しが真実を暴く！',
        '我が心が判決を下す。',
        '恐魚！？ああ、あなたですか。'
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
      },
      quotes: [
        '幸いなことに……これはもう一つの夢ではなさそうだ',
        '問題ない。',
        '君を信じよう。',
        '全ての人々のための未来を我々は目にすることができるかもしれない。',
        '私の状態を頻繫に心配する必要はない、この肉体は常人と何ら変わりないのだから。',
        '君がそこまで気にするというのならない話しておくが、今の私は健康そのものだ。'
      ]
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
        'どこか具合でも悪いのでしょうか？よろしければ私に診させていただけませんか。',
        'こんにちは、ドクター様。私に面白いことを期待されても、特に何か話せるようなことはありません。あくまで私は、ただの医療用ロボットですから……。',
        '医療設備の消毒、完了。充電、完了。いつでも出発可能です。',
        'あわわ……。'
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
        '楽しい時間って、ほんとに終わらないわよねぇ。',
        'さぁ～て今日は誰が粉々になる番かしらね？',
        'パァン！毎回カウントするなんて誰が言ったのかしら？',
        'あたしのネイルの色が好きかしら？何で染めてるか当ててみたら？',
        'またあんたの顔を拝めたわね、ドクター。まったく、幸先がいいわ。',
        'そんなに死にたいの？'
      ]
    }
  ];

  var MIN_SCALE = 0.5, MAX_SCALE = 4, SCALE_STEP = 0.1;
  var DRAG_THRESHOLD = 5;
  var PETS_KEY = 'blogPetInstances';
  var MAX_SAVED_PETS = 10;
  var DEFAULT_SESSION_KEY = 'blogPetDefaultState';
  // ドラッグ範囲はほぼ無制限にする：画面外・ページの端の外側にはみ出してもよい。
  // これだけのピクセルだけ画面内に残して、完全に見えなくならず後でつかみ直せる
  // ようにする。
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

    // jiaqiuのようなsprite系キャラはidle/clickの2素材だけでロジックも単純なので、
    // 元通りの単一video・src差し替え方式のままにする——クリックアニメの位置・拡大率は
    // この単一video構造に合わせて調整済みで、二重バッファにすると交差フェード中に
    // 消えていく方の映像にも同じ変形が一瞬当たってしまい、位置がずれる原因になっていた。
    // 二重バッファはmultistate系キャラ（exusiaiなど動作数の多いキャラ）専用にする。
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
      // 二重バッファ：videoを2枚重ねておき、activeMedia/inactiveMediaでどちらが表示中かを管理する。
      // 状態が切り替わるときは新素材を待機中の方に読み込み、実際に再生できる状態になってから
      // フェードインで入れ替える。表示中の映像が途中で途切れることはない。
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

    // 明日方舟系キャラの素材は余白のある正方形キャンバスで、キャラ本体は中央のごく一部しか
    // 占めていない。ドラッグ・クリック・ホイールでの拡大縮小の判定を、この中央の小さい
    // ホットスポットだけに反応するようにする。キャラ周りの余白部分をクリック・ドラッグしても
    // 何も起きなくなる。サイズはあくまで目安なので、キャラによってズレが大きければ
    // 後で個別に調整できる。
    var hitTarget = sprite;
    if (isMultistate || isSprite) {
      hitTarget = document.createElement('div');
      hitTarget.className = isMultistate ? 'bp-hitbox' : 'bp-hitbox-jiaqiu';
      // spriteではなくvisualの下にぶら下げる：--bp-scaleのtransformで実際に拡大縮小されるのは
      // visual側なので、ホットスポットもその中に入れておけば、キャラと一緒にズームに
      // 追従するようになる（元のサイズ・位置に固定されたままにならない）。
      visual.appendChild(hitTarget);

      // ホットスポットの外側の余白部分にはもうドラッグ・クリックの処理が何も付いていないが、
      // ここでmousedown/dragstartを吸収しておかないと、ブラウザが普通のページコンテンツと
      // 判断してネイティブのテキスト選択ハイライトが出たり、中の動画を画像のようにドラッグして
      // 残像が出たりしてしまう。ここではデフォルト動作を潰すだけで、実際のドラッグ・クリック
      // 処理は全部hitTarget側にある。
      sprite.addEventListener('mousedown', function (e) { e.preventDefault(); });
      sprite.addEventListener('dragstart', function (e) { e.preventDefault(); });
    }

    // 拡大率が上がるほど、映像内でキャラの頭より上にある余白部分も同じ倍率で広がってしまい、
    // 字幕がboxH*scaleにそのまま追従するとキャラ本体からどんどん離れていく。
    // scaleの伸び幅の40%だけ字幕の位置に反映させることで、拡大後もキャラに近い位置を保つ。
    function quoteBottom() {
      // 頭上の余白が大きいのは明日方舟系のmultistateキャラだけなので、字幕の伸びを
      // 抑えるのもそちらだけにする。jiaqiuはこの問題がないので元のboxH*scaleのまま
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
    btnAdd.title = 'まだいないペットを追加';
    var btnDel = document.createElement('div');
    btnDel.className = 'bp-ctrl-btn';
    btnDel.textContent = '−';
    btnDel.title = 'このペットを削除';
    var btnDup = document.createElement('div');
    btnDup.className = 'bp-ctrl-btn';
    btnDup.textContent = '⧉';
    btnDup.title = 'このペットを複製';
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

    // sprite系のidle動画はここで再生開始（従来通り）。multistateの二重バッファはまだ素材がなく、
    // 実際の再生は下のplayEntranceThenStart()/swapMedia()から始まる
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
      // 通常はminXxxBound()がmaxXxxBound()以下になるはずだが、キャラ自体がビューポートより
      // 大きい場合（拡大率が高い、またはビューポートが小さい）、この2つの理論上の境界が
      // 逆転することがある。その場合はどちらが大きいかに関係なく、単純に区間の両端として
      // 扱う（小さい方を下限、大きい方を上限に）。これで常に実際にドラッグできる範囲が
      // 残り、1点に固定されて動かせなくなることがなくなる。
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
      // 保険：canplayが発火しない場合（通信状況が悪いなど）は最大800ms待って強制的に切り替える
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

    // どの押下がどのpetに対応するかはmanagerがコンテナ側で一括判定する
    // （「ホットスポットの中心が一番近いもの」ロジックは manager 側参照）。
    // ここでは実際にドラッグが始まった後の処理だけを持ち、managerが勝者に対してこれを呼ぶ。
    function handleHitMouseDown(e) {
      e.preventDefault();
      dragStart(e.clientX, e.clientY);
      function onMove(ev) { dragMove(ev.clientX, ev.clientY); }
      function onUp() {
        dragEnd();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        // ほとんど動いていなければクリックとして扱う。ブラウザのネイティブclickイベント
        // （離した瞬間にカーソル直下にいる方を対象にする）には頼らない——重なっている場合、
        // 押した瞬間に選ばれたpetと食い違うことがあるため
        if (!moved) handleHitClick();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }

    var pinching = false;
    var didPinch = false; // この一連のタッチ操作中にピンチズームが発生したか。発生していたら指を離してもクリック扱いにしない
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
        // 大きく動いておらず、ピンチも発生していなければタップ扱いにする。
        // ブラウザが合成するclickイベントには頼らない
        if (!moved && !didPinch) handleHitClick();
        touchActive = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        document.removeEventListener('touchcancel', onTouchEnd);
      }
    }

    // これもmanagerが一括判定する。ここでは実際のタッチ開始処理のみ
    function handleHitTouchStart(e) {
      if (!touchActive) didPinch = false; // 新しいジェスチャーの開始なのでリセット
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

    // デスクトップでは純粋なCSSの:hoverでメニューの表示・非表示を切り替えるのをやめる。
    // spriteとcontrolsの間にわずかな隙間があるだけで、斜めにマウスを動かした瞬間
    // "離れた"と判定されてメニューが消え、クリックする前に消えてしまっていたため。
    // 代わりにJSで管理し、短い猶予時間を設ける：入ったら即表示、離れてもすぐには隠さず、
    // 一定時間内にspriteかcontrolsのどちらかに戻ってくれば非表示をキャンセルする。
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
      // 同じセリフを連続で言わないようにする：候補が2つ以上あるときは
      // 前回言ったセリフと違うものが出るまで抽選し直す
      if (!quotes || !quotes.length) return '';
      if (quotes.length === 1) { lastQuoteIndex = 0; return quotes[0]; }
      var idx;
      do {
        idx = Math.floor(Math.random() * quotes.length);
      } while (idx === lastQuoteIndex);
      lastQuoteIndex = idx;
      return quotes[idx];
    }
    // これもmanagerが一括判定する
    function handleHitClick() {
      if (moved) { moved = false; return; }

      if (isMultistate) {
        // specialはクリックで中断できない。自然に再生し終わるまで待つ
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
            // どちらのバッファにもまだ何も入っていないので、常態の映像をここで出す。
            // 二重バッファの仕組みがそのまま「無→有」の初回表示も受け止めてくれる
            swapMedia(character.media.relax, true, null);
          }
          startBehavior();
        }
        return;
      }
      // sprite系キャラ（jiaqiuなど）は二重バッファを使わない。従来通りの処理
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
      // manager側の「重なっている時はホットスポット中心が一番近いものを選ぶ」判定で使う
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

    // ペットが増えると重なりやすくなる。押した/タップした瞬間にどのpetに対応するかを
    // ここで一括判定する：その座標を実際にホットスポットが含んでいるpetだけを対象に、
    // その中でホットスポットの中心が一番近いものを選ぶ。DOMの重なり順（誰が一番上に
    // 描画されているか）に関係なく、常に「一番近いもの」が反応するようになる。
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
      // persist:false —— まだ触られていないデフォルトのペットはlocalStorageに書き込まない。
      // これでカスタマイズされていない限り、毎回sessionStorageベースの
      // 「リロードで再抽選／ページ遷移では維持」ロジックが効く。
      // ドラッグ・拡大縮小・追加・削除・複製などユーザーが実際に操作した瞬間に
      // 通常のsave()が走り、以降は固定される。
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
          // 横方向だけにランダムでずらす：左右どちらかをランダムに選び、距離は300~700px、
          // 縦の位置は元と同じにする
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
