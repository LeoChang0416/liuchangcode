export default {
  API_KEY: 'sk-QDveW1X9IX9GAkWuQ9GbL9NAZSaJA9OfXQ5lbySqYe1zVAIV',
  API_BASE: 'https://api.apimart.ai',
  IMAGE_MODEL: 'gemini-3-pro-image-preview',
  // 文字分析模型（内容分析、生成提示词）- 按优先级排列，503时自动切换
  TEXT_MODELS: ['gemini-3-pro-image-preview'],
  TEXT_MODEL: 'gemini-3-pro-image-preview', // 默认首选
  // 视觉模型（图片评估、意象校验）
  VISION_MODEL: 'gemini-2.5-pro',
  PORT: 3002
};

