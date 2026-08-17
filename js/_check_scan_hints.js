const fs = require('fs');
const path = require('path');
const vm = require('vm');

const context = vm.createContext({
  console,
  localStorage: { getItem: () => null, setItem: () => {} },
  window: {
    innerWidth: 1280,
    innerHeight: 720,
    addEventListener: () => {}
  },
  document: {
    documentElement: { style: { setProperty: () => {} } },
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => []
  },
  AudioSys: { play: () => {}, init: () => {} },
  Art: {},
  setTimeout: () => 1,
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {}
});

const root = path.resolve(__dirname, '..');
vm.runInContext(fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8'), context, { filename: 'data.js' });
vm.runInContext(fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8'), context, { filename: 'game.js' });

const Data = vm.runInContext('Data', context);
const game = context.window.game;
const targetLevels = ['L03_smile', 'L04_silence'];
const failures = [];

targetLevels.forEach(levelId => {
  const level = Data.LEVELS[levelId];
  game.level = level;
  const order = [...level.scanConfig.fragments].sort((a, b) => a.targetOrder - b.targetOrder);
  order.forEach((target, index) => {
    const prefix = index === 0 ? '第一步' : '下一步';
    const prompt = game.scanTargetPrompt(prefix, target);
    if (!prompt.includes(`「${target.name}」`)) {
      failures.push(`${levelId} 第 ${index + 1} 步未显示「${target.name}」：${prompt}`);
    }
  });
});

if (failures.length) {
  console.error(`扫描提示校验失败（${failures.length} 项）：`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log('扫描提示校验通过：第三、第四关的每一步都会显示具体目标碎片名称。');
