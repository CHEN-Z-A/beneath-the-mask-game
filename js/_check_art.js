const fs = require('fs');
const vm = require('vm');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/art.js', 'utf8'), ctx);
const A = vm.runInContext('Art', ctx);
const checks = [
  ['pieceSvg(eyebrow)', A.pieceSvg('eyebrow')],
  ['pieceSvg(eye)', A.pieceSvg('eye')],
  ['pieceSvg(nose)', A.pieceSvg('nose')],
  ['pieceSvg(mouth)', A.pieceSvg('mouth')],
  ...['watch', 'smile', 'silence'].flatMap(theme => ['eyebrow', 'eye', 'nose', 'mouth'].map(type => [
    `pieceSvg(${type}, ${theme})`, A.pieceSvg(type, theme)
  ])),
  ...['authority', 'watch', 'smile', 'silence'].flatMap(theme => ['eyebrow', 'eye', 'nose', 'mouth'].map(type => [
    `assemblyPieceSvg(${type}, ${theme})`, A.assemblyPieceSvg(type, theme)
  ])),
  ['fullMaskSvg', A.fullMaskSvg()],
  ['fullMaskSvg(watch)', A.fullMaskSvg('watch')],
  ['fullMaskSvg(smile)', A.fullMaskSvg('smile')],
  ['fullMaskSvg(silence)', A.fullMaskSvg('silence')],
  ['maskOutlineSvg', A.maskOutlineSvg()],
  ['maskOutlineSvg(watch)', A.maskOutlineSvg('watch')],
  ['maskOutlineSvg(smile)', A.maskOutlineSvg('smile')],
  ['maskOutlineSvg(silence)', A.maskOutlineSvg('silence')],
  ['bigEyeSvg', A.bigEyeSvg()],
  ['kingInnerSvg', A.kingInnerSvg()],
  ['kingFaceSvg(authority)', A.kingFaceSvg('authority')],
  ['kingFaceSvg(tired)', A.kingFaceSvg('tired')],
  ['kingFaceSvg(sad)', A.kingFaceSvg('sad')],
  ['cancunAvatarSvg', A.cancunAvatarSvg()],
  ['kingAvatarSvg', A.kingAvatarSvg()],
  ['cancunFullSvg', A.cancunFullSvg()],
  ['brokenMaskSvg', A.brokenMaskSvg()],
  ['coverMaskSvg', A.coverMaskSvg()]
];
let fail = 0;
for (const type of ['eyebrow', 'eye', 'nose', 'mouth']) {
  const variants = ['authority', 'watch', 'smile', 'silence'].map(theme => A.pieceSvg(type, theme));
  if (new Set(variants).size !== 4) {
    console.log('FAIL themed variants are identical', type);
    fail++;
  }
}
for (const [name, s] of checks) {
  if (typeof s !== 'string' || !s.includes('<svg')) { console.log('FAIL', name); fail++; continue; }
  const m = s.match(/viewBox="([^"]+)"/);
  if (!m) { console.log('FAIL no viewBox', name); fail++; continue; }
  const ids = (s.match(/id="[a-zA-Z0-9-]+"/g) || []).map(x => x.slice(4, -1));
  const refs = (s.match(/url\(#([a-zA-Z0-9-]+)\)/g) || []).map(x => x.slice(5, -1));
  const missing = refs.filter(r => !ids.includes(r));
  if (missing.length) { console.log('FAIL refs', name, missing); fail++; }
  else console.log('OK', name, 'viewBox=' + m[1]);
}
console.log(fail === 0 ? 'ALL OK' : 'FAILURES:' + fail);
if (fail > 0) process.exit(1);
