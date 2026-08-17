/* ============================================================
 * 面具之下 · 音效系统（Web Audio 合成，无外部资源）
 * ============================================================ */

const AudioSys = {
  ctx: null,
  master: null,

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },

  isMuted() {
    try { return window.game && window.game.profile.sensorySettings.muteSound; } catch (e) { return false; }
  },

  play(name) {
    this.init();
    if (this.isMuted() || !this.ctx) return;
    const fns = {
      chime: () => this.chime(),
      click: () => this.click(),
      deny: () => this.deny(),
      bump: () => this.bump(),
      flip: () => this.flip(),
      success: () => this.success(),
      whoosh: () => this.whoosh(),
      scroll: () => this.scroll()
    };
    try {
      if (fns[name]) fns[name]();
    } catch (error) {
      /* 音效失败不应阻断游戏交互 */
    }
  },

  /* 基础音色：tone(freq, dur, {type, gain, when, slideTo}) */
  tone(freq, dur, opts = {}) {
    const { type = 'sine', gain = 0.2, when = 0, slideTo = null, attack = 0.012, release = 0.1 } = opts;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t0 + dur);
    const attackEnd = t0 + Math.min(attack, dur * 0.5);
    const releaseStart = t0 + Math.max(Math.min(attack, dur * 0.5), dur - release);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, attackEnd);
    g.gain.setValueAtTime(gain, releaseStart);
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  },

  /* 青铜碰击：基频 + 泛音列，清脆短促 */
  chime() {
    const t = this.ctx.currentTime;
    [523.25, 784, 1046.5, 1568].forEach((f, i) => {
      this.tone(f, 0.9, { type: 'sine', gain: 0.11 - i * 0.018, when: i * 0.055 });
    });
    this.tone(261.6, 1.3, { type: 'sine', gain: 0.07, when: 0 });
    this.tone(1318.5, 0.5, { type: 'triangle', gain: 0.05, when: 0.03 });
  },

  click() {
    this.tone(660, 0.09, { type: 'triangle', gain: 0.22 });
  },

  deny() {
    this.tone(220, 0.32, { type: 'sine', gain: 0.13, slideTo: 175 });
  },

  bump() {
    this.tone(150, 0.2, { type: 'triangle', gain: 0.26, slideTo: 90 });
  },

  flip() {
    this.tone(300, 0.55, { type: 'sine', gain: 0.11, slideTo: 640 });
    this.tone(160, 0.55, { type: 'triangle', gain: 0.09, slideTo: 320 });
    this.tone(960, 0.2, { type: 'sine', gain: 0.05, when: 0.35 });
  },

  success() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.tone(f, 0.6, { type: 'sine', gain: 0.16, when: i * 0.12 });
    });
  },

  whoosh() {
    this.tone(180, 0.4, { type: 'sine', gain: 0.06, slideTo: 1300 });
    this.tone(90, 0.4, { type: 'sine', gain: 0.05, slideTo: 700 });
  },

  scroll() {
    this.tone(880, 0.15, { type: 'sine', gain: 0.06, when: 0 });
    this.tone(660, 0.15, { type: 'sine', gain: 0.06, when: 0.12 });
  }
};

/* 语音朗读（speechSynthesis，受感官设置控制） */
function speakText(text) {
  if (!window.game || !window.game.profile.sensorySettings.voiceRead) return;
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/[「」『』]/g, ''));
    u.lang = 'zh-CN';
    u.rate = 0.92;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch (e) { /* 忽略语音失败 */ }
}
