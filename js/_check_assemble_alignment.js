const fs = require('fs');
const vm = require('vm');

const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/art.js', 'utf8'), context);
const Art = vm.runInContext('Art', context);

const themes = ['authority', 'watch', 'smile', 'silence'];
const parts = ['eyebrow', 'eye', 'nose', 'mouth'];
const failures = [];

for (const theme of themes) {
  const layout = typeof Art.assemblyLayout === 'function' ? Art.assemblyLayout(theme) : null;
  if (!layout) {
    failures.push(`${theme} 缺少装配几何`);
    continue;
  }

  for (const part of parts) {
    const box = layout[part];
    if (!box) {
      failures.push(`${theme}.${part} 缺少几何区域`);
      continue;
    }
    const values = ['x', 'y', 'width', 'height'].map(key => Number(box[key]));
    if (values.some(value => !Number.isFinite(value) || value <= 0)) {
      failures.push(`${theme}.${part} 几何值无效`);
      continue;
    }
    if (box.x + box.width > 400 || box.y + box.height > 520) {
      failures.push(`${theme}.${part} 超出 400×520 装配画布`);
    }
    const hit = box.hit;
    if (!hit || ['x', 'y', 'width', 'height'].some(key => !Number.isFinite(Number(hit[key])) || Number(hit[key]) <= 0)) {
      failures.push(`${theme}.${part} 缺少有效拖放命中区域`);
    } else if (hit.x + hit.width > 400 || hit.y + hit.height > 520) {
      failures.push(`${theme}.${part} 的拖放命中区域超出装配画布`);
    }

    if (typeof Art.assemblyPieceSvg !== 'function') {
      failures.push('缺少 Art.assemblyPieceSvg');
      continue;
    }
    const svg = Art.assemblyPieceSvg(part, theme);
    if (!svg.includes('viewBox="0 0 400 520"')) {
      failures.push(`${theme}.${part} 未使用完整装配画布`);
    }
    if (!svg.includes(`data-assembly-theme="${theme}"`) || !svg.includes(`data-assembly-part="${part}"`)) {
      failures.push(`${theme}.${part} 缺少可校验标记`);
    }
  }
}

for (const theme of themes) {
  const outline = Art.maskOutlineSvg(theme);
  if (!outline.includes('mask-feature-guide')) {
    failures.push(`${theme} 的旧五官引导线未标记`);
  }
}

if (failures.length) {
  console.error(failures.map(item => `FAIL: ${item}`).join('\n'));
  process.exit(1);
}

console.log('拼接对齐校验通过：四关的引导态与完成态共用 400×520 装配坐标。');
