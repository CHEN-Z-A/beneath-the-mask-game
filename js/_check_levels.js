const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
const context = vm.createContext({
  console,
  localStorage: { getItem: () => null, setItem: () => {} }
});
vm.runInContext(source, context, { filename: 'data.js' });
const Data = vm.runInContext('Data', context);

const expectedIds = ['L01_authority', 'L02_watch', 'L03_smile', 'L04_silence'];
const requiredStages = ['INIT', 'SCAN', 'ASSEMBLE', 'FLIP', 'RITUAL', 'REVIEW'];
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(JSON.stringify(Data.LEVEL_ORDER) === JSON.stringify(expectedIds), 'LEVEL_ORDER 必须依次包含四个指定关卡');
check(new Set(Data.LEVEL_ORDER).size === 4, '关卡 ID 必须唯一');

Data.LEVEL_ORDER.forEach((id, index) => {
  const level = Data.LEVELS[id];
  check(!!level, `${id} 未注册到 Data.LEVELS`);
  if (!level) return;

  check(level.difficulty === index + 1, `${id} 的 difficulty 应为 ${index + 1}`);
  check(level.theme && level.trainingLabel && level.cultureTag, `${id} 缺少主题、训练标签或文化提示`);
  check(level.visual && level.visual.frontImage && level.visual.backImage && level.visual.ritualImage, `${id} 缺少视觉素材配置`);
  ['frontImage', 'backImage', 'ritualImage', 'lobbyImage'].forEach(key => {
    if (level.visual && level.visual[key]) {
      check(fs.existsSync(path.join(root, level.visual[key])), `${id} 的 ${key} 素材不存在：${level.visual[key]}`);
    }
  });

  const stageNames = (level.stages || []).map(stage => stage.name);
  check(JSON.stringify(stageNames) === JSON.stringify(requiredStages), `${id} 必须包含顺序正确的六阶段`);
  check((level.initDialogue || []).length >= 3, `${id} 的委托对话不足`);
  check((level.scanConfig?.fragments || []).length === 4, `${id} 必须有四块扫描碎片`);
  check((level.assembleConfig?.slots || []).length === 4, `${id} 必须有四个拼合槽位`);
  check(!!level.assembleConfig?.summary, `${id} 缺少复原总结`);

  const infer = level.flipConfig?.question;
  check((infer?.options || []).length >= 3, `${id} 的推理选项不足`);
  check((infer?.options || []).filter(option => option.isCorrect).length === 1, `${id} 的推理题必须恰有一个正确答案`);
  check(!!level.flipConfig?.finalInsight, `${id} 缺少最终洞察`);

  const ritual = level.ritualConfig?.question;
  const ritualIds = new Set((ritual?.options || []).map(option => option.id));
  check((level.ritualConfig?.scenes || []).length >= 3, `${id} 的情境数量不足`);
  check((ritual?.correctPattern || []).length >= 1, `${id} 的仪式题缺少正确组合`);
  (ritual?.correctPattern || []).forEach(optionId => check(ritualIds.has(optionId), `${id} 的正确组合引用了不存在的选项 ${optionId}`));

  check((level.review?.practiceQuestions || []).length === 3, `${id} 必须提供三道家庭讨论题`);
});

if (failures.length) {
  console.error(`关卡数据校验失败（${failures.length} 项）：`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log('关卡数据校验通过：四关结构、题目与素材均有效。');
