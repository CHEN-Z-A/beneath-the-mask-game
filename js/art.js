/* ============================================================
 * 面具之下 · 美术层（程序化 SVG + 关卡专属面具资产）
 * 四关共享三星堆启发的青铜语言，但五官、轮廓与配色各有区分
 * ============================================================ */

const Art = {

  /* ---------- 通用 defs（黄金 / 绿玉 / 蓝珠 / 铜绿锈斑） ---------- */
  _maskDefs(uid) {
    return `
    <defs>
      <linearGradient id="gold-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F9E08A"/>
        <stop offset="45%" stop-color="#E6BE4C"/>
        <stop offset="100%" stop-color="#B8861E"/>
      </linearGradient>
      <linearGradient id="green-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#7FB08C"/>
        <stop offset="50%" stop-color="#4E7A5E"/>
        <stop offset="100%" stop-color="#2E4E3C"/>
      </linearGradient>
      <linearGradient id="blue-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6BA3D9"/>
        <stop offset="100%" stop-color="#2F6BA3"/>
      </linearGradient>
      <linearGradient id="patina-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7FB069" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#4A7C59" stop-opacity="0.3"/>
      </linearGradient>
    </defs>`;
  },

  /* ---------- 三星堆面具静态基础：脸部 + 头饰 + 鼻子 + 耳朵（viewBox 400x520 坐标） ---------- */
  _maskBase(uid) {
    return `
    <!-- 脸部金色基础层 -->
    <path d="M 105 175 L 295 175 L 285 210 L 310 320 L 280 410 L 275 400 L 200 405 L 125 400 L 120 410 L 90 320 L 115 210 Z"
          fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
    <!-- 头饰（金冠带 + 绿回纹 + 羊角翻卷） -->
    <path d="M 110 85 L 290 85 L 292 95 L 108 95 Z" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
    <path d="M 100 95 L 300 95 L 295 175 L 105 175 Z" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
    <path d="M 125 115 Q 135 105 145 115 Q 155 125 145 135 Q 135 145 125 135 Q 115 125 125 115" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
    <path d="M 175 115 Q 185 105 195 115 Q 205 125 195 135 Q 185 145 175 135 Q 165 125 175 115" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
    <path d="M 225 115 Q 235 105 245 115 Q 255 125 245 135 Q 235 145 225 135 Q 215 125 225 115" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
    <path d="M 185 140 Q 200 125 215 140 Q 220 155 200 165 Q 180 155 185 140" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
    <path d="M 195 145 L 195 158 M 205 145 L 205 158" stroke="#1E3A2C" stroke-width="1.5"/>
    <path d="M 100 95 Q 70 85 60 60 Q 55 40 70 35 Q 85 32 85 50 Q 85 62 74 62 Q 66 62 66 52" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
    <path d="M 62 48 Q 72 42 80 50" fill="none" stroke="#8B6914" stroke-width="2"/>
    <path d="M 300 95 Q 330 85 340 60 Q 345 40 330 35 Q 315 32 315 50 Q 315 62 326 62 Q 334 62 334 52" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
    <path d="M 338 48 Q 328 42 320 50" fill="none" stroke="#8B6914" stroke-width="2"/>
    <line x1="105" y1="175" x2="295" y2="175" stroke="#8B6914" stroke-width="2"/>
    <!-- 鼻子 -->
    <line x1="200" y1="260" x2="200" y2="315" stroke="#8B6914" stroke-width="2"/>
    <path d="M 185 285 Q 190 300 188 300" fill="none" stroke="#8B6914" stroke-width="2"/>
    <path d="M 215 285 Q 210 300 212 300" fill="none" stroke="#8B6914" stroke-width="2"/>
    <path d="M 188 300 L 188 320 L 212 320 L 212 300" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
    <line x1="188" y1="320" x2="212" y2="320" stroke="#8B6914" stroke-width="2"/>
    <path d="M 193 325 Q 196 328 199 325" fill="none" stroke="#5C4210" stroke-width="1.5"/>
    <path d="M 201 325 Q 204 328 207 325" fill="none" stroke="#5C4210" stroke-width="1.5"/>
    <!-- 耳朵（大耳 + 卷云纹 + 珠串耳坠） -->
    <path d="M 100 210 Q 50 200 35 260 Q 30 310 55 340 Q 75 355 95 330 Q 105 300 100 260" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
    <path d="M 80 240 Q 60 235 55 260 Q 52 280 70 285 Q 85 288 88 270 Q 90 255 75 252" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
    <path d="M 72 265 Q 68 275 78 278" fill="none" stroke="#1E3A2C" stroke-width="1.5"/>
    <line x1="55" y1="340" x2="55" y2="390" stroke="#8B6914" stroke-width="2"/>
    <circle cx="55" cy="345" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
    <circle cx="55" cy="355" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
    <circle cx="55" cy="365" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
    <circle cx="55" cy="375" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
    <path d="M 50 390 L 60 390 L 55 405 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
    <path d="M 300 210 Q 350 200 365 260 Q 370 310 345 340 Q 325 355 305 330 Q 295 300 300 260" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
    <path d="M 320 240 Q 340 235 345 260 Q 348 280 330 285 Q 315 288 312 270 Q 310 255 325 252" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
    <path d="M 328 265 Q 332 275 322 278" fill="none" stroke="#1E3A2C" stroke-width="1.5"/>
    <line x1="345" y1="340" x2="345" y2="390" stroke="#8B6914" stroke-width="2"/>
    <circle cx="345" cy="345" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
    <circle cx="345" cy="355" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
    <circle cx="345" cy="365" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
    <circle cx="345" cy="375" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
    <path d="M 340 390 L 350 390 L 345 405 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>`;
  },

  /* ---------- 常规绿色眉毛（三星堆） ---------- */
  _browsNormal(uid) {
    return `
    <path d="M 125 230 Q 155 225 185 233 L 183 247 Q 155 240 127 244 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
    <path d="M 275 230 Q 245 225 215 233 L 217 247 Q 245 240 273 244 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>`;
  },

  /* ---------- 常规眼睛（金睑 + 蓝珠） ---------- */
  _eyesNormal(uid) {
    return `
    <path d="M 135 265 Q 160 250 185 265 Q 190 285 160 295 Q 130 285 135 265" fill="#F4D97E" stroke="#8B6914" stroke-width="2"/>
    <ellipse cx="160" cy="275" rx="14" ry="10" fill="url(#blue-${uid})" stroke="#1C456E" stroke-width="1.5"/>
    <ellipse cx="160" cy="275" rx="7" ry="5" fill="#122B44"/>
    <path d="M 135 265 Q 160 255 185 265" fill="none" stroke="#8B6914" stroke-width="2"/>
    <path d="M 265 265 Q 240 250 215 265 Q 210 285 240 295 Q 270 285 265 265" fill="#F4D97E" stroke="#8B6914" stroke-width="2"/>
    <ellipse cx="240" cy="275" rx="14" ry="10" fill="url(#blue-${uid})" stroke="#1C456E" stroke-width="1.5"/>
    <ellipse cx="240" cy="275" rx="7" ry="5" fill="#122B44"/>
    <path d="M 265 265 Q 240 255 215 265" fill="none" stroke="#8B6914" stroke-width="2"/>`;
  },

  /* ---------- 常规嘴（三星堆横抿） ---------- */
  _mouthNormal() {
    return `
    <line x1="165" y1="375" x2="235" y2="375" stroke="#5C4210" stroke-width="3" stroke-linecap="round"/>`;
  },

  /* ---------- 第二、三关专属五官：纵目守望 / 含笑祭舞 ---------- */
  _themedPieceSvg(type, theme) {
    const uid = `${theme}-${type}`;
    const watch = {
      eyebrow: `<path d="M18 88 Q74 18 146 48 L138 75 Q78 50 28 105 Z" fill="url(#pat-${uid})" stroke="#D3AA3C" stroke-width="6"/><path d="M302 88 Q246 18 174 48 L182 75 Q242 50 292 105 Z" fill="url(#pat-${uid})" stroke="#D3AA3C" stroke-width="6"/>`,
      eye: `<path d="M8 48 Q70 12 148 43 L140 96 Q68 80 8 92 Z" fill="url(#pat-${uid})" stroke="#D3AA3C" stroke-width="7"/><path d="M312 48 Q250 12 172 43 L180 96 Q252 80 312 92 Z" fill="url(#pat-${uid})" stroke="#D3AA3C" stroke-width="7"/><circle cx="104" cy="67" r="18" fill="url(#lapis-${uid})" stroke="#F0CD68" stroke-width="5"/><circle cx="216" cy="67" r="18" fill="url(#lapis-${uid})" stroke="#F0CD68" stroke-width="5"/>`,
      nose: `<path d="M132 8 L188 8 L181 105 L160 134 L139 105 Z" fill="url(#pat-${uid})" stroke="#D3AA3C" stroke-width="7"/><path d="M138 103 Q160 120 182 103" fill="none" stroke="#6B4518" stroke-width="6"/>`,
      mouth: `<path d="M80 58 Q160 42 240 58 L228 91 Q160 80 92 91 Z" fill="url(#gold-${uid})" stroke="#72501A" stroke-width="6"/><path d="M101 70 Q160 65 219 70" fill="none" stroke="#3A2916" stroke-width="6"/>`
    };
    const smile = {
      eyebrow: `<path d="M30 82 Q86 32 145 66" fill="none" stroke="url(#jade-${uid})" stroke-width="18" stroke-linecap="round"/><path d="M290 82 Q234 32 175 66" fill="none" stroke="url(#jade-${uid})" stroke-width="18" stroke-linecap="round"/><circle cx="32" cy="82" r="7" fill="#C34F2E"/><circle cx="288" cy="82" r="7" fill="#C34F2E"/>`,
      eye: `<path d="M24 82 Q82 28 145 78 Q87 62 34 97 Z" fill="url(#gold-${uid})" stroke="#8A5A1D" stroke-width="6"/><path d="M296 82 Q238 28 175 78 Q233 62 286 97 Z" fill="url(#gold-${uid})" stroke="#8A5A1D" stroke-width="6"/><path d="M43 78 Q87 48 127 76 M277 78 Q233 48 193 76" fill="none" stroke="#2A2017" stroke-width="7" stroke-linecap="round"/>`,
      nose: `<path d="M145 18 Q160 6 175 18 L180 102 Q160 121 140 102 Z" fill="url(#gold-${uid})" stroke="#98651F" stroke-width="6"/><path d="M140 100 Q160 117 180 100" fill="none" stroke="#6E4218" stroke-width="5"/>`,
      mouth: `<path d="M72 48 Q160 126 248 48 Q226 124 160 132 Q94 124 72 48 Z" fill="url(#gold-${uid})" stroke="#8A4E1B" stroke-width="6"/><path d="M96 72 Q160 116 224 72" fill="none" stroke="#A93E27" stroke-width="7" stroke-linecap="round"/>`
    };
    const silence = {
      eyebrow: `<path d="M22 55 L145 62 L139 92 L28 86 Z" fill="url(#stone-${uid})" stroke="#8A9A8F" stroke-width="6"/><path d="M298 55 L175 62 L181 92 L292 86 Z" fill="url(#stone-${uid})" stroke="#8A9A8F" stroke-width="6"/><path d="M48 68 L124 72 M272 68 L196 72" stroke="#D29B46" stroke-width="3" opacity=".65"/>`,
      eye: `<path d="M26 54 L145 62 L134 104 Q78 112 34 85 Z" fill="url(#stone-${uid})" stroke="#789287" stroke-width="6"/><path d="M294 54 L175 62 L186 104 Q242 112 286 85 Z" fill="url(#stone-${uid})" stroke="#789287" stroke-width="6"/><path d="M48 76 Q88 105 128 78 M272 76 Q232 105 192 78" fill="none" stroke="#101A1E" stroke-width="10" stroke-linecap="round"/>`,
      nose: `<path d="M137 12 L183 12 L190 105 L160 132 L130 105 Z" fill="url(#stone-${uid})" stroke="#8A9A8F" stroke-width="7"/><path d="M154 20 L158 112" stroke="#C29142" stroke-width="3" opacity=".7"/>`,
      mouth: `<rect x="72" y="53" width="176" height="42" rx="7" fill="url(#stone-${uid})" stroke="#84978F" stroke-width="7"/><path d="M96 74 L224 74" stroke="#11191C" stroke-width="8"/><path d="M113 58 L107 90 M207 58 L213 90" stroke="#C29142" stroke-width="3" opacity=".6"/>`
    };
    const shapes = theme === 'watch' ? watch : theme === 'smile' ? smile : silence;
    return `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="gold-${uid}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#FFE08A"/><stop offset=".5" stop-color="#D7A83D"/><stop offset="1" stop-color="#8E5B1D"/></linearGradient>
        <linearGradient id="pat-${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#85C6A5"/><stop offset=".5" stop-color="#2F8B79"/><stop offset="1" stop-color="#175047"/></linearGradient>
        <linearGradient id="jade-${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#B0D1A2"/><stop offset=".5" stop-color="#5E9A76"/><stop offset="1" stop-color="#315D49"/></linearGradient>
        <linearGradient id="stone-${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#557B72"/><stop offset=".45" stop-color="#263F3D"/><stop offset="1" stop-color="#111D22"/></linearGradient>
        <radialGradient id="lapis-${uid}"><stop stop-color="#C8F1FF"/><stop offset=".35" stop-color="#338DC0"/><stop offset="1" stop-color="#102D54"/></radialGradient>
      </defs>
      ${shapes[type] || ''}
    </svg>`;
  },

  /* ========== 碎片（三星堆部位裁剪） ========== */
  pieceSvg(type, theme = 'authority') {
    if (theme === 'watch' || theme === 'smile' || theme === 'silence') return this._themedPieceSvg(type, theme);
    /* 2.0 五官素材：直接从确认过的五官预览图裁切，保证碎片与角色面部一致 */
    const featureCrops = {
      eyebrow: { asset: 'feature-eyebrow-final.png', w: 920, h: 285 },
      eye:     { asset: 'feature-eye-final-clean.png', w: 900, h: 320 },
      nose:    { asset: 'feature-nose-final.png', w: 380, h: 390 },
      mouth:   { asset: 'feature-mouth-final.png', w: 600, h: 170 }
    };
    const crop = featureCrops[type];
    if (crop) {
      return `<svg viewBox="0 0 ${crop.w} ${crop.h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <image href="assets/${crop.asset}" x="0" y="0" width="${crop.w}" height="${crop.h}" preserveAspectRatio="none"/>
    </svg>`;
    }
    const g = {
      eyebrow: `<path d="M 125 230 Q 155 225 185 233 L 183 247 Q 155 240 127 244 Z" fill="url(#pg-${'piece-' + type})" stroke="#1E3A2C" stroke-width="3"/>
      <path d="M 275 230 Q 245 225 215 233 L 217 247 Q 245 240 273 244 Z" fill="url(#pg-${'piece-' + type})" stroke="#1E3A2C" stroke-width="3"/>`,
      eye: `<path d="M 135 265 Q 160 250 185 265 Q 190 285 160 295 Q 130 285 135 265" fill="url(#pg-${'piece-' + type})" stroke="#6B4B1A" stroke-width="3"/>
      <path d="M 140 265 Q 160 255 180 265 Q 176 285 160 289 Q 144 285 140 265 Z" fill="url(#pm-${'piece-' + type})" stroke="#C79A3B" stroke-width="2"/>
      <ellipse cx="160" cy="275" rx="9" ry="7" fill="none" stroke="#B8861E" stroke-width="1.5"/>
      <circle cx="160" cy="275" r="3" fill="#E8C547"/>
      <path d="M 265 265 Q 240 250 215 265 Q 210 285 240 295 Q 270 285 265 265" fill="url(#pg-${'piece-' + type})" stroke="#6B4B1A" stroke-width="3"/>
      <path d="M 260 265 Q 240 255 220 265 Q 224 285 240 289 Q 256 285 260 265 Z" fill="url(#pm-${'piece-' + type})" stroke="#C79A3B" stroke-width="2"/>
      <ellipse cx="240" cy="275" rx="9" ry="7" fill="none" stroke="#B8861E" stroke-width="1.5"/>
      <circle cx="240" cy="275" r="3" fill="#E8C547"/>`,
      nose: `<path d="M 185 285 Q 190 300 188 300" fill="none" stroke="#8B6914" stroke-width="3"/>
      <path d="M 215 285 Q 210 300 212 300" fill="none" stroke="#8B6914" stroke-width="3"/>
      <path d="M 188 300 L 188 320 L 212 320 L 212 300" fill="url(#pg-${'piece-' + type})" stroke="#8B6914" stroke-width="3"/>
      <line x1="188" y1="320" x2="212" y2="320" stroke="#8B6914" stroke-width="3"/>
      <path d="M 193 325 Q 196 328 199 325" fill="none" stroke="#5C4210" stroke-width="2"/>
      <path d="M 201 325 Q 204 328 207 325" fill="none" stroke="#5C4210" stroke-width="2"/>`,
      mouth: `<line x1="165" y1="375" x2="235" y2="375" stroke="#5C4210" stroke-width="5" stroke-linecap="round"/>`
    };
    const vb = {
      eyebrow: '105 215 190 42',
      eye:     '120 245 160 58',
      nose:    '180 255 42 84',
      mouth:   '150 365 100 20'
    };
    const uid = 'piece-' + type;
    return `<svg viewBox="${vb[type]}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="pg-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F9E08A"/><stop offset="45%" stop-color="#E6BE4C"/><stop offset="100%" stop-color="#B8861E"/>
      </linearGradient>
      <linearGradient id="pb-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6BA3D9"/><stop offset="100%" stop-color="#2F6BA3"/>
      </linearGradient>
      <radialGradient id="pm-${uid}" cx="38%" cy="30%" r="78%">
        <stop offset="0%" stop-color="#B6C58A"/><stop offset="42%" stop-color="#66836A"/>
        <stop offset="78%" stop-color="#3C5C4D"/><stop offset="100%" stop-color="#263A32"/>
      </radialGradient>
    </defs>
    ${g[type]}
    <!-- 铜绿锈斑 -->
    <circle cx="30" cy="18" r="7" fill="url(#pb-${uid})" opacity="0.18"/>
    <circle cx="120" cy="64" r="8" fill="url(#pb-${uid})" opacity="0.14"/>
  </svg>`;
  },

  /* ========== 完整正面面具（三星堆黄金面具 400x520） ========== */
  fullMaskSvg(theme = 'authority') {
    const themedImage = {
      watch: 'assets/sanxingdui-watch-mask-v1.png',
      smile: 'assets/sanxingdui-smile-mask-v1.png',
      silence: 'assets/sanxingdui-silence-mask-v1.png'
    }[theme];
    if (themedImage) {
      return `<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <image href="${themedImage}" x="0" y="0" width="400" height="520" preserveAspectRatio="xMidYMid meet"/>
      </svg>`;
    }
    const uid = 'full';
    return `
<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  ${this._maskDefs(uid)}
  ${this._maskBase(uid)}
  ${this._browsNormal(uid)}
  ${this._eyesNormal(uid)}
  ${this._mouthNormal()}
  <!-- 面部纹理 -->
  <path d="M 130 185 Q 200 180 270 185" stroke="#B8861E" stroke-width="1.5" fill="none" opacity="0.4"/>
  <path d="M 150 420 Q 200 430 250 420" stroke="#B8861E" stroke-width="1.5" fill="none" opacity="0.35"/>
  <!-- 铜绿锈斑 -->
  <circle cx="140" cy="195" r="8" fill="url(#patina-${uid})" opacity="0.45"/>
  <circle cx="260" cy="205" r="7" fill="url(#patina-${uid})" opacity="0.4"/>
</svg>`;
  },

  /* ========== 面具线框（ASSEMBLE 槽位参考） ========== */
  maskOutlineSvg(theme = 'authority') {
    if (theme === 'watch') {
      return `<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs><linearGradient id="watch-line" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8ED2BC"/><stop offset="1" stop-color="#CDA63A"/></linearGradient></defs>
        <path d="M154 142 L158 28 Q164 14 176 26 L184 142 M216 142 L224 26 Q236 14 242 28 L246 142" fill="none" stroke="url(#watch-line)" stroke-width="3" stroke-dasharray="7 6"/>
        <path d="M116 140 Q200 96 284 140 L302 420 Q268 486 200 500 Q132 486 98 420 Z" fill="none" stroke="url(#watch-line)" stroke-width="3" stroke-dasharray="7 6"/>
        <path d="M18 256 Q94 208 184 246 L172 302 Q88 278 18 292 Z M382 256 Q306 208 216 246 L228 302 Q312 278 382 292 Z" fill="none" stroke="#D6B34A" stroke-width="3" stroke-dasharray="5 5"/>
        <circle cx="130" cy="270" r="18" fill="none" stroke="#8ED2BC" stroke-width="2" stroke-dasharray="4 4"/><circle cx="270" cy="270" r="18" fill="none" stroke="#8ED2BC" stroke-width="2" stroke-dasharray="4 4"/>
        <path d="M178 210 L222 210 L216 348 L200 370 L184 348 Z M142 384 Q200 366 258 384" fill="none" stroke="#D6B34A" stroke-width="3" stroke-dasharray="5 5"/>
      </svg>`;
    }
    if (theme === 'smile') {
      return `<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs><linearGradient id="smile-line" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#E8C260"/><stop offset=".55" stop-color="#88B08C"/><stop offset="1" stop-color="#B95332"/></linearGradient></defs>
        <path d="M200 34 Q224 72 220 122 M172 126 Q120 96 104 54 Q154 58 190 108 M228 126 Q280 96 296 54 Q246 58 210 108" fill="none" stroke="url(#smile-line)" stroke-width="3" stroke-dasharray="7 6"/>
        <ellipse cx="200" cy="304" rx="126" ry="190" fill="none" stroke="url(#smile-line)" stroke-width="3" stroke-dasharray="7 6"/>
        <path d="M104 228 Q150 190 188 232 M296 228 Q250 190 212 232" fill="none" stroke="#78A985" stroke-width="5" stroke-dasharray="5 5"/>
        <path d="M112 274 Q150 232 188 270 Q150 254 118 286 M288 274 Q250 232 212 270 Q250 254 282 286" fill="none" stroke="#D9AE44" stroke-width="3" stroke-dasharray="5 5"/>
        <path d="M188 248 Q200 234 212 248 L216 342 Q200 358 184 342 Z" fill="none" stroke="#D9AE44" stroke-width="3" stroke-dasharray="5 5"/>
        <path d="M132 366 Q200 446 268 366 Q244 432 200 440 Q156 432 132 366 Z" fill="none" stroke="#B95332" stroke-width="4" stroke-dasharray="5 5"/>
      </svg>`;
    }
    if (theme === 'silence') {
      return `<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs><linearGradient id="silence-line" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#9CB7AE"/><stop offset=".48" stop-color="#537B75"/><stop offset="1" stop-color="#B07B39"/></linearGradient></defs>
        <path d="M118 142 L118 94 L148 94 L148 62 L184 62 L184 26 L216 26 L216 62 L252 62 L252 94 L282 94 L282 142" fill="none" stroke="url(#silence-line)" stroke-width="3" stroke-dasharray="7 6"/>
        <path d="M102 140 L298 140 L316 422 Q276 490 200 500 Q124 490 84 422 Z" fill="none" stroke="url(#silence-line)" stroke-width="3" stroke-dasharray="7 6"/>
        <path d="M84 212 L44 220 L52 370 L92 362 M316 212 L356 220 L348 370 L308 362" fill="none" stroke="#587E78" stroke-width="3" stroke-dasharray="6 6"/>
        <path d="M108 226 L188 234 L182 264 L116 258 Z M292 226 L212 234 L218 264 L284 258 Z" fill="none" stroke="#87A59C" stroke-width="4" stroke-dasharray="5 5"/>
        <path d="M122 274 Q154 304 184 278 M278 274 Q246 304 216 278" fill="none" stroke="#3E625F" stroke-width="4" stroke-dasharray="5 5"/>
        <path d="M182 238 L218 238 L224 352 L200 374 L176 352 Z" fill="none" stroke="#A67A3C" stroke-width="3" stroke-dasharray="5 5"/>
        <rect x="128" y="386" width="144" height="38" rx="5" fill="none" stroke="#7F9990" stroke-width="3" stroke-dasharray="5 5"/>
        <path d="M150 405 L250 405" stroke="#A67A3C" stroke-width="3" stroke-dasharray="5 5"/>
      </svg>`;
    }
    const uid = 'outline';
    return `
<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="gold-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F9E08A"/>
      <stop offset="45%" stop-color="#E6BE4C"/>
      <stop offset="100%" stop-color="#B8861E"/>
    </linearGradient>
    <linearGradient id="green-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7FB08C"/>
      <stop offset="50%" stop-color="#4E7A5E"/>
      <stop offset="100%" stop-color="#2E4E3C"/>
    </linearGradient>
  </defs>
  <!-- 三星堆新面具外轮廓：高冠、宽耳、下垂耳饰 -->
  <path d="M 82 182 Q 70 135 74 88 Q 80 42 112 28 Q 200 -6 288 28 Q 320 42 326 88 Q 330 135 318 182"
        fill="none" stroke="url(#gold-${uid})" stroke-width="2.5" stroke-dasharray="7 6" opacity="0.75"/>
  <path d="M 200 18 L 200 174 M 174 52 L 174 144 M 226 52 L 226 144"
        fill="none" stroke="url(#green-${uid})" stroke-width="2" stroke-dasharray="5 5" opacity="0.65"/>
  <path d="M 82 182 Q 60 206 58 258 Q 56 318 84 350 L 102 432 Q 118 474 150 488 Q 200 508 250 488 Q 282 474 298 432 L 316 350 Q 344 318 342 258 Q 340 206 318 182 Q 290 170 260 176 L 200 184 L 140 176 Q 110 170 82 182 Z"
        fill="none" stroke="url(#gold-${uid})" stroke-width="2.5" stroke-dasharray="7 6" opacity="0.75"/>
  <!-- 夸张耳廓与耳饰 -->
  <path d="M 102 190 Q 58 180 40 220 Q 24 266 42 316 Q 58 350 94 342 Q 108 316 104 266" fill="none" stroke="url(#gold-${uid})" stroke-width="2" stroke-dasharray="5 5" opacity="0.65"/>
  <path d="M 298 190 Q 342 180 360 220 Q 376 266 358 316 Q 342 350 306 342 Q 292 316 296 266" fill="none" stroke="url(#gold-${uid})" stroke-width="2" stroke-dasharray="5 5" opacity="0.65"/>
  <path d="M 54 290 L 54 390 M 346 290 L 346 390 M 45 390 L 63 390 M 337 390 L 355 390" fill="none" stroke="url(#green-${uid})" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>
  <!-- 眉槽位参考 -->
  <path d="M 118 230 Q 153 220 188 232 L 185 249 Q 151 240 120 246 Z" fill="none" stroke="url(#green-${uid})" stroke-width="2" stroke-dasharray="4 4" opacity="0.7"/>
  <path d="M 282 230 Q 247 220 212 232 L 215 249 Q 249 240 280 246 Z" fill="none" stroke="url(#green-${uid})" stroke-width="2" stroke-dasharray="4 4" opacity="0.7"/>
  <!-- 眼槽位参考 -->
  <path d="M 130 268 Q 160 248 190 268 Q 190 292 160 304 Q 130 292 130 268" fill="none" stroke="#B8861E" stroke-width="2" stroke-dasharray="4 4" opacity="0.7"/>
  <path d="M 270 268 Q 240 248 210 268 Q 210 292 240 304 Q 270 292 270 268" fill="none" stroke="#B8861E" stroke-width="2" stroke-dasharray="4 4" opacity="0.7"/>
  <!-- 鼻槽位参考 -->
  <line x1="200" y1="260" x2="200" y2="348" stroke="#B8861E" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>
  <path d="M 184 326 L 184 350 L 216 350 L 216 326" fill="none" stroke="#B8861E" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>
  <!-- 嘴槽位参考 -->
  <line x1="152" y1="378" x2="248" y2="378" stroke="#5C4210" stroke-width="3" stroke-dasharray="4 4" opacity="0.7"/>
</svg>`;
  },

  /* ========== SCAN 铜镜眼（青铜镜面 + 铜绿纹理，带扫描准星） ========== */
  bigEyeSvg() {
    const uid = 'eye';
    return `
<svg viewBox="0 0 130 96" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  ${this._maskDefs(uid)}
  <linearGradient id="bronze-eye-${uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#E0B95F"/>
    <stop offset="48%" stop-color="#A97A2B"/>
    <stop offset="100%" stop-color="#5A3A18"/>
  </linearGradient>
  <radialGradient id="mirror-eye-${uid}" cx="38%" cy="30%" r="78%">
    <stop offset="0%" stop-color="#B6C58A"/>
    <stop offset="42%" stop-color="#66836A"/>
    <stop offset="78%" stop-color="#3C5C4D"/>
    <stop offset="100%" stop-color="#263A32"/>
  </radialGradient>
  <!-- 扫描准星 -->
  <circle cx="65" cy="48" r="42" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.8"/>
  <path d="M 65 2 L 65 12 M 65 84 L 65 94 M 2 48 L 12 48 M 118 48 L 128 48" stroke="#D4AF37" stroke-width="2" opacity="0.7"/>
  <!-- 铜镜外缘：保留眼形轮廓，但改为金铜铸造质感 -->
  <path d="M 12 44 Q 40 18 65 20 Q 92 18 118 44 Q 104 70 65 76 Q 26 70 12 44" fill="url(#bronze-eye-${uid})" stroke="#6B4B1A" stroke-width="2.5"/>
  <path d="M 18 43 Q 41 22 65 24 Q 91 22 112 43 Q 99 63 65 68 Q 31 63 18 43 Z" fill="url(#mirror-eye-${uid})" stroke="#C79A3B" stroke-width="2"/>
  <!-- 铜镜中心钮与同心纹 -->
  <ellipse cx="65" cy="48" rx="17" ry="13" fill="none" stroke="#B8861E" stroke-width="1.5" opacity=".85"/>
  <ellipse cx="65" cy="48" rx="7" ry="5.5" fill="#6C5525" stroke="#D2A84B" stroke-width="1.5"/>
  <circle cx="65" cy="48" r="2.5" fill="#E8C547"/>
  <path d="M 27 42 Q 43 29 58 29 M 72 29 Q 88 30 103 42" stroke="#D9C27A" stroke-width="1.5" fill="none" opacity=".65"/>
  <path d="M 31 57 Q 47 65 59 66 M 71 66 Q 84 64 99 57" stroke="#2D4B3E" stroke-width="2" fill="none" opacity=".8"/>
</svg>`;
  },

  /* ========== 面具背面：国王内心（三星堆风格疲惫脸） ========== */
  kingInnerSvg() {
    const uid = 'kingback';
    return `
<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <defs>
    <radialGradient id="halo-${uid}" cx="0.5" cy="0.45" r="0.72">
      <stop offset="0%" stop-color="#c9a45c" stop-opacity="0.4"/>
      <stop offset="55%" stop-color="#4E7A5E" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#1c130a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${this._maskDefs(uid)}
  <ellipse cx="200" cy="240" rx="200" ry="250" fill="url(#halo-${uid})"/>
  ${this._maskBase(uid)}
  <!-- 眉：疲惫低垂 -->
  <path d="M 125 234 Q 155 232 185 238 L 183 246 Q 155 243 127 245 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5" opacity="0.95"/>
  <path d="M 275 234 Q 245 232 215 238 L 217 246 Q 245 243 273 245 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5" opacity="0.95"/>
  <!-- 眼：疲惫半闭 -->
  <path d="M 135 268 Q 160 258 185 268 Q 190 282 160 290 Q 130 282 135 268" fill="#F4D97E" stroke="#8B6914" stroke-width="2"/>
  <path d="M 135 268 Q 160 258 185 268" stroke="#8B6914" stroke-width="2.5" fill="none"/>
  <ellipse cx="160" cy="279" rx="10" ry="5" fill="url(#blue-${uid})" stroke="#1C456E" stroke-width="1.2"/>
  <ellipse cx="160" cy="279" rx="4" ry="2" fill="#122B44"/>
  <path d="M 265 268 Q 240 258 215 268 Q 210 282 240 290 Q 270 282 265 268" fill="#F4D97E" stroke="#8B6914" stroke-width="2"/>
  <path d="M 265 268 Q 240 258 215 268" stroke="#8B6914" stroke-width="2.5" fill="none"/>
  <ellipse cx="240" cy="279" rx="10" ry="5" fill="url(#blue-${uid})" stroke="#1C456E" stroke-width="1.2"/>
  <ellipse cx="240" cy="279" rx="4" ry="2" fill="#122B44"/>
  <!-- 泪光 -->
  <path d="M 158 298 Q 158 304 160 306 Q 162 304 162 298" fill="#6BA3D9" opacity="0.8"/>
  <path d="M 238 298 Q 238 304 240 306 Q 242 304 242 298" fill="#6BA3D9" opacity="0.7"/>
  <!-- 嘴：松弛 -->
  <line x1="178" y1="378" x2="222" y2="378" stroke="#5C4210" stroke-width="3" stroke-linecap="round"/>
  <!-- 锈斑 -->
  <circle cx="130" cy="330" r="8" fill="url(#patina-${uid})" opacity="0.45"/>
  <circle cx="270" cy="340" r="7" fill="url(#patina-${uid})" opacity="0.4"/>
</svg>`;
  },

  /* ========== RITUAL 场景国王头像（三星堆风格三表情） ========== */
  kingFaceSvg(expr) {
    const uid = 'face-' + (expr || 'tired');
    const exprs = {
      /* 祭祀：威严 */
      authority: `
        ${this._browsNormal(uid)}
        ${this._eyesNormal(uid)}
        <!-- 口：紧抿 -->
        <line x1="172" y1="373" x2="228" y2="373" stroke="#5C4210" stroke-width="3.5" stroke-linecap="round"/>`,
      /* 母亲面前：疲惫 */
      tired: `
        <!-- 眉：低垂 -->
        <path d="M 125 234 Q 155 232 185 238 L 183 246 Q 155 243 127 245 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5" opacity="0.95"/>
        <path d="M 275 234 Q 245 232 215 238 L 217 246 Q 245 243 273 245 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5" opacity="0.95"/>
        <!-- 眼：疲惫半闭 -->
        <path d="M 135 268 Q 160 258 185 268 Q 190 282 160 290 Q 130 282 135 268" fill="#F4D97E" stroke="#8B6914" stroke-width="2"/>
        <path d="M 135 268 Q 160 258 185 268" stroke="#8B6914" stroke-width="2.5" fill="none"/>
        <ellipse cx="160" cy="279" rx="10" ry="5" fill="url(#blue-${uid})" stroke="#1C456E" stroke-width="1.2"/>
        <ellipse cx="160" cy="279" rx="4" ry="2" fill="#122B44"/>
        <path d="M 265 268 Q 240 258 215 268 Q 210 282 240 290 Q 270 282 265 268" fill="#F4D97E" stroke="#8B6914" stroke-width="2"/>
        <path d="M 265 268 Q 240 258 215 268" stroke="#8B6914" stroke-width="2.5" fill="none"/>
        <ellipse cx="240" cy="279" rx="10" ry="5" fill="url(#blue-${uid})" stroke="#1C456E" stroke-width="1.2"/>
        <ellipse cx="240" cy="279" rx="4" ry="2" fill="#122B44"/>
        <!-- 泪光 -->
        <path d="M 158 296 Q 158 302 160 304 Q 162 302 162 296" fill="#6BA3D9" opacity="0.75"/>
        <path d="M 238 296 Q 238 302 240 304 Q 242 302 242 296" fill="#6BA3D9" opacity="0.65"/>
        <!-- 口：松弛 -->
        <line x1="178" y1="378" x2="222" y2="378" stroke="#5C4210" stroke-width="3" stroke-linecap="round"/>`,
      /* 独处深夜：悲伤 */
      sad: `
        <!-- 眉：下压 -->
        <path d="M 125 236 Q 155 230 185 238 L 183 246 Q 155 243 127 245 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5" opacity="0.95"/>
        <path d="M 275 236 Q 245 230 215 238 L 217 246 Q 245 243 273 245 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5" opacity="0.95"/>
        <!-- 眼：含泪低垂 -->
        <path d="M 135 272 Q 160 262 185 272" stroke="#8B6914" stroke-width="2.5" fill="none"/>
        <path d="M 135 272 Q 160 266 185 272 Q 190 284 160 292 Q 130 284 135 272" fill="#F4D97E" stroke="#8B6914" stroke-width="2" opacity="0.85"/>
        <ellipse cx="160" cy="282" rx="10" ry="5" fill="url(#blue-${uid})" stroke="#1C456E" stroke-width="1.2" opacity="0.9"/>
        <ellipse cx="160" cy="282" rx="4" ry="2" fill="#122B44"/>
        <path d="M 265 272 Q 240 262 215 272" stroke="#8B6914" stroke-width="2.5" fill="none"/>
        <path d="M 265 272 Q 240 266 215 272 Q 210 284 240 292 Q 270 284 265 272" fill="#F4D97E" stroke="#8B6914" stroke-width="2" opacity="0.85"/>
        <ellipse cx="240" cy="282" rx="10" ry="5" fill="url(#blue-${uid})" stroke="#1C456E" stroke-width="1.2" opacity="0.9"/>
        <ellipse cx="240" cy="282" rx="4" ry="2" fill="#122B44"/>
        <!-- 泪珠 -->
        <path d="M 148 300 Q 148 308 150 310 Q 152 308 152 300" fill="#6BA3D9" opacity="0.85"/>
        <path d="M 248 298 Q 248 306 250 308 Q 252 306 252 298" fill="#6BA3D9" opacity="0.75"/>
        <!-- 口：下弯 -->
        <path d="M 172 378 Q 200 372 228 378" stroke="#5C4210" stroke-width="3" stroke-linecap="round" fill="none"/>`
    };
    return `
<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <defs>
    <radialGradient id="halo-${uid}" cx="0.5" cy="0.45" r="0.7">
      <stop offset="0%" stop-color="#c9a45c" stop-opacity="0.35"/>
      <stop offset="55%" stop-color="#5a8a6e" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#1c130a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${this._maskDefs(uid)}
  <ellipse cx="150" cy="180" rx="150" ry="185" fill="url(#halo-${uid})"/>
  <g transform="translate(0, 28) scale(0.75)">
    ${this._maskBase(uid)}
    ${exprs[expr] || exprs.tired}
  </g>
</svg>`;
  },

  /* ========== 蚕丛头像（三星堆黄金面具） ========== */
  cancunAvatarSvg() {
    const uid = 'cancun';
    return `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  ${this._maskDefs(uid)}
  <circle cx="60" cy="60" r="56" fill="#1c130a"/>
  <g transform="translate(10, 6) scale(0.25)">
    ${this._maskBase(uid)}
    ${this._browsNormal(uid)}
    ${this._eyesNormal(uid)}
    ${this._mouthNormal()}
  </g>
</svg>`;
  },

  /* ========== 古蜀国王头像（三星堆黄金面具 + 额冠标记） ========== */
  kingAvatarSvg() {
    const uid = 'kingavatar';
    return `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  ${this._maskDefs(uid)}
  <circle cx="60" cy="60" r="56" fill="#1c130a"/>
  <g transform="translate(10, 6) scale(0.25)">
    ${this._maskBase(uid)}
    ${this._browsNormal(uid)}
    ${this._eyesNormal(uid)}
    ${this._mouthNormal()}
    <!-- 额冠标记（金色菱纹） -->
    <path d="M 193 200 L 207 200 L 200 212 Z" fill="#F4D97E" stroke="#8B6914" stroke-width="1.2"/>
    <path d="M 193 200 L 207 200 L 200 188 Z" fill="#4E7A5E" stroke="#2E4E3C" stroke-width="1.2"/>
  </g>
</svg>`;
  },

  /* ========== 蚕丛全身立绘（三星堆黄金面具头 + 绿袍） ========== */
  cancunFullSvg() {
    const uid = 'cancunFull';
    return `
<svg viewBox="0 0 200 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  ${this._maskDefs(uid)}
  <!-- 身体（绿色长袍） -->
  <path d="M 55 172 L 145 172 L 160 280 L 170 340 L 100 350 L 30 340 L 40 280 Z" fill="url(#green-${uid})" stroke="#2A4A3A" stroke-width="2"/>
  <!-- 衣纹 -->
  <path d="M 65 195 Q 100 215 135 195" stroke="#4A7C59" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M 58 240 Q 100 260 142 240" stroke="#4A7C59" stroke-width="1.5" fill="none" opacity="0.45"/>
  <path d="M 48 290 Q 100 310 152 290" stroke="#4A7C59" stroke-width="1.5" fill="none" opacity="0.3"/>
  <!-- 领口 -->
  <path d="M 72 172 L 100 196 L 128 172" fill="none" stroke="#F4D97E" stroke-width="2"/>
  <!-- 手臂（下垂） -->
  <path d="M 55 182 L 28 248 L 38 258 L 62 192 Z" fill="url(#green-${uid})" stroke="#2A4A3A" stroke-width="1.5"/>
  <path d="M 145 182 L 172 248 L 162 258 L 138 192 Z" fill="url(#green-${uid})" stroke="#2A4A3A" stroke-width="1.5"/>
  <!-- 头部（三星堆面具） -->
  <g transform="translate(16, 5) scale(0.42)">
    ${this._maskBase(uid)}
    ${this._browsNormal(uid)}
    ${this._eyesNormal(uid)}
    ${this._mouthNormal()}
  </g>
</svg>`;
  },

  /* ========== 大厅/破损面具轮廓（三星堆黄金面具破损版） ========== */
  brokenMaskSvg() {
    const uid = 'broken';
    return `
<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  ${this._maskDefs(uid)}
  ${this._maskBase(uid)}
  ${this._browsNormal(uid)}
  ${this._eyesNormal(uid)}
  ${this._mouthNormal()}
  <!-- 眼部空洞 -->
  <path d="M 135 265 Q 160 250 185 265 Q 190 285 160 295 Q 130 285 135 265" fill="#3A2510" opacity="0.88"/>
  <path d="M 265 265 Q 240 250 215 265 Q 210 285 240 295 Q 270 285 265 265" fill="#3A2510" opacity="0.88"/>
  <!-- 鼻部缺损 -->
  <path d="M 188 300 L 188 320 L 212 320 L 212 300 Z" fill="#3A2510" opacity="0.7"/>
  <!-- 嘴部缺损 -->
  <line x1="165" y1="375" x2="235" y2="375" stroke="#3A2510" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
  <!-- 裂纹 -->
  <path d="M 200 40 L 186 120 L 204 200 L 176 260 L 200 340 L 164 420" stroke="#5A3A1A" stroke-width="3.5" fill="none" opacity="0.8"/>
  <path d="M 200 40 L 224 120 L 208 180 L 232 250 L 200 300" stroke="#5A3A1A" stroke-width="3" fill="none" opacity="0.75"/>
  <path d="M 80 170 L 128 200 L 104 250 L 138 290" stroke="#5A3A1A" stroke-width="2.5" fill="none" opacity="0.7"/>
  <path d="M 320 160 L 272 200 L 296 250 L 264 296" stroke="#5A3A1A" stroke-width="2.5" fill="none" opacity="0.7"/>
  <!-- 铜绿锈斑 -->
  <circle cx="140" cy="180" r="9" fill="url(#patina-${uid})" opacity="0.5"/>
  <circle cx="260" cy="200" r="8" fill="url(#patina-${uid})" opacity="0.45"/>
  <circle cx="70" cy="330" r="10" fill="url(#patina-${uid})" opacity="0.5"/>
  <circle cx="330" cy="340" r="11" fill="url(#patina-${uid})" opacity="0.45"/>
</svg>`;
  },

  /* ========== 封面巨幕面具（三星堆黄金面具 SVG） ========== */
  coverMaskSvg() {
    const uid = 'cover';
    return `
<svg viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <defs>
    <radialGradient id="cvr-glow-${uid}" cx="0.5" cy="0.45" r="0.6">
      <stop offset="0%" stop-color="#c9a45c" stop-opacity="0.55"/>
      <stop offset="45%" stop-color="#8a6d3b" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#1c130a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F9E08A"/>
      <stop offset="45%" stop-color="#E6BE4C"/>
      <stop offset="100%" stop-color="#B8861E"/>
    </linearGradient>
    <linearGradient id="green-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7FB08C"/>
      <stop offset="50%" stop-color="#4E7A5E"/>
      <stop offset="100%" stop-color="#2E4E3C"/>
    </linearGradient>
    <linearGradient id="blue-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6BA3D9"/>
      <stop offset="100%" stop-color="#2F6BA3"/>
    </linearGradient>
  </defs>

  <!-- 光晕 -->
  <circle cx="260" cy="240" r="240" fill="url(#cvr-glow-${uid})"/>
  <!-- 太阳轮（放射光芒） -->
  <g stroke="#E8C547" stroke-width="4" opacity="0.55" stroke-linecap="round">
    <line x1="260" y1="16" x2="260" y2="52"/>
    <line x1="260" y1="428" x2="260" y2="464"/>
    <line x1="16" y1="240" x2="52" y2="240"/>
    <line x1="468" y1="240" x2="504" y2="240"/>
    <line x1="87" y1="67" x2="113" y2="93"/>
    <line x1="407" y1="67" x2="433" y2="93"/>
    <line x1="87" y1="413" x2="113" y2="387"/>
    <line x1="407" y1="413" x2="433" y2="387"/>
    <line x1="146" y1="36" x2="162" y2="62"/>
    <line x1="358" y1="36" x2="374" y2="62"/>
    <line x1="146" y1="444" x2="162" y2="418"/>
    <line x1="358" y1="444" x2="374" y2="418"/>
  </g>
  <!-- 太阳轮内环 -->
  <circle cx="260" cy="240" r="150" fill="none" stroke="#D4A017" stroke-width="2" opacity="0.5" stroke-dasharray="10 8"/>
  <circle cx="260" cy="240" r="196" fill="none" stroke="#D4A017" stroke-width="3" opacity="0.35" stroke-dasharray="2 10"/>

  <!-- ===== 面具主体（viewBox 400x520 居中缩放放置到 520x520） ===== -->
  <g transform="translate(60, 0)">
    <!-- 脸部金色基础层 -->
    <g id="face-base">
      <path d="M 105 175 L 295 175 L 285 210 L 310 320 L 280 410 L 275 400 L 200 405 L 125 400 L 120 410 L 90 320 L 115 210 Z"
            fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
    </g>

    <!-- 1. crown 头饰 -->
    <g id="crown">
      <path d="M 110 85 L 290 85 L 292 95 L 108 95 Z" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
      <path d="M 100 95 L 300 95 L 295 175 L 105 175 Z" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
      <path d="M 125 115 Q 135 105 145 115 Q 155 125 145 135 Q 135 145 125 135 Q 115 125 125 115" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
      <path d="M 175 115 Q 185 105 195 115 Q 205 125 195 135 Q 185 145 175 135 Q 165 125 175 115" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
      <path d="M 225 115 Q 235 105 245 115 Q 255 125 245 135 Q 235 145 225 135 Q 215 125 225 115" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
      <path d="M 185 140 Q 200 125 215 140 Q 220 155 200 165 Q 180 155 185 140" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
      <path d="M 195 145 L 195 158 M 205 145 L 205 158" stroke="#1E3A2C" stroke-width="1.5"/>
      <path d="M 100 95 Q 70 85 60 60 Q 55 40 70 35 Q 85 32 85 50 Q 85 62 74 62 Q 66 62 66 52" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
      <path d="M 62 48 Q 72 42 80 50" fill="none" stroke="#8B6914" stroke-width="2"/>
      <path d="M 300 95 Q 330 85 340 60 Q 345 40 330 35 Q 315 32 315 50 Q 315 62 326 62 Q 334 62 334 52" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
      <path d="M 338 48 Q 328 42 320 50" fill="none" stroke="#8B6914" stroke-width="2"/>
      <line x1="105" y1="175" x2="295" y2="175" stroke="#8B6914" stroke-width="2"/>
    </g>

    <!-- 2. eyebrows 眉毛 -->
    <g id="eyebrows">
      <path d="M 125 230 Q 155 225 185 233 L 183 247 Q 155 240 127 244 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
      <path d="M 275 230 Q 245 225 215 233 L 217 247 Q 245 240 273 244 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
    </g>

    <!-- 3. eyes 眼睛 -->
    <g id="eyes">
      <path d="M 135 265 Q 160 250 185 265 Q 190 285 160 295 Q 130 285 135 265" fill="#F4D97E" stroke="#8B6914" stroke-width="2"/>
      <ellipse cx="160" cy="275" rx="14" ry="10" fill="url(#blue-${uid})" stroke="#1C456E" stroke-width="1.5"/>
      <ellipse cx="160" cy="275" rx="7" ry="5" fill="#122B44"/>
      <path d="M 135 265 Q 160 255 185 265" fill="none" stroke="#8B6914" stroke-width="2"/>
      <path d="M 265 265 Q 240 250 215 265 Q 210 285 240 295 Q 270 285 265 265" fill="#F4D97E" stroke="#8B6914" stroke-width="2"/>
      <ellipse cx="240" cy="275" rx="14" ry="10" fill="url(#blue-${uid})" stroke="#1C456E" stroke-width="1.5"/>
      <ellipse cx="240" cy="275" rx="7" ry="5" fill="#122B44"/>
      <path d="M 265 265 Q 240 255 215 265" fill="none" stroke="#8B6914" stroke-width="2"/>
    </g>

    <!-- 4. nose 鼻子 -->
    <g id="nose">
      <line x1="200" y1="260" x2="200" y2="315" stroke="#8B6914" stroke-width="2"/>
      <path d="M 185 285 Q 190 300 188 300" fill="none" stroke="#8B6914" stroke-width="2"/>
      <path d="M 215 285 Q 210 300 212 300" fill="none" stroke="#8B6914" stroke-width="2"/>
      <path d="M 188 300 L 188 320 L 212 320 L 212 300" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
      <line x1="188" y1="320" x2="212" y2="320" stroke="#8B6914" stroke-width="2"/>
      <path d="M 193 325 Q 196 328 199 325" fill="none" stroke="#5C4210" stroke-width="1.5"/>
      <path d="M 201 325 Q 204 328 207 325" fill="none" stroke="#5C4210" stroke-width="1.5"/>
    </g>

    <!-- 5. mouth 嘴巴 -->
    <g id="mouth">
      <line x1="165" y1="375" x2="235" y2="375" stroke="#5C4210" stroke-width="3" stroke-linecap="round"/>
    </g>

    <!-- 6. ears 耳朵 -->
    <g id="ears">
      <path d="M 100 210 Q 50 200 35 260 Q 30 310 55 340 Q 75 355 95 330 Q 105 300 100 260" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
      <path d="M 80 240 Q 60 235 55 260 Q 52 280 70 285 Q 85 288 88 270 Q 90 255 75 252" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
      <path d="M 72 265 Q 68 275 78 278" fill="none" stroke="#1E3A2C" stroke-width="1.5"/>
      <line x1="55" y1="340" x2="55" y2="390" stroke="#8B6914" stroke-width="2"/>
      <circle cx="55" cy="345" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
      <circle cx="55" cy="355" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
      <circle cx="55" cy="365" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
      <circle cx="55" cy="375" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
      <path d="M 50 390 L 60 390 L 55 405 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
      <path d="M 300 210 Q 350 200 365 260 Q 370 310 345 340 Q 325 355 305 330 Q 295 300 300 260" fill="url(#gold-${uid})" stroke="#8B6914" stroke-width="2"/>
      <path d="M 320 240 Q 340 235 345 260 Q 348 280 330 285 Q 315 288 312 270 Q 310 255 325 252" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
      <path d="M 328 265 Q 332 275 322 278" fill="none" stroke="#1E3A2C" stroke-width="1.5"/>
      <line x1="345" y1="340" x2="345" y2="390" stroke="#8B6914" stroke-width="2"/>
      <circle cx="345" cy="345" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
      <circle cx="345" cy="355" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
      <circle cx="345" cy="365" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
      <circle cx="345" cy="375" r="3" fill="url(#gold-${uid})" stroke="#8B6914"/>
      <path d="M 340 390 L 350 390 L 345 405 Z" fill="url(#green-${uid})" stroke="#1E3A2C" stroke-width="1.5"/>
    </g>
  </g>
</svg>`;
  }
};
