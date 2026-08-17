/* ============================================================
 * 面具之下 · Beneath the Mask
 * 主逻辑：状态机 [INIT] → [SCAN] → [ASSEMBLE] → [FLIP] → [RITUAL] → [REVIEW]
 * ============================================================ */

const DESIGN_VIEWPORT = Object.freeze({ width: 1280, height: 720 });

function fitGameViewport() {
  const scale = Math.min(
    window.innerWidth / DESIGN_VIEWPORT.width,
    window.innerHeight / DESIGN_VIEWPORT.height
  );
  document.documentElement.style.setProperty('--app-scale', String(Math.max(0.2, scale)));
}

window.addEventListener('resize', fitGameViewport, { passive: true });
fitGameViewport();

class Game {
  constructor() {
    this.profile = Data.loadProfile();
    this.levelState = null;
    this.level = null;
    this.dialogueQueue = [];
    this.dialogueDone = null;
    this.dialogueActive = false;
    this.timers = [];
    this.intervals = [];
    this.scan = null;
    this.assemble = null;
    this.flip = null;
    this.ritual = null;
    this.drag = null;
    this.initDialogueObserver = null;
  }

  /* ---------------- 基础工具 ---------------- */
  el(id) { return document.getElementById(id); }

  setTimer(fn, ms) {
    const id = setTimeout(() => {
      this.timers = this.timers.filter(t => t !== id);
      fn();
    }, ms);
    this.timers.push(id);
    return id;
  }

  setIntervalFn(fn, ms) {
    const id = setInterval(fn, ms);
    this.intervals.push(id);
    return id;
  }

  clearTimers() {
    this.timers.forEach(clearTimeout);
    this.intervals.forEach(clearInterval);
    this.timers = [];
    this.intervals = [];
  }

  sfx(name) { AudioSys.play(name); }

  toast(text, ms = 2200) {
    const t = this.el('toast');
    t.textContent = text;
    t.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.add('hidden'), ms);
  }

  setBg(cls) {
    const bg = this.el('game-bg');
    bg.className = 'bg-' + cls;
  }

  setHudStage(label) {
    this.el('hud-level-title').textContent = this.level ? this.level.levelName : '面具之下';
    this.el('hud-stage-label').textContent = label || '';
  }

  isLevelUnlocked(level) {
    if (!level || level.unlockCondition === 'default' || !level.prerequisite) return true;
    return (this.profile.completedLevels || []).includes(level.prerequisite);
  }

  nextLevelId(levelId = this.level && this.level.levelId) {
    const index = Data.LEVEL_ORDER.indexOf(levelId);
    return index >= 0 ? Data.LEVEL_ORDER[index + 1] || null : null;
  }

  /* ---------------- 启动 ---------------- */
  init() {
    // 首次用户手势时初始化 Audio
    document.addEventListener('pointerdown', () => AudioSys.init(), { once: true });
    document.addEventListener('keydown', () => AudioSys.init(), { once: true });

    this.el('btn-exit').addEventListener('click', () => this.exitToLobby());
    this.el('btn-settings').addEventListener('click', () => this.openSettings());
    this.el('btn-settings-lobby').addEventListener('click', () => this.openSettings());
    this.el('btn-back-cover').addEventListener('click', () => {
      this.sfx('click');
      this.showCover();
    });
    this.el('btn-settings-close').addEventListener('click', () => this.closeSettings());
    this.el('settings-panel').addEventListener('click', (e) => {
      if (e.target === this.el('settings-panel')) this.closeSettings();
    });
    this.el('dialogue-box').addEventListener('click', () => this.showNextDialogue());

    document.querySelectorAll('#settings-panel input[data-setting]').forEach(input => {
      input.addEventListener('change', () => {
        const key = input.dataset.setting;
        this.profile.sensorySettings[key] = input.checked;
        this.applySettings();
        Data.saveProfile(this.profile);
        this.sfx('click');
      });
    });

    this.el('btn-cover-enter').addEventListener('click', () => {
      this.sfx('click');
      this.renderLobby();
    });

    this.showCover();
  }

  /* ---------------- 封面 ---------------- */
  showCover() {
    this.clearTimers();
    this.el('cover').classList.remove('hidden');
    this.el('lobby').classList.add('hidden');
    this.el('game').classList.add('hidden');
    this.el('cover-art').innerHTML = '<img class="cover-image" src="assets/cover-v2.png" alt="三星堆金面具守护者封面">';
    this.applySettings();
  }

  applySettings() {
    const s = this.profile.sensorySettings;
    document.body.classList.toggle('high-contrast', !!s.highContrast);
  }

  /* ---------------- 大厅 ---------------- */
  showScreen(name) {
    this.el('cover').classList.toggle('hidden', name !== 'cover');
    this.el('lobby').classList.toggle('hidden', name !== 'lobby');
    this.el('game').classList.toggle('hidden', name !== 'game');
  }

  renderLobby() {
    this.clearTimers();
    this.showScreen('lobby');
    this.applySettings();

    const lobbyMask = this.el('lobby-mask');
    const completedMask = (this.profile.completedLevels || []).length > 0;
    lobbyMask.classList.toggle('completed', completedMask);
    lobbyMask.innerHTML = '<img class="sanxingdui-head-image" src="assets/sanxingdui-head.png" alt="三星堆金面具角色头像">';
    const nameInput = this.el('player-name');
    nameInput.value = this.profile.playerName;
    const syncPlayerName = (playFeedback = false) => {
      const nextName = nameInput.value.trim() || '修复师';
      if (nextName === this.profile.playerName) return;
      this.profile.playerName = nextName;
      Data.saveProfile(this.profile);
      if (playFeedback) this.sfx('click');
    };
    nameInput.addEventListener('input', () => syncPlayerName());
    nameInput.addEventListener('change', () => syncPlayerName(true));

    const stats = this.el('lobby-stats');
    const a = this.profile.abilityScores;
    stats.innerHTML = `
      <div class="stat-item"><div class="stat-num">${this.profile.totalMasks}</div><div class="stat-label">修复面具</div></div>
      <div class="stat-item"><div class="stat-num">${a.jointAttention}</div><div class="stat-label">共同注意</div></div>
      <div class="stat-item"><div class="stat-num">${a.emotionRecog}</div><div class="stat-label">情绪识别</div></div>
      <div class="stat-item"><div class="stat-num">${a.theoryOfMind}</div><div class="stat-label">心智理论</div></div>
    `;

    const lv = this.el('lobby-levels');
    lv.innerHTML = Data.LEVEL_ORDER.map(id => {
      const L = Data.LEVELS[id];
      const unlocked = this.isLevelUnlocked(L);
      const completed = (this.profile.completedLevels || []).includes(id);
      return `
      <div class="level-card theme-${L.theme} ${unlocked ? '' : 'locked'} ${completed ? 'completed' : ''}" data-level="${id}">
        <div class="level-card-icon"><img class="sanxingdui-head-image" src="${L.visual.lobbyImage}" alt="${L.visual.alt}"></div>
        <div class="level-card-main">
          <div class="lc-name">${L.levelName} · ${L.levelTitle}</div>
          <div class="lc-desc">训练：${L.trainingLabel} · 约 ${Math.round(L.estimatedTime / 60)} 分钟</div>
          <div class="lc-culture">${L.cultureTag}</div>
        </div>
        <div class="level-card-arrow">${completed ? '✓' : unlocked ? '➤' : '🔒'}</div>
      </div>`;
    }).join('');

    lv.querySelectorAll('.level-card[data-level]').forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('locked')) return;
        this.sfx('click');
        this.startLevel(card.dataset.level);
      });
    });
  }

  exitToLobby() {
    if (!this.levelState) return;
    this.sfx('click');
    this.removeInitFloatingCharacter();
    this.renderLobby();
  }

  /* ---------------- 设置面板 ---------------- */
  openSettings() {
    this.sfx('click');
    const s = this.profile.sensorySettings;
    document.querySelectorAll('#settings-panel input[data-setting]').forEach(input => {
      input.checked = !!s[input.dataset.setting];
    });
    this.el('settings-panel').classList.remove('hidden');
  }

  closeSettings() {
    this.el('settings-panel').classList.add('hidden');
    this.sfx('click');
  }

  /* ---------------- 关卡启动与状态机 ---------------- */
  startLevel(levelId) {
    this.level = Data.LEVELS[levelId] || Data.LEVEL_L01;
    if (!this.isLevelUnlocked(this.level)) {
      this.toast('请先完成上一面具的修复。', 2200);
      return;
    }
    this.levelState = Data.createLevelState(this.level.levelId);
    this.levelState.timestamps.stageStart.INIT = Date.now();
    this.el('app').dataset.levelTheme = this.level.theme || 'authority';
    this.showScreen('game');
    this.transitionTo('INIT');
  }

  transitionTo(stage) {
    this.clearTimers();
    this.removeInitFloatingCharacter();
    this.hideDialogue();
    this.levelState.stage = stage;
    this.levelState.timestamps.stageStart[stage] = Date.now();
    const label = (this.level.stages.find(s => s.name === stage) || {}).label || '';
    this.setHudStage(label);
    const fn = 'stage_' + stage;
    if (typeof this[fn] === 'function') this[fn]();
  }

  /* ---------------- 对话系统 ---------------- */
  showDialogueSeq(seq, onDone) {
    this.dialogueQueue = seq.slice();
    this.dialogueDone = onDone;
    this.dialogueActive = true;
    this.el('dialogue-box').classList.remove('hidden');
    this.showNextDialogue();
  }

  /* 一次性对话（蚕丛/国王短句，点击可跳过） */
  say(speaker, text) {
    this.dialogueQueue = [];
    this.dialogueDone = null;
    this.dialogueActive = true;
    this.renderDialogue(speaker, text);
    this.el('dialogue-box').classList.remove('hidden');
  }

  renderDialogue(speaker, text) {
    const displayText = String(text).replaceAll('修复师', this.profile.playerName || '修复师');
    const character = (this.level && this.level.characters && this.level.characters[speaker])
      || (this.level && this.level.characters && this.level.characters.cancun)
      || { name: '蚕丛', title: '古蜀祭司' };
    const avatar = speaker === 'wearer' && this.level ? this.level.visual.backImage : 'assets/sanxingdui-head.png';
    this.el('dialogue-avatar').innerHTML = `<img class="dialogue-avatar-image" src="${avatar}" alt="${character.name}">`;
    this.el('dialogue-speaker').textContent = `${character.name} · ${character.title}`;
    this.el('dialogue-text').textContent = displayText;
    const hint = this.el('dialogue-hint');
    if (hint) { hint.classList.remove('hidden'); hint.textContent = '点击页面继续'; }
    this.sfx('click');
    speakText(displayText);
    this.positionInitFloatingCharacter();
    requestAnimationFrame(() => this.positionInitFloatingCharacter());
    setTimeout(() => this.positionInitFloatingCharacter(), 80);
    setTimeout(() => this.positionInitFloatingCharacter(), 180);
  }

  positionInitFloatingCharacter() {
    const character = this.el('init-floating-character');
    const dialogue = this.el('dialogue-box');
    const app = this.el('app');
    if (!character || !dialogue || dialogue.classList.contains('hidden') || !app) return;
    const appRect = app.getBoundingClientRect();
    const dialogueRect = dialogue.getBoundingClientRect();
    const scale = appRect.height / DESIGN_VIEWPORT.height || 1;
    // 以对话框上沿为基准留出固定悬浮距离，避免短对白时人物压住对话框
    const gap = 18;
    const bottom = ((appRect.bottom - dialogueRect.top) / scale) + gap;
    character.style.bottom = `${Math.max(14, bottom)}px`;
  }

  showNextDialogue() {
    if (!this.dialogueActive) return;
    if (this.dialogueQueue.length === 0) {
      this.el('dialogue-box').classList.add('hidden');
      this.dialogueActive = false;
      const done = this.dialogueDone;
      this.dialogueDone = null;
      if (done) done();
      return;
    }
    const d = this.dialogueQueue.shift();
    this.renderDialogue(d.speaker, d.text);
  }

  hideDialogue() {
    this.dialogueQueue = [];
    this.dialogueActive = false;
    this.el('dialogue-box').classList.add('hidden');
    const hint = this.el('dialogue-hint');
    if (hint) hint.classList.add('hidden');
  }

  /* ============================================================
   * S0 · INIT 委托接收
   * ============================================================ */
  stage_INIT() {
    this.setBg('shrine');
    this.el('stage-root').innerHTML = `
      <div class="init-scene">
        <div class="init-title">${this.level.levelTitle} · 「${this.level.levelName}」</div>
      </div>`;
    const floatingCharacter = document.createElement('img');
    floatingCharacter.id = 'init-floating-character';
    floatingCharacter.className = 'init-floating-character';
    floatingCharacter.src = this.level.visual.frontImage;
    floatingCharacter.alt = this.level.visual.alt;
    this.el('app').appendChild(floatingCharacter);
    if (typeof ResizeObserver !== 'undefined') {
      this.initDialogueObserver = new ResizeObserver(() => this.positionInitFloatingCharacter());
      this.initDialogueObserver.observe(this.el('dialogue-box'));
    }
    this.showDialogueSeq(this.level.initDialogue, () => this.startScanTutorialTransition());
  }

  /* INIT → SCAN 的短教程过渡：让玩家先看到“观察—寻找—点击”的操作提示 */
  startScanTutorialTransition() {
    this.removeInitFloatingCharacter();
    const root = this.el('stage-root');
    this.setHudStage('线索扫描');
    root.innerHTML = `
      <div class="scan-transition" role="status" aria-live="polite">
        <div class="scan-transition-orbit"></div>
        <div class="scan-transition-eye"><span></span></div>
        <div class="scan-transition-copy">
          <div class="scan-transition-kicker">第 ${this.level.difficulty} 关 · 观察</div>
          <div class="scan-transition-title">寻找面具的第一处特征</div>
          <div class="scan-transition-tip">跟随铜镜指引，点击发光的五官碎片</div>
        </div>
        <div class="scan-transition-progress"><i></i><i></i><i></i></div>
      </div>`;
    this.sfx('click');
    this.setTimer(() => this.transitionTo('SCAN'), 3000);
  }

  removeInitFloatingCharacter() {
    if (this.initDialogueObserver) {
      this.initDialogueObserver.disconnect();
      this.initDialogueObserver = null;
    }
    const character = this.el('init-floating-character');
    if (character) character.remove();
  }

  /* ============================================================
   * S1 · SCAN 线索扫描（共同注意）
   * ============================================================ */
  stage_SCAN() {
    this.setBg('shrine');
    const cfg = this.level.scanConfig;
    const root = this.el('stage-root');

    root.innerHTML = `
      <div class="scan-scene">
        <div class="scan-eye-wrap" id="scan-eye">${Art.bigEyeSvg()}</div>
        <div class="scan-altar"></div>
        <div id="scan-fragments"></div>
        <div class="scan-progress" id="scan-progress"></div>
      </div>`;

    const fragWrap = this.el('scan-fragments');
    /* 碎片由祭台内的 2×2 网格统一居中排列 */
    cfg.fragments.forEach(f => {
      const div = document.createElement('div');
      div.className = 'scan-fragment';
      div.id = 'frag-' + f.id;
      div.dataset.id = f.id;
      div.innerHTML = Art.pieceSvg(f.id.replace('f_', ''), this.level.theme) + `<span class="frag-label">碎片</span>`;
      div.addEventListener('click', () => this.onScanClick(f.id));
      fragWrap.appendChild(div);
    });

    this.el('scan-progress').innerHTML = cfg.fragments.map((_, i) => `<span class="dot" id="sdot-${i}"></span>`).join('');

    this.scan = {
      order: cfg.fragments.slice().sort((a, b) => a.targetOrder - b.targetOrder),
      index: 0,
      done: false,
      lastInteract: Date.now()
    };

    // 眼球初始位置（顶部中央），随后移动到第一个目标
    const eye = this.el('scan-eye');
    eye.style.left = '50%';
    eye.style.top = '6%';
    this.setTimer(() => {
      const firstTarget = this.scan.order[0];
      this.moveEyeTo(firstTarget);
      this.eyeBlinkHint();
      this.toast(this.scanTargetPrompt('第一步', firstTarget), 3600);
    }, 600);

    // 眼球每 3 秒指向当前目标（共同注意提示）
    this.setIntervalFn(() => {
      if (this.scan.done) return;
      this.moveEyeTo(this.scan.order[this.scan.index]);
    }, cfg.eyeMoveInterval);

    // 长时间无操作提示
    this.setIntervalFn(() => {
      if (this.scan.done || !this.levelState || this.levelState.stage !== 'SCAN') return;
      if (Date.now() - this.scan.lastInteract > cfg.idleHintAfter) {
        this.scan.lastInteract = Date.now();
        this.eyeBlinkHint();
        this.say('cancun', '请看着我的眼睛指向，找到那块碎片。');
      }
    }, 5000);
  }

  moveEyeTo(fragment) {
    const eye = this.el('scan-eye');
    if (!eye || eye.classList.contains('pointer-follow')) return;
    const targetEl = this.el('frag-' + fragment.id);
    const scene = document.querySelector('.scan-scene');
    if (!targetEl || !scene) return;
    const targetRect = targetEl.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    const x = ((targetRect.left + targetRect.width / 2 - sceneRect.left) / sceneRect.width) * 100;
    const y = ((targetRect.top - sceneRect.top) / sceneRect.height) * 100 - 7;
    eye.style.left = `${Math.max(12, Math.min(88, x))}%`;
    eye.style.top = `${Math.max(13, Math.min(78, y))}%`;
  }

  scanTargetPrompt(prefix, target) {
    const targetText = this.level.scanConfig.revealTargetName === false
      ? '的发光碎片'
      : `的「${target.name}」`;
    return `${prefix}：请点击铜镜指向${targetText}。`;
  }

  eyeBlinkHint() {
    const eye = this.el('scan-eye');
    if (!eye) return;
    eye.classList.add('hint-blink');
    this.setTimer(() => eye.classList.remove('hint-blink'), 1100);
  }

  onScanClick(fragmentId) {
    if (!this.scan || this.scan.done || this.scan.inputLocked) return;
    this.scan.lastInteract = Date.now();
    const target = this.scan.order[this.scan.index];
    if (fragmentId === target.id) {
      this.scanCorrect(target);
    } else {
      this.scanWrong(fragmentId);
    }
  }

  scanCorrect(target) {
    this.scan.index++;
    const el = this.el('frag-' + target.id);
    el.classList.add('collected', 'highlight');
    this.sfx('chime');
    this.floatTag(el, `${target.name} · ${target.emotionCue}`);
    this.levelState.score.scanAccuracy += 100 / this.scan.order.length;
    const dot = this.el('sdot-' + (this.scan.index - 1));
    if (dot) dot.classList.add('on');

    this.hideDialogue();

    if (this.scan.index >= this.scanConfig().totalFragments) {
      this.scan.done = true;
      this.levelState.timestamps.stageEnd.SCAN = Date.now();
      this.toast('碎片已收集齐，进入组装', 1000);
      this.setTimer(() => {
        this.transitionTo('ASSEMBLE');
      }, 900);
    } else {
      const next = this.scan.order[this.scan.index];
      const eye = this.el('scan-eye');
      if (eye) eye.classList.remove('pointer-follow');
      this.setTimer(() => {
        this.moveEyeTo(next);
        this.eyeBlinkHint();
        this.toast(this.scanTargetPrompt('下一步', next), 3000);
      }, 550);
    }
  }

  scanWrong(fragmentId) {
    this.scan.inputLocked = true;
    this.levelState.attempts.scanMisses++;
    this.sfx('deny');
    const el = this.el('frag-' + fragmentId);
    if (el) {
      el.classList.add('wrong');
      this.setTimer(() => el.classList.remove('wrong'), 500);
    }
    this.say('cancun', '这块碎片也有价值，但不是现在要找的。请看着我的眼睛指向。');
    const target = this.scan.order[this.scan.index];
    const eye = this.el('scan-eye');
    if (eye) eye.classList.remove('pointer-follow');
    this.setTimer(() => {
      this.hideDialogue();
      this.scan.inputLocked = false;
      this.moveEyeTo(target);
      this.eyeBlinkHint();
      this.toast(this.scanTargetPrompt('再看一次', target), 2800);
    }, 1000);
    if (this.profile.abilityScores.scaffoldingLevel >= 3) {
      this.eyeBlinkHint();
    }
  }

  scanConfig() { return this.level.scanConfig; }

  floatTag(el, text) {
    const tag = document.createElement('div');
    tag.className = 'floating-tag';
    tag.textContent = text;
    el.appendChild(tag);
    this.setTimer(() => tag.remove(), 1700);
  }

  /* ============================================================
   * S2 · ASSEMBLE 正面拼接（情绪识别）
   * ============================================================ */
  stage_ASSEMBLE() {
    this.setBg('workbench');
    const cfg = this.level.assembleConfig;
    const root = this.el('stage-root');

    root.innerHTML = `
      <div class="assemble-scene">
        <div class="assemble-left">
          <div class="assemble-board">
            <div class="board-outline" id="board-outline">${Art.maskOutlineSvg(this.level.theme)}</div>
            <div id="slot-container"></div>
          </div>
        </div>
        <div class="assemble-right">
          <div class="fragment-tray" id="fragment-tray"></div>
          <div class="fragment-labels" id="fragment-labels"></div>
        </div>
        <div class="assemble-hint" id="assemble-hint">拖拽碎片至面具轮廓的正确位置</div>
      </div>`;

    this.assemble = { placed: 0, errorStreak: 0, step: 0, order: cfg.slots.slice() };

    // 槽位（对应三星堆面具：眉 45% / 眼 52% / 鼻 59% / 口 72%）
    const slotPos = {
      // 收拢到新面具轮廓的面部区域，避免五官落到耳廓/冠饰之外
      slot_eyebrow: { x: 50, y: 44 },
      slot_eye: { x: 50, y: 51 },
      slot_nose: { x: 50, y: 59 },
      slot_mouth: { x: 50, y: 66 }
    };

    const sc = this.el('slot-container');
    cfg.slots.forEach(s => {
      const p = slotPos[s.id];
      const div = document.createElement('div');
      div.className = 'mask-slot';
      div.id = s.id;
      div.dataset.slot = s.id;
      div.style.left = p.x + '%';
      div.style.top = p.y + '%';
      div.style.transform = 'translate(-50%, -50%)';
      sc.appendChild(div);
    });

    // 碎片栏 - 打乱顺序
    const tray = this.el('fragment-tray');
    const fragments = [...this.level.scanConfig.fragments].sort(() => Math.random() - 0.5);
    fragments.forEach(f => {
      const div = document.createElement('div');
      div.className = 'drag-fragment';
      div.id = 'dfrag-' + f.id;
      div.dataset.id = f.id;
      div.innerHTML = Art.pieceSvg(f.id.replace('f_', ''), this.level.theme);
      div.style.touchAction = 'none';
      this.bindDrag(div, f.id);
      tray.appendChild(div);
    });

    // 侧边标签
    const labels = this.el('fragment-labels');
    cfg.slots.forEach(s => {
      const tag = document.createElement('div');
      tag.className = 'fragment-tag';
      tag.id = 'tag-' + s.id;
      tag.dataset.slot = s.id;
      tag.textContent = `${s.emotion}之${s.label}`;
      labels.appendChild(tag);
    });

    // 长时间无操作提示
    this.assemble.lastInteract = Date.now();
    this.setIntervalFn(() => {
      if (this.assemble.done || !this.levelState || this.levelState.stage !== 'ASSEMBLE') return;
      if (Date.now() - this.assemble.lastInteract > cfg.idleHintAfter) {
        this.assemble.lastInteract = Date.now();
        this.say('cancun', '把右侧的碎片拖到面具对应的位置：眉对眉、眼对眼、鼻对鼻、口对口。');
      }
    }, 5000);

    // 前两关提供逐步高亮，后两关只保留轮廓与标签线索
    this.assembleHintStep();
    if (cfg.guidedOrder === false) {
      this.say('cancun', '这次没有固定顺序。请同时观察形状、位置与情绪标签，自主完成复原。');
    } else {
      this.say('cancun', `先放「${this.assemble.order[0].emotion}之${this.assemble.order[0].label}」。`);
    }
  }

  /* 组装步骤引导：高亮当前应放置的槽位 */
  assembleHintStep() {
    if (!this.assemble || this.assemble.done) return;
    document.querySelectorAll('.mask-slot').forEach(s => s.classList.remove('next'));
    document.querySelectorAll('.fragment-tag').forEach(t => t.classList.remove('next'));
    const hint = this.el('assemble-hint');
    if (this.level.assembleConfig.guidedOrder === false) {
      if (hint) hint.textContent = `自主复原：已完成 ${this.assemble.placed} / ${this.assemble.order.length} 块`;
      return;
    }
    const cur = this.assemble.order[this.assemble.step];
    if (!cur) return;
    const slotEl = this.el(cur.id);
    if (slotEl) slotEl.classList.add('next');
    const tagEl = this.el('tag-' + cur.id);
    if (tagEl) tagEl.classList.add('next');
    if (hint) hint.textContent = `第 ${this.assemble.step + 1} / ${this.assemble.order.length} 步：把「${cur.emotion}之${cur.label}」拖到对应位置`;
  }

  bindDrag(el, fragmentId) {
    el.addEventListener('pointerdown', (e) => {
      if (this.assemble && this.assemble.done) return;
      if (el.classList.contains('placed')) return;
      e.preventDefault();
      this.sfx('click');
      const rect = el.getBoundingClientRect();
      this.drag = {
        el, fragmentId,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        startX: rect.left, startY: rect.top,
        originalParent: el.parentElement
      };
      el.classList.add('dragging');
      el.style.left = rect.left + 'px';
      el.style.top = rect.top + 'px';
      el.style.width = rect.width + 'px';
      el.style.height = rect.height + 'px';
      document.body.appendChild(el);
      if (this.assemble) this.assemble.lastInteract = Date.now();
    });
  }

  onPointerMove(e) {
    if (this.scan && this.levelState && this.levelState.stage === 'SCAN') {
      this.updateScanPointer(e.clientX, e.clientY);
    }
    if (!this.drag) return;
    this.drag.el.style.left = (e.clientX - this.drag.offsetX) + 'px';
    this.drag.el.style.top = (e.clientY - this.drag.offsetY) + 'px';
    // 槽位高亮
    document.querySelectorAll('.mask-slot').forEach(s => {
      s.classList.toggle('drag-over', !s.classList.contains('filled') && this.hitTest(s, e.clientX, e.clientY));
    });
  }

  updateScanPointer(clientX, clientY) {
    const scene = document.querySelector('.scan-scene');
    const eye = this.el('scan-eye');
    if (!scene || !eye || this.scan.done) return;
    const bounds = scene.getBoundingClientRect();
    const inside = clientX >= bounds.left && clientX <= bounds.right && clientY >= bounds.top && clientY <= bounds.bottom;
    if (!inside) {
      eye.classList.remove('pointer-follow');
      document.querySelectorAll('#scan-fragments .scan-fragment.hover-highlight').forEach(el => el.classList.remove('hover-highlight'));
      return;
    }

    const x = Math.max(15, Math.min(85, ((clientX - bounds.left) / bounds.width) * 100));
    const y = Math.max(14, Math.min(86, ((clientY - bounds.top) / bounds.height) * 100));
    eye.classList.add('pointer-follow');
    eye.style.left = x + '%';
    eye.style.top = y + '%';

    document.querySelectorAll('#scan-fragments .scan-fragment').forEach(fragment => {
      const r = fragment.getBoundingClientRect();
      const hit = clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
      fragment.classList.toggle('hover-highlight', hit && !fragment.classList.contains('collected'));
    });
  }

  onPointerUp(e) {
    if (!this.drag) return;
    if (!this.assemble) { this.drag = null; return; }
    const d = this.drag;
    this.drag = null;
    document.querySelectorAll('.mask-slot').forEach(s => s.classList.remove('drag-over'));

    // 检测槽位
    const slots = Array.from(document.querySelectorAll('.mask-slot'));
    const hit = slots.find(s => !s.classList.contains('filled') && this.hitTest(s, e.clientX, e.clientY));

    if (hit) {
      const slot = this.level.assembleConfig.slots.find(s => s.id === hit.dataset.slot);
      if (slot.fragment === d.fragmentId) {
        this.assembleCorrect(hit, slot, d.el);
        return;
      }
      this.assembleWrong(hit, slot, d.el, d);
    } else {
      // 弹回
      d.el.classList.remove('dragging');
      this.sfx('bump');
      d.originalParent.appendChild(d.el);
      d.el.style.left = d.el.style.top = d.el.style.width = d.el.style.height = '';
    }
  }

  hitTest(slotEl, x, y) {
    const r = slotEl.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  assembleCorrect(slotEl, slot, dragEl) {
    this.sfx('chime');
    dragEl.remove();
    slotEl.classList.add('filled');
    slotEl.innerHTML = `
      <div class="slot-svg">${Art.pieceSvg(slot.fragment.replace('f_', ''), this.level.theme)}</div>`;
    const tag = this.el('tag-' + slot.id);
    if (tag) tag.classList.add('done');
    this.levelState.score.assembleAccuracy += 100 / this.level.assembleConfig.slots.length;
    this.assemble.placed++;
    this.assemble.errorStreak = 0;
    if (this.assemble) this.assemble.lastInteract = Date.now();
    this.assemble.step++;
    this.assembleHintStep();

    if (this.profile.sensorySettings.voiceRead) {
      speakText(`${slot.label}部，${slot.emotion}之象。`);
    }

    if (this.assemble.placed >= this.level.assembleConfig.slots.length) {
      this.assemble.done = true;
      this.levelState.timestamps.stageEnd.ASSEMBLE = Date.now();
      this.setTimer(() => {
        const board = this.el('board-outline');
        if (board) {
          board.innerHTML = Art.fullMaskSvg(this.level.theme);
          board.classList.remove('glow');
        }
        this.hideDialogue();
        this.showMaskSummary();
      }, 900);
    }
  }

  assembleWrong(slotEl, slot, dragEl, d) {
    this.levelState.attempts.assembleErrors++;
    this.assemble.errorStreak++;
    if (this.assemble) this.assemble.lastInteract = Date.now();
    this.sfx('bump');
    dragEl.classList.remove('dragging');
    d.originalParent.appendChild(dragEl);
    dragEl.style.left = dragEl.style.top = dragEl.style.width = dragEl.style.height = '';
    const wrongEmotion = this.level.scanConfig.fragments.find(f => f.id === d.fragmentId).emotionCue;
    this.say('cancun', `「${wrongEmotion}」的碎片放在这里不太合适。请看看轮廓，找到它的位置。`);

    // 连续放错超过阈值 → 动态支架升级：高亮轮廓
    if (this.assemble.errorStreak >= this.level.assembleConfig.errorThreshold) {
      const outline = this.el('board-outline');
      outline.classList.add('glow');
      this.assemble.errorStreak = 0;
      this.say('cancun', '我为你点亮轮廓，帮你找到位置。');
    }
  }

  showMaskSummary() {
    const cfg = this.level.assembleConfig;
    const summary = cfg.summary;
    const parts = cfg.slots.map(s => `${s.emotion}之${s.label}`).join(' + ');
    const root = this.el('stage-root');
    // 上下分层：上面是面具，下面是文字和继续按钮
    root.innerHTML = `
      <div class="assemble-result-scene">
        <div class="assemble-result-top">
          <div class="result-mask-wrap"><img class="result-character-image" src="${this.level.visual.frontImage}" alt="${this.level.visual.alt}"></div>
        </div>
        <div class="assemble-result-bottom">
          <div class="result-info">
            <div class="result-title">${summary.title}</div>
            <div class="result-body">${summary.equationLabel} = ${parts}</div>
            <div class="result-desc">${summary.description}</div>
          </div>
          <button class="result-next-btn" id="result-next-btn">点击继续</button>
        </div>
      </div>`;

    this.el('result-next-btn').addEventListener('click', () => {
      this.transitionTo('FLIP');
    });
  }

  /* ============================================================
   * S3 · FLIP 翻转推断（心智理论）
   * ============================================================ */
  stage_FLIP() {
    this.setBg('flip');
    const cfg = this.level.flipConfig;
    const root = this.el('stage-root');
    const simplify = this.profile.sensorySettings.simplifyAnim;

    root.innerHTML = `
      <div class="flip-scene">
        <div class="flip-stage">
          <div class="flip-card ${simplify ? 'simple-flip' : ''}" id="flip-card">
            <div class="flip-face flip-front"><img class="flip-character-image" src="${this.level.visual.frontImage}" alt="${this.level.visual.alt}"></div>
            <div class="flip-face flip-back"><img class="flip-character-image unmasked-face-image" src="${this.level.visual.backImage}" alt="${this.level.characters.wearer.name}的内心面孔"></div>
          </div>
        </div>
        <button class="flip-btn" id="flip-btn">鉴</button>
        <div id="flip-overlay"></div>
      </div>`;

    this.flip = {
      attempts: 0,
      monologueIndex: 0,
      finished: false
    };

    this.el('flip-btn').addEventListener('click', () => this.onFlipClick(cfg));
  }

  onFlipClick(cfg) {
    if (this.flip.finished) return;
    this.sfx('flip');
    this.flip.finished = true;
    this.el('flip-btn').classList.add('hidden');
    const card = this.el('flip-card');
    const simplify = this.profile.sensorySettings.simplifyAnim;
    card.classList.add('flipped');
    this.setTimer(() => this.playMonologue(cfg), simplify ? 350 : 1600);
  }

  playMonologue(cfg) {
    const mono = cfg.monologue;
    if (this.flip.monologueIndex >= mono.length) {
      this.setTimer(() => this.showInferQuestion(cfg), 500);
      return;
    }
    const item = mono[this.flip.monologueIndex++];
    const overlay = this.el('flip-overlay');
    overlay.innerHTML = `
      <div class="monologue-box">
        <div class="mb-speaker">${cfg.monologueSpeaker} · 独白</div>
        <div class="mb-text">${item.text}</div>
        <div class="mb-emotion">${item.emotion}</div>
      </div>`;
    speakText(item.text);
    this.setTimer(() => this.playMonologue(cfg), 2600);
  }

  showInferQuestion(cfg) {
    const overlay = this.el('flip-overlay');
    const q = cfg.question;
    overlay.innerHTML = `
      <div class="infer-panel">
        <div class="infer-q">${q.text}</div>
        <div class="infer-opts">
          ${q.options.map(o => `<button class="opt-btn" data-id="${o.id}">${o.text}</button>`).join('')}
        </div>
        <div class="feedback-line" id="feedback-line"></div>
      </div>`;

    overlay.querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => this.onInferSelect(btn, q));
    });
  }

  onInferSelect(btn, q) {
    if (btn.classList.contains('disabled')) return;
    const opt = q.options.find(o => o.id === btn.dataset.id);
    this.levelState.attempts.inferAttempts++;
    const feedback = this.el('feedback-line');

    if (opt.isCorrect) {
      this.sfx('success');
      this.levelState.score.inferCorrect = true;
      btn.classList.add('correct-pick', 'disabled');
      feedback.textContent = opt.feedback;
      document.querySelectorAll('.infer-opts .opt-btn').forEach(b => b.classList.add('disabled'));
      this.say('cancun', this.level.flipConfig.successGuide);
      this.setTimer(() => this.toRitual(), 3400);
    } else {
      this.sfx('deny');
      btn.classList.add('wrong-pick', 'disabled');
      feedback.textContent = opt.feedback;
      if (this.levelState.attempts.inferAttempts < q.maxAttempts) {
        this.say('cancun', this.level.flipConfig.retryGuide);
      } else {
        document.querySelectorAll('.infer-opts .opt-btn').forEach(b => b.classList.add('disabled'));
        this.say('cancun', this.level.flipConfig.exhaustedGuide);
        this.setTimer(() => this.toRitual(), 3400);
      }
    }
  }

  toRitual() {
    if (!this.levelState || this.levelState.stage !== 'FLIP') return;
    this.levelState.timestamps.stageEnd.FLIP = Date.now();
    this.transitionTo('RITUAL');
  }

  showFinalInsight() {
    if (!this.levelState || this.levelState.stage !== 'FLIP') return;
    this.hideDialogue();
    const insight = this.level.flipConfig.finalInsight;
    const overlay = this.el('flip-overlay');
    overlay.innerHTML = `
      <section class="final-insight" aria-labelledby="final-insight-title">
        <div class="final-insight-mark">${insight.mark}</div>
        <h2 id="final-insight-title">${insight.title}</h2>
        <p>${insight.body}</p>
        <div class="final-insight-actions">
          <button class="btn btn-primary" id="btn-final-next">下一关</button>
          <button class="btn" id="btn-final-replay">重新游玩</button>
          <button class="btn btn-ghost" id="btn-final-lobby">回到主菜单</button>
        </div>
      </section>`;

    this.el('btn-final-next').addEventListener('click', () => {
      this.sfx('click');
      const nextId = this.nextLevelId();
      if (nextId && Data.LEVELS[nextId]) this.startLevel(nextId);
      else this.renderLobby();
    });
    this.el('btn-final-replay').addEventListener('click', () => {
      this.sfx('click');
      this.startLevel(this.level.levelId);
    });
    this.el('btn-final-lobby').addEventListener('click', () => {
      this.sfx('click');
      this.renderLobby();
    });
  }

  /* ============================================================
   * S4 · RITUAL 仪式重现（情境泛化）
   * ============================================================ */
  stage_RITUAL() {
    this.setBg('ritual');
    const cfg = this.level.ritualConfig;
    const root = this.el('stage-root');

    root.innerHTML = `
      <div class="ritual-scene" id="ritual-scene">
        <div class="ritual-stage">
          <div class="ritual-card" id="ritual-card"></div>
        </div>
      </div>`;

    this.ritual = { sceneIndex: 0, selected: new Set() };
    this.playRitualScene(cfg);
  }

  playRitualScene(cfg) {
    const scenes = cfg.scenes;
    if (this.ritual.sceneIndex >= scenes.length) {
      this.setTimer(() => this.showRitualQuestion(cfg), 500);
      return;
    }
    const sc = scenes[this.ritual.sceneIndex++];
    const cls = 'scene-' + sc.id.replace('scene_', '');
    const card = this.el('ritual-card');
    card.className = 'ritual-card ' + cls;
    card.innerHTML = `
      <div class="ritual-king"><img class="unmasked-face-image" src="${this.level.visual.ritualImage}" alt="${this.level.characters.wearer.name}的情境面孔"></div>
      <div class="ritual-mask-badge">${sc.mask === 'none' ? '· 未戴面具 ·' : '· 佩戴青铜面具 ·'}</div>
      <div class="ritual-info">
        <div class="ri-title">${sc.title}</div>
        <div class="ri-sub">${sc.subtitle}</div>
      </div>`;
    this.sfx('scroll');
    this.setTimer(() => this.playRitualScene(cfg), sc.duration);
  }

  showRitualQuestion(cfg) {
    const q = cfg.question;
    const overlay = document.createElement('div');
    overlay.className = 'ritual-question';
    overlay.id = 'ritual-question';
    overlay.innerHTML = `
      <div class="rq-title">${q.text}</div>
      <div class="multi-opts" id="multi-opts">
        ${q.options.map(o => `
          <div class="multi-opt" data-id="${o.id}">
            <span class="m-check"></span><span>${o.text}</span>
          </div>`).join('')}
      </div>
      <button class="btn btn-primary btn-confirm" id="btn-confirm">确认所选</button>`;

    const scene = this.el('ritual-scene');
    scene.appendChild(overlay);

    overlay.querySelectorAll('.multi-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        opt.classList.toggle('selected');
        this.sfx('click');
      });
    });
    this.el('btn-confirm').addEventListener('click', () => this.confirmRitual(cfg));
  }

  confirmRitual(cfg) {
    if (this.ritual.answerLocked) return;
    const q = cfg.question;
    const selected = Array.from(document.querySelectorAll('#multi-opts .multi-opt.selected')).map(el => el.dataset.id);
    if (selected.length === 0) {
      this.toast('请选择至少一项', 1600);
      return;
    }
    const selectedSet = new Set(selected);
    const correctSet = new Set(q.correctPattern);
    const onlyCorrect = selected.every(id => correctSet.has(id));
    const exactMatch = selectedSet.size === correctSet.size && q.correctPattern.every(id => selectedSet.has(id));
    const isCorrect = q.requireExact ? exactMatch : selected.length > 0 && onlyCorrect;

    if (isCorrect) {
      this.ritual.answerLocked = true;
      this.sfx('success');
      this.levelState.score.ritualCorrect = true;
      document.querySelectorAll('#multi-opts .multi-opt').forEach(el => el.classList.add('answered'));
      this.toast(cfg.successToast, 2600);
      this.say('cancun', cfg.successGuide);
      this.setTimer(() => {
        this.levelState.timestamps.stageEnd.RITUAL = Date.now();
        this.transitionTo('REVIEW');
      }, 3600);
    } else {
      this.sfx('deny');
      this.levelState.score.ritualCorrect = false;
      document.querySelectorAll('#multi-opts .multi-opt.selected').forEach(el => el.classList.add('wrong-pick'));
      this.say('cancun', cfg.retryGuide);
      this.setTimer(() => {
        document.querySelectorAll('#multi-opts .multi-opt').forEach(el => el.classList.remove('wrong-pick'));
      }, 1800);
    }
  }

  /* ============================================================
   * S5 · REVIEW 复盘结算
   * ============================================================ */
  recordLevelCompletion() {
    if (!this.levelState || this.levelState.completionRecorded) return;
    const st = this.levelState;
    const p = this.profile;
    p.completedLevels = Array.isArray(p.completedLevels) ? p.completedLevels : [];
    if (!p.completedLevels.includes(this.level.levelId)) p.completedLevels.push(this.level.levelId);
    p.totalMasks = p.completedLevels.length;
    const nextId = this.nextLevelId(this.level.levelId);
    const nextDifficulty = nextId ? Data.LEVELS[nextId].difficulty : Data.LEVEL_ORDER.length;
    p.currentLevel = Math.max(p.currentLevel, nextDifficulty);
    p.abilityScores.jointAttention = Math.round((p.abilityScores.jointAttention + st.score.scanAccuracy) / 2);
    p.abilityScores.emotionRecog = Math.round((p.abilityScores.emotionRecog + st.score.assembleAccuracy) / 2);
    p.abilityScores.theoryOfMind = Math.round((p.abilityScores.theoryOfMind + (st.score.inferCorrect ? 100 : 55)) / 2);
    p.abilityScores.contextUnderstand = Math.round((p.abilityScores.contextUnderstand + (st.score.ritualCorrect ? 100 : 55)) / 2);
    p.abilityScores.scaffoldingLevel = Math.min(4, 1 + Math.floor(p.totalMasks / 2));
    Data.saveProfile(p);
    st.completionRecorded = true;
  }

  stage_REVIEW() {
    this.setBg('review');
    const root = this.el('stage-root');
    const st = this.levelState;

    // 进入复盘即视为完成；按关卡 ID 去重，重玩不会增加面具数量
    this.recordLevelCompletion();

    const scan = Math.max(0, Math.min(100, st.score.scanAccuracy));
    const assemble = Math.max(0, Math.min(100, st.score.assembleAccuracy));
    const infer = st.score.inferCorrect;
    const ritual = st.score.ritualCorrect;
    const insight = this.level.flipConfig.finalInsight;
    const nextId = this.nextLevelId();
    const nextLevel = nextId ? Data.LEVELS[nextId] : null;

    const stars = (v) => {
      const n = v >= 90 ? 5 : v >= 75 ? 4 : v >= 60 ? 3 : v >= 40 ? 2 : 1;
      return '★'.repeat(n) + '☆'.repeat(5 - n);
    };
    const pass = (b) => b ? '正确' : '待加强';

    root.innerHTML = `
      <div class="review-scene">
        <div class="scroll">
          <div class="scroll-title">修复报告</div>
          <div class="scroll-sub">${this.level.levelTitle}</div>
          <div class="scroll-mask">面具：${this.level.levelName}　·　修复师：${this.profile.playerName}</div>

          <div class="score-row">
            <span class="sr-name">共同注意</span>
            <div class="sr-bar"><div class="sr-fill" style="width:${scan}%"></div></div>
            <span class="sr-num">${scan}</span>
            <span class="sr-result">${stars(scan)}</span>
          </div>
          <div class="score-row">
            <span class="sr-name">情绪识别</span>
            <div class="sr-bar"><div class="sr-fill" style="width:${assemble}%"></div></div>
            <span class="sr-num">${assemble}</span>
            <span class="sr-result">${stars(assemble)}</span>
          </div>
          <div class="score-row">
            <span class="sr-name">心智理论</span>
            <div class="sr-bar"><div class="sr-fill" style="width:${infer ? 100 : 60}%"></div></div>
            <span class="sr-num">${infer ? 100 : 60}</span>
            <span class="sr-result">${infer ? stars(100) : '待加强'}</span>
          </div>
          <div class="score-row">
            <span class="sr-name">情境理解</span>
            <div class="sr-bar"><div class="sr-fill" style="width:${ritual ? 100 : 60}%"></div></div>
            <span class="sr-num">${ritual ? 100 : 60}</span>
            <span class="sr-result">${ritual ? stars(100) : '待加强'}</span>
          </div>

          <div class="knowledge-box">${this.level.review.knowledge}</div>
          <div class="review-insight"><strong>${insight.title}</strong><span>${insight.body}</span></div>
          <div class="cancun-note">蚕丛批注：${this.level.review.cancunNote}</div>
          <div class="culture-note">文化说明：${this.level.cultureTag}</div>

          <div class="btn-row">
            <button class="btn btn-primary" id="btn-next">${nextLevel ? `进入${nextLevel.levelTitle}` : '完成四关 · 返回大厅'}</button>
            <button class="btn" id="btn-back-lobby">返回大厅</button>
          </div>
          <div class="review-export">
            <button id="btn-export">生成家庭练习卡</button>
          </div>
        </div>
      </div>`;

    this.el('btn-next').addEventListener('click', () => {
      this.sfx('click');
      if (nextLevel && this.isLevelUnlocked(nextLevel)) this.startLevel(nextLevel.levelId);
      else this.renderLobby();
    });
    this.el('btn-back-lobby').addEventListener('click', () => {
      this.sfx('click');
      this.renderLobby();
    });
    this.el('btn-export').addEventListener('click', () => this.showExportCard());
  }

  showExportCard() {
    const L = this.level;
    const st = this.levelState;
    const overlay = document.createElement('div');
    overlay.className = 'export-overlay';
    overlay.innerHTML = `
      <div class="export-card">
        <h3>家庭练习卡 · ${L.levelName}</h3>
        <p>
          今天修复了「${L.levelName}」，学习如何分辨<b>表面表情</b>与<b>内心感受</b>。<br><br>
          <b>和孩子聊一聊：</b><br>
          ${L.review.practiceQuestions.map((question, index) => `${index + 1}. ${question}`).join('<br>')}<br><br>
          <b>本关小知识：</b><br>
          ${L.review.knowledge.replace(/\n/g, '<br>')}<br><br>
          <i style="font-size:.8rem">本次表现：共同注意 ${st.score.scanAccuracy} 分 · 情绪识别 ${st.score.assembleAccuracy} 分</i>
        </p>
        <div class="export-actions">
          <button class="btn" id="btn-export-close">收起</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    this.sfx('scroll');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.id === 'btn-export-close') {
        overlay.remove();
        this.sfx('click');
      }
    });
  }
}

/* ---------------- 全局指针事件（拖拽） ---------------- */
window.addEventListener('pointermove', (e) => { if (window.game) window.game.onPointerMove(e); });
window.addEventListener('pointerup', (e) => { if (window.game) window.game.onPointerUp(e); });
window.addEventListener('pointercancel', (e) => { if (window.game) window.game.onPointerUp(e); });

window.game = new Game();
document.addEventListener('DOMContentLoaded', () => window.game.init());
