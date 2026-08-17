/* ============================================================
 * 面具之下 · Beneath the Mask
 * 数据层：玩家档案（localStorage 持久化）+ 四关数据
 * ============================================================ */

const PROFILE_KEY = 'mask_dual_face_profile';

const COMMON_STAGES = [
  { id: 'S0', name: 'INIT', label: '委托接收' },
  { id: 'S1', name: 'SCAN', label: '线索扫描' },
  { id: 'S2', name: 'ASSEMBLE', label: '正面拼接' },
  { id: 'S3', name: 'FLIP', label: '翻转推断' },
  { id: 'S4', name: 'RITUAL', label: '情境重现' },
  { id: 'S5', name: 'REVIEW', label: '复盘结算' }
];

const CANCUN = {
  id: 'cancun', name: '蚕丛', title: '古蜀祭司', role: 'AI导师',
  personality: '古朴、中立、不评判、引导式'
};

const CULTURE_NOTE = '三星堆文化启发的教育性艺术想象，并非历史人物或事件复原';

const Data = {
  defaultProfile() {
    return {
      playerId: 'local_player', playerName: '修复师', currentLevel: 1,
      totalMasks: 0, completedLevels: [],
      abilityScores: {
        jointAttention: 50, emotionRecog: 50, theoryOfMind: 50,
        contextUnderstand: 50, scaffoldingLevel: 1
      },
      sensorySettings: {
        simplifyAnim: false, muteSound: false, highContrast: false,
        noTimeLimit: true, textPriority: true, voiceRead: false
      }
    };
  },

  loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const p = this.defaultProfile();
        const legacyCompleted = Number(saved.totalMasks) > 0 ? ['L01_authority'] : [];
        const completedLevels = Array.isArray(saved.completedLevels)
          ? [...new Set(saved.completedLevels.filter(id => this.LEVEL_ORDER.includes(id)))]
          : legacyCompleted;
        const merged = {
          ...p, ...saved, completedLevels,
          abilityScores: { ...p.abilityScores, ...saved.abilityScores },
          sensorySettings: { ...p.sensorySettings, ...saved.sensorySettings }
        };
        merged.totalMasks = completedLevels.length;
        merged.currentLevel = Math.max(1, Math.min(4, completedLevels.length + 1));
        return merged;
      }
    } catch (e) { /* 忽略解析错误 */ }
    return this.defaultProfile();
  },

  saveProfile(profile) {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch (e) { /* 存储失败忽略 */ }
  },

  LEVEL_L01: {
    levelId: 'L01_authority', levelName: '威严面具', levelTitle: '第一关 · 祭祀之威',
    theme: 'authority', trainingLabel: '心智理论 / 情绪识别', cultureTag: CULTURE_NOTE,
    targetAbility: 'theoryOfMind', difficulty: 1, unlockCondition: 'default',
    estimatedTime: 240, prerequisite: null,
    visual: {
      frontImage: 'assets/sanxingdui-guardian.png', backImage: 'assets/sanxingdui-unmasked-face-final.png',
      ritualImage: 'assets/sanxingdui-unmasked-face-final.png', lobbyImage: 'assets/sanxingdui-head.png',
      alt: '威严面具佩戴者'
    },
    characters: {
      cancun: CANCUN,
      wearer: { id: 'wearer', name: '古蜀国王', title: '面具佩戴者', personality: '威严外表下藏着疲惫与责任' }
    },
    stages: COMMON_STAGES,
    initDialogue: [
      { speaker: 'cancun', text: '修复师，你来了。' },
      { speaker: 'cancun', text: '这面「威严面具」在祭祀大典上碎裂了。' },
      { speaker: 'cancun', text: '它的佩戴者看起来严厉，背面却藏着无人知晓的心事。' },
      { speaker: 'cancun', text: '请修复它，再判断这份威严究竟意味着什么。' }
    ],
    scanConfig: {
      totalFragments: 4, eyeMoveInterval: 3000, idleHintAfter: 60000, revealTargetName: true,
      fragments: [
        { id: 'f_eyebrow', name: '眉部碎片', emotionCue: '压低', targetOrder: 2 },
        { id: 'f_eye', name: '眼部碎片', emotionCue: '凝视', targetOrder: 1 },
        { id: 'f_nose', name: '鼻部碎片', emotionCue: '挺立', targetOrder: 3 },
        { id: 'f_mouth', name: '口部碎片', emotionCue: '紧绷', targetOrder: 4 }
      ]
    },
    assembleConfig: {
      guidedOrder: true,
      slots: [
        { id: 'slot_eyebrow', fragment: 'f_eyebrow', label: '眉', emotion: '压低' },
        { id: 'slot_eye', fragment: 'f_eye', label: '眼', emotion: '凝视' },
        { id: 'slot_nose', fragment: 'f_nose', label: '鼻', emotion: '挺立' },
        { id: 'slot_mouth', fragment: 'f_mouth', label: '口', emotion: '紧绷' }
      ],
      errorThreshold: 3, idleHintAfter: 60000,
      summary: {
        title: '威严面具 · 复原', equationLabel: '威严',
        description: '眉压如峰，目凝如渊，唇紧如锁——表面传来的是不容动摇的威严。'
      }
    },
    flipConfig: {
      monologueSpeaker: '古蜀国王的内心',
      monologue: [
        { text: '我其实很累。', emotion: '疲惫' },
        { text: '昨夜的事务还未处理完，我的头仍隐隐作痛。', emotion: '痛苦' },
        { text: '但仪式之上，我不能先乱了阵脚。', emotion: '克制' },
        { text: '大家在看，我要让他们安心。', emotion: '责任' },
        { text: '这份威严，是我暂时举起的盾。', emotion: '保护' }
      ],
      question: {
        text: '他为什么要戴上「威严面具」？',
        options: [
          { id: 'l1_surface', text: '因为他一直很生气', feedback: '他轻轻摇头：「生气只是你先看到的可能。」', isCorrect: false },
          { id: 'l1_social', text: '他想稳住自己，也让众人安心', feedback: '他颔首：「你懂了。我的严肃，是责任，也是保护。」', isCorrect: true },
          { id: 'l1_like', text: '因为他喜欢显得可怕', feedback: '青铜沉重，他并不享受让别人害怕。', isCorrect: false }
        ],
        maxAttempts: 2
      },
      successGuide: '你已经看见双面的含义：表面的严肃，也可能是在承担责任、保护他人。',
      retryGuide: '这是一种可能。再想想：他说自己「必须撑住」，这句话透露了什么？',
      exhaustedGuide: '表情给了我们线索，却不能单独证明内心。继续看看不同情境吧。',
      finalInsight: {
        mark: '双面之见', title: '严肃，不等于生气',
        body: '有时，严肃是人在责任面前戴上的一层保护。真正的理解，不是急着判断，而是看见表情背后的处境。'
      }
    },
    ritualConfig: {
      scenes: [
        { id: 'scene_court', title: '众人面前', subtitle: '他挺直身体，让仪式不乱', mask: 'bronze', duration: 3000 },
        { id: 'scene_family', title: '亲近之人面前', subtitle: '他终于承认自己很累', mask: 'none', duration: 3000 },
        { id: 'scene_alone', title: '独处深夜', subtitle: '严肃褪去，只剩需要休息的人', mask: 'none', duration: 3000 }
      ],
      question: {
        text: '哪些因素会改变我们对同一表情的理解？（可多选）',
        options: [
          { id: 'l1_context', text: '他正处在什么情境中', isCorrect: true },
          { id: 'l1_words', text: '他说了什么、经历了什么', isCorrect: true },
          { id: 'l1_magic', text: '面具会自动告诉我们唯一答案', isCorrect: false }
        ],
        correctPattern: ['l1_context', 'l1_words'], requireExact: false
      },
      successToast: '很好。表情要和情境、话语一起理解。',
      successGuide: '同一份严肃，在仪式中可能是责任，在安全的地方也可以被疲惫取代。',
      retryGuide: '面具不会给出唯一答案。试着把表情和处境、话语放在一起看。'
    },
    review: {
      knowledge: '【黄金法则】表情是信号，不是真相。\n先观察，再询问；先理解处境，再下判断。',
      cancunNote: '你第一次看见了表情的双面。下一面具，会考验你对“盯视”的理解。',
      nextLevel: '第二关 · 纵目守望',
      practiceQuestions: ['他在众人面前为什么显得严肃？', '严肃除了生气，还可能表达什么？', '当你不确定别人的感受时，可以怎样温和地询问？']
    }
  },

  LEVEL_L02: {
    levelId: 'L02_watch', levelName: '纵目面具', levelTitle: '第二关 · 纵目守望',
    theme: 'watch', trainingLabel: '共同注意 / 情境推断', cultureTag: CULTURE_NOTE,
    targetAbility: 'contextUnderstand', difficulty: 2, unlockCondition: 'complete:L01_authority',
    estimatedTime: 300, prerequisite: 'L01_authority',
    visual: {
      frontImage: 'assets/sanxingdui-watch-mask-v1.png', backImage: 'assets/sanxingdui-unmasked-face-v4.png',
      ritualImage: 'assets/sanxingdui-unmasked-face-v4.png', lobbyImage: 'assets/sanxingdui-watch-mask-v1.png',
      alt: '纵目面具守望者'
    },
    characters: {
      cancun: CANCUN,
      wearer: { id: 'wearer', name: '古蜀守望者', title: '夜巡守护者', personality: '目光锐利，内心警觉并牵挂村落' }
    },
    stages: COMMON_STAGES,
    initDialogue: [
      { speaker: 'cancun', text: '第二面，是目光伸向远方的「纵目面具」。' },
      { speaker: 'cancun', text: '守望者一直盯着村口，孩子们以为他在怀疑所有人。' },
      { speaker: 'cancun', text: '可昨夜山谷传来异响，他一刻也不敢移开视线。' },
      { speaker: 'cancun', text: '修复这双眼睛，看看盯视背后还有什么可能。' }
    ],
    scanConfig: {
      totalFragments: 4, eyeMoveInterval: 2600, idleHintAfter: 50000, revealTargetName: true,
      fragments: [
        { id: 'f_eyebrow', name: '高挑眉片', emotionCue: '警觉', targetOrder: 3 },
        { id: 'f_eye', name: '纵目眼片', emotionCue: '远望', targetOrder: 1 },
        { id: 'f_nose', name: '中轴鼻片', emotionCue: '专注', targetOrder: 4 },
        { id: 'f_mouth', name: '闭口碎片', emotionCue: '克制', targetOrder: 2 }
      ]
    },
    assembleConfig: {
      guidedOrder: true,
      slots: [
        { id: 'slot_eyebrow', fragment: 'f_eyebrow', label: '眉', emotion: '警觉' },
        { id: 'slot_eye', fragment: 'f_eye', label: '眼', emotion: '远望' },
        { id: 'slot_nose', fragment: 'f_nose', label: '鼻', emotion: '专注' },
        { id: 'slot_mouth', fragment: 'f_mouth', label: '口', emotion: '克制' }
      ],
      errorThreshold: 4, idleHintAfter: 50000,
      summary: {
        title: '纵目面具 · 复原', equationLabel: '守望',
        description: '眉梢扬起，双眼远伸，嘴唇收紧——这份目光像怀疑，也像不肯松懈的守护。'
      }
    },
    flipConfig: {
      monologueSpeaker: '守望者的内心',
      monologue: [
        { text: '他们说我总盯着别人，让人不自在。', emotion: '被误解' },
        { text: '可山谷的风声变了，我怕危险突然靠近。', emotion: '担忧' },
        { text: '只要我先看见，大家就能早一点躲避。', emotion: '警觉' },
        { text: '我的目光不是审问，是一道瞭望的门。', emotion: '守护' }
      ],
      question: {
        text: '守望者一直盯着村口，最可能是为什么？',
        options: [
          { id: 'l2_distrust', text: '他不信任每一个经过的人', feedback: '怀疑是一种可能，但还没有结合昨夜的异响。', isCorrect: false },
          { id: 'l2_angry', text: '他在生路人的气', feedback: '锐利的目光像生气，却不等于正在生气。', isCorrect: false },
          { id: 'l2_protect', text: '他担心危险，想尽早保护大家', feedback: '守望者松了口气：「你看见了目光里的担忧和责任。」', isCorrect: true },
          { id: 'l2_showoff', text: '他想展示自己的眼睛最特别', feedback: '特别的外形并不能解释他为何整夜不休息。', isCorrect: false }
        ],
        maxAttempts: 2
      },
      successGuide: '盯视会令人紧张，但它也可能来自警觉、专注或保护。还要结合发生了什么。',
      retryGuide: '留意“山谷异响”和“整夜守着”这两条线索，它们说明了什么？',
      exhaustedGuide: '只看目光很容易误判。继续观察他的目光在不同情境中怎样变化。',
      finalInsight: {
        mark: '守望之见', title: '盯着，不一定是不信任',
        body: '锐利的目光可能让人不安，也可能是在寻找危险、集中注意或保护同伴。感受不舒服时，可以表达感受，也可以先问清原因。'
      }
    },
    ritualConfig: {
      scenes: [
        { id: 'scene_gate', title: '村口守夜', subtitle: '目光锐利，寻找远处异常', mask: 'bronze', duration: 3000 },
        { id: 'scene_child', title: '孩子靠近', subtitle: '他放低视线，提醒孩子回屋', mask: 'none', duration: 3000 },
        { id: 'scene_safe', title: '警报解除', subtitle: '肩膀放松，目光终于离开远方', mask: 'none', duration: 3000 }
      ],
      question: {
        text: '哪些线索支持“他的盯视是在保护”？（精确选择）',
        options: [
          { id: 'l2_night', text: '异响后整夜守在村口', isCorrect: true },
          { id: 'l2_warn', text: '提醒孩子先回到安全处', isCorrect: true },
          { id: 'l2_eyes', text: '他的眼睛外形很突出', isCorrect: false },
          { id: 'l2_feel', text: '有人看到他时觉得紧张', isCorrect: false }
        ],
        correctPattern: ['l2_night', 'l2_warn'], requireExact: true
      },
      successToast: '判断准确：你用行为和情境验证了推测。',
      successGuide: '我们用持续守夜和提醒孩子这些行为线索来验证判断，而不是只看外形。',
      retryGuide: '请选能说明他“做了什么”的证据，而不是外形或旁人的第一感受。'
    },
    review: {
      knowledge: '【证据法则】感受值得尊重，判断需要证据。\n目光令人不安时，可以拉开距离、表达感受，再观察情境与行为。',
      cancunNote: '你学会了用行为验证对表情的猜测。下一关，微笑会比严肃更难读。',
      nextLevel: '第三关 · 含笑之勇',
      practiceQuestions: ['盯视可能让别人有什么感受？', '哪些行为能说明守望者是在保护大家？', '如果被人盯得不舒服，你可以怎样安全地表达？']
    }
  },

  LEVEL_L03: {
    levelId: 'L03_smile', levelName: '含笑面具', levelTitle: '第三关 · 含笑之勇',
    theme: 'smile', trainingLabel: '情绪分层 / 社会意图', cultureTag: CULTURE_NOTE,
    targetAbility: 'emotionRecog', difficulty: 3, unlockCondition: 'complete:L02_watch',
    estimatedTime: 330, prerequisite: 'L02_watch',
    visual: {
      frontImage: 'assets/sanxingdui-smile-mask-v1.png', backImage: 'assets/sanxingdui-unmasked-face-v3.png',
      ritualImage: 'assets/sanxingdui-unmasked-face-v3.png', lobbyImage: 'assets/sanxingdui-smile-mask-v1.png',
      alt: '含笑面具舞者'
    },
    characters: {
      cancun: CANCUN,
      wearer: { id: 'wearer', name: '古蜀舞者', title: '仪式领舞者', personality: '笑意温和，内心紧张却愿意鼓励同伴' }
    },
    stages: COMMON_STAGES,
    initDialogue: [
      { speaker: 'cancun', text: '第三面面具，嘴角带着一丝笑。' },
      { speaker: 'cancun', text: '大家都说领舞者一定很开心，因为她从未停止微笑。' },
      { speaker: 'cancun', text: '可鼓声越近，她握着衣角的手越紧。' },
      { speaker: 'cancun', text: '这一次，不要只追随最显眼的表情。' }
    ],
    scanConfig: {
      totalFragments: 4, eyeMoveInterval: 2300, idleHintAfter: 45000, revealTargetName: true,
      fragments: [
        { id: 'f_eyebrow', name: '舒展眉片', emotionCue: '镇定', targetOrder: 4 },
        { id: 'f_eye', name: '弯眼碎片', emotionCue: '友善', targetOrder: 2 },
        { id: 'f_nose', name: '鼻梁碎片', emotionCue: '克制', targetOrder: 1 },
        { id: 'f_mouth', name: '含笑口片', emotionCue: '微笑', targetOrder: 3 }
      ]
    },
    assembleConfig: {
      guidedOrder: false,
      slots: [
        { id: 'slot_eyebrow', fragment: 'f_eyebrow', label: '眉', emotion: '舒展' },
        { id: 'slot_eye', fragment: 'f_eye', label: '眼', emotion: '柔和' },
        { id: 'slot_nose', fragment: 'f_nose', label: '鼻', emotion: '克制' },
        { id: 'slot_mouth', fragment: 'f_mouth', label: '口', emotion: '含笑' }
      ],
      errorThreshold: 4, idleHintAfter: 45000,
      summary: {
        title: '含笑面具 · 复原', equationLabel: '笑意',
        description: '眉眼柔和，唇角微扬——它传递友善，却仍不能独自证明佩戴者心里只有快乐。'
      }
    },
    flipConfig: {
      monologueSpeaker: '领舞者的内心',
      monologue: [
        { text: '所有人都说我笑得很轻松。', emotion: '被期待' },
        { text: '其实鼓点一响，我的心就跳得很快。', emotion: '紧张' },
        { text: '年幼的舞者一直看着我，我不能让她更害怕。', emotion: '牵挂' },
        { text: '我先对她笑，也是在对自己说：我们可以。', emotion: '勇气' }
      ],
      question: {
        text: '领舞者微笑时，内心最可能同时发生了什么？',
        options: [
          { id: 'l3_happy', text: '她只有快乐，没有别的感受', feedback: '笑能表达快乐，但“只有快乐”忽略了她握紧衣角的动作。', isCorrect: false },
          { id: 'l3_fake', text: '她在欺骗所有人，所以笑是假的', feedback: '紧张和微笑可以同时真实存在，不一定是在欺骗。', isCorrect: false },
          { id: 'l3_courage', text: '她很紧张，也用微笑鼓励同伴和自己', feedback: '她点点头：「勇敢不是不紧张，而是带着紧张继续前进。」', isCorrect: true },
          { id: 'l3_ignore', text: '她完全没有注意到同伴', feedback: '她一直留意年幼舞者，这正是微笑的一部分原因。', isCorrect: false }
        ],
        maxAttempts: 2
      },
      successGuide: '同一时刻可以有不止一种感受：她既紧张，也有勇气和关心。',
      retryGuide: '把“微笑”和“握紧衣角”两条线索同时保留下来，不要只选其中一条。',
      exhaustedGuide: '微笑不是测量快乐的仪器。让我们看看她在不同对象面前的反应。',
      finalInsight: {
        mark: '含笑之见', title: '微笑，不代表毫无烦恼',
        body: '笑可以是快乐，也可以是礼貌、安慰、勇气或掩住紧张的方式。看见笑容时可以分享喜悦，也别忘了给对方说出真实感受的空间。'
      }
    },
    ritualConfig: {
      scenes: [
        { id: 'scene_dance', title: '走向舞台', subtitle: '她微笑领队，手心却在出汗', mask: 'bronze', duration: 3000 },
        { id: 'scene_partner', title: '同伴看过来', subtitle: '她点头微笑，让同伴跟上呼吸', mask: 'none', duration: 3000 },
        { id: 'scene_rest', title: '仪式结束', subtitle: '笑容落下，她说终于可以休息了', mask: 'none', duration: 3000 }
      ],
      question: {
        text: '哪些说法同时尊重了她的笑容和紧张？（精确选择）',
        options: [
          { id: 'l3_both', text: '她可以一边紧张，一边勇敢地微笑', isCorrect: true },
          { id: 'l3_support', text: '她的微笑也在给同伴支持', isCorrect: true },
          { id: 'l3_proof', text: '只要笑了，就证明完全没事', isCorrect: false },
          { id: 'l3_lie', text: '有紧张就说明所有笑容都是欺骗', isCorrect: false }
        ],
        correctPattern: ['l3_both', 'l3_support'], requireExact: true
      },
      successToast: '很好。你容纳了同时存在的多种情绪。',
      successGuide: '情绪并不互相排斥。紧张和勇敢、担心和关心，都能在一张微笑的脸后同时存在。',
      retryGuide: '不要用“完全没事”或“全是假的”把复杂感受压成一种答案。'
    },
    review: {
      knowledge: '【共存法则】一个人可以同时拥有多种感受。\n微笑可能是真的，紧张也可能是真的；理解不必二选一。',
      cancunNote: '你已经能读懂相反情绪的共存。最后一面没有明显表情，线索会更少。',
      nextLevel: '第四关 · 无言之心',
      practiceQuestions: ['领舞者的微笑同时承载了哪些感受？', '为什么“笑了”不能证明一个人完全没事？', '你可以怎样关心一个正在笑、却看起来有些紧张的人？']
    }
  },

  LEVEL_L04: {
    levelId: 'L04_silence', levelName: '无言面具', levelTitle: '第四关 · 无言之心',
    theme: 'silence', trainingLabel: '复杂情境 / 延迟判断', cultureTag: CULTURE_NOTE,
    targetAbility: 'contextUnderstand', difficulty: 4, unlockCondition: 'complete:L03_smile',
    estimatedTime: 360, prerequisite: 'L03_smile',
    visual: {
      frontImage: 'assets/sanxingdui-silence-mask-v1.png', backImage: 'assets/sanxingdui-unmasked-face-v2.png',
      ritualImage: 'assets/sanxingdui-unmasked-face-v2.png', lobbyImage: 'assets/sanxingdui-silence-mask-v1.png',
      alt: '无言面具铸工'
    },
    characters: {
      cancun: CANCUN,
      wearer: { id: 'wearer', name: '古蜀铸工', title: '神树铸造者', personality: '外表沉静，内心被失误、担忧与自责压得难以开口' }
    },
    stages: COMMON_STAGES,
    initDialogue: [
      { speaker: 'cancun', text: '最后一面几乎没有表情，我们称它「无言面具」。' },
      { speaker: 'cancun', text: '神树铸造出现裂纹后，铸工没有解释，也没有看任何人。' },
      { speaker: 'cancun', text: '有人说他冷漠，有人说他根本不在乎。' },
      { speaker: 'cancun', text: '这一次，你要在最少的表情线索里，忍住过早判断。' }
    ],
    scanConfig: {
      totalFragments: 4, eyeMoveInterval: 2100, idleHintAfter: 40000, revealTargetName: true,
      fragments: [
        { id: 'f_eyebrow', name: '平直眉片', emotionCue: '平静', targetOrder: 2 },
        { id: 'f_eye', name: '垂目眼片', emotionCue: '回避', targetOrder: 4 },
        { id: 'f_nose', name: '静止鼻片', emotionCue: '僵住', targetOrder: 1 },
        { id: 'f_mouth', name: '闭合口片', emotionCue: '沉默', targetOrder: 3 }
      ]
    },
    assembleConfig: {
      guidedOrder: false,
      slots: [
        { id: 'slot_eyebrow', fragment: 'f_eyebrow', label: '眉', emotion: '平直' },
        { id: 'slot_eye', fragment: 'f_eye', label: '眼', emotion: '低垂' },
        { id: 'slot_nose', fragment: 'f_nose', label: '鼻', emotion: '僵住' },
        { id: 'slot_mouth', fragment: 'f_mouth', label: '口', emotion: '闭合' }
      ],
      errorThreshold: 5, idleHintAfter: 40000,
      summary: {
        title: '无言面具 · 复原', equationLabel: '沉默',
        description: '眉线平直，目光低垂，双唇闭合——表面没有答案，这正是最需要等待和询问的时候。'
      }
    },
    flipConfig: {
      monologueSpeaker: '铸工的内心',
      monologue: [
        { text: '裂纹出现时，我脑中一下子空了。', emotion: '震惊' },
        { text: '大家都在问，我却找不到一句不会让事情更糟的话。', emotion: '过载' },
        { text: '我怕他们失望，也怕一开口就责怪自己。', emotion: '害怕' },
        { text: '我不是不在乎，我只是还没有准备好说。', emotion: '难以表达' },
        { text: '请给我一点时间，也请别把沉默当成答案。', emotion: '需要空间' }
      ],
      question: {
        text: '面对铸工的沉默，目前最稳妥的理解是什么？',
        options: [
          { id: 'l4_cold', text: '他沉默，所以一定冷漠', feedback: '“一定”把有限线索变成了结论。沉默还可能有很多原因。', isCorrect: false },
          { id: 'l4_guilty', text: '他不解释，所以一定故意弄坏神树', feedback: '不解释不能证明故意，也不能单独证明责任。', isCorrect: false },
          { id: 'l4_sad', text: '他肯定只是难过，和害怕无关', feedback: '他可能难过，但“只是”忽略了害怕、过载和自责。', isCorrect: false },
          { id: 'l4_wait', text: '他可能过载或难以表达，需要安全和时间再说明', feedback: '这是保留多种可能、又能给予支持的判断。', isCorrect: true },
          { id: 'l4_nothing', text: '没有表情就代表没有感受', feedback: '感受可能很强烈，只是没有出现在脸上。', isCorrect: false }
        ],
        maxAttempts: 3
      },
      successGuide: '你没有把沉默当作证据，而是保留可能、提供安全，并等待更多信息。',
      retryGuide: '注意题目问的是“目前最稳妥”。哪一个选项没有用“一定”替别人下结论？',
      exhaustedGuide: '当线索不足时，最好的答案有时不是猜中，而是承认还不知道。',
      finalInsight: {
        mark: '无言之见', title: '沉默，不等于不在乎',
        body: '沉默可能来自冷漠，也可能来自震惊、过载、害怕、羞愧或暂时难以表达。线索不足时，先保证安全、允许等待，再用尊重的方式询问。'
      }
    },
    ritualConfig: {
      scenes: [
        { id: 'scene_crack', title: '裂纹出现', subtitle: '他僵在原地，一句话也说不出', mask: 'bronze', duration: 3000 },
        { id: 'scene_crowd', title: '众人追问', subtitle: '声音越多，他越难整理思绪', mask: 'none', duration: 3000 },
        { id: 'scene_quiet', title: '安静角落', subtitle: '有人陪他坐下，并说可以慢慢来', mask: 'none', duration: 3000 }
      ],
      question: {
        text: '线索不足、对方沉默时，哪些做法更合适？（精确选择）',
        options: [
          { id: 'l4_safe', text: '先确认他和周围的人是否安全', isCorrect: true },
          { id: 'l4_time', text: '给一点时间，并说明“准备好时我愿意听”', isCorrect: true },
          { id: 'l4_force', text: '不断追问，直到他马上回答', isCorrect: false },
          { id: 'l4_label', text: '直接告诉别人“他就是不在乎”', isCorrect: false },
          { id: 'l4_leave', text: '什么都不说地永远离开', isCorrect: false }
        ],
        correctPattern: ['l4_safe', 'l4_time'], requireExact: true
      },
      successToast: '判断成熟：安全、时间与尊重，比强迫猜测更重要。',
      successGuide: '真正的理解包括承认“我还不知道”。先确认安全，再给空间和可回应的邀请。',
      retryGuide: '选择既不逼迫、也不放弃关心的做法。重点是安全、时间和尊重。'
    },
    review: {
      knowledge: '【延迟判断法则】线索不足时，允许自己暂时不知道。\n先确认安全，给时间与空间，再用开放问题邀请表达。',
      cancunNote: '四面皆复。你学会的不是猜透别人，而是不被第一眼困住。',
      nextLevel: '四关已完成 · 返回大厅查看修复档案',
      practiceQuestions: ['沉默除了冷漠，还可能来自哪些状态？', '为什么线索不足时可以暂时不下结论？', '怎样说一句既给空间、又表达关心的话？']
    }
  },

  LEVEL_ORDER: ['L01_authority', 'L02_watch', 'L03_smile', 'L04_silence'],
  LEVELS: {}
};

Data.LEVEL_ORDER.forEach((id, index) => {
  Data.LEVELS[id] = Data[`LEVEL_L0${index + 1}`];
});

Data.createLevelState = function (levelId) {
  const level = Data.LEVELS[levelId] || Data.LEVEL_L01;
  return {
    levelId: level.levelId, levelName: level.levelName, stage: 'INIT',
    score: { scanAccuracy: 0, assembleAccuracy: 0, inferCorrect: false, ritualCorrect: false },
    attempts: { scanMisses: 0, assembleErrors: 0, inferAttempts: 0, assembleErrorStreak: 0 },
    timestamps: { stageStart: {}, stageEnd: {} }, completionRecorded: false
  };
};

Data.fragmentEmotion = function (fragmentId, levelId = 'L01_authority') {
  const level = Data.LEVELS[levelId] || Data.LEVEL_L01;
  const fragment = level.scanConfig.fragments.find(item => item.id === fragmentId);
  return fragment ? fragment.emotionCue : '';
};
