import dotenv from 'dotenv';
dotenv.config();

export default {
  // ====== Provider credentials (use env; DO NOT hardcode secrets) ======
  // APIMart
  APIMART_API_KEY: process.env.APIMART_API_KEY || process.env.API_KEY || '',
  APIMART_API_BASE: process.env.APIMART_API_BASE || process.env.API_BASE || 'https://api.apimart.ai',

  // Volcengine Ark (Doubao)
  // Base recommended by Ark console examples: https://ark.cn-beijing.volces.com/api/v3
  ARK_API_KEY: process.env.ARK_API_KEY || '',
  ARK_API_BASE: process.env.ARK_API_BASE || 'https://ark.cn-beijing.volces.com/api/v3',

  // Xiaomi MiMo (Official API Platform: https://platform.xiaomimimo.com)
  // Base URL: https://api.xiaomimimo.com/v1
  MIMO_API_KEY: process.env.MIMO_API_KEY || '',
  MIMO_API_BASE: process.env.MIMO_API_BASE || 'https://api.xiaomimimo.com/v1',
  MIMO_MODEL: process.env.MIMO_MODEL || 'mimo-v2-flash',

  // ====== Image (kept as-is; still via APIMart in this project) ======
  IMAGE_MODEL: process.env.IMAGE_MODEL || 'gemini-3-pro-image-preview',

  // ====== Text models catalog (for analysis & prompt generation) ======
  // id is what frontend sends as textModelId
  TEXT_MODEL_CATALOG: [
    {
      id: 'doubao-seed-1-8',
      label: 'Doubao-Seed-1.8（Ark）',
      provider: 'ark',
      model: process.env.ARK_TEXT_MODEL || 'doubao-seed-1-8-251215'
    },
    {
      id: 'apimart-gemini',
      label: 'Gemini（APIMart）',
      provider: 'apimart',
      model: process.env.APIMART_TEXT_MODEL || 'gemini-3-pro-image-preview'
    },
    {
      id: 'mimo-v2-flash',
      label: 'MiMo-V2-Flash（Xiaomi）',
      provider: 'openai_compat',
      model: process.env.MIMO_MODEL || 'mimo-v2-flash',
      baseUrl: process.env.MIMO_API_BASE || 'https://api.xiaomimimo.com/v1',
      apiKey: process.env.MIMO_API_KEY || ''
    }
  ],
  DEFAULT_TEXT_MODEL_ID: process.env.DEFAULT_TEXT_MODEL_ID || 'doubao-seed-1-8',

  // 视觉模型（图片评估、意象校验）
  VISION_MODEL: process.env.VISION_MODEL || 'gemini-3-flash-preview',

  PORT: Number(process.env.PORT || 3002)
};

