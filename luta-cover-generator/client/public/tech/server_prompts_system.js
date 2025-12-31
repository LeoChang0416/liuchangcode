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
      edgePreference: 'soft-fade',        // 边缘偏好：柔和渐隐
      shapeRhythm: 'flowing',             // 形体节奏：流动感
      contrastTendency: 'area',           // 对比倾向：面积对比为主
      whitespaceDistribution: 'outer',    // 留白分布：外围更多
      depthTreatment: 'subtle-layers',    // 深度处理：微妙层次
      cornerTreatment: 'rounded'          // 角处理：圆润
    },
    
    // 约束（硬性）
    constraints: { maxShapes: 3, maxLines: 2, minWhitespace: 55 },
    
    // 颜色倾向（非具体配方）
    colorTendency: '暖色或中性绿为主，高明度，避免深沉冷硬',
    
    // 情感锚点（用于内容匹配，不是画面指令）
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
      edgePreference: 'crisp',            // 边缘偏好：清晰但不锐利
      shapeRhythm: 'static',              // 形体节奏：静态稳定
      contrastTendency: 'brightness',     // 对比倾向：明度对比
      whitespaceDistribution: 'inner',    // 留白分布：内部留白
      depthTreatment: 'flat',             // 深度处理：扁平
      cornerTreatment: 'subtle-round'     // 角处理：微圆角
    },
    
    constraints: { maxShapes: 4, maxLines: 3, minWhitespace: 50 },
    colorTendency: '冷色或中性白为主，高明度，极简配色',
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
      temperature: '温和中性，不极端'
    },
    
    bias: {
      edgePreference: 'gradient-fade',    // 边缘偏好：渐变过渡
      shapeRhythm: 'cushioned',           // 形体节奏：有缓冲
      contrastTendency: 'layering',       // 对比倾向：层次叠加
      whitespaceDistribution: 'center',   // 留白分布：中心缓冲
      depthTreatment: 'subtle-layers',    // 深度处理：微妙层次
      cornerTreatment: 'very-rounded'     // 角处理：非常圆润
    },
    
    constraints: { maxShapes: 3, maxGradients: 2, minWhitespace: 50 },
    colorTendency: '柔和冷色或中性色，避免刺激性色彩',
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
      edgePreference: 'crisp',            // 边缘偏好：清晰
      shapeRhythm: 'progressive',         // 形体节奏：递进感
      contrastTendency: 'brightness',     // 对比倾向：明度递进
      whitespaceDistribution: 'directional', // 留白分布：有方向
      depthTreatment: 'distinct-planes',  // 深度处理：层次分明
      cornerTreatment: 'subtle-round'     // 角处理：微圆角
    },
    
    constraints: { maxShapes: 4, maxLines: 2, minWhitespace: 50 },
    colorTendency: '暖色为主（红/黄高明度），配冷色点缀平衡',
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
      temperature: '清凉宁静，不温不火'
    },
    
    bias: {
      edgePreference: 'soft-fade',        // 边缘偏好：柔和渐隐
      shapeRhythm: 'static',              // 形体节奏：静态
      contrastTendency: 'none',           // 对比倾向：极弱对比
      whitespaceDistribution: 'dominant', // 留白分布：主导性留白
      depthTreatment: 'flat',             // 深度处理：扁平
      cornerTreatment: 'rounded'          // 角处理：圆润
    },
    
    constraints: { maxShapes: 2, maxLines: 1, minWhitespace: 65 },
    colorTendency: '冷色或中性白为主，极高明度，配色最少',
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
      edgePreference: 'soft-division',    // 边缘偏好：柔和分界
      shapeRhythm: 'contrasting',         // 形体节奏：对照感
      contrastTendency: 'warm-cool',      // 对比倾向：冷暖对比
      whitespaceDistribution: 'balanced', // 留白分布：均衡
      depthTreatment: 'distinct-planes',  // 深度处理：层次分明
      cornerTreatment: 'mixed'            // 角处理：混合
    },
    
    constraints: { maxShapes: 3, maxLines: 2, minWhitespace: 55 },
    colorTendency: '冷暖对照或明暗对照，高明度，强调"洞见"感',
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

// 风格DNA
export const STYLE_DNA = `
- Background: Minimalist paper-like texture or solid color, high brightness (off-white/light gray).
- Lighting: Soft, diffuse ambient light. No harsh shadows. Max 2 subtle gradients/glows.
- Aesthetics: Japanese minimalism (Ma), clean, serene, balanced.
- Composition: Strict geometric abstraction. No concrete objects.
`;

// 背景色号参考（扩展）
export const BACKGROUND_COLORS = [
  { name: 'paper-white', hex: '#F6F4EE', temp: 'warm' },
  { name: 'mist-white', hex: '#F3F5F6', temp: 'cool' },
  { name: 'warm-beige', hex: '#F7F2E8', temp: 'warm' },
  { name: 'soft-gray', hex: '#F0F0F0', temp: 'neutral' },
  { name: 'cream', hex: '#FFFEF5', temp: 'warm' },
  { name: 'cool-mist', hex: '#F5F7FA', temp: 'cool' },
  { name: 'ivory', hex: '#FFFFF0', temp: 'warm' },
  { name: 'snow', hex: '#FFFAFA', temp: 'neutral' }
];

// ========================================
// 五方佛五色体系（基于 lutaai.txt 2.1）
// 每色 6 个变体：从极浅到中等，覆盖不同明度/饱和度
// ========================================
export const FIVE_COLORS = {
  '蓝': {
    meaning: '澄明、冷静、深邃（东方）',
    variants: [
      { name: 'ice-blue', hex: '#E8F4FC', brightness: 95, saturation: 15 },
      { name: 'sky-mist', hex: '#D6EAF8', brightness: 92, saturation: 22 },
      { name: 'soft-azure', hex: '#AED6F1', brightness: 85, saturation: 35 },
      { name: 'powder-blue', hex: '#85C1E9', brightness: 78, saturation: 45 },
      { name: 'clear-cyan', hex: '#E0F7FA', brightness: 94, saturation: 20 },
      { name: 'serene-blue', hex: '#B3E5FC', brightness: 88, saturation: 30 }
    ]
  },
  '黄': {
    meaning: '温暖、开阔、滋养（南方）',
    variants: [
      { name: 'cream-yellow', hex: '#FFF9E6', brightness: 97, saturation: 10 },
      { name: 'soft-gold', hex: '#FFF3CD', brightness: 95, saturation: 20 },
      { name: 'warm-amber', hex: '#FFE9B3', brightness: 92, saturation: 30 },
      { name: 'honey-light', hex: '#FFE082', brightness: 88, saturation: 40 },
      { name: 'butter', hex: '#FFF8E1', brightness: 96, saturation: 15 },
      { name: 'sunlight', hex: '#FFECB3', brightness: 93, saturation: 28 }
    ]
  },
  '红': {
    meaning: '力量、温热、精进（西方）',
    variants: [
      { name: 'blush', hex: '#FFEBEE', brightness: 96, saturation: 8 },
      { name: 'rose-mist', hex: '#FFCDD2', brightness: 90, saturation: 18 },
      { name: 'coral-light', hex: '#FFAB91', brightness: 82, saturation: 35 },
      { name: 'peach', hex: '#FFCCBC', brightness: 88, saturation: 25 },
      { name: 'warm-rose', hex: '#F8BBD9', brightness: 85, saturation: 28 },
      { name: 'terracotta-light', hex: '#FFCCBC', brightness: 88, saturation: 22 }
    ]
  },
  '绿': {
    meaning: '生机、平衡、流动（北方）',
    variants: [
      { name: 'mint-mist', hex: '#E8F5E9', brightness: 96, saturation: 10 },
      { name: 'soft-sage', hex: '#C8E6C9', brightness: 90, saturation: 20 },
      { name: 'spring-green', hex: '#A5D6A7', brightness: 84, saturation: 30 },
      { name: 'jade-light', hex: '#B2DFDB', brightness: 88, saturation: 25 },
      { name: 'eucalyptus', hex: '#E0F2F1', brightness: 95, saturation: 12 },
      { name: 'celadon', hex: '#DCEDC8', brightness: 92, saturation: 18 }
    ]
  },
  '白': {
    meaning: '清净、澄澈、空灵（中央）',
    variants: [
      { name: 'pure-white', hex: '#FFFFFF', brightness: 100, saturation: 0 },
      { name: 'cloud-white', hex: '#FAFAFA', brightness: 98, saturation: 0 },
      { name: 'fog-white', hex: '#F5F5F5', brightness: 96, saturation: 0 },
      { name: 'pearl', hex: '#F8F9FA', brightness: 97, saturation: 2 },
      { name: 'silk', hex: '#FCFCFC', brightness: 99, saturation: 0 },
      { name: 'moon-white', hex: '#F0F4F8', brightness: 95, saturation: 5 }
    ]
  }
};

// ========================================
// 每个度的颜色策略（V2 修订版）
// ========================================
export const DEGREE_COLOR_RULES = {
  dana: {
    name: '布施',
    primaryHues: ['黄', '绿'],  // 主色优先：黄/绿高明度
    accentHues: ['蓝', '红'],   // 对比色可选：蓝/红（小面积）
    bgTempPrefer: 'warm',       // 背景温度倾向
    brightnessMin: 85,          // 最低明度
    saturationMax: 35,          // 最高饱和度
    accentProbability: 0.7,
    accentAreaRange: [2, 6],    // 点醒面积%
    accentOpacityRange: [10, 15], // 点醒不透明度%
    allowedContrastMethods: ['area', 'brightness', 'warm-cool'],
    rule: '高明度黄/绿为主，蓝/红只作"提示"，避免抢戏',
    palette: { main: 'butter', mainHex: '#FFF8E1', aux1: 'celadon', aux1Hex: '#DCEDC8', aux2: 'ice-blue', aux2Hex: '#E8F4FC', bg: 'paper-white', bgHex: '#F6F4EE' }
  },
  sila: {
    name: '持戒',
    primaryHues: ['白', '蓝', '绿'],
    accentHues: ['红', '黄'],   // 极小面积
    bgTempPrefer: 'cool',
    brightnessMin: 88,
    saturationMax: 25,
    accentProbability: 0.35,
    accentAreaRange: [1, 4],
    accentOpacityRange: [8, 12],
    allowedContrastMethods: ['brightness', 'area', 'none'],
    rule: '以冷白/淡蓝/淡绿建立秩序；红/黄仅用于"警醒点"',
    palette: { main: 'moon-white', mainHex: '#F0F4F8', aux1: 'ice-blue', aux1Hex: '#E8F4FC', aux2: 'eucalyptus', aux2Hex: '#E0F2F1', bg: 'mist-white', bgHex: '#F3F5F6' }
  },
  ksanti: {
    name: '忍辱',
    primaryHues: ['白', '绿'],  // V2: 白/绿为主
    accentHues: ['黄'],         // V2: 暖黄作为稳定中轴，蓝/红极少
    bgTempPrefer: 'warm',       // V2: 中性偏暖
    brightnessMin: 84,          // V2: 降至84%
    saturationMax: 32,          // V2: 升至32%
    accentProbability: 0.4,
    accentAreaRange: [6, 18],   // V2: 暖黄轴可更大面积
    accentOpacityRange: [12, 18],
    allowedContrastMethods: ['layering', 'brightness', 'warm-cool', 'none'],
    rule: '以留白与雾化叠层承受刺激；引入"温和暖黄"作为稳定中轴',
    palette: { main: 'pearl', mainHex: '#F8F9FA', aux1: 'mint-mist', aux1Hex: '#E8F5E9', aux2: 'warm-amber', aux2Hex: '#FFE9B3', bg: 'cream', bgHex: '#FFFEF5' }
  },
  virya: {
    name: '精进',
    primaryHues: ['红', '黄'],  // 主色优先：红/黄高明度
    accentHues: ['蓝', '绿'],   // 冷色平衡
    bgTempPrefer: 'warm',
    brightnessMin: 85,          // V2: 上调至85%
    saturationMax: 40,
    accentProbability: 0.75,
    accentAreaRange: [2, 6],
    accentOpacityRange: [10, 15],
    allowedContrastMethods: ['brightness', 'area', 'warm-cool'],
    rule: '暖色主导但不压；用冷色作"呼吸口"，保持轻盈',
    palette: { main: 'honey-light', mainHex: '#FFE082', aux1: 'warm-rose', aux1Hex: '#F8BBD9', aux2: 'serene-blue', aux2Hex: '#B3E5FC', bg: 'warm-beige', bgHex: '#F7F2E8' }
  },
  samadhi: {
    name: '禅定',
    primaryHues: ['白', '蓝'],  // V2: 白/蓝为主
    accentHues: ['黄'],         // V2: 暖黄作为"内在灯火"，避免红
    bgTempPrefer: 'neutral',    // V2: 中性（不强冷）
    brightnessMin: 88,
    saturationMax: 28,          // V2: 升至28%
    accentProbability: 0.3,     // V2: 升至30%
    accentAreaRange: [2, 8],
    accentOpacityRange: [10, 15],
    allowedContrastMethods: ['brightness', 'area', 'warm-cool', 'none'],
    rule: '仍以留白与微差为核心，加入明亮暖黄作为"内在灯火"',
    palette: { main: 'cloud-white', mainHex: '#FAFAFA', aux1: 'clear-cyan', aux1Hex: '#E0F7FA', aux2: 'sunlight', aux2Hex: '#FFECB3', bg: 'ivory', bgHex: '#FFFFF0' }
  },
  prajna: {
    name: '般若',
    primaryHues: ['白', '蓝', '黄'],
    accentHues: ['绿', '红'],   // 小面积点醒
    bgTempPrefer: 'cool',
    brightnessMin: 85,
    saturationMax: 32,
    accentProbability: 0.55,    // V2: 降至55%
    accentAreaRange: [2, 5],
    accentOpacityRange: [10, 15],
    allowedContrastMethods: ['warm-cool', 'brightness', 'area'],
    rule: '保留冷暖对照但降低频率；点醒色更小更淡，避免"聪明而躁"',
    palette: { main: 'moon-white', mainHex: '#F0F4F8', aux1: 'clear-cyan', aux1Hex: '#E0F7FA', aux2: 'cream-yellow', aux2Hex: '#FFF9E6', bg: 'cool-mist', bgHex: '#F5F7FA' }
  }
};

function pickOne(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function randFloat(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// 随机选择颜色变体的工具函数
export function selectColorVariant(hueName, minBrightness = 80, maxSaturation = 40) {
  const hue = FIVE_COLORS[hueName];
  if (!hue) return null;
  
  const eligible = hue.variants.filter(v => 
    v.brightness >= minBrightness && v.saturation <= maxSaturation
  );
  
  if (eligible.length === 0) return hue.variants[0];
  return eligible[Math.floor(Math.random() * eligible.length)];
}

// 根据度生成随机配色方案
export function generateColorScheme(degreeKey) {
  const rule = DEGREE_COLOR_RULES[degreeKey];
  if (!rule) return null;
  
  // 随机选择主色相
  const primaryHue = pickOne(rule.primaryHues);
  const primaryVariant = selectColorVariant(primaryHue, rule.brightnessMin, rule.saturationMax);
  
  // 对比策略（增强变化维度）
  const contrastMethod = pickOne(rule.allowedContrastMethods || ['brightness', 'area', 'warm-cool', 'layering', 'none']);
  
  // 是否使用对比色（不同度不同概率；且在 contrastMethod=none 时强制不使用）
  const accentAllowed = contrastMethod !== 'none' && Array.isArray(rule.accentHues) && rule.accentHues.length > 0;
  const accentProbability = typeof rule.accentProbability === 'number' ? clamp(rule.accentProbability, 0, 1) : 0.5;
  const useAccent = accentAllowed && Math.random() < accentProbability;
  const accentHue = useAccent ? pickOne(rule.accentHues) : null;
  const accentVariant = useAccent && accentHue
    ? selectColorVariant(accentHue, rule.brightnessMin + 5, rule.saturationMax - 5)
    : null;

  // 点缀强度（V2：使用各度专属的范围）
  const areaRange = rule.accentAreaRange || [2, 10];
  const opacityRange = rule.accentOpacityRange || [12, 22];
  const accentAreaPct = accentVariant ? Math.round(randFloat(areaRange[0], areaRange[1])) : 0;
  const accentOpacityPct = accentVariant ? Math.round(randFloat(opacityRange[0], opacityRange[1])) : 0;
  
  // V2：优先使用各度预设的调色板背景，否则匹配温度
  let bgColor;
  if (rule.palette && rule.palette.bgHex) {
    bgColor = { name: rule.palette.bg, hex: rule.palette.bgHex, temp: rule.bgTempPrefer };
  } else {
    const eligibleBgs = BACKGROUND_COLORS.filter(bg => 
      bg.temp === rule.bgTempPrefer || bg.temp === 'neutral'
    );
    bgColor = pickOne(eligibleBgs) || BACKGROUND_COLORS[0];
  }
  
  return {
    primaryHue,
    primaryColor: primaryVariant,
    accentHue,
    accentColor: accentVariant,
    background: bgColor,
    contrastMethod,
    accentAreaPct,
    accentOpacityPct,
    rule: rule.rule
  };
}

// 兼容旧代码的导出
export const PRIMARY_COLOR_EXAMPLES = {
  '黄': { light: '#FFF8E7', medium: '#FFE5B4' },
  '绿': { light: '#E8F5E9', medium: '#C8E6C9' },
  '蓝': { light: '#E3F2FD', medium: '#BBDEFB' },
  '红': { light: '#FFEBEE', medium: '#FFCDD2' },
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
  }
}

## 多样化输出示例

### 示例1：关于"专注力"的播客
{
  "contentEssence": "在纷扰中找到内心的锚点",
  "physicalMetaphor": "一颗石子沉入水底，周围尘埃渐渐平息",
  "metaphorVisualization": "中心一个沉稳的主形体，周围是极大的静谧留白",
  "topologicalLayout": { "zoneCount": "1", "divisionMethod": "none", "zoneRatios": "100" },
  "primaryRelationship": { "type": "solo", "spatialPosition": "center" },
  "rhythmSignature": { "type": "none", "direction": "static" },
  "antiTemplateCheck": { "isLeftRightDual": false, "uniquenessScore": 8 }
}

### 示例2：关于"成长"的播客
{
  "contentEssence": "从根基向上生长的力量",
  "physicalMetaphor": "竹笋破土而出，节节向上",
  "metaphorVisualization": "底部紧实，向上逐渐展开，用上下布局而非左右",
  "topologicalLayout": { "zoneCount": "2", "divisionMethod": "horizontal", "zoneRatios": "30:70" },
  "primaryRelationship": { "type": "piercing", "spatialPosition": "bottom" },
  "rhythmSignature": { "type": "accelerating", "direction": "upward", "elementCount": 3 },
  "antiTemplateCheck": { "isLeftRightDual": false, "uniquenessScore": 9 }
}

### 示例3：关于"包容"的播客
{
  "contentEssence": "以柔克刚，海纳百川",
  "physicalMetaphor": "大圆包裹着小圆，边界柔软透气",
  "metaphorVisualization": "外层环形包裹内层，用嵌套关系而非并列对比",
  "topologicalLayout": { "zoneCount": "1", "divisionMethod": "radial", "zoneRatios": "100" },
  "primaryRelationship": { "type": "nested", "spatialPosition": "center" },
  "rhythmSignature": { "type": "echoing", "direction": "outward", "elementCount": 2 },
  "antiTemplateCheck": { "isLeftRightDual": false, "uniquenessScore": 9 }
}

### 示例4：关于"涅槃"的播客（即使有对比，也不用左右）
{
  "contentEssence": "破碎后的重生",
  "physicalMetaphor": "碎片从四周向中心聚合，形成新的整体",
  "metaphorVisualization": "多个碎片向心聚拢，动态但不是左右对比",
  "topologicalLayout": { "zoneCount": "1", "divisionMethod": "radial", "zoneRatios": "100" },
  "primaryRelationship": { "type": "fragmenting", "spatialPosition": "center" },
  "rhythmSignature": { "type": "decelerating", "direction": "inward", "elementCount": 4 },
  "antiTemplateCheck": { "isLeftRightDual": false, "uniquenessScore": 10 }
}

---

## 最终检查（输出前必须确认）

1. ✅ physicalMetaphor 是否具体、独特、可视化？
2. ✅ zoneCount 是否真的需要是 2？大多数情况 1 就够了！
3. ✅ primaryRelationship 是否避开了 opposing？
4. ✅ antiTemplateCheck.isLeftRightDual 是否为 false？
5. ✅ 这个骨架是否真正反映了播客的独特意象？

只输出 JSON。`;

// ========================================
// 自动选度（V1）
// ========================================
export const DEGREE_SELECT_SYSTEM = `你是一个“六度（布施/持戒/忍辱/精进/禅定/般若）自动判别器”。你的任务是：阅读用户提供的完整播客文本内容（可包含标题、简介、逐字稿片段、要点），判断最适合的“度”。

## 重要原则
- 你必须阅读并综合整段文本，不要只看开头几句。
- 选择依据必须来自文本本身的语义与气质：情绪、动机、行动方向、张力类型、价值取向。
- 如果信息不足或多度都合理，你必须降低置信度，并明确说明缺失信息点。
- 不要输出多余解释，只输出 JSON。

## 六度语义取向（高层）
- dana（布施）：开放、给予、流动、轻盈；向外扩展、分享、连接、温暖而不炽热。
- sila（持戒）：边界、秩序、澄净；规则、自律、克制、清明、守护、稳定的“框定”。
- ksanti（忍辱）：承受、缓冲、化解；接纳、包容、消融冲突、等持/保持、温和稳定。
- virya（精进）：推进、节律、明快；行动力、训练、持续、迭代、突破惯性但不焦躁。
- samadhi（禅定）：收束、安住、澄寂；内在沉静、定力、专注、空明、减少噪声。
- prajna（般若）：切透、澄明、洞见；认知穿透、看破迷雾、觉察、分辨与明晰（可有冷暖对照但不必二元对立）。

## 输出格式（JSON）
{
  "degreeKey": "dana|sila|ksanti|virya|samadhi|prajna",
  "confidence": 0-100,
  "reason": "一句话说明为什么（引用文本语义，不要泛泛而谈）",
  "evidence": ["从文本中抽取的短语/要点（最多3条）"],
  "missingInfo": ["若置信度<70，指出缺失的信息（最多3条）"]
}

只输出 JSON。`;

// ========================================
// 第二阶段：生成提示词（V6 骨架强变量版：三类强变量决定骨架）
// ========================================
export const PROMPT_SYSTEM = `你是一个顶级平面设计师，擅长日本极简美学（Ma）。

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
- Whitespace: ≥ 50%
- Shapes: ≤ 4
- Lines: ≤ 3
- Gradients/Glows: ≤ 2
- Hue colors: ≤ 3
- Background: atmosphere-matching color (can be non-neutral)
- 禁止: text, symbols, UI elements; 允许有意义的抽象意象

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
- Background: {色号}
- Primary hue: {色名、明度、色号范围}
- Secondary hue: {如有}
- Temperature: {度影响的色温}
- Contrast method: {对比方式及具体的构图体现}
- Accent usage: {如有对比色，描述其具体形态和占比}

[LIGHTING]
- Light source: {类型}
- Glow effects: {数量、位置、颜色}
- Ambient atmosphere: {整体光感}

[TEXTURE & MATERIAL] — 度可微调
- Surface quality: {度影响的材质}
- Edge sharpness: {度影响的边缘}
- Transparency: {如有}

[ATMOSPHERE & MOOD]
- Japanese aesthetic: {Ma/Kanso/Shibui}
- Content resonance: {physicalMetaphor 的情感呼应}
[STYLE]
- Render style: Clean vector-like digital art
- No photorealism, no 3D rendering
- High clarity at 128px thumbnail
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

只输出 JSON。`;

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

请严格评判，不要宽容。`;

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
- 主色为高明度版本
- 无荧光/霓虹感
- 缩略到 128px 仍清爽

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
  "color": { "pass": true/false, "score": 0-100, "reason": "..." },
  "abstraction": { "pass": true/false, "score": 0-100, "reason": "..." },
  "aesthetic": { "pass": true/false, "score": 0-100, "reason": "..." },
  "pass": true/false,
  "summary": "..."
}

pass 规则：
- 只要任一维度 pass=false，则 pass=false。
`;
