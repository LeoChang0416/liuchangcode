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

  // ====== Grsai (Nano Banana 图片生成) ======
  // 文档: https://grsai.com/zh/dashboard/documents/nano-banana
  GRSAI_API_KEY: process.env.GRSAI_API_KEY || '',
  GRSAI_API_BASE: process.env.GRSAI_API_BASE || 'https://grsai.dakka.com.cn',

  // ====== Image Provider 选择 ======
  // 可选: 'apimart' | 'grsai'
  IMAGE_PROVIDER: process.env.IMAGE_PROVIDER || 'grsai',
  IMAGE_MODEL: process.env.IMAGE_MODEL || 'nano-banana',

  // ====== Text models catalog (for analysis & prompt generation) ======
  // id is what frontend sends as textModelId
  TEXT_MODEL_CATALOG: [
    {
      id: 'doubao-seed-1-6-flash',
      label: 'Doubao-Seed-1.6-flash（Ark）',
      provider: 'ark',
      model: process.env.ARK_TEXT_MODEL || 'ep-20260103202057-tgj44'
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
  DEFAULT_TEXT_MODEL_ID: process.env.DEFAULT_TEXT_MODEL_ID || 'doubao-seed-1-6-flash',

  // 视觉模型（图片评估、意象校验）
  VISION_MODEL: process.env.VISION_MODEL || 'gemini-3-flash-preview',

  PORT: Number(process.env.PORT || 3002)
};

