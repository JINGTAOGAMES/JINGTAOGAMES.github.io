(function () {
  'use strict';

  // ===== 角色定义：跟语言无关的引擎数据（素材路径、体型、能不能动这些）=====
  // 三个语言站点这份文件应该是逐字节相同的，改动只需要改一份再原样复制到
  // source-zh/source-en/source-ja三个目录。台词、按钮文案这些语言相关的内容
  // 全部收在下面的QUOTES/UI_STRINGS里，不要往CHARACTERS里塞跟语言绑定的字段。
  // 这里放的是"全部角色"，如果以后有某个角色只在部分语言站上线，可以给它配一个
  // locales数组（比如locales:['zh']），下面会按当前LOCALE过滤成实际使用的
  // CHARACTERS；没配locales的角色（目前所有角色都是这样，包括Recoleta）默认三个
  // 语言站都会显示。
  var ALL_CHARACTERS = [
    {
      id: 'jiaqiu',
      type: 'sprite',
      idleSrc: '/img/pets/jiaqiu-idle.webm',
      clickSrc: '/img/pets/jiaqiu-click.webm',
      width: 110,
      height: 100,
      canMove: false
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
        start: '/img/pets/Exusiai_Start.webm',
        die: '/img/pets/Exusiai_Die.webm'
      }
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
        start: '/img/pets/Heavyrain_Start.webm',
        die: '/img/pets/Heavyrain_Die.webm'
      }
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
        start: '/img/pets/Irene_Start.webm',
        die: '/img/pets/Irene_Die.webm'
      }
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
        start: "/img/pets/Kal'tsit_Start.webm",
        die: "/img/pets/Kal'tsit_Die.webm"
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
        start: '/img/pets/Lancet-2_Start.webm',
        die: '/img/pets/Lancet-2_Die.webm'
      }
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
        start: "/img/pets/Wis'del_Start.webm",
        die: "/img/pets/Wis'del_Die.webm"
      }
    },
    {
      // Recoleta没有sit素材，relax后只会在move/sleep之间随机，逻辑本身已经支持这种缺省。
      // die是退场动画：删除/被清空时会先播这个再真正消失，见createPet里的requestRemove。
      // special是skill2，带一个方向性特效specialFx（打在角色当前朝向的那一侧，会自动
      // 跟着--bp-face镜像，不用单独判断朝向）；special2是skill3，触发概率更低、没有特效。
      // facesLeftByDefault：Recoleta素材本身画的就是朝左的姿势（跟其他角色素材默认朝右
      // 相反），setFacing()里会按这个标记把镜像方向反过来，不然移动和放技能会一直朝反方向。
      // 三个语言站都会显示这只宠物；目前只有中文台词（QUOTES.zh.recoleta），英文/日文
      // 台词还没配，attachQuotes()里"没配就是null"的兜底逻辑会让她在en/ja站互动时
      // 不出字幕气泡，但角色本身、动作、技能都正常，不受影响。
      // 角色本体缩小到其他方舟角色的一半（width/height从225减到112.5），技能特效
      // 的定位要保持原来的绝对大小不跟着缩——CSS尺寸是按角色框的百分比算的，框缩小
      // 一半，百分比就要翻倍才能不跟着走样，具体倍数见fxScale（等于225/112.5=2），
      // spawnSkillFx会用到它。
      // quoteBoost是专门给头顶字幕气泡调的，跟fxScale分开：光把boxH按fxScale换算回
      // 标准尺寸，字幕还是会压到头，因为Recoleta素材本身头顶留白比明日方舟那批角色少，
      // 需要再单独往上顶一截，这个数值是估的，效果不对可以再调。
      // special2Scale：skill3（普通互动之外触发概率更低的第二技能）播放时把角色本身
      // 的画面额外放大这么多倍——见swapMedia的scaleFactor参数，用CSS transform:scale
      // 实现，不影响角色框本身的尺寸/热区，播完切回其它状态会自动还原。
      // specialFxRate：skill2的方向性特效（specialFx）放慢到这个倍速播放，
      // 见spawnSkillFx，只影响这个特效本身，不影响skill2角色动画本体的播放速度。
      // specialFxDelay：skill2动作本身触发后，隔这么多毫秒才真正播放specialFx特效，
      // 让特效跟角色动作的节奏对上（比如动作前摇之后才是特效该出现的时机），
      // 见msPlaySpecial。
      id: 'recoleta',
      type: 'multistate',
      width: 112.5,
      height: 112.5,
      canMove: true,
      facesLeftByDefault: true,
      fxScale: 2,
      quoteBoost: 2.1,
      special2Scale: 1.15,
      specialFxRate: 0.8,
      specialFxDelay: 500,
      media: {
        relax: '/img/pets/Recoletaui-idle.webm',
        move: '/img/pets/Recoletaui-walk.webm',
        sleep: '/img/pets/Recoletaui-sleep.webm',
        start: '/img/pets/Recoletaui-born.webm',
        die: '/img/pets/Recoletafight-die.webm',
        interact: '/img/pets/Recoletaroom-interact.webm',
        special: '/img/pets/Recoletafight-skill2.webm',
        specialFx: '/img/pets/Recoletafight-skill2_1.webm',
        special2: '/img/pets/Recoletafight-skill3.webm'
      }
    }
  ];

  // ===== 各角色的台词，按语言分组。缺了某个角色的key就代表那个语言暂时没有台词
  // （比如英文站的凯尔希），点击时会自动跳过冒泡，不会报错。=====
  var QUOTES = {
    zh: {
      jiaqiu: [
        '君主御驾亲征。',
        '勿以知之为不知。',
        '勿以不知为知之，是知也。',
        '从鸿园的最高处望去……大观园是这样的么？呼呼，那么……我也不必再掩饰了。',
        '我将亲自展示……我是如何肃清大观园的。'
      ],
      exusiai: [
        '主啊，希望你能让老板做个长长的美梦，希望那个美梦......终有一日能成真。',
        '我再确认下，美好人世间和地狱全景房，你到底想选哪一个啊？',
        '正宗天意！',
        '叉烧苹果派！',
        '一天一苹果，一周七苹果！'
      ],
      heavyrain: [
        '嗯，我来保护博士。',
        '遵命。',
        '......我会尽力。',
        '我在。',
        '欸欸？！'
      ],
      irene: [
        '跟着我的灯光走，小心潮水和海雾。',
        '看到我的灯了吗？我在这里。',
        '我的灯将净化邪恶！',
        '我的剑将劈开海潮！',
        '我的眼将找出真相！',
        '我的心会作出判决。',
        '恐鱼？！哦，是你啊。'
      ],
      kaltsit: [
        '所幸......这并不是另一个梦。',
        '没有问题。',
        '我相信你。',
        '也许我们能够看到那个属于所有人的未来。',
        '不必频繁确认我的状态，这副躯体与常人无异。',
        '如果你的确很在意的话，我现在很好。'
      ],
      lancet2: [
        '感觉什么地方不舒服？请让我来帮你看一看吧。',
        '嗨，你好，博士。你在期待我能对你多说些什么，但我不能，毕竟我只是一台医疗机器人......',
        '医疗设备消毒，ok。电力，ok。随时可以出发。',
        '啊啊啊......'
      ],
      wisdel: [
        '美好的日子真是怎么过都过不完啊。',
        '今天又轮到谁粉身碎骨了呢？',
        '砰！是谁告诉你，我每次都会倒数的？',
        '喜欢我指甲的颜色嘛，猜猜看是用什么染的？',
        '又看到你这张脸了呢，博士，真是个好的开始。',
        '终于活腻味了？'
      ],
      // Recoleta的台词按点击结果分了三档：general是普通互动，special对应skill2
      // （释放神秘术Ⅰ），special2对应skill3（释放神秘术Ⅱ）。另外还有一句"召唤至终的
      // 仪式/在一往无前的狂热里"暂时没放进任何一档——它看起来是究极技的台词，
      // 目前没做第三个技能，先不擅自归类，等确认后再加。
      recoleta: {
        general: [
          '好极了，一场光荣、愚蠢、激动人心的即兴创作！',
          '很明显——这是发生在黑白格子间的常见隐喻！',
          '由巧合与一瞬灵光构成的天才隐喻！我该围绕这个巨大的对局写一个故事，然后投给出版社……'
        ],
        special: [
          '向你与我的窘迫效忠。',
          '以真实和荒诞之名决斗！'
        ],
        special2: [
          '从此听任美德差遣。',
          '他人的嘲笑为我授勋！'
        ]
      }
    },
    en: {
      jiaqiu: [
        'The Lord of Hongyuan marches to war.',
        'I will not pretend ignorance before understanding.',
        'Pretense of understanding may not have been a wise decision.',
        'So this is what Daguanyuan looks like from the zenith of Hongyuan, huh? Fuhu, then I suppose… I have need of this pretense no longer.',
        'I shall show you myself... How I have culled Daguanyuan.'
      ],
      exusiai: [
        'Lord, please bless the Leader with a long and wonderful dream, and let that dream... come true some day.',
        'Real estate question: this wonderful realm or a panoramic view of hell—which did you want again?',
        'Divine judgment, traditional!',
        'Apple pie, with char siu!',
        'An apple a day means seven apples a week, yay!'
      ],
      heavyrain: [
        "Yes, I'll protect the Doctor.",
        'By your command.',
        "I'll do my best.",
        "I'm here.",
        'Ehhh?!'
      ],
      irene: [
        'Follow my light. Watch out for the tides and mist.',
        "See the light of my lantern? I'm right here.",
        'My light will purge the vice!',
        'My blade will cleave the tides!',
        'My eyes will find the truth!',
        'My heart will be the judge.',
        "Sea Terror?! Oh, it's you."
      ],
      lancet2: [
        'Are you feeling unwell? I could give you a medical examination, if you wish.',
        "Hi, nice to meet you, Doctor. I understand that you want me to say something more interesting, but I'm afraid I cannot do so. Because I'm just a medical robot…",
        'Medical supplies: confirmed. Battery charge: confirmed. Ready for deployment.',
        'Ahhh...'
      ],
      wisdel: [
        'Aw. These wonderful days just never end.',
        'Whose turn is it to get blown to bits today?',
        "Boom! Who says there's always a countdown?",
        'Do you like my nails? Guess what I used to paint them.',
        "Oh joy, there's your face again, Doctor. What a great start for the day.",
        'Finally ready to die?'
      ],
      recoleta: {
        general: [
          'Bravo! A gloriously silly and thrilling act of improvisation!',
          'Oh, I see it clear as day—a metaphor seamlessly woven into the check!',
          'Ah, what a victory! And what a metaphor! I have to put quill to paper and send this off to the publishers ...'
        ],
        special: [
          'I pledge my loyalty—to you and my folly.',
          'Duel lunacy with a dream in your heart!'
        ],
        special2: [
          'Henceforth, virtue alone shall be my guide.',
          'If laughter is their weapon, then let them strike!'
        ]
      }
    },
    ja: {
      jiaqiu: [
        '君主自ら出ようじゃないか。',
        '知っていることに知らぬ振りは出来ないからな。',
        '知らぬことを知っていると言ってはならなかったか。',
        '鴻園の最も高い場所からは…大観園がこんな風に見えるんですね？ふふ、さて…うわべを取り繕うのは終わりだ。',
        '直々に見せてやろう。いかに大観園を粛清してきたかを。'
      ],
      exusiai: [
        '主よ、リーダーに長く幸せな夢を見せ給え。願わくはその夢が……いつの日か実現せんことを。',
        '念のためもっかい聞くけど、美しき人の世と地獄のパノラマビューはどっちにしたいんだっけ？',
        'ヴェルス・ディオ・ヴォーレント！',
        'チャーシュー・アップルパイ！',
        '一日一リンゴ、一週間七リンゴ！'
      ],
      heavyrain: [
        'はい、私がドクターを守ります。',
        '仰せのままに。',
        '……私、頑張ります。',
        '私はここに。',
        'ええ？！'
      ],
      irene: [
        '私の灯りに付いてきてください、潮と海霧に呑まれないように。',
        '私の灯りが見えますか？ここです。',
        '我が灯火が邪悪を払う！',
        '我が刃が海を斬り裂く！',
        '我が眼差しが真実を暴く！',
        '我が心が判決を下す。',
        '恐魚！？ああ、あなたですか。'
      ],
      kaltsit: [
        '幸いなことに……これはもう一つの夢ではなさそうだ',
        '問題ない。',
        '君を信じよう。',
        '全ての人々のための未来を我々は目にすることができるかもしれない。',
        '私の状態を頻繫に心配する必要はない、この肉体は常人と何ら変わりないのだから。',
        '君がそこまで気にするというのならない話しておくが、今の私は健康そのものだ。'
      ],
      lancet2: [
        'どこか具合でも悪いのでしょうか？よろしければ私に診させていただけませんか。',
        'こんにちは、ドクター様。私に面白いことを期待されても、特に何か話せるようなことはありません。あくまで私は、ただの医療用ロボットですから……。',
        '医療設備の消毒、完了。充電、完了。いつでも出発可能です。',
        'あわわ……。'
      ],
      wisdel: [
        '楽しい時間って、ほんとに終わらないわよねぇ。',
        'さぁ～て今日は誰が粉々になる番かしらね？',
        'パァン！毎回カウントするなんて誰が言ったのかしら？',
        'あたしのネイルの色が好きかしら？何で染めてるか当ててみたら？',
        'またあんたの顔を拝めたわね、ドクター。まったく、幸先がいいわ。',
        'そんなに死にたいの？'
      ],
      recoleta: {
        general: [
          '素晴らしい！　誇らしくて愚かな、胸が高鳴る即興創作だ！',
          'わかりきってる──これは白と黒のマスによく見られる隠喩メタファーだよ！',
          '偶然と一瞬のひらめきから構成される天才的な隠喩メタファーだね！この壮大な対決を題材に一編書いて、出版社に投稿しよう…'
        ],
        special: [
          'あなたとわたしの苦境に忠誠を誓い。',
          '真実と滑稽の名のもとに決闘を！'
        ],
        special2: [
          'これより美徳の命ずるままに。',
          '他者の嘲笑を己の功勲に替え！'
        ]
      }
    }
  };

  // ===== 控件按钮的title文案，按语言分组 =====
  var UI_STRINGS = {
    zh: {
      add: '添加一只还没有的宠物',
      del: '删除这只宠物',
      dup: '复制这只宠物',
      clear: '删除除这只以外的所有宠物'
    },
    en: {
      add: 'Add a pet you don\'t have yet',
      del: 'Remove this pet',
      dup: 'Duplicate this pet',
      clear: 'Remove every pet except this one'
    },
    ja: {
      add: 'まだいないペットを追加',
      del: 'このペットを削除',
      dup: 'このペットを複製',
      clear: 'これ以外のペットを全部削除'
    }
  };

  // 根据当前页面路径判断语言：hexo-multiple-language-generate把中文站生成在根目录，
  // 英文站在/en/下面，日文站在/ja/下面（见hexo-multiple-language.yml），
  // 所以直接看路径前缀就能判断，不用额外读配置。
  function detectLocale() {
    var path = (window.location && window.location.pathname) || '/';
    if (/^\/en(\/|$)/.test(path)) return 'en';
    if (/^\/ja(\/|$)/.test(path)) return 'ja';
    return 'zh';
  }
  var LOCALE = detectLocale();
  var STR = UI_STRINGS[LOCALE] || UI_STRINGS.zh;

  // 按当前语言过滤出这个站点实际可用的角色列表。没配locales的角色（绝大部分）
  // 三个语言站都会出现；配了locales的角色（目前只有Recoleta）只在列出的语言站生效——
  // 不会被随机抽为默认宠物、"+"按钮加不出来，findCharacter也找不到它。
  var CHARACTERS = ALL_CHARACTERS.filter(function (c) {
    return !c.locales || c.locales.indexOf(LOCALE) > -1;
  });

  // 把当前语言对应的台词表塞回CHARACTERS上。找不到台词的角色（比如英文站还没配
  // 台词的凯尔希）拿到的是null，后面所有用到character.quotes的地方本来就有
  // "没有就跳过"的判断，不需要额外处理。
  // 台词表里每个角色可以是两种形状：
  //   1) 纯数组——老格式，不管点击后触发的是普通互动还是技能，都从这一个池子里抽。
  //   2) {general, special, special2}——新格式，按点击结果分开抽，没配的档位会自动
  //      落回general（见handleHitClick里的pickQuotePool）。
  (function attachQuotes() {
    var table = QUOTES[LOCALE] || QUOTES.zh;
    for (var i = 0; i < CHARACTERS.length; i++) {
      var entry = table[CHARACTERS[i].id] || null;
      if (entry && !Array.isArray(entry)) {
        CHARACTERS[i].quotes = entry.general || null;
        CHARACTERS[i].specialQuotes = entry.special || null;
        CHARACTERS[i].special2Quotes = entry.special2 || null;
      } else {
        CHARACTERS[i].quotes = entry;
      }
    }
  })();

  var MIN_SCALE = 0.5, MAX_SCALE = 4, SCALE_STEP = 0.1;
  var DRAG_THRESHOLD = 5;
  var PETS_KEY = 'blogPetInstances';
  var MAX_SAVED_PETS = 10;
  var DEFAULT_SESSION_KEY = 'blogPetDefaultState';
  // 拖拽范围基本不设限，允许拖出屏幕、拖到网页边界外一点点，只留这么多像素卡在
  // 视口边缘，保证角色不会完全消失、之后还能重新抓回来。
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
      '.bp-media-buffered{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;opacity:0;transition:opacity .2s ease;transform-origin:50% 100%;}',
      '.bp-media-buffered.bp-media-active{opacity:1;}',
      '.bp-skill-fx{position:absolute;left:100%;top:-37.5%;width:175%;height:175%;object-fit:contain;pointer-events:none;}',
      '.bp-skill-fx-left{left:auto;right:100%;}',
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

    // jiaqiu这类sprite角色只有idle/click两种素材，逻辑简单，直接沿用原来单video换src的方式，
    // 不用双缓冲——之前调过的点击动画偏移/缩放是针对这个单video结构调的，双缓冲会导致
    // 交叉淡入淡出期间旧素材短暂也命中同一套变换样式，位置就跟着乱了。
    // 双缓冲只用在multistate角色（exusiai等一堆有很多动作的角色）上。
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
      // 双缓冲：两个video叠在一起，谁是"当前显示"由activeMedia/inactiveMedia记录，
      // 换动作时把新素材加载到闲置的那个上面，等它真的能播放了才淡入换上来，
      // 播放中的画面全程不间断，不会像单video换src那样黑屏闪一下。
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

    // 明日方舟这批角色的素材是带留白的正方形画布，角色本体只占中间一小块；jiaqiu的素材
    // 角色本体偏在左上方。拖拽/点击/滚轮缩放的判定都改成只认各自这块小热区，角色周围的
    // 空气背景不会再被当成点在了角色身上（点在那些地方不会有任何反应）。这几个热区的
    // 大小/位置是估个大概比例，如果偏差比较明显，之后可以再单独调整。
    var hitTarget = sprite;
    if (isMultistate || isSprite) {
      hitTarget = document.createElement('div');
      hitTarget.className = isMultistate ? 'bp-hitbox' : 'bp-hitbox-jiaqiu';
      // 挂在visual下面而不是sprite下面：visual才是真正被--bp-scale这个transform缩放的
      // 那一层，热区跟着放在它里面，滚轮/双指缩放的时候热区会跟着角色一起放大缩小，
      // 不会再固定钉在原来的大小和位置上。
      visual.appendChild(hitTarget);

      // 热区之外的空白区域现在没有绑任何拖拽/点击逻辑了，但如果完全不处理这里的
      // mousedown/dragstart，浏览器会把这块区域当成普通网页内容，出现原生的文字选取
      // 高亮框，或者把里面的视频当图片一样拖出重影。这里单独拦一层，只吃掉默认行为，
      // 不做任何实际的拖拽/点击逻辑（真正的逻辑都在hitTarget上）。
      sprite.addEventListener('mousedown', function (e) { e.preventDefault(); });
      sprite.addEventListener('dragstart', function (e) { e.preventDefault(); });
    }

    // 放大倍数越高，角色画面里头顶以上的空白区域也跟着等比例放大，如果字幕完全按
    // boxH*scale来定位，放大后就会跟角色本体越离越远。这里只让字幕跟着scale涨一半的幅度，
    // 放大后字幕会明显比原来更靠近角色一些。
    function quoteBottom() {
      // 只有明日方舟这批multistate角色头顶留白比较多，才需要给字幕的涨幅打折扣；
      // jiaqiu没有这个问题，还是用原来的boxH*scale
      var quoteScale = isMultistate ? (1 + (scale - 1) * 0.4) : scale;
      // 这个公式本来是按boxH=225这个"标准尺寸"、以及明日方舟角色素材头顶留白的比例
      // 调出来的。像Recoleta这种把boxH主动缩小了的角色（缩小到112.5），如果还是直接
      // 乘boxH，算出来的偏移量会跟着等比缩小；但字幕本身字号、内边距都是固定像素，
      // 不会跟着缩小，放大倍数一高就会相对显得偏低、盖到头。这里用quoteBoost把boxH
      // 换算回一个更合适的参考尺寸——单独给字幕定制、不跟fxScale（特效缩放用的倍数）
      // 混用，因为Recoleta素材本身头顶留白就比明日方舟那批角色少，光把boxH换算回
      // 标准尺寸（等于fxScale）还是不够，需要单独再调大一些。没配quoteBoost的角色
      // 直接落回fxScale，没配fxScale的落回1，行为不变。
      var boxCompensation = character.quoteBoost || character.fxScale || 1;
      return (boxH * boxCompensation * quoteScale + 8) + 'px';
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
    btnAdd.title = STR.add;
    var btnDel = document.createElement('div');
    btnDel.className = 'bp-ctrl-btn';
    btnDel.textContent = '−';
    btnDel.title = STR.del;
    var btnDup = document.createElement('div');
    btnDup.className = 'bp-ctrl-btn';
    btnDup.textContent = '⧉';
    btnDup.title = STR.dup;
    var btnClear = document.createElement('div');
    btnClear.className = 'bp-ctrl-btn';
    btnClear.textContent = '×';
    btnClear.title = STR.clear;
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

    // sprite角色的idle视频这里就直接播放（跟原来一样）；multistate的双缓冲还没素材，
    // 真正的播放从下面的playEntranceThenStart()/swapMedia()开始
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
      // 正常情况下minXxxBound()本来就该小于等于maxXxxBound()；但角色本身比视口还大
      // （放大倍数很高、或者视口本身比较小）的时候，这两个理论边界会反过来。这时候不管
      // 谁大谁小，直接把它们当成一个区间的两端（小的当下限、大的当上限），保证永远有
      // 一段真实可以拖动的范围，不会被钉死在同一个点上出不来。
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
      if (dying) return;
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
    // 退场动画播放期间不响应任何拖拽/点击/缩放，避免动画播到一半又被重新互动打断
    var dying = false;
    var mediaSwapTimer = null;
    var specialFxTimer = null;

    // scaleFactor可选：给这次要切进来的画面临时加一个CSS transform:scale（比如某个
    // 技能播放时想让角色本体看起来更大一点），不传或传1就是正常大小。因为每次调用
    // swapMedia都会显式设置incoming的transform（没有就清空成''），mediaA/mediaB
    // 两个video轮流复用时不会把上一次的放大效果遗留到下一个状态上，自动就会还原。
    function swapMedia(src, loop, onEnded, scaleFactor) {
      if (!activeMedia || !inactiveMedia) return;
      var incoming = inactiveMedia;
      var outgoing = activeMedia;
      incoming.onended = null;
      incoming.loop = !!loop;
      incoming.src = src;
      incoming.style.transform = (scaleFactor && scaleFactor !== 1) ? ('scale(' + scaleFactor + ')') : '';
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

    function msSetMedia(src, loop, onEnded, scaleFactor) {
      swapMedia(src, loop, onEnded, scaleFactor);
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
      var duration = 6000 + Math.random() * 174000;
      msTimer = setTimeout(function () { msEnterRelax(); }, duration);
    }

    function msResumeSleep() {
      msState = 'sleep';
      msSetMedia(character.media.sleep, true);
      clearTimeout(msTimer);
      var duration = 6000 + Math.random() * 174000;
      msTimer = setTimeout(function () { msEnterRelax(); }, duration);
    }

    function msEnterSit() {
      msState = 'sit';
      msSetMedia(character.media.sit, true);
      clearTimeout(msTimer);
      var duration = 6000 + Math.random() * 174000;
      msTimer = setTimeout(function () { msEnterRelax(); }, duration);
    }

    function msResumeSit() {
      msState = 'sit';
      msSetMedia(character.media.sit, true);
      clearTimeout(msTimer);
      var duration = 6000 + Math.random() * 174000;
      msTimer = setTimeout(function () { msEnterRelax(); }, duration);
    }

    function msPlayInteract(onDone) {
      msState = 'interact';
      clearTimeout(msTimer);
      if (moveRafId) cancelAnimationFrame(moveRafId);
      msSetMedia(character.media.interact, false, onDone);
    }

    // 技能特效：贴在visual下面，摆在角色"未镜像时朝向的那一侧"，角色转向时靠visual
    // 自带的--bp-face镜像整体带过去，不用在这里单独判断当前朝向。
    // 但"未镜像时朝向哪一侧"跟角色素材本身的默认朝向有关：普通角色素材默认朝右，
    // 所以特效默认锚在右侧（.bp-skill-fx的left:100%）；Recoleta这类facesLeftByDefault
    // 的角色素材默认朝左，特效就需要用.bp-skill-fx-left锚在左侧，不然镜像后方向会反。
    // 特效素材本身没有循环，播完/兜底超时就把这个临时video元素摘掉。
    function spawnSkillFx(fxSrc) {
      var fx = document.createElement('video');
      fx.className = 'bp-skill-fx' + (character.facesLeftByDefault ? ' bp-skill-fx-left' : '');
      // fxScale：特效的CSS尺寸是相对角色框的百分比，角色框如果被特意缩小了（比如
      // Recoleta缩到了一半），特效会跟着等比缩小。fxScale用来抵消这个效果，让特效
      // 保持它"设计时"的绝对大小，不随角色框缩放走样。数值等于"角色框缩小前/缩小后"
      // 的倍数，没配就是1（不用特殊处理，直接吃CSS里.bp-skill-fx的默认175%/-37.5%）。
      var FX_BASE_PERCENT = 175;
      var fxScale = character.fxScale || 1;
      if (fxScale !== 1) {
        var fxPercent = FX_BASE_PERCENT * fxScale;
        fx.style.width = fxPercent + '%';
        fx.style.height = fxPercent + '%';
        fx.style.top = (50 - fxPercent / 2) + '%';
      }
      fx.muted = true;
      fx.playsInline = true;
      fx.setAttribute('playsinline', '');
      fx.setAttribute('muted', '');
      fx.loop = false;
      fx.src = fxSrc;
      // specialFxRate：特效的播放速度倍率，没配就是1（正常速度）。小于1会放慢播放，
      // 实际播完的时间也会跟着变长，所以下面的兜底清理超时要按同样的倍率放宽，
      // 不然放慢后的特效可能还没播完就被兜底逻辑提前摘掉了。
      var fxRate = character.specialFxRate || 1;
      fx.playbackRate = fxRate;
      visual.appendChild(fx);
      fx.play().catch(function () {});
      var cleaned = false;
      function cleanup() {
        if (cleaned) return;
        cleaned = true;
        if (fx.parentNode) fx.parentNode.removeChild(fx);
      }
      fx.onended = cleanup;
      setTimeout(cleanup, 3000 / fxRate);
    }

    function msPlaySpecial(onDone) {
      msState = 'special';
      clearTimeout(msTimer);
      if (moveRafId) cancelAnimationFrame(moveRafId);
      if (character.media.specialFx) {
        // specialFxDelay：不是一点进技能就立刻放特效，等这么多毫秒再放，跟角色动作
        // 本身的节奏对上（没配就是0，跟以前一样立即播放）。用定时器延后触发，所以
        // 要留意这段时间内角色可能被拖走/删除/切到别的状态——真正触发前重新检查一遍
        // destroyed和msState，避免特效凭空冒出来或者操作已经销毁的DOM。
        clearTimeout(specialFxTimer);
        specialFxTimer = setTimeout(function () {
          if (destroyed || msState !== 'special') return;
          spawnSkillFx(character.media.specialFx);
        }, character.specialFxDelay || 0);
      }
      msSetMedia(character.media.special, false, onDone);
    }

    // 第二个技能：跟special共用"点击不能打断"的规则（同样把msState设成'special'），
    // 但触发概率更低，也没有专属特效。character.special2Scale可选，配了的话播放期间
    // 会把画面整体放大这么多倍（比如Recoleta配的1.5，即150%），播完切回其它状态时
    // swapMedia会自动把transform清空还原，不用额外收尾。
    function msPlaySpecial2(onDone) {
      msState = 'special';
      clearTimeout(msTimer);
      if (moveRafId) cancelAnimationFrame(moveRafId);
      msSetMedia(character.media.special2, false, onDone, character.special2Scale);
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

    // 具体这次按下该由哪只pet响应，交给manager在容器上统一判断（角色多了容易重叠，
    // 判断规则见manager里的"离热区中心最近的那只"逻辑），这里只负责真正开始拖拽之后
    // 的处理，manager找到目标后会调用这个函数。
    function handleHitMouseDown(e) {
      if (dying) return;
      e.preventDefault();
      dragStart(e.clientX, e.clientY);
      function onMove(ev) { dragMove(ev.clientX, ev.clientY); }
      function onUp() {
        dragEnd();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        // 松开时如果全程没怎么移动，就当成一次点击处理——直接判断这次按下的同一只pet，
        // 不依赖浏览器原生click事件（原生click是松开时鼠标下面正对着哪只就算哪只，
        // 跟重叠判断的"按下时选中的是哪只"可能对不上，容易点错）
        if (!moved) handleHitClick();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }

    var pinching = false;
    var didPinch = false; // 这次触摸手势里有没有出现过双指缩放，出现过的话松开时就不算点击
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
        // 松开时如果全程没有明显移动、也没有出现过双指缩放，就当成一次点击（tap）处理，
        // 直接判断这次触摸开始时选中的同一只pet，不依赖浏览器合成的click事件
        if (!moved && !didPinch) handleHitClick();
        touchActive = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        document.removeEventListener('touchcancel', onTouchEnd);
      }
    }

    // 同样交给manager统一判断由哪只pet响应，这里只负责实际的触摸开始逻辑
    function handleHitTouchStart(e) {
      if (dying) return;
      if (!touchActive) didPinch = false; // 新的一轮触摸手势开始，重置标记
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
    // 同样交给manager统一判断由哪只pet响应
    function handleHitClick() {
      if (dying) return;
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
        // 先判小概率的第二技能，没抽中再判第一技能，都没抽中就是普通互动。
        // 两次独立判定，概率是估的，之后可以再调。先定下这次点击的结果，再根据结果
        // 挑对应的台词池——这样像Recoleta这种配了技能专属台词的角色，放技能时喊的
        // 就是技能台词而不是随便一句日常互动词。
        var outcome = 'interact';
        if (character.media.special2 && Math.random() < 0.08) {
          outcome = 'special2';
        } else if (character.media.special && Math.random() < 0.3) {
          outcome = 'special';
        }
        var quotePool = character.quotes;
        if (outcome === 'special' && character.specialQuotes && character.specialQuotes.length) {
          quotePool = character.specialQuotes;
        } else if (outcome === 'special2' && character.special2Quotes && character.special2Quotes.length) {
          quotePool = character.special2Quotes;
        }
        if (quotePool && quotePool.length) {
          var msLine = pickQuote(quotePool);
          quote.textContent = msLine;
          quote.classList.add('show');
          clearTimeout(quoteTimer);
          quoteTimer = setTimeout(function () {
            quote.classList.remove('show');
          }, 2600);
        }
        if (outcome === 'special2') {
          msPlaySpecial2(msResumeAfterClick);
        } else if (outcome === 'special') {
          msPlaySpecial(msResumeAfterClick);
        } else {
          msPlayInteract(msResumeAfterClick);
        }
        return;
      }

      if (character.quotes && character.quotes.length) {
        var line = pickQuote(character.quotes);
        quote.textContent = line;
        quote.classList.add('show');
        clearTimeout(quoteTimer);
        quoteTimer = setTimeout(function () {
          quote.classList.remove('show');
        }, 2600);
      }

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

    // faceLeft表示"这次希望角色视觉上朝左"。默认素材是朝右的，所以朝左需要镜像（-1）；
    // 但Recoleta这类facesLeftByDefault的角色素材本身就画的朝左，这时候反而是"朝右"才
    // 需要镜像，直接把faceLeft取反再套用同一套逻辑即可。
    function setFacing(faceLeft) {
      var needMirror = character.facesLeftByDefault ? !faceLeft : faceLeft;
      visual.style.setProperty('--bp-face', needMirror ? -1 : 1);
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
        } else if (!dragging && !dying && msState !== 'interact' && msState !== 'special') {
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
            // 两个video刚创建时都还没有素材，这里把常态画面摆上去，
            // 双缓冲本身就能兜住这次"从无到有"的展示
            swapMedia(character.media.relax, true, null);
          }
          startBehavior();
        }
        return;
      }
      // sprite角色（比如jiaqiu）不用双缓冲，跟原来一样直接处理
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
      clearTimeout(specialFxTimer);
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

    // 删除这只/清空其它宠物的时候统一走这里，而不是直接调destroy()：如果这个角色配了
    // die退场动画（character.media.die），先播完退场动画再真正销毁；没配的角色
    // （目前大部分明日方舟角色、jiaqiu）保持原来的行为，直接销毁，不受影响。
    function requestRemove(onDone) {
      if (destroyed) return;
      if (isMultistate && character.media.die) {
        dying = true;
        clearTimeout(msTimer);
        if (moveRafId) cancelAnimationFrame(moveRafId);
        swapMedia(character.media.die, false, function () {
          destroy();
          if (onDone) onDone();
        });
      } else {
        destroy();
        if (onDone) onDone();
      }
    }

    return {
      getState: function () { return { left: left, top: top, scale: scale }; },
      destroy: destroy,
      requestRemove: requestRemove,
      // 下面几个是给manager统一做"重叠时选离热区中心最近的那只"判断用的
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

    // pet多了容易叠在一起，鼠标/触摸按下的时候具体算按到了哪一只，统一在这里判断：
    // 只看热区确实包含了这个坐标点的那些pet，在它们里面选热区中心离落点最近的一个。
    // 这样不管DOM层叠顺序（谁盖着谁）是什么样，永远是"离得最近的那只"响应，而不是
    // "占了这个位置最上面的那只"。
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

    // 有的角色配了退场动画（requestRemove内部会自己判断），播完才会真正调用handle.destroy()，
    // 所以这里不能像以前一样同步splice——用removing标记防止同一只在动画播完前被重复触发，
    // 实际的splice/save都挪到requestRemove的回调里，等真正销毁了再做。
    removeByUid: function (uid) {
      var self = this;
      for (var i = 0; i < this.instances.length; i++) {
        var inst = this.instances[i];
        if (inst.uid === uid) {
          if (inst.removing) return;
          inst.removing = true;
          inst.handle.requestRemove(function () {
            var idx = self.instances.indexOf(inst);
            if (idx > -1) self.instances.splice(idx, 1);
            if (self.instances.length === 0) {
              self.spawnDefault();
            } else {
              self.save();
            }
          });
          break;
        }
      }
    },

    removeAllExcept: function (uid) {
      var self = this;
      // 每个要删的实例单独包一层函数来接收inst参数，不然多个inst会共享同一个var绑定，
      // 等退场动画各自播完再回调的时候，全部都会指向循环结束后的最后一个inst。
      function scheduleRemoval(inst) {
        inst.removing = true;
        inst.handle.requestRemove(function () {
          var idx = self.instances.indexOf(inst);
          if (idx > -1) self.instances.splice(idx, 1);
          self.save();
        });
      }
      // 先把要删的实例整体过滤成一份独立快照，再逐个调用requestRemove——不能直接
      // 一边遍历this.instances一边触发删除，因为没有die动画的角色会在requestRemove里
      // 同步splice掉this.instances，遍历下标会因此错位，导致连续两只没有退场动画的
      // 宠物只删掉其中一只（另一只被跳过）。用快照数组遍历就不受这个影响。
      var toRemove = this.instances.filter(function (inst) {
        return inst.uid !== uid && !inst.removing;
      });
      toRemove.forEach(scheduleRemoval);
    },

    duplicate: function (uid) {
      for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].uid === uid) {
          var src = this.instances[i].handle.getState();
          // 只在横向上随机落点：左右随机挑一边，距离300~700px，纵坐标跟原来的一样
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
