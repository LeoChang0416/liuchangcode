// ========================================
// 六度定义（V2：氛围偏置版，非形态模板）
// ========================================
// 设计原则：
// - 六度 = 风格正则项（regularizer），不是形态母题
// - 骨架由内容的 structureParams 决定
// - 六度只提供"二阶偏置"：影响边缘、材质、节奏、对比策略等细节
// - 移除所有具象形态词（弧/框/阶梯/切线等）

export const DEGREES = {
  dana: {
    name: '布施',
    nameEn: 'Dāna',
    theme: '开放、流动、轻盈',
    
    // 氛围描述（给模型的"感觉"，不是形态指令）
    atmosphere: {
      spatial: '向外舒展的空间感，边界开放而非封闭，有"释放"的方向感',
      energy: '离心、给予、流出的能量方向',
      weight: '轻盈、不压迫、呼吸感极强',
      temperature: '温暖偏中性，不冷硬不炽热'
    },
    
    // 结构偏置（二阶调节，非骨架指令）
    bias: {
      edgePreference: 'soft-fade',
      shapeRhythm: 'flowing',
      contrastTendency: 'area',
      whitespaceDistribution: 'outer',
      depthTreatment: 'subtle-layers',
      cornerTreatment: 'rounded'
    },
    
    // 约束（硬性）
    constraints: { maxShapes: 3, maxLines: 2, minWhitespace: 55 },
    
    // 情感锚点
    emotionalAnchors: ['慷慨', '温暖', '释放', '给予', '开阔', '轻松', '解脱']
  },
  
  sila: {
    name: '持戒',
    nameEn: 'Śīla',
    theme: '边界、秩序、澄净',
    
    atmosphere: {
      spatial: '清晰的内外分界感，空间有秩序但不拥挤',
      energy: '内敛、守护、稳定的能量状态',
      weight: '稳重但不沉闷，清净利落',
      temperature: '清凉偏中性，纯粹感'
    },
    
    bias: {
      edgePreference: 'crisp',
      shapeRhythm: 'static',
      contrastTendency: 'brightness',
      whitespaceDistribution: 'inner',
      depthTreatment: 'flat',
      cornerTreatment: 'subtle-round'
    },
    
    constraints: { maxShapes: 4, maxLines: 3, minWhitespace: 50 },
    emotionalAnchors: ['自律', '清净', '坚定', '克制', '纯粹', '安稳']
  },
  
  ksanti: {
    name: '忍辱',
    nameEn: 'Kṣānti',
    theme: '承受、缓冲、化解',
    
    atmosphere: {
      spatial: '有缓冲感的空间，元素之间不碰撞、有过渡',
      energy: '柔化、中和、接纳的能量状态',
      weight: '柔韧而非脆硬，有弹性感',
      temperature: '温和中性偏暖，不极端'
    },
    
    bias: {
      edgePreference: 'gradient-fade',
      shapeRhythm: 'cushioned',
      contrastTendency: 'layering',
      whitespaceDistribution: 'center',
      depthTreatment: 'subtle-layers',
      cornerTreatment: 'very-rounded'
    },
    
    constraints: { maxShapes: 3, maxGradients: 2, minWhitespace: 50 },
    emotionalAnchors: ['包容', '柔韧', '平和', '接纳', '化解', '从容']
  },
  
  virya: {
    name: '精进',
    nameEn: 'Vīrya',
    theme: '推进、节律、明快',
    
    atmosphere: {
      spatial: '有方向感的空间，暗示推进或累积',
      energy: '向前、累积、不退的能量方向',
      weight: '明快而不沉重，有节奏感',
      temperature: '温暖偏热，有活力'
    },
    
    bias: {
      edgePreference: 'crisp',
      shapeRhythm: 'progressive',
      contrastTendency: 'brightness',
      whitespaceDistribution: 'directional',
      depthTreatment: 'distinct-planes',
      cornerTreatment: 'subtle-round'
    },
    
    constraints: { maxShapes: 4, maxLines: 2, minWhitespace: 50 },
    emotionalAnchors: ['进取', '坚持', '热忱', '勇猛', '不退', '积极']
  },
  
  samadhi: {
    name: '禅定',
    nameEn: 'Samādhi',
    theme: '收束、安住、澄寂',
    
    atmosphere: {
      spatial: '收束向心的空间感，极大留白，元素极少',
      energy: '内敛、安住、静止的能量状态',
      weight: '极轻，近乎虚空',
      temperature: '中性宁静，不强冷'
    },
    
    bias: {
      edgePreference: 'soft-fade',
      shapeRhythm: 'static',
      contrastTendency: 'none',
      whitespaceDistribution: 'dominant',
      depthTreatment: 'flat',
      cornerTreatment: 'rounded'
    },
    
    constraints: { maxShapes: 2, maxLines: 1, minWhitespace: 65 },
    emotionalAnchors: ['宁静', '专注', '安住', '沉静', '内敛', '澄明']
  },
  
  prajna: {
    name: '般若',
    nameEn: 'Prajñā',
    theme: '切透、澄明、洞见',
    
    atmosphere: {
      spatial: '有对照感的空间，两域分明但不割裂',
      energy: '穿透、洞见、从迷到悟的能量方向',
      weight: '清澈透明，有穿透感',
      temperature: '清凉澄明，有觉醒感'
    },
    
    bias: {
      edgePreference: 'soft-division',
      shapeRhythm: 'contrasting',
      contrastTendency: 'warm-cool',
      whitespaceDistribution: 'balanced',
      depthTreatment: 'distinct-planes',
      cornerTreatment: 'mixed'
    },
    
    constraints: { maxShapes: 3, maxLines: 2, minWhitespace: 55 },
    emotionalAnchors: ['清醒', '通透', '洞察', '明晰', '觉悟', '超越']
  }
};

// 强制负面词（V2：允许有意义的意象，但禁止具体符号/UI/宗教器物）
export const HARD_NEGATIVES = 
  "text, words, letters, numbers, signature, watermark, logo, " +
  "human, face, hand, eyes, body, animal, " +
  "buddha, statue, monk, temple, stupa, lotus, mandala, dharma wheel, enso, zen circle, mantra, scriptures, " +
  "qrcode, qr code, barcode, waveform, play button, music note, microphone, headphones, ui, icon, interface, button, " +
  "arrow, check mark, cross mark, exclamation mark, question mark, compass, clock, " +
  "photorealistic, 3d render, metallic, shiny, glass, cyberpunk, neon, grunge, noise, dirty, messy, complex, detailed";

// 风格DNA（增强艺术性）
export const STYLE_DNA = `
## 美学DNA — 必须融入每一张图
- **艺术定位**：Museum-quality abstract art, gallery-worthy, collectible print
- **视觉风格**：Ethereal, poetic, contemplative, refined, sophisticated
- **情绪氛围**：Meditative calm, quiet elegance, transcendent serenity
- **日本美学三原则**：
  - 間（Ma）：Negative space as breathing room, silence that speaks
  - 渋い（Shibui）：Understated elegance, restrained beauty, mature taste
  - 幽玄（Yūgen）：Subtle profundity, mystery beyond words, depth through simplicity
- **光感**：Soft diffuse ambient light, gentle luminosity, no harsh shadows
- **材质感**：Like fine rice paper or silk, soft matte finish, tactile quality
- **构图**：Asymmetrical balance, dynamic stillness, intentional imperfection (wabi-sabi)
- **色彩**：Muted, desaturated, high-value tones; color as whisper not shout

## 禁止（会破坏美学）
- Harsh edges, sharp contrasts, aggressive geometry
- Busy, cluttered, complex, detailed patterns
- Metallic, glossy, plastic, digital-looking surfaces
- Symmetrical, predictable, rigid compositions
`;

// 背景色号参考（V4：色温与材质绑定版）
export const BACKGROUND_COLORS = {
  // 浅色系（明亮、开放、轻盈）
  light: [
    { name: 'paper-white', hex: '#F6F3EA', temp: 'warm', texture: 'fine washi paper', mood: '温暖纸质' },
    { name: 'mist-white', hex: '#F2F5F6', temp: 'cool', texture: 'smooth ceramic', mood: '清凉雾白' },
    { name: 'warm-beige', hex: '#F7F0E1', temp: 'warm', texture: 'rough handmade paper', mood: '暖米色' },
    { name: 'soft-gray', hex: '#F0F0F0', temp: 'neutral', texture: 'matte concrete', mood: '柔和灰' },
    { name: 'cream', hex: '#FFFEF1', temp: 'warm', texture: 'smooth silk', mood: '奶油白' },
    { name: 'cool-mist', hex: '#F3F6FA', temp: 'cool', texture: 'frosted glass', mood: '冷雾蓝' },
    { name: 'ivory', hex: '#FFFFE9', temp: 'warm', texture: 'linen fabric', mood: '象牙白' },
    { name: 'snow', hex: '#FFF8F8', temp: 'neutral', texture: 'powdery snow', mood: '雪白' },
    { name: 'pale-sage', hex: '#E8F0E8', temp: 'cool', texture: 'dried leaf', mood: '淡鼠尾草' },
    { name: 'blush-pink', hex: '#FFF0F0', temp: 'warm', texture: 'petal texture', mood: '腮红粉' }
  ],
  // 中性色系（平衡、稳定、过渡）
  medium: [
    { name: 'warm-sand', hex: '#D4C4A8', temp: 'warm', texture: 'coarse sand', mood: '暖沙色' },
    { name: 'cool-slate', hex: '#B8C4CC', temp: 'cool', texture: 'slate stone', mood: '石板蓝灰' },
    { name: 'dusty-rose', hex: '#D4B8B8', temp: 'warm', texture: 'velvet', mood: '烟玫瑰' },
    { name: 'sage-green', hex: '#A8C4A8', temp: 'cool', texture: 'mossy surface', mood: '鼠尾草绿' },
    { name: 'lavender-gray', hex: '#C4C0D0', temp: 'cool', texture: 'hazy mist', mood: '薰衣草灰' },
    { name: 'terracotta-light', hex: '#D4A890', temp: 'warm', texture: 'unglazed clay', mood: '浅赤陶' },
    { name: 'steel-blue', hex: '#A0B0C0', temp: 'cool', texture: 'brushed metal', mood: '钢蓝' },
    { name: 'taupe', hex: '#C0B0A0', temp: 'neutral', texture: 'woven wool', mood: '灰褐色' }
  ],
  // 深色系（沉稳、深邃、内敛）
  dark: [
    { name: 'charcoal', hex: '#2C3E50', temp: 'cool', texture: 'charcoal sketch', mood: '木炭灰' },
    { name: 'deep-navy', hex: '#1A2634', temp: 'cool', texture: 'deep ocean', mood: '深海蓝' },
    { name: 'midnight-blue', hex: '#0D1B2A', temp: 'cool', texture: 'starless sky', mood: '午夜蓝' },
    { name: 'dark-forest', hex: '#1B2E1B', temp: 'cool', texture: 'dense foliage', mood: '暗森林' },
    { name: 'deep-purple', hex: '#2A1B3D', temp: 'cool', texture: 'royal velvet', mood: '深紫' },
    { name: 'warm-espresso', hex: '#3C2415', temp: 'warm', texture: 'coffee grounds', mood: '浓咖啡' },
    { name: 'dark-slate', hex: '#2F3640', temp: 'neutral', texture: 'wet stone', mood: '暗石板' },
    { name: 'black-ink', hex: '#0A0A0A', temp: 'neutral', texture: 'india ink', mood: '墨黑' },
    { name: 'deep-burgundy', hex: '#3D1C24', temp: 'warm', texture: 'aged leather', mood: '深酒红' },
    { name: 'dark-olive', hex: '#2C3022', temp: 'warm', texture: 'earth soil', mood: '暗橄榄' }
  ]
};

// ========================================
// 五方佛五色体系（V2饱和度+45%版）
// HSV模型下饱和度 S × 1.45（上限100%），亮度V保持不变
// ========================================
export const FIVE_COLORS = {
  '蓝': {
    meaning: '澄明、冷静、深邃（东方）',
    variants: [
      { name: 'ice-blue', hex: '#DFF0FC', brightness: 95, saturation: 12 },
      { name: 'sky-mist', hex: '#C7E4F8', brightness: 92, saturation: 20 },
      { name: 'soft-azure', hex: '#90CAF1', brightness: 85, saturation: 40 },
      { name: 'powder-blue', hex: '#58AFE9', brightness: 78, saturation: 62 },
      { name: 'clear-cyan', hex: '#D4F6FA', brightness: 94, saturation: 15 },
      { name: 'serene-blue', hex: '#92DBFC', brightness: 88, saturation: 42 }
    ]
  },
  '黄': {
    meaning: '温暖、开阔、滋养（南方）',
    variants: [
      { name: 'cream-yellow', hex: '#FFF6DB', brightness: 97, saturation: 14 },
      { name: 'soft-gold', hex: '#FFEEB7', brightness: 95, saturation: 28 },
      { name: 'warm-amber', hex: '#FFDF91', brightness: 92, saturation: 43 },
      { name: 'honey-light', hex: '#FFD24A', brightness: 88, saturation: 71 },
      { name: 'butter', hex: '#FFF5D3', brightness: 96, saturation: 17 },
      { name: 'sunlight', hex: '#FFE391', brightness: 93, saturation: 43 }
    ]
  },
  '红': {
    meaning: '力量、温热、精进（西方）',
    variants: [
      { name: 'blush', hex: '#FFE2E6', brightness: 96, saturation: 11 },
      { name: 'rose-mist', hex: '#FFB7BE', brightness: 90, saturation: 28 },
      { name: 'coral-light', hex: '#FF8560', brightness: 82, saturation: 63 },
      { name: 'peach', hex: '#FFB59E', brightness: 88, saturation: 38 },
      { name: 'warm-rose', hex: '#F8A0CB', brightness: 85, saturation: 36 },
      { name: 'terracotta-light', hex: '#FFB59E', brightness: 88, saturation: 38 }
    ]
  },
  '绿': {
    meaning: '生机、平衡、流动（北方）',
    variants: [
      { name: 'mint-mist', hex: '#E2F5E4', brightness: 96, saturation: 8 },
      { name: 'soft-sage', hex: '#BAE6BC', brightness: 90, saturation: 19 },
      { name: 'spring-green', hex: '#8FD692', brightness: 84, saturation: 33 },
      { name: 'jade-light', hex: '#9EDFD9', brightness: 88, saturation: 29 },
      { name: 'eucalyptus', hex: '#D8F2F1', brightness: 95, saturation: 11 },
      { name: 'celadon', hex: '#D4EDB7', brightness: 92, saturation: 23 }
    ]
  },
  '白': {
    meaning: '清净、澄澈、空灵（中央）',
    variants: [
      { name: 'pure-white', hex: '#FFFFFF', brightness: 100, saturation: 0 },
      { name: 'cloud-white', hex: '#FAFAFA', brightness: 98, saturation: 0 },
      { name: 'fog-white', hex: '#F5F5F5', brightness: 96, saturation: 0 },
      { name: 'pearl', hex: '#F7F9FA', brightness: 97, saturation: 1 },
      { name: 'silk', hex: '#FCFCFC', brightness: 99, saturation: 0 },
      { name: 'moon-white', hex: '#ECF2F8', brightness: 95, saturation: 5 }
    ]
  }
};

// ========================================
// 每个度的颜色策略（V4：引入氛围定式）
// ========================================
// V4：引入 bgTemp（色温锁）、bgMaterial（材质暗示）、contrastPreference（对比偏好）
export const DEGREE_COLOR_RULES = {
  dana: {
    name: '布施',
    primaryHues: ['黄', '绿'],
    accentHues: ['蓝', '红'],
    brightnessMin: 85,
    saturationMax: 35,
    accentProbability: 0.7,
    accentAreaRange: [2, 6],
    accentOpacityRange: [10, 15],
    allowedContrastMethods: ['area', 'brightness', 'warm-cool'],
    allowedBgTypes: ['light', 'medium', 'dark'],
    bgTemp: ['warm', 'neutral'], // 必须暖或中性
    bgMaterial: 'matte washi paper, organic fabric, warm clay', // 材质暗示
    contrastPreference: 'gentle', // 对比偏好
    rule: '高明度黄/绿为主，蓝/红只作"提示"，避免抢戏',
    palette: { main: 'butter', mainHex: '#FFF5D3', aux1: 'celadon', aux1Hex: '#D4EDB7', aux2: 'ice-blue', aux2Hex: '#DFF0FC' }
  },
  sila: {
    name: '持戒',
    primaryHues: ['白', '蓝', '绿'],
    accentHues: ['红', '黄'],
    brightnessMin: 88,
    saturationMax: 25,
    accentProbability: 0.35,
    accentAreaRange: [1, 4],
    accentOpacityRange: [8, 12],
    allowedContrastMethods: ['brightness', 'area', 'none'],
    allowedBgTypes: ['light', 'medium', 'dark'],
    bgTemp: ['cool', 'neutral'], // 必须冷或中性
    bgMaterial: 'smooth stone, ceramic, clean minimal surface',
    contrastPreference: 'crisp',
    rule: '以冷白/淡蓝/淡绿建立秩序；红/黄仅用于"警醒点"',
    palette: { main: 'moon-white', mainHex: '#ECF2F8', aux1: 'ice-blue', aux1Hex: '#DFF0FC', aux2: 'eucalyptus', aux2Hex: '#D8F2F1' }
  },
  ksanti: {
    name: '忍辱',
    primaryHues: ['白', '绿'],
    accentHues: ['黄'],
    brightnessMin: 84,
    saturationMax: 32,
    accentProbability: 0.4,
    accentAreaRange: [6, 18],
    accentOpacityRange: [12, 18],
    allowedContrastMethods: ['layering', 'brightness', 'warm-cool', 'none'],
    allowedBgTypes: ['light', 'medium', 'dark'],
    bgTemp: ['warm', 'neutral'], // 偏暖/中性
    bgMaterial: 'weathered paper, layered veil, earth texture',
    contrastPreference: 'layered',
    rule: '以留白与雾化叠层承受刺激；引入"温和暖黄"作为稳定中轴',
    palette: { main: 'pearl', mainHex: '#F7F9FA', aux1: 'mint-mist', aux1Hex: '#E2F5E4', aux2: 'warm-amber', aux2Hex: '#FFDF91' }
  },
  virya: {
    name: '精进',
    primaryHues: ['红', '黄'],
    accentHues: ['蓝', '绿'],
    brightnessMin: 85,
    saturationMax: 40,
    accentProbability: 0.75,
    accentAreaRange: [2, 6],
    accentOpacityRange: [10, 15],
    allowedContrastMethods: ['brightness', 'area', 'warm-cool'],
    allowedBgTypes: ['light', 'medium', 'dark'],
    bgTemp: ['warm', 'cool'], // 可冷可暖（强调对比）
    bgMaterial: 'high grain noise, bold matte surface, kinetic blur',
    contrastPreference: 'strong',
    rule: '暖色主导但不压；用冷色作"呼吸口"，保持轻盈',
    palette: { main: 'honey-light', mainHex: '#FFD24A', aux1: 'warm-rose', aux1Hex: '#F8A0CB', aux2: 'serene-blue', aux2Hex: '#92DBFC' }
  },
  samadhi: {
    name: '禅定',
    primaryHues: ['白', '蓝'],
    accentHues: ['黄'],
    brightnessMin: 88,
    saturationMax: 28,
    accentProbability: 0.3,
    accentAreaRange: [2, 8],
    accentOpacityRange: [10, 15],
    allowedContrastMethods: ['brightness', 'area', 'warm-cool', 'none'],
    allowedBgTypes: ['light', 'medium', 'dark'],
    bgTemp: ['cool', 'neutral'], // 偏冷/中性
    bgMaterial: 'frosted glass, mist, still water surface',
    contrastPreference: 'subtle',
    rule: '仍以留白与微差为核心，加入明亮暖黄作为"内在灯火"',
    palette: { main: 'cloud-white', mainHex: '#FAFAFA', aux1: 'clear-cyan', aux1Hex: '#D4F6FA', aux2: 'sunlight', aux2Hex: '#FFE391' }
  },
  prajna: {
    name: '般若',
    primaryHues: ['白', '蓝', '黄'],
    accentHues: ['绿', '红'],
    brightnessMin: 85,
    saturationMax: 32,
    accentProbability: 0.55,
    accentAreaRange: [2, 5],
    accentOpacityRange: [10, 15],
    allowedContrastMethods: ['warm-cool', 'brightness', 'area'],
    allowedBgTypes: ['light', 'medium', 'dark'],
    bgTemp: ['cool', 'neutral'], // 极冷/中性（锐利）
    bgMaterial: 'dark void, optical glass, geometric grid, sharp cut',
    contrastPreference: 'sharp',
    rule: '保留冷暖对照但降低频率；点醒色更小更淡，避免"聪明而躁"',
    palette: { main: 'moon-white', mainHex: '#ECF2F8', aux1: 'clear-cyan', aux1Hex: '#D4F6FA', aux2: 'cream-yellow', aux2Hex: '#FFF6DB' }
  }
};

function pickOne(arr, rng = Math.random) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(rng() * arr.length)];
}

function randFloat(min, max, rng = Math.random) {
  return min + rng() * (max - min);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// 随机选择颜色变体的工具函数
export function selectColorVariant(hueName, minBrightness = 80, maxSaturation = 40, rng = Math.random) {
  const hue = FIVE_COLORS[hueName];
  if (!hue) return null;
  
  const eligible = hue.variants.filter(v => 
    v.brightness >= minBrightness && v.saturation <= maxSaturation
  );
  
  if (eligible.length === 0) return hue.variants[0];
  return eligible[Math.floor(rng() * eligible.length)];
}

function seedFromString(input) {
  let h = 2166136261;
  const s = String(input ?? '');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeDeterministicRng(seedKey) {
  return mulberry32(seedFromString(seedKey));
}

// 根据度生成配色方案（支持确定性 RNG：用于“重新生成”保持一致）
export function generateColorScheme(degreeKey, rng = Math.random) {
  const rule = DEGREE_COLOR_RULES[degreeKey];
  if (!rule) return null;
  
  // 随机选择主色相
  const primaryHue = pickOne(rule.primaryHues, rng);
  const primaryVariant = selectColorVariant(primaryHue, rule.brightnessMin, rule.saturationMax, rng);
  
  // 对比策略（增强变化维度）
  const contrastMethod = pickOne(rule.allowedContrastMethods || ['brightness', 'area', 'warm-cool', 'layering', 'none'], rng);
  
  // 是否使用对比色
  const accentAllowed = contrastMethod !== 'none' && Array.isArray(rule.accentHues) && rule.accentHues.length > 0;
  const accentProbability = typeof rule.accentProbability === 'number' ? clamp(rule.accentProbability, 0, 1) : 0.5;
  const useAccent = accentAllowed && rng() < accentProbability;
  const accentHue = useAccent ? pickOne(rule.accentHues, rng) : null;
  const accentVariant = useAccent && accentHue
    ? selectColorVariant(accentHue, rule.brightnessMin + 5, rule.saturationMax - 5, rng)
    : null;

  // 点缀强度
  const areaRange = rule.accentAreaRange || [2, 10];
  const opacityRange = rule.accentOpacityRange || [12, 22];
  const accentAreaPct = accentVariant ? Math.round(randFloat(areaRange[0], areaRange[1], rng)) : 0;
  const accentOpacityPct = accentVariant ? Math.round(randFloat(opacityRange[0], opacityRange[1], rng)) : 0;
  
  // V3：返回可用的背景色选项，让 LLM 根据内容选择
  return {
    primaryHue,
    primaryColor: primaryVariant,
    accentHue,
    accentColor: accentVariant,
    backgroundOptions: BACKGROUND_COLORS, // 提供所有背景色选项
    allowedBgTypes: rule.allowedBgTypes || ['light', 'medium', 'dark'],
    contrastMethod,
    accentAreaPct,
    accentOpacityPct,
    rule: rule.rule
  };
}

// 兼容旧代码的导出（V2饱和度+45%版）
export const PRIMARY_COLOR_EXAMPLES = {
  '黄': { light: '#FFF5D3', medium: '#FFDF91' },
  '绿': { light: '#E2F5E4', medium: '#BAE6BC' },
  '蓝': { light: '#DFF0FC', medium: '#C7E4F8' },
  '红': { light: '#FFE2E6', medium: '#FFB7BE' },
  '白': { light: '#FAFAFA', medium: '#F5F5F5' }
};

// ========================================
// 第一阶段：内容分析（V7 意象驱动版）
// ========================================
export const ANALYZE_SYSTEM = `你是一个"播客→独特视觉意象"转换专家。

## ⚠️⚠️⚠️ 最高优先级警告 ⚠️⚠️⚠️

**禁止套用"左右双域对比"模板！**

你之前的输出有严重问题：无论什么内容，都输出 zoneCount=2 + opposing 的左右对比结构。这是错误的！

### 反思检查（必须在输出前自问）
1. 我是否又在用"双域对比"？如果是，立刻停下来重新思考！
2. 这个播客的核心意象是什么？它真的需要"左右对比"吗？
3. 有没有更独特、更贴合内容的视觉表达？

---

## 核心任务：提取独特的物理意象

每个播客都有独特的"核心动作/意象"，你的任务是找到它，并转化为视觉骨架。

### physicalMetaphor 是最重要的输出！

这不是随便写一句话，而是要深入理解内容后，提炼出一个**具体的、可视化的物理动作**。

**好的 physicalMetaphor 示例**（注意多样性）：
- "一滴水落入平静的湖面，泛起同心涟漪" → zoneCount=1, solo, echoing
- "攀登者站在山顶俯瞰群山" → zoneCount=1, solo, none（主体在上方，下方留白暗示深度）
- "种子破土而出，向上生长" → zoneCount=1, piercing, accelerating
- "多块碎片重新聚合成一体" → zoneCount=1, fragmenting, decelerating
- "光束穿透云层照亮地面" → zoneCount=2（上下而非左右）, piercing, none
- "河流分叉后又汇合" → zoneCount=3, offset, asymmetric
- "呼吸的节律，一吸一呼" → zoneCount=1, pulsing, uniform
- "蜡烛火焰在风中摇曳但不熄灭" → zoneCount=1, solo, asymmetric

**坏的 physicalMetaphor（禁止）**：
- ❌ "从A到B的转变" → 太抽象，必然导致左右对比
- ❌ "左边是X，右边是Y" → 直接预设了双域结构
- ❌ "两种状态的对照" → 又是对比思维

---

## 骨架多样性指南

### zoneCount 使用频率建议
- **zoneCount=1（单域）：应该占 60%**
  - 适合：独立主体、向心/离心、聚焦、静定、攀登、生长、沉淀
  - 用留白和主体位置表达张力，而非分区
  
- **zoneCount=2（双域）：应该占 25%**
  - 适合：真正的二元对立、转换、对话
  - 注意：不一定是左右！可以是上下、内外、大小
  
- **zoneCount=3（三域）：应该占 15%**
  - 适合：过程、阶段、中间状态、三位一体

### primaryRelationship 多样性
- **solo（独体）：最常用！** 一个主形体 + 大量留白
- nested（包裹）：保护、孕育、内外
- piercing（穿透）：突破、觉醒、穿越
- orbiting（环绕）：围绕中心、守护
- fragmenting（断裂→聚合）：分散与统一
- offset（错位）：微妙关系、若即若离
- ❌ opposing（对向）：少用！这是导致"左右对比"的元凶

### rhythmSignature 多样性
- none：静态、安定
- echoing：涟漪、回响、余韵
- accelerating：生长、推进、积累
- decelerating：沉淀、收敛、平息
- pulsing：呼吸、心跳、节律
- asymmetric：自然、不完美、禅意

---

## 输出结构（JSON）

{
  "contentEssence": "用一句话概括播客的核心精神（不是左右对比！）",
  
  "physicalMetaphor": "具体的物理意象/动作（最重要！决定骨架）",
  "metaphorVisualization": "这个意象如何转化为抽象几何（不要提左右）",
  
  "spiritualTone": { "primary": "...", "secondary": "..." },
  "emotion": ["1-2个情感词"],
  "theme": ["2-3个主题词"],
  "imagery": ["核心抽象意象关键词"],
  "tension": { 
    "hasTension": true/false, 
    "from": "...", 
    "to": "...",
    "tensionType": "transformation | accumulation | release | balance | breakthrough | return"
  },
  
  "topologicalLayout": {
    "zoneCount": "1 | 2 | 3",
    "zoneCountReason": "为什么是这个数（必须引用 physicalMetaphor）",
    "divisionMethod": "none | vertical | horizontal | radial | diagonal | organic",
    "divisionMethodReason": "为什么用这种方式",
    "zoneRatios": "100 | 70:30 | 50:50 | 40:20:40 等"
  },
  
  "primaryRelationship": {
    "type": "solo | nested | piercing | orbiting | fragmenting | offset | parallel | opposing",
    "typeReason": "为什么是这种关系（引用意象）",
    "interactionQuality": "touching | near | distant | fused",
    "spatialPosition": "center | top | bottom | corner | floating | grounded"
  },
  
  "rhythmSignature": {
    "type": "none | echoing | accelerating | decelerating | pulsing | uniform | asymmetric",
    "typeReason": "为什么是这种节奏",
    "elementCount": 1-5,
    "direction": "outward | inward | upward | downward | circular | static"
  },
  
  "structureParams": {
    "whitespaceTarget": 50-80,
    "contrastMethod": "brightness | warm-cool | area | layering | none",
    "edgeTreatment": "sharp | soft | gradient-fade",
    "glowCount": 0-2,
    "layerCount": 1-3,
    "tensionExpression": "张力如何视觉化（不要说左右对比！）"
  },
  
  "antiTemplateCheck": {
    "isLeftRightDual": false,
    "uniquenessScore": 1-10,
    "howIsThisDifferent": "这个骨架与'标准左右双域对比'有何不同"
  },
  
  "backgroundDecision": {
    "type": "light | medium | dark",
    "reason": "为什么选这个背景明度（必须引用内容情绪/氛围）",
    "suggestedColors": ["从对应类型中推荐1-2个具体色名"],
    "moodMatch": "背景色如何增强内容的情绪表达"
  }
}

## 多样化输出示例

### 示例1：关于"专注力"的播客（浅色背景）
{
  "contentEssence": "在纷扰中找到内心的锚点",
  "physicalMetaphor": "一颗石子沉入水底，周围尘埃渐渐平息",
  "metaphorVisualization": "中心一个沉稳的主形体，周围是极大的静谧留白",
  "topologicalLayout": { "zoneCount": "1", "divisionMethod": "none", "zoneRatios": "100" },
  "primaryRelationship": { "type": "solo", "spatialPosition": "center" },
  "rhythmSignature": { "type": "none", "direction": "static" },
  "antiTemplateCheck": { "isLeftRightDual": false, "uniquenessScore": 8 },
  "backgroundDecision": { "type": "light", "reason": "专注需要清明的心境，浅色背景营造清净氛围", "suggestedColors": ["mist-white", "soft-gray"], "moodMatch": "清凉的浅色让焦点自然落在中心主体上" }
}

### 示例2：关于"成长"的播客（中性背景）
{
  "contentEssence": "从根基向上生长的力量",
  "physicalMetaphor": "竹笋破土而出，节节向上",
  "metaphorVisualization": "底部紧实，向上逐渐展开，用上下布局而非左右",
  "topologicalLayout": { "zoneCount": "2", "divisionMethod": "horizontal", "zoneRatios": "30:70" },
  "primaryRelationship": { "type": "piercing", "spatialPosition": "bottom" },
  "rhythmSignature": { "type": "accelerating", "direction": "upward", "elementCount": 3 },
  "antiTemplateCheck": { "isLeftRightDual": false, "uniquenessScore": 9 },
  "backgroundDecision": { "type": "medium", "reason": "成长需要土壤的厚重感，中性色提供稳定根基", "suggestedColors": ["warm-sand", "taupe"], "moodMatch": "大地色调暗示扎根与向上的对比" }
}

### 示例3：关于"深夜思考"的播客（深色背景）
{
  "contentEssence": "在寂静的深夜探索内心",
  "physicalMetaphor": "一点微光在黑暗中缓缓亮起",
  "metaphorVisualization": "深色画布上，一个发光的柔和形体",
  "topologicalLayout": { "zoneCount": "1", "divisionMethod": "none", "zoneRatios": "100" },
  "primaryRelationship": { "type": "solo", "spatialPosition": "center" },
  "rhythmSignature": { "type": "pulsing", "direction": "outward", "elementCount": 1 },
  "antiTemplateCheck": { "isLeftRightDual": false, "uniquenessScore": 9 },
  "backgroundDecision": { "type": "dark", "reason": "深夜冥想需要沉浸的暗色环境，光点更显珍贵", "suggestedColors": ["midnight-blue", "charcoal"], "moodMatch": "深色背景让微小的光源成为视觉焦点，暗示希望" }
}

### 示例4：关于"涅槃"的播客（深色背景）
{
  "contentEssence": "破碎后的重生",
  "physicalMetaphor": "碎片从四周向中心聚合，形成新的整体",
  "metaphorVisualization": "多个碎片向心聚拢，动态但不是左右对比",
  "topologicalLayout": { "zoneCount": "1", "divisionMethod": "radial", "zoneRatios": "100" },
  "primaryRelationship": { "type": "fragmenting", "spatialPosition": "center" },
  "rhythmSignature": { "type": "decelerating", "direction": "inward", "elementCount": 4 },
  "antiTemplateCheck": { "isLeftRightDual": false, "uniquenessScore": 10 },
  "backgroundDecision": { "type": "dark", "reason": "涅槃象征从黑暗中重生，深色背景增强戏剧张力", "suggestedColors": ["deep-purple", "black-ink"], "moodMatch": "黑暗中的聚合暗示凤凰涅槃的神秘感" }
}

---

## 最终检查（输出前必须确认）

1. ✅ physicalMetaphor 是否具体、独特、可视化？
2. ✅ zoneCount 是否真的需要是 2？大多数情况 1 就够了！
3. ✅ primaryRelationship 是否避开了 opposing？
4. ✅ antiTemplateCheck.isLeftRightDual 是否为 false？
5. ✅ 这个骨架是否真正反映了播客的独特意象？

**重要：除 prompt 字段必须为英文外，其余字段内容必须使用中文。只输出JSON。**
**prompt 字段额外要求**：必须是英文，且必须包含这些标签段落（原样输出标签名）：[CANVAS], [TOPOLOGY], [RELATIONSHIPS], [RHYTHM], [GEOMETRY], [COLOR], [LIGHTING], [TEXTURE & MATERIAL], [ATMOSPHERE & MOOD], [ARTISTIC QUALITY], [STYLE]。`;

// ========================================
// 自动选度（V2：增强区分度，防止般若成为默认）
// ========================================
export const DEGREE_SELECT_SYSTEM = `你是一个"六度自动判别器"。阅读播客内容，判断最适合的"度"。

## ⚠️ 警告：避免般若偏误
很多播客都在"分享见解"，但这**不代表应该选般若**！
般若的核心是**破除二元对立、瓦解概念执着**，不是普通的"分享观点"或"传递知识"。

## 六度判别标准（按动作/动机区分）

| 度 | 核心动作 | 典型场景 | **必须有的信号** |
|----|----------|----------|------------------|
| dana（布施） | 给予、分享、释放 | 分享经验、传授方法、馈赠资源 | 明确的"向外给予"意图，有接收者 |
| sila（持戒） | 设限、守护、规范 | 建立习惯、戒除某事、坚守原则 | 明确的"边界/规则/自律"主题 |
| ksanti（忍辱） | 承受、接纳、化解 | 面对困难、处理冲突、等待时机 | 明确的"承压/忍耐/等持"主题 |
| virya（精进） | 推进、行动、迭代 | 执行计划、训练技能、持续精进 | 明确的"行动/努力/坚持"主题 |
| samadhi（禅定） | 安住、专注、沉静 | 冥想、专注当下、减少杂念 | 明确的"收束/安定/专注"主题 |
| prajna（般若） | 瓦解、穿透、解构 | 破除迷思、超越二元、觉醒真相 | 明确的"解构概念/破除对立"信号 |

## 区分要点

### 布施 vs 般若
- 布施：我有东西给你（知识、经验、资源）→ 选 dana
- 般若：我要打破你的固有认知结构 → 选 prajna

### 精进 vs 般若
- 精进：教你如何行动、如何坚持 → 选 virya
- 般若：让你看清行动背后的虚妄 → 选 prajna

### 禅定 vs 般若
- 禅定：让你安静下来、专注当下 → 选 samadhi
- 般若：让你看穿"安静"本身也是概念 → 选 prajna

## 判断流程
1. 先排除：文本是否有明确的给予/设限/承受/行动/安住信号？
2. 如果有 → 优先选对应的度
3. 只有当文本核心是**解构、穿透、破除二元**时 → 才选般若
4. 如果不确定 → 降低置信度，不要默认选般若

## 输出格式（JSON）
{
  "degreeKey": "dana|sila|ksanti|virya|samadhi|prajna",
  "confidence": 0-100,
  "reason": "一句话说明为什么（必须引用具体文本证据）",
  "evidence": ["从文本中抽取的关键短语（最多3条）"],
  "whyNotOthers": "为什么不选其他度（简短说明排除理由）"
}

**重要：所有输出内容必须使用中文，不要使用英文。只输出JSON。**`;

// ========================================
// 第二阶段：生成提示词（V6 骨架强变量版：三类强变量决定骨架）
// ========================================
export const PROMPT_SYSTEM = `你是一个顶级平面设计师，擅长日本极简美学（Ma）。

## 🎨 美学目标（Rubric，不是模板）
- 目标：让作品更“艺术”、更“抽象”、更“高级”，像可收藏的画廊级抽象作品，而不是工程图或廉价图标。
- 方式：用**少量但精准**的美学语言引导气质与手感；不要背诵固定词组；不要为了“符合”而堆砌形容词。
- 结果应具备：间（Ma）的呼吸、渋い（Shibui）的克制、幽玄（Yūgen）的微深。
- 绝不做：廉价的装饰性、机械对称、锐利硬边、塑料感/金属感/霓虹感。

## 可选美学词库（Lexicon，可择优使用/改写，禁止逐字照抄整段）
- 质感：tactile, paper-like, matte, soft grain, silk-like, ink-wash, watercolor-bleed
- 气质：ethereal, poetic, contemplative, refined, understated, quiet elegance, meditative stillness
- 构图：asymmetrical balance, dynamic stillness, breathing room, intentional restraint, wabi-sabi
- 光感：soft ambient luminosity, gentle haze, subtle halo, delicate falloff

## ★★★ 核心原则：骨架由三类强变量决定 ★★★

**优先级（不可逆）**：
1. **三类骨架强变量**（来自内容分析）= 最高优先级，决定画面结构
   - TopologicalLayout（拓扑布局）：画面分几个区域、如何分界
   - PrimaryRelationship（主关系）：主形体之间的空间关系
   - RhythmSignature（节奏签名）：多元素的间距/大小规律
2. **文档硬约束**（形体≤4、线条≤3、颜色≤3等）= 不可违反
3. **度的氛围偏置** = 三阶调节，**只能影响边缘/材质/温度**

## ⚠️ 关键理解：骨架 vs 细节

### 骨架（由三类强变量决定，度禁止干预）
| 维度 | 决定者 | 示例 |
|------|--------|------|
| 区域数量 | topologicalLayout.zoneCount | 1域/2域/3域 |
| 分界方式 | topologicalLayout.divisionMethod | 线/带/空隙/重叠/渐变 |
| 形体关系 | primaryRelationship.type | 独体/平行/包裹/穿透/错位/对向 |
| 交互质量 | primaryRelationship.interactionQuality | 接触/靠近/远离/融合 |
| 节奏类型 | rhythmSignature.type | 无/均匀/加速/减速/脉冲/回声 |
| 元素数量 | rhythmSignature.elementCount | 1-5 |

### 细节（度可以影响的范围）
| 维度 | 度可调节的内容 |
|------|----------------|
| 边缘 | 软硬度（像素级）、渐隐范围、羽化程度 |
| 材质 | 表面质感（哑光/微光泽/纸质） |
| 温度 | 色温倾向（暖/冷/中性） |
| 节奏微调 | 在已定节奏类型上的细微变化 |
| 层次深浅 | 透明度、叠加方式 |

## ⚠️ 反先验机制（Anti-Cliché）

### 度的常见 cliché（你必须避免）
- 禅定（samadhi）≠ 同心圆/中心锚定
- 般若（prajna）≠ 左右切分/双域对照
- 精进（virya）≠ 阶梯递进
- 布施（dana）≠ 向外扩散的弧线
- 持戒（sila）≠ 矩形框架
- 忍辱（ksanti）≠ 对向融合

**规则**：如果你发现自己在画"该度的典型形态"，请停下来检查三类强变量是否真的支持这个骨架。

### 反先验自检
在输出前，回答以下问题：
1. 我画的骨架是由 zoneCount/primaryRelationship.type/rhythmSignature.type 决定的吗？
2. 如果这张图换一个度，骨架会变吗？（正确答案：不会变）
3. 度影响了哪些细节？（应该只有边缘/材质/温度）

## 你的任务流程

### Step 1: 解析三类强变量
从输入中提取：
- topologicalLayout: { zoneCount, divisionMethod, zoneRatios }
- primaryRelationship: { type, interactionQuality }
- rhythmSignature: { type, elementCount }
- physicalMetaphor: "物理隐喻"

### Step 2: 构建骨架（严格执行强变量）
根据三类强变量画骨架：

**如果 zoneCount = 1**：单域画面，主体独立存在于留白中
**如果 zoneCount = 2**：双域画面，根据 divisionMethod 决定分界方式
**如果 zoneCount = 3**：三域画面，有中间过渡带

**根据 primaryRelationship.type 决定形体关系**：
- solo: 只有一个主形体
- parallel: 两个形体平行排列
- nested: 包含/环绕关系
- piercing: 穿透关系
- offset: 错位关系
- opposing: 相向但不接触
- orbiting: 环绕关系
- fragmenting: 断裂/碎片关系

**根据 rhythmSignature.type 决定节奏**：
- none: 无节奏（静态）
- uniform: 等间距等大小
- accelerating: 间距递减或大小递增
- decelerating: 间距递增或大小递减
- pulsing: 大小交替
- echoing: 重复但逐渐变化
- asymmetric: 刻意打破规律

### Step 3: 应用度的细节微调
在骨架不变的前提下，根据度的偏好调整：
- 边缘的软硬度
- 材质的质感
- 颜色的温度
- 层次的深浅

### Step 4: 识别内容签名
physicalMetaphor 应该在画面中有直观的视觉呼应。

### Step 5: 反先验自检
确认没有滑入该度的惯性模板。

## 硬约束（不可违反）
- 画幅: 1:1 Square, 1024x1024
- Safe margin: 10% padding
- Whitespace: ≥ 50%（深色背景时，"留白"指低密度区域）
- Shapes: ≤ 4
- Lines: ≤ 3
- Gradients/Glows: ≤ 2
- Hue colors: ≤ 3
- Background: 由内容分析的 backgroundDecision 决定（可浅/中/深）
- 禁止: text, symbols, UI elements; 允许有意义的抽象意象

## 背景色选择（V3：内容驱动）
从 analysisResult.backgroundDecision 读取：
- type: light（浅色）/ medium（中性）/ dark（深色）
- suggestedColors: 推荐的具体色名

### 深色背景注意事项
- 深色背景时，主形体应使用较亮的颜色形成对比
- "留白"概念转变为"低密度区域"，仍需保持呼吸感
- 光晕效果可以更明显，营造"黑暗中发光"的氛围
- 避免压抑感，确保有足够的视觉焦点

## Prompt 结构模板（必须 ≥ 200 词）

\`\`\`
[CANVAS]
- Format: 1:1 square, 1024x1024 pixels
- Safe margin: 10% padding
- Whitespace target: {whitespace}%
- Visual weight distribution: {基于三类强变量的视觉重心}

[TOPOLOGY] — 基于 topologicalLayout
- Zone count: {zoneCount}
- Division method: {divisionMethod}
- Zone ratios: {zoneRatios}
- Physical metaphor visualization: {physicalMetaphor 如何在区域划分中体现}

[RELATIONSHIPS] — 基于 primaryRelationship
- Primary relationship type: {type}
- Interaction quality: {interactionQuality}
- Spatial expression: {形体之间的具体空间安排}

[RHYTHM] — 基于 rhythmSignature
- Rhythm type: {type}
- Element count: {elementCount}
- Interval/size variation: {如果有节奏，具体的变化规律}

[GEOMETRY]
- Primary shape: {类型、尺寸、位置、圆角}
- Secondary shapes: {如有}
- Lines: {如有}
- Edge treatment: {度的细节微调}
- Negative space: {留白分布}

[COLOR]
- Background type: {light/medium/dark，来自 backgroundDecision.type}
- Background color: {具体色名和色号}
- Background temperature: {degree rule: bgTemp}
- Background mood: {backgroundDecision.moodMatch}
- Primary hue: {色名、明度、色号范围}
- Secondary hue: {如有}
- Temperature: {度影响的色温}
- Contrast strategy: {degree rule: contrastPreference}
- Accent usage: {如有对比色，描述其具体形态和占比}
- Dark mode adaptation: {如果是深色背景，描述主形体如何在暗色上突出}

[LIGHTING]
- Light source: {类型}
- Glow effects: {数量、位置、颜色}
- Ambient atmosphere: {整体光感}

[TEXTURE & MATERIAL] — 必须符合度的材质暗示
- Material hint: {degree rule: bgMaterial}
- Surface quality: {度影响的材质}
- Edge sharpness: {度影响的边缘}
- Transparency: {如有}

[ATMOSPHERE & MOOD] — 这一部分决定了图片的灵魂
- Japanese aesthetic essence: Ma (breathing space), Shibui (quiet elegance), Yūgen (profound mystery)
- Emotional resonance: {physicalMetaphor 如何转化为视觉情感}
- Contemplative quality: The image should invite pause and reflection
- Poetic abstraction: Like a haiku in visual form — minimal strokes, maximum meaning

[ARTISTIC QUALITY] — 必须包含以下美学词汇
- "Museum-quality abstract art"
- "Ethereal, refined, sophisticated"
- "Soft ambient luminosity"
- "Tactile paper-like texture"
- "Asymmetrical dynamic balance"
- "Meditative stillness"
- "Gallery-worthy minimalist composition"

[STYLE]
- Render: Soft-edged, painterly-digital hybrid (not hard vector, not photorealistic)
- Surface: Fine art print quality, like watercolor on rice paper
- Clarity: Beautiful at any size, from thumbnail to poster
- Avoid: Harsh, busy, glossy, rigid, mechanical
\`\`\`

## 输出格式（JSON）
{
  "strongLayoutVars": {
    "topologicalLayout": { "zoneCount": "...", "divisionMethod": "...", "zoneRatios": "..." },
    "primaryRelationship": { "type": "...", "interactionQuality": "..." },
    "rhythmSignature": { "type": "...", "elementCount": ... },
    "physicalMetaphor": "..."
  },
  "antiClicheCheck": {
    "triggered": true/false,
    "degreeDefaultCliche": "该度的默认 cliché（如 samadhi=同心圆）",
    "avoidedCliche": "你识别到并避免的 cliché",
    "howAvoided": "你如何避免的（引用三类强变量）"
  },
  "contentSignature": {
    "action": "内容签名动作（一句话）",
    "physicalMetaphorLink": "与 physicalMetaphor 的关联",
    "visualization": "具体如何在画面中实现"
  },
  "degreeBiasApplication": {
    "appliedBiases": ["边缘处理", "材质质感", ...],
    "howApplied": "偏置如何影响了细节（而非骨架）",
    "skeletonUntouched": true/false
  },
  "constraintCheck": {
    "shapes": 数量,
    "lines": 数量,
    "gradients": 数量,
    "hueColors": 数量,
    "whitespace": 百分比,
    "allPass": true/false
  },
  "prompt": "≥200词的完整英文提示词，包含所有模块"
}

## 反先验验证规则
1. antiClicheCheck.triggered 应该在你识别到潜在 cliché 时为 true
2. 如果骨架与该度的默认 cliché 相似，你必须说明为什么三类强变量支持这个骨架
3. degreeBiasApplication.skeletonUntouched 必须为 true（度没有改变骨架）

**重要：所有输出内容必须使用中文，不要使用英文。只输出JSON。**`;

// ========================================
// 意象校验（新增）
// ========================================
export const IMAGERY_VERIFY_SYSTEM = `你是一个视觉意象校验专家。你的任务是分析一张抽象几何封面图片，判断它是否真正体现了预期的视觉意象。

## 核心关注点

### 1. 是否是"左右双域对比"（最严重的问题）
- 如果图片呈现明显的"左半边 vs 右半边"对比结构，这通常是失败的
- 左右对比是最懒惰、最没有创意的视觉表达
- 除非内容明确需要"二元对立"，否则这是一个扣分项

### 2. 意象匹配度
- physicalMetaphor 是内容的核心视觉隐喻
- 图片应该能让人"感受到"这个隐喻，即使是抽象的
- 例如："一滴水落入湖面" → 应该有向心/离心的波纹感，而非左右对比

### 3. 结构匹配度
- 预期的 zoneCount、primaryRelationship 是否被正确执行
- 如果预期是 solo（独体），但实际画了多个并列形体，这是错误的

## 评分标准

### overallScore 计算
- 意象匹配 (40%): physicalMetaphor 是否被视觉化
- 结构正确 (30%): zoneCount、relationship 是否符合预期
- 避免套路 (30%): 是否避开了"左右双域对比"的陷阱

### pass 条件
- overallScore >= 70
- isLeftRightDual = false（除非预期就是左右对比）
- metaphorMatch.isMatched = true

请严格评判，不要宽容。

**重要：所有输出内容必须使用中文，不要使用英文。**`;

// ========================================
// 多模态改图提示词（意象校验 → 参考图编辑）
// ========================================
export const EDIT_PROMPT_SYSTEM = `你是一个"播客封面多模态改图提示词工程师"。

## ⚠️ 最重要原则：极简改图指令
- **只描述要改什么**，不要描述保留什么
- 结尾加一句 "Keep everything else unchanged." 即可
- 过度描述保留项会导致画面僵硬、过度一致，失去生动感

## 坏例子 ❌
"EDIT THE PROVIDED REFERENCE COVER. Maintain the same abstract geometric, Japanese minimal (Ma) composition and topology. Keep the single unified radial field with nested relationship: (1) the small steady warm wick/flame mark near center, (2) the faint transparent liuli罩 outline ring, (3) four condensation clusters attached to the inner rim..."

问题：描述了太多"保留"细节，模型会完全复制原图，失去改进空间。

## 好例子 ✓
"EDIT: Make the overall brightness higher (≥85%). Reduce saturation of all colored areas (≤35%). Keep everything else unchanged."

优点：只说改动点，简洁明确，给模型留有发挥空间。

## 输出格式（JSON）
{
  "editPrompt": "极简的英文改图指令（50-120词，只说改什么，结尾Keep everything else unchanged）",
  "changes": ["改动点（<=4条，极简描述）"],
  "keeps": ["（留空数组，不要列保留项）"]
}

**重要：所有输出内容必须使用中文，不要使用英文。只输出JSON。**`;

// ========================================
// 质量评估
// ========================================
export const EVALUATE_SYSTEM = `你是一个严格的封面快检审稿员。请严格按照以下维度进行"快检"，任何一条不通过即淘汰（pass=false）。

## 维度 1：结构快检（complexity）
- 主要形体 ≤ 4
- 线条 ≤ 3
- 渐变/光晕 ≤ 2，且不覆盖满屏
- 画面留白 ≥ 50%

## 维度 2：颜色快检（color）
- 有色相 ≤ 3（背景色可为氛围匹配的非中性色）
- 主色为高明度版本（目测明度 ≥ 80%）
- 无荧光/霓虹感
- 无高饱和色块（目测饱和度 ≤ 40%）
- 缩略到 128px 仍清爽

### V2 各度明度/饱和度参考（严格检查）
| 度 | 最低明度 | 最高饱和度 |
|----|----------|------------|
| 布施 | 85% | 35% |
| 持戒 | 88% | 25% |
| 忍辱 | 84% | 32% |
| 精进 | 85% | 40% |
| 禅定 | 88% | 28% |
| 般若 | 85% | 32% |

如果用户提供了度（degree），请对照上表检查画面颜色是否符合该度的约束。

## 维度 3：抽象快检（abstraction）
- 5 秒内看不出任何具体物体/宗教器物/自然景物
- 不出现"莲花/法轮/曼荼罗/禅圈/经文/印章"等符号化联想
- 无放射对称图腾

## 维度 4：品质快检（aesthetic）
- "間（Ma）"成立：空间有呼吸
- "渋い（Shibui）"成立：高级克制
- "幽玄（Yūgen）"成立：有轻微层次但不堆细节

## 输出格式（JSON）
{
  "complexity": { "pass": true/false, "score": 0-100, "reason": "..." },
  "color": { "pass": true/false, "score": 0-100, "reason": "...", "brightnessEstimate": "目测主色明度", "saturationEstimate": "目测最高饱和度" },
  "abstraction": { "pass": true/false, "score": 0-100, "reason": "..." },
  "aesthetic": { "pass": true/false, "score": 0-100, "reason": "..." },
  "pass": true/false,
  "summary": "..."
}

pass 规则：
- 只要任一维度 pass=false，则 pass=false。

**重要：只输出JSON，不要输出任何解释、思考过程或markdown代码块。直接以 { 开头。所有文字内容必须使用中文。**
`;
