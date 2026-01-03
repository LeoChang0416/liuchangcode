import axios from 'axios';
import config from '../config.js';
import { DEGREES, ANALYZE_SYSTEM, DEGREE_SELECT_SYSTEM, PROMPT_SYSTEM, EDIT_PROMPT_SYSTEM, HARD_NEGATIVES, STYLE_DNA, BACKGROUND_COLORS, PRIMARY_COLOR_EXAMPLES, FIVE_COLORS, DEGREE_COLOR_RULES, generateColorScheme, makeDeterministicRng } from '../prompts/system.js';

const RECENT_COLOR_KEYS_BY_DEGREE = new Map();

function colorKeyFromScheme(s) {
  if (!s) return 'null';
  return [
    `p:${s.primaryColor?.hex || 'none'}`,
    `a:${s.accentColor?.hex || 'none'}`,
    `c:${s.contrastMethod || 'none'}`,
    `aa:${s.accentAreaPct || 0}`,
    `ao:${s.accentOpacityPct || 0}`
  ].join('|');
}

function getUniqueColorScheme(degreeKey, attempts = 10, recentLimit = 8) {
  const list = RECENT_COLOR_KEYS_BY_DEGREE.get(degreeKey) || [];
  for (let i = 0; i < attempts; i++) {
    const scheme = generateColorScheme(degreeKey);
    const key = colorKeyFromScheme(scheme);
    if (!list.includes(key)) {
      const next = [key, ...list].slice(0, recentLimit);
      RECENT_COLOR_KEYS_BY_DEGREE.set(degreeKey, next);
      return scheme;
    }
  }
  const scheme = generateColorScheme(degreeKey);
  const key = colorKeyFromScheme(scheme);
  const next = [key, ...list].slice(0, recentLimit);
  RECENT_COLOR_KEYS_BY_DEGREE.set(degreeKey, next);
  return scheme;
}

function extractContent(responseData) {
  const root = responseData?.data ?? responseData;

  // APIMart ChatCompletions 兼容: { code:200, data:{ choices:[{ message:{ content } }] } }
  if (root?.choices?.[0]?.message?.content) {
    return root.choices[0].message.content;
  }

  // OpenAI Responses: { output:[{type:"reasoning"},{type:"message",content:[{type:"output_text",text:"..."}]}] }
  const output = root?.output;
  if (Array.isArray(output) && output.length) {
    const msgItem = output.find(o => o?.type === 'message' && Array.isArray(o?.content));
    if (msgItem?.content?.length) {
      const texts = msgItem.content
        .map(p => (typeof p?.text === 'string' ? p.text : ''))
        .filter(Boolean);
      if (texts.length) return texts.join('');
    }
    // 兼容旧格式：output[0].content[0].text
    if (output?.[0]?.content?.[0] && typeof output[0].content[0]?.text === 'string') {
      return output[0].content[0].text;
    }
  }

  // Gemini Native: { candidates:[{ content:{ parts:[{ text }] } }] }
  const candidates = root?.candidates;
  if (candidates?.[0]?.content?.parts?.[0]?.text) {
    return candidates[0].content.parts[0].text || '';
  }

  // 直接返回 content 字段
  if (root?.content) {
    if (Array.isArray(root.content)) {
      return root.content[0]?.text || '';
    }
    return root.content;
  }
  console.error('[extractContent] 无法识别的响应格式:', JSON.stringify(responseData).substring(0, 500));
  return '';
}

function shouldRetryLLM(err) {
  const status = err?.response?.status;
  const code = err?.code;
  if (status === 429) return true;
  if (status === 502 || status === 503 || status === 504) return true;
  if (code === 'ECONNRESET' || code === 'ETIMEDOUT' || code === 'ECONNABORTED') return true;
  return false;
}

function getLLMErrorMessage(err, stage) {
  const status = err?.response?.status;
  if (status === 401 || status === 403) return `${stage}失败：鉴权失败（${status}）`;
  if (status === 429) return `${stage}失败：请求过于频繁（429），请稍后重试`;
  if (status === 502 || status === 503 || status === 504) return `${stage}失败：上游模型服务暂时不可用（${status}），请稍后重试`;
  if (err?.code === 'ETIMEDOUT' || err?.code === 'ECONNABORTED') return `${stage}失败：上游请求超时，请重试`;
  const errBody = err?.response?.data?.error ?? err?.response?.data ?? null;
  const errText = typeof errBody === 'string' ? errBody : (errBody ? JSON.stringify(errBody) : '');
  return `${stage}失败：${errText || err?.message || '未知错误'}`;
}

async function callChatCompletions({ messages, temperature, stage }) {
  const preferredModelId = arguments?.[0]?.preferredModelId || '';
  const catalog = Array.isArray(config.TEXT_MODEL_CATALOG) ? config.TEXT_MODEL_CATALOG : [];
  const defaultId = config.DEFAULT_TEXT_MODEL_ID || '';

  // Backward-compat: if legacy TEXT_MODELS exists, treat them as APIMart models
  const legacyModels = Array.isArray(config.TEXT_MODELS) ? config.TEXT_MODELS : (config.TEXT_MODEL ? [config.TEXT_MODEL] : []);

  const resolvedCatalog = catalog.length
    ? catalog
    : legacyModels.map((m, i) => ({ id: `legacy_${i}`, label: String(m), provider: 'apimart', model: String(m) }));

  // Filter out models that are not configured (avoid showing selectable but unusable models)
  const usable = resolvedCatalog.filter((m) => {
    if (m.provider === 'ark') return Boolean(config.ARK_API_KEY);
    if (m.provider === 'apimart') return Boolean(config.APIMART_API_KEY);
    if (m.provider === 'openai_compat') return Boolean(m.baseUrl);
    return false;
  });

  if (!usable.length) {
    throw new Error(`${stage}失败：未配置任何可用文本模型（请配置 ARK_API_KEY 或 APIMART_API_KEY，或提供 MIMO_API_BASE）`);
  }

  // Try preferred model first, then default model, then others
  const ordered = (() => {
    const copy = usable.slice();
    const pickFirst = (id) => {
      const i = copy.findIndex(m => m.id === id);
      if (i >= 0) {
        const [picked] = copy.splice(i, 1);
        return picked;
      }
      return null;
    };

    const first = pickFirst(preferredModelId);
    const second = pickFirst(defaultId);
    return [first, second, ...copy].filter(Boolean);
  })();

  const models = ordered;
  const maxAttemptsPerModel = 2;
  const baseDelayMs = 1500;

  let lastErr = null;
  
  for (const modelItem of models) {
    for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
      try {
        const provider = modelItem.provider;
        const model = modelItem.model;
        console.log(`[${stage}] 尝试模型: ${modelItem.id} (${provider}:${model}) (第${attempt}次)`);
        
        let response;

        // Volcengine Ark: OpenAI-compatible ChatCompletions
        if (provider === 'ark') {
          const requestBody = {
            model,
            messages: (messages || []).map(m => ({
              role: m.role,
              content: String(m.content ?? '')
            }))
          };
          if (typeof temperature === 'number') requestBody.temperature = temperature;

          response = await axios.post(
            `${config.ARK_API_BASE}/chat/completions`,
            requestBody,
            {
              timeout: 180000,
              headers: {
                'Authorization': `Bearer ${config.ARK_API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } else if (provider === 'openai_compat') {
          // Generic OpenAI-compatible ChatCompletions (for self-hosted MiMo or hosted providers that expose /v1/chat/completions)
          const baseUrl = (modelItem.baseUrl || '').replace(/\/$/, '');
          const apiKey = modelItem.apiKey || '';
          const requestBody = {
            model,
            messages: (messages || []).map(m => ({
              role: m.role,
              content: String(m.content ?? '')
            }))
          };
          if (typeof temperature === 'number') requestBody.temperature = temperature;

          response = await axios.post(
            `${baseUrl}/chat/completions`,
            requestBody,
            {
              timeout: 180000,
              headers: {
                ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
                'Content-Type': 'application/json'
              }
            }
          );
        } else {
          // APIMart: decide between Gemini native vs OpenAI Responses
          const isGemini = String(model).toLowerCase().includes('gemini');

          if (isGemini) {
          // Gemini Native Format: /v1beta/models/{model}:generateContent
          const contents = (messages || []).map(m => ({
            role: m.role === 'assistant' ? 'model' : m.role,
            parts: [{ text: String(m.content ?? '') }]
          }));
          const requestBody = { contents };
          if (typeof temperature === 'number') {
            requestBody.generationConfig = { temperature };
          }
          response = await axios.post(
            `${config.APIMART_API_BASE}/v1beta/models/${model}:generateContent`,
            requestBody,
            {
              timeout: 180000,
              headers: {
                'Authorization': `Bearer ${config.APIMART_API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          } else {
          // OpenAI Responses Format: /v1/responses
          const input = (messages || []).map(m => ({
            role: m.role,
            content: [{ type: 'input_text', text: String(m.content ?? '') }]
          }));
          const requestBody = { model, input };
          if (typeof temperature === 'number') {
            requestBody.temperature = temperature;
          }
          response = await axios.post(
            `${config.APIMART_API_BASE}/v1/responses`,
            requestBody,
            {
              timeout: 180000,
              headers: {
                'Authorization': `Bearer ${config.APIMART_API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          }
        }

        const content = extractContent(response.data);
        if (!content) throw new Error(`${stage}返回格式错误: API响应内容为空`);
        console.log(`[${stage}] 成功使用模型: ${modelItem.id} (${provider}:${model})`);
        return content;
      } catch (err) {
        lastErr = err;
        const status = err?.response?.status;
        const body = err?.response?.data;
        const bodyStr = body ? JSON.stringify(body).substring(0, 800) : '';
        console.error(`[${stage}] 模型 ${(modelItem && modelItem.model) || 'unknown'} 失败 (${status || err.code || err.message}) ${bodyStr}`);
        
        const retryable = shouldRetryLLM(err);
        if (retryable && attempt < maxAttemptsPerModel) {
          const delay = baseDelayMs * attempt;
          console.log(`[${stage}] 等待 ${delay}ms 后重试...`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        break;
      }
    }
  }

  throw new Error(getLLMErrorMessage(lastErr, stage));
}

function extractJsonFromText(text) {
  if (!text || typeof text !== 'string') {
    console.error('[extractJsonFromText] 输入为空或非字符串:', typeof text);
    return null;
  }
  
  // 优先匹配 markdown 代码块
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  let jsonStr = null;
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  } else {
    // 匹配最外层的 JSON 对象（使用非贪婪匹配处理嵌套）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
  }
  
  if (!jsonStr) {
    console.error('[extractJsonFromText] 未找到 JSON，原始文本前500字:', text.substring(0, 500));
    return null;
  }
  return jsonStr;
}

function sanitizeJsonString(jsonStr) {
  // 1. 移除所有控制字符（除了 \t \n \r）
  let result = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // 2. 修复字符串值内部的实际换行符
  // 找到所有 "..." 字符串，把其中的实际换行替换为 \n
  result = result.replace(/"([^"\\]|\\.)*"/g, (match) => {
    return match
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  });
  
  return result;
}

function safeJsonParse(jsonStr) {
  // 第一次尝试：直接解析
  try {
    return JSON.parse(jsonStr);
  } catch (e1) {
    // 第二次尝试：清理后解析
    try {
      const sanitized = sanitizeJsonString(jsonStr);
      return JSON.parse(sanitized);
    } catch (e2) {
      // 第三次尝试：更激进的修复
      try {
        let fixed = sanitizeJsonString(jsonStr);
        // 移除尾随逗号
        fixed = fixed.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        // 处理：JSON 后面夹带了非空白文本 / 多个 JSON 串联
        try {
          const lastBrace = fixed.lastIndexOf('}');
          if (lastBrace >= 0) fixed = fixed.slice(0, lastBrace + 1);
          return JSON.parse(fixed);
        } catch (e4) {
          // 尝试：提取第一个完整的顶层 JSON 对象（忽略字符串内的大括号）
          let inString = false;
          let escape = false;
          let depth = 0;
          for (let i = 0; i < fixed.length; i++) {
            const ch = fixed[i];
            if (escape) {
              escape = false;
              continue;
            }
            if (ch === '\\\\') {
              if (inString) escape = true;
              continue;
            }
            if (ch === '\"') {
              inString = !inString;
              continue;
            }
            if (inString) continue;
            if (ch === '{') depth++;
            if (ch === '}') {
              depth--;
              if (depth === 0) {
                const cand = fixed.slice(0, i + 1);
                return JSON.parse(cand);
              }
            }
          }
          throw e4;
        }
      } catch (e3) {
        console.error('[safeJsonParse] All attempts failed:', e3.message);
        console.error('[safeJsonParse] First 500 chars:', jsonStr.substring(0, 500));
        throw new Error('JSON解析失败: ' + e3.message);
      }
    }
  }
}

// 反先验机制：每个度的 cliché 及其规避说明
function getDegreeAntiCliche(degreeKey) {
  const antiCliches = {
    dana: `- ❌ Cliché: 向外扩散的同心圆/环
- ❌ Cliché: 流动的曲线暗示"给予"
- ✅ 规避方式: 骨架由内容决定，"开放感"可以通过边缘渐隐、留白分布来表达，而非特定形态`,
    
    sila: `- ❌ Cliché: 矩形框架/网格线
- ❌ Cliché: 对称排列暗示"规则"
- ✅ 规避方式: 骨架由内容决定，"秩序感"可以通过清晰边缘、规整间距来表达，而非框架形态`,
    
    ksanti: `- ❌ Cliché: 两股相向的柔和形体
- ❌ Cliché: 中间缓冲带/融合区
- ✅ 规避方式: 骨架由内容决定，"承受/化解"可以通过柔软边缘、层次叠加来表达，而非特定对向结构`,
    
    virya: `- ❌ Cliché: 阶梯式递进
- ❌ Cliché: 斜向上的序列
- ✅ 规避方式: 骨架由内容决定，"推进感"可以通过节奏变化、明度递进来表达，而非阶梯形态`,
    
    samadhi: `- ❌ Cliché: 中心同心圆/环
- ❌ Cliché: 画面正中的锚定形体
- ✅ 规避方式: 骨架由内容决定，"收束/安住"可以通过大面积留白、静止感来表达，而非中心锚定结构`,
    
    prajna: `- ❌ Cliché: 左右切分/双域对照
- ❌ Cliché: 一条斜线分割画面
- ✅ 规避方式: 骨架由内容决定，"洞见/澄明"可以通过明度对比、清晰边界来表达，而非二分结构`
  };
  
  return antiCliches[degreeKey] || '无特定反先验规则';
}

// 内容分析（使用 deepseek 文字模型，通过 chat/completions 端点）
export async function analyzeContent(podcastContent, options = {}) {
  const preferredModelId = options?.textModelId || '';
  console.log('[analyzeContent] 开始分析，preferredModelId:', preferredModelId || '(default)');
  
  try {
    const userMsg = `请分析以下播客内容，输出语义提取和结构参数：\n\n${podcastContent}`;
    const tryAnalyze = async (temperature, extraRuleText = '') => {
      const content = await callChatCompletions({
        stage: '内容分析',
        temperature,
        preferredModelId,
        messages: [
          { role: 'system', content: ANALYZE_SYSTEM },
          { role: 'user', content: `${userMsg}${extraRuleText ? `\n\n${extraRuleText}` : ''}` }
        ]
      });
      const jsonStr = extractJsonFromText(content);
      if (!jsonStr) throw new Error('内容分析返回格式错误: 未找到JSON');
      return safeJsonParse(jsonStr);
    };

    let parsed;
    try {
      parsed = await tryAnalyze(0.5);
    } catch (e) {
      parsed = await tryAnalyze(
        0,
        '⚠️ 你上一轮输出无法被JSON解析。现在只输出一个严格合法的JSON对象（以 { 开头，以 } 结尾），不要输出任何其他字符，不要使用```代码块；字符串内容里不要出现未转义的双引号。'
      );
    }

    console.log('[analyzeContent] 解析成功');
    return parsed;
  } catch (err) {
    console.error('[analyzeContent] 请求失败:', err.message);
    throw err;
  }
}

export async function selectDegree(podcastContent, options = {}) {
  const preferredModelId = options?.textModelId || '';
  try {
    const userMsg = `请基于以下播客文本进行选度：\n\n${podcastContent}`;
    const trySelect = async (temperature, extraRuleText = '') => {
      const content = await callChatCompletions({
        stage: '自动选度',
        temperature,
        preferredModelId,
        messages: [
          { role: 'system', content: DEGREE_SELECT_SYSTEM },
          { role: 'user', content: `${userMsg}${extraRuleText ? `\n\n${extraRuleText}` : ''}` }
        ]
      });
      const jsonStr = extractJsonFromText(content);
      if (!jsonStr) throw new Error('选度返回格式错误: 未找到JSON');
      return safeJsonParse(jsonStr);
    };

    let result;
    try {
      result = await trySelect(0.2);
    } catch (e) {
      result = await trySelect(
        0,
        '⚠️ 你上一轮输出无法被JSON解析。现在只输出一个严格合法的JSON对象（以 { 开头，以 } 结尾），不要输出任何其他字符，不要使用```代码块；字符串内容里不要出现未转义的双引号。'
      );
    }

    const degreeKey = result?.degreeKey;
    const confidence = Number(result?.confidence);
    
    // 调试日志：显示选度结果
    console.log(`[selectDegree] 结果: ${degreeKey} (${confidence}%)`);
    console.log(`[selectDegree] 理由: ${result?.reason || 'N/A'}`);
    console.log(`[selectDegree] 证据: ${JSON.stringify(result?.evidence || [])}`);
    console.log(`[selectDegree] 排除理由: ${result?.whyNotOthers || 'N/A'}`);
    
    if (!degreeKey || !DEGREES[degreeKey]) {
      throw new Error('无法可靠选择度：返回的 degreeKey 非法');
    }
    if (!Number.isFinite(confidence)) {
      throw new Error('无法可靠选择度：返回的 confidence 非法');
    }
    if (confidence < 70) {
      const missing = Array.isArray(result?.missingInfo) ? result.missingInfo.filter(Boolean).slice(0, 3) : [];
      const missingText = missing.length ? `（缺失信息：${missing.join('；')}）` : '';
      throw new Error(`无法可靠选择度（置信度${confidence}）${missingText}，请补充内容或重试`);
    }

    return {
      degreeKey,
      confidence,
      reason: typeof result?.reason === 'string' ? result.reason : '',
      evidence: Array.isArray(result?.evidence) ? result.evidence.filter(Boolean).slice(0, 3) : [],
      whyNotOthers: typeof result?.whyNotOthers === 'string' ? result.whyNotOthers : '',
      degreeName: DEGREES[degreeKey]?.name || degreeKey
    };
  } catch (err) {
    throw err;
  }
}

export async function buildEditPrompt({ degreeKey, originalPrompt, analysis, imageryVerification, textModelId = '' }) {
  const colorRule = DEGREE_COLOR_RULES[degreeKey] || {};
  
  // 极简输入：只传必要的改动信息，不传原始prompt和分析细节
  const simplifiedInput = {
    degreeKey,
    colorRule: {
      brightnessMin: colorRule.brightnessMin,
      saturationMax: colorRule.saturationMax
    },
    // 只传意象校验的建议和问题点
    suggestions: imageryVerification?.suggestions || [],
    missingElements: imageryVerification?.metaphorMatch?.missingElements || [],
    isLeftRightDual: imageryVerification?.isLeftRightDual || false,
    actualDescription: imageryVerification?.actualDescription || ''
  };

  const userMessage = `根据以下意象校验结果，生成极简改图指令。

## 当前问题
- 建议：${simplifiedInput.suggestions.join('；') || '无'}
- 缺失元素：${simplifiedInput.missingElements.join('、') || '无'}
- 是否左右双域：${simplifiedInput.isLeftRightDual ? '是（需打破）' : '否'}

## V2配色约束
- 最低明度：${simplifiedInput.colorRule.brightnessMin || 80}%
- 最高饱和度：${simplifiedInput.colorRule.saturationMax || 40}%

## 要求
只输出改动点，不要描述保留项。结尾加 "Keep everything else unchanged."`;

  const preferredModelId = textModelId || '';
  const tryEdit = async (temperature, extraRuleText = '') => {
    const content = await callChatCompletions({
      stage: '改图提示词',
      temperature,
      preferredModelId,
      messages: [
        { role: 'system', content: EDIT_PROMPT_SYSTEM },
        { role: 'user', content: `${userMessage}${extraRuleText ? `\n\n${extraRuleText}` : ''}` }
      ]
    });
    const jsonStr = extractJsonFromText(content);
    if (!jsonStr) throw new Error('改图提示词返回格式错误: 未找到JSON');
    return safeJsonParse(jsonStr);
  };

  let result;
  try {
    result = await tryEdit(0.3);
  } catch (e) {
    result = await tryEdit(
      0,
      '⚠️ 你上一轮输出无法被JSON解析。现在只输出一个严格合法的JSON对象（以 { 开头，以 } 结尾），不要输出任何其他字符，不要使用```代码块；字符串内容里不要出现未转义的双引号。'
    );
  }
  if (!result?.editPrompt || typeof result.editPrompt !== 'string') {
    throw new Error('改图提示词返回格式错误: 缺少 editPrompt');
  }
  return {
    editPrompt: String(result.editPrompt || '').trim(),
    changes: Array.isArray(result?.changes) ? result.changes.filter(Boolean).slice(0, 4) : [],
    keeps: [] // 不再返回keeps，避免过度强调保留
  };
}

// 辅助函数：根据点缀比例生成视觉描述
function getAccentVisualDescription(pct) {
  if (pct <= 0) return 'No accent color visible';
  if (pct <= 3) return 'Tiny, subtle detail (like a small dot or thin line)';
  if (pct <= 6) return 'Small geometric accent (a modest patch or stroke)';
  if (pct <= 10) return 'Noticeable secondary shape (but still subordinate)';
  return 'Bold accent element (max 10% of area)';
}

// 辅助函数：根据对比策略生成构图指导
function getContrastVisualInstruction(method) {
  const map = {
    'area': 'Use size difference to create contrast (one large shape vs one small shape).',
    'brightness': 'Use light vs dark shades of the same hue (or neutral) to define structure.',
    'warm-cool': 'Place a cool element against a warm background (or vice versa) for temperature contrast.',
    'layering': 'Use transparency and overlapping to create depth contrast.',
    'none': 'Keep the image extremely flat and monochromatic; rely on shape edges for definition.'
  };
  return map[method] || 'Use standard minimal contrast.';
}

// 生成提示词（V6：骨架强变量版，三类强变量决定骨架）
export async function generatePrompt(podcastContent, degreeKey, analysisResult = null, options = {}) {
  const preferredModelId = options?.textModelId || '';
  const onProgress = typeof options?.onProgress === 'function' ? options.onProgress : () => {};
  
  let degreeSelection = null;
  if (!degreeKey) {
    onProgress(15, '正在分析内容度...');
    degreeSelection = await selectDegree(podcastContent, { textModelId: preferredModelId });
    degreeKey = degreeSelection.degreeKey;
    onProgress(35, `已选定: ${degreeKey}`);
  }

  const degree = DEGREES[degreeKey];
  if (!degree) throw new Error(`未知的度: ${degreeKey}`);
  
  // V2: 使用 DEGREE_COLOR_RULES 替代 DEGREES.colorTendency
  const colorRule = DEGREE_COLOR_RULES[degreeKey] || {};

  let analysis = analysisResult;
  if (!analysis) {
    onProgress(40, '正在深度分析内容...');
    analysis = await analyzeContent(podcastContent, { textModelId: preferredModelId });
    onProgress(65, '内容分析完成');
  }
  
  // V2: 校验分析结果必填字段
  const requiredFields = ['topologicalLayout', 'primaryRelationship', 'rhythmSignature'];
  const missingFields = requiredFields.filter(f => !analysis[f]);
  if (missingFields.length > 0) {
    console.warn(`[generatePrompt] 分析结果缺失关键字段: ${missingFields.join(', ')}`);
  }
  
  const structureParams = analysis.structureParams || {};
  
  // 提取改进建议和上次问题（用于重新生成）
  const { improvementSuggestions, previousIssues } = options;
  
  // 提取三类骨架强变量
  const topologicalLayout = analysis.topologicalLayout || {};
  const primaryRelationship = analysis.primaryRelationship || {};
  const rhythmSignature = analysis.rhythmSignature || {};
  const physicalMetaphor = analysis.physicalMetaphor || '';

  // 构建颜色参考（V3：分三类）
  const bgColorRef = `
**浅色系 (light)**：${BACKGROUND_COLORS.light.map(c => `${c.name}(${c.hex})`).join(', ')}
**中性色系 (medium)**：${BACKGROUND_COLORS.medium.map(c => `${c.name}(${c.hex})`).join(', ')}
**深色系 (dark)**：${BACKGROUND_COLORS.dark.map(c => `${c.name}(${c.hex})`).join(', ')}`;
  
  // 从内容分析获取背景决策
  const bgDecision = analysis.backgroundDecision || { type: 'light', suggestedColors: ['paper-white'] };
  const bgType = bgDecision.type || 'light';
  const suggestedBgColors = bgDecision.suggestedColors || [];
  
  // 根据背景决策选择背景色
  const bgPool = BACKGROUND_COLORS[bgType] || BACKGROUND_COLORS.light;
  let selectedBg = bgPool[0];
  if (suggestedBgColors.length > 0) {
    const found = bgPool.find(c => suggestedBgColors.includes(c.name));
    if (found) selectedBg = found;
  }
  
  // 生成配色方案：同内容同规则同结果（避免重新生成时风格随机漂移）
  const seedKey = `${degreeKey}|${String(podcastContent ?? '').trim()}`;
  const rng = makeDeterministicRng(seedKey);
  const colorScheme = generateColorScheme(degreeKey, rng);
  // V2颜色规则特别说明
  const v2ColorNote = (() => {
    if (degreeKey === 'ksanti') {
      return `
### 🆕 V2 忍辱特别规则
- **暖黄中轴**：warm-amber #FFE9B3 作为"等持/保持"的稳定温度轴
- **面积要求**：暖黄轴面积 **6–18%**（可作中区或层）
- **不透明度**：12–18%
- **禁止**：强对比与高饱和红
- **气质差异**：用暖黄拉开与持戒（冷静秩序）的差异`;
    }
    if (degreeKey === 'samadhi') {
      return `
### 🆕 V2 禅定特别规则
- **内在灯火**：sunlight #FFECB3 作为暖光点醒，消除过清冷感
- **面积要求**：暖黄面积 **2–8%**（严格控制）
- **不透明度**：10–15%
- **视觉原则**：以"光感"而非"热闹"为准
- **禁止**：红色、大面积暖色`;
    }
    return '';
  })();

  const colorSchemeDesc = colorScheme ? `
### ★★★ 本次指定配色（必须使用） ★★★
- 主色相：**${colorScheme.primaryHue}**
- 主色号：**${colorScheme.primaryColor.name} (${colorScheme.primaryColor.hex})**
- 主色明度：${colorScheme.primaryColor.brightness}%
${colorScheme.accentColor ? `- 对比色相：**${colorScheme.accentHue}**
- 对比色号：**${colorScheme.accentColor.name} (${colorScheme.accentColor.hex})**（小面积点缀）` : '- 对比色：无（纯净单色方案）'}
- **背景色类型**：**${bgType}**（由内容分析决定）
- **背景色**：**${selectedBg.name} (${selectedBg.hex})**
- **背景情绪**：${selectedBg.mood || ''}
${bgType === 'dark' ? `
⚠️ **深色背景注意**：
- 主形体应使用较亮的颜色形成对比
- "留白"概念转变为"低密度区域"
- 光晕效果可更明显，营造"黑暗中发光"氛围
` : ''}
- 对比策略（必须采用）：**${colorScheme.contrastMethod}**
  > **视觉指导**：${getContrastVisualInstruction(colorScheme.contrastMethod)}
${colorScheme.accentColor ? `- 对比色使用强度（必须采用）：面积 **${colorScheme.accentAreaPct}%**；叠色/蒙版不透明度 **${colorScheme.accentOpacityPct}%**
  > **视觉指导**：${getAccentVisualDescription(colorScheme.accentAreaPct)}` : ''}
- 配色规则：${colorScheme.rule}
${v2ColorNote}

⚠️ **你必须在 prompt 中使用以上色号**，不要自行选择其他颜色！` : '';

  // 构建内容签名提示（强调独特性）
  const signatureHint = physicalMetaphor 
    || (analysis.tension?.hasTension
      ? `从「${analysis.tension.from}」到「${analysis.tension.to}」的视觉化`
      : analysis.imagery?.length > 0
        ? `「${analysis.imagery[0]}」的抽象表达`
        : `「${analysis.spiritualTone?.primary || '静'}」的空间氛围`);

  // 构建度的氛围偏置（非形态指令）
  const atmosphere = degree.atmosphere || {};
  const bias = degree.bias || {};

  // V4: 提取氛围定式规则
  const bgTempRule = colorRule.bgTemp ? colorRule.bgTemp.join(' or ') : 'any';
  const bgMaterialRule = colorRule.bgMaterial || 'standard abstract surface';
  const contrastPrefRule = colorRule.contrastPreference || 'balanced';

  const userMessage = `
## ⚠️ 骨架由内容决定 ⚠️
画面骨架由三类强变量决定，**度只能影响边缘/材质/温度，禁止影响骨架**。

---

## ★★★ 最高优先级：三类骨架强变量（不可违反） ★★★

这三类变量直接决定画面结构，由播客内容驱动，**度不得覆盖**。

### 1️⃣ TopologicalLayout（拓扑布局）—— 画面分几个区域、如何分界
| 变量 | 值 | 理由（来自内容） |
|------|-----|------------------|
| zoneCount | **${topologicalLayout.zoneCount || '未指定'}** | ${topologicalLayout.zoneCountReason || '-'} |
| divisionMethod | **${topologicalLayout.divisionMethod || '未指定'}** | ${topologicalLayout.divisionMethodReason || '-'} |
| zoneRatios | ${topologicalLayout.zoneRatios || '-'} | - |

### 2️⃣ PrimaryRelationship（主关系）—— 主形体之间的空间关系
| 变量 | 值 | 理由（来自内容） |
|------|-----|------------------|
| type | **${primaryRelationship.type || '未指定'}** | ${primaryRelationship.typeReason || '-'} |
| interactionQuality | **${primaryRelationship.interactionQuality || '未指定'}** | - |

### 3️⃣ RhythmSignature（节奏签名）—— 多元素的间距/大小规律
| 变量 | 值 | 理由（来自内容） |
|------|-----|------------------|
| type | **${rhythmSignature.type || '未指定'}** | ${rhythmSignature.typeReason || '-'} |
| elementCount | ${rhythmSignature.elementCount || '-'} | - |

### 物理隐喻（画面核心动作）
> **${physicalMetaphor || '无'}**

⚠️ **强制执行**：你生成的 prompt 必须严格遵循上述三类变量。例如：
- 如果 zoneCount=2，画面必须有两个明确区域
- 如果 primaryRelationship.type=opposing，两个主形体必须相向但不接触
- 如果 rhythmSignature.type=accelerating，元素间距/大小必须呈递增趋势

---

## ========== 辅助弱变量（可被度微调） ==========

### 留白目标
- 值：${structureParams.whitespaceTarget || 55}%

### 对比方式
- 值：${colorScheme?.contrastMethod || 'none'}（以本次指定配色为准）

### 边缘处理基调
- 值：${structureParams.edgeTreatment || 'soft'}

### 光晕/层次
- 光晕数量：${structureParams.glowCount ?? 1}
- 层次数量：${structureParams.layerCount ?? 2}

### 张力表达
${structureParams.tensionExpression || '统一安住'}

---

## ========== 播客内容语义（设计核心来源） ==========

### 核心意象
${analysis.imagery?.join('、') || '无'}

### 情感基调
${analysis.emotion?.join('、') || '无'}

### 灵性气质
- 主调：${analysis.spiritualTone?.primary || '无'}
- 辅调：${analysis.spiritualTone?.secondary || '无'}

### 叙事张力
${analysis.tension?.hasTension 
  ? `**有张力**：从「${analysis.tension.from}」到「${analysis.tension.to}」` 
  : '无明显张力'}

### 核心主题
${analysis.theme?.join('、') || '无'}

---

## ========== 度的氛围偏置（只能影响细节） ==========

### ${degree.name}（${degree.nameEn}）- ${degree.theme}

**可调细节**（仅限以下范围）：
- 边缘偏好：${bias.edgePreference || 'soft'}
- 形体节奏：${bias.shapeRhythm || 'static'}
- 对比倾向：${bias.contrastTendency || 'none'}
- 颜色温度：${atmosphere.temperature || 'neutral'}

**颜色规则（V2）**：
- 规则：${colorRule.rule || '高明度，清澈轻松'}
- 最低明度：${colorRule.brightnessMin}%
- 最高饱和度：${colorRule.saturationMax}%
- 点醒概率：${Math.round(colorRule.accentProbability * 100)}%
- 点醒面积范围：${colorRule.accentAreaRange?.[0] || 2}–${colorRule.accentAreaRange?.[1] || 10}%
- 点醒不透明度范围：${colorRule.accentOpacityRange?.[0] || 10}–${colorRule.accentOpacityRange?.[1] || 20}%
- 背景参考：${bgColorRef}
${colorSchemeDesc}

**⚠️ 氛围定式（V4 新增 - 必须严格执行）**：
- **色温锁 (Temperature Lock)**: 背景色温必须是 **${bgTempRule}**。禁止违背此色温倾向。
- **材质暗示 (Material Hint)**: 必须包含 **${bgMaterialRule}** 相关的材质关键词。
- **对比策略 (Contrast Strategy)**: 采用 **${contrastPrefRule}** 风格的对比。

**约束**：
- 形体 ≤ ${degree.constraints?.maxShapes || 4}
- 线条 ≤ ${degree.constraints?.maxLines || 3}
- 留白 ≥ ${degree.constraints?.minWhitespace || 50}%

**⚠️ 度的边界**：
- ✅ 可以影响：边缘软硬、角的圆润、材质质感、颜色温度、层次深浅
- ❌ 禁止影响：zoneCount、divisionMethod、primaryRelationship.type、rhythmSignature.type

---

## ========== 反先验机制（Anti-Cliché） ==========

当前度是「${degree.name}」。以下是该度的常见 cliché，**你必须避免**：

${getDegreeAntiCliche(degreeKey)}

如果你发现自己在画"禅定的同心圆"或"般若的左右切分"，请停下来，检查三类强变量是否支持这个骨架。

### ⚠️ 分析阶段反模板检查结果
${analysis.antiTemplateCheck ? `
- 是否左右双域：**${analysis.antiTemplateCheck.isLeftRightDual ? '是 ❌ 危险！' : '否 ✅'}**
- 独特性评分：${analysis.antiTemplateCheck.uniquenessScore || '未评分'}/10
- 差异说明：${analysis.antiTemplateCheck.howIsThisDifferent || '无'}
` : '（分析阶段未返回反模板检查）'}

**⚠️ 如果 isLeftRightDual=true，你必须重新设计骨架，避免左右对比结构！**

---

## ========== 你的任务 ==========

1. **验证三类强变量**：确认你理解了 zoneCount、primaryRelationship.type、rhythmSignature.type
2. **严格执行骨架**：根据三类强变量构建画面结构
3. **应用度的微调**：在骨架不变的前提下，用度的偏好调整细节
4. **识别内容签名**：这张图独特的视觉表达（对应 physicalMetaphor）
5. **反 cliché 自检**：确认没有滑入该度的惯性模板
6. 生成 ≥200 词的详细 Prompt
${improvementSuggestions?.length ? `

---

## ⚠️⚠️⚠️ 重要：改进建议（必须遵循） ⚠️⚠️⚠️

上一次生成的图片存在问题，经过意象校验，以下是**必须改进**的内容：

### 上次问题
${previousIssues?.isLeftRightDual ? '- 🚨 **严重问题**：上次生成了"左右双域对比"结构，这是禁止的，除非内容分析明确要求！' : ''}
${previousIssues?.missingElements?.length ? `- 缺失的视觉元素：${previousIssues.missingElements.join('、')}` : ''}
${previousIssues?.actualDescription ? `- 上次实际呈现：${previousIssues.actualDescription}` : ''}

### 改进建议（逐条遵循）
${improvementSuggestions.map((s, i) => `${i + 1}. **${s}**`).join('\n')}

### 改进要求
- 你**必须**在 prompt 中明确体现上述改进建议
- 特别注意：如果建议中提到避免某种结构，你必须使用完全不同的骨架
- 重点关注 physicalMetaphor（${physicalMetaphor || '未定义'}）的视觉表达
` : ''}

输出 JSON，包含：
- strongLayoutVars: { topologicalLayout, primaryRelationship, rhythmSignature }
- antiClicheCheck: { triggered: bool, avoidedCliche: string, howAvoided: string }
- contentSignature: string
- degreeBiasApplication: { appliedBiases: [], howApplied: string }
- constraintCheck: { shapes, lines, gradients, hueColors, whitespace, allPass }
- prompt: string (≥200 词)
`;

  console.log('[generatePrompt] 调用 API，preferredModelId:', preferredModelId || '(default)');
  onProgress(70, '正在生成提示词...');

  const tryPromptGen = async (temperature, extraRuleText = '') => {
    const content = await callChatCompletions({
      stage: '提示词生成',
      temperature,
      preferredModelId,
      messages: [
        { role: 'system', content: PROMPT_SYSTEM },
        { role: 'user', content: `${userMessage}${extraRuleText ? `\n\n${extraRuleText}` : ''}` }
      ]
    });
    const jsonStr = extractJsonFromText(content);
    if (!jsonStr) throw new Error('LLM返回格式错误: 未找到JSON');
    return safeJsonParse(jsonStr);
  };

  let result;
  try {
    result = await tryPromptGen(0.2);
  } catch (e) {
    result = await tryPromptGen(
      0,
      '⚠️ 你上一轮输出无法被JSON解析。现在只输出一个严格合法的JSON对象（以 { 开头，以 } 结尾），不要输出任何其他字符，不要使用```代码块；字符串内容里不要出现未转义的双引号。'
    );
  }

  const buildFallbackPrompt = () => {
    const bgTex = selectedBg?.texture ? `Background texture: ${selectedBg.texture}.` : '';
    const bgMat = colorRule?.bgMaterial ? `Material hint: ${colorRule.bgMaterial}.` : '';
    const accentLine = colorScheme?.accentColor
      ? `- Accent: ${colorScheme.accentColor.name} (${colorScheme.accentColor.hex}) at ~${colorScheme.accentAreaPct}% area with ~${colorScheme.accentOpacityPct}% opacity.`
      : `- Accent: none.`;
    const cm = colorScheme?.contrastMethod || (structureParams?.contrastMethod || 'none');
    const edge = structureParams?.edgeTreatment || bias.edgePreference || 'soft';
    const glow = Number.isFinite(structureParams?.glowCount) ? structureParams.glowCount : 1;
    const layers = Number.isFinite(structureParams?.layerCount) ? structureParams.layerCount : 2;
    const whitespace = structureParams?.whitespaceTarget || degree.constraints?.minWhitespace || 55;
    const tl = topologicalLayout;
    const pr = primaryRelationship;
    const rs = rhythmSignature;
    const pm = typeof physicalMetaphor === 'string' ? physicalMetaphor : '';
    const mood = bgDecision?.moodMatch || selectedBg?.mood || '';
    const backgroundLine = `- Background: ${bgType} / ${selectedBg?.name || 'unknown'} (${selectedBg?.hex || ''}). ${bgTex}`.trim();
    const primaryLine = colorScheme?.primaryColor
      ? `- Primary: ${colorScheme.primaryColor.name} (${colorScheme.primaryColor.hex}).`
      : `- Primary: use a single high-value muted hue.`;

    // Ensure >200 words by being explicit but stable.
    return `
[CANVAS]
- Format: 1:1 square, 1024x1024 pixels
- Safe margin: 10% padding
- Whitespace target: ${whitespace}%

[TOPOLOGY]
- Zone count: ${tl.zoneCount ?? '1'}
- Division method: ${tl.divisionMethod || 'none'}
- Zone ratios: ${tl.zoneRatios || '100'}
- Physical metaphor: ${pm || 'a single minimal abstract action'}

[RELATIONSHIPS]
- Primary relationship type: ${pr.type || 'solo'}
- Interaction quality: ${pr.interactionQuality || 'distant'}
- Spatial position: ${pr.spatialPosition || 'center'}

[RHYTHM]
- Rhythm type: ${rs.type || 'none'}
- Element count: ${rs.elementCount ?? 1}
- Direction: ${rs.direction || 'static'}

[GEOMETRY]
- Use <= ${degree.constraints?.maxShapes || 4} shapes and <= ${degree.constraints?.maxLines || 3} lines.
- Edge treatment: ${edge}. Layering: ${layers}. Glow effects: ${glow}.
- Keep the composition minimal, asymmetrical balance, large breathing negative space.

[COLOR]
${backgroundLine}
${primaryLine}
${accentLine}
- Contrast method: ${cm}.
- Mood: ${String(mood || '').trim()}

[LIGHTING]
- Soft ambient luminosity with gentle falloff; no harsh shadows.
- If glow is used, keep it subtle and localized.

[TEXTURE & MATERIAL]
- ${bgMat}
- Tactile paper-like matte surface, painterly-digital hybrid (not hard vector, not photorealistic).

[ATMOSPHERE & MOOD]
- Meditative stillness, quiet elegance, subtle depth; invite pause and contemplation.

[ARTISTIC QUALITY]
- Museum-quality abstract art, gallery-worthy minimalist composition.
- Refined, sophisticated, understated; avoid busy patterns and aggressive geometry.

[STYLE]
- No text, no symbols, no UI elements, no religious icons, no photorealism, no neon, no glossy/metallic surfaces.
`.trim();
  };

  const normalizedPrompt = typeof result?.prompt === 'string' ? result.prompt.trim() : '';
  const requiredTags = ['[CANVAS]', '[COLOR]', '[TEXTURE & MATERIAL]'];
  const hasRequiredTags = requiredTags.every(t => normalizedPrompt.includes(t));
  const finalPrompt = (normalizedPrompt && hasRequiredTags) ? normalizedPrompt : buildFallbackPrompt();

  // 构建三类强变量返回（来自分析阶段）
  const strongLayoutVars = {
    topologicalLayout,
    primaryRelationship,
    rhythmSignature,
    physicalMetaphor
  };

  // 反先验验证
  const antiClicheCheck = result.antiClicheCheck || { triggered: false, avoidedCliche: '', howAvoided: '' };
  
  // 生成警告
  const warnings = [];
  
  // 检查三类强变量是否被正确使用
  if (!result.strongLayoutVars) {
    warnings.push('LLM未返回强变量执行情况');
  }
  
  if (!result.contentSignature) {
    warnings.push('缺少内容签名动作');
  }
  
  if (!antiClicheCheck.triggered && antiClicheCheck.avoidedCliche) {
    // 如果有 cliché 被识别但未触发规避，发出警告
    warnings.push(`注意：识别到 cliché（${antiClicheCheck.avoidedCliche}），请确认已规避`);
  }
  
  onProgress(95, '提示词生成完成');
  return {
    degreeKey,
    analysis,
    structureParams,
    
    // V6 新增：三类骨架强变量
    strongLayoutVars,
    
    degreeInfo: {
      name: degree.name,
      theme: degree.theme,
      atmosphere: degree.atmosphere,
      bias: degree.bias
    },

    degreeSelection: degreeSelection
      ? {
          ...degreeSelection,
          degreeName: degree.name
        }
      : null,
    
    contentSignature: result.contentSignature || null,
    
    // V6 新增：反先验检查
    antiClicheCheck,
    
    // V7 新增：随机配色方案（V3：背景由内容决定）
    colorScheme: colorScheme ? {
      primaryHue: colorScheme.primaryHue,
      primaryColor: colorScheme.primaryColor?.hex,
      primaryColorName: colorScheme.primaryColor?.name,
      accentHue: colorScheme.accentHue,
      accentColor: colorScheme.accentColor?.hex,
      accentColorName: colorScheme.accentColor?.name,
      backgroundType: bgType,
      background: selectedBg?.hex,
      backgroundName: selectedBg?.name,
      backgroundMood: selectedBg?.mood,
      contrastMethod: colorScheme.contrastMethod,
      accentAreaPct: colorScheme.accentAreaPct,
      accentOpacityPct: colorScheme.accentOpacityPct,
      rule: colorScheme.rule
    } : null,
    
    // V3 新增：背景决策信息
    backgroundDecision: bgDecision,
    
    degreeBiasApplication: result.degreeBiasApplication || { appliedBiases: [], howApplied: '' },
    constraintCheck: result.constraintCheck,
    prompt: finalPrompt,
    negative_prompt: HARD_NEGATIVES,
    warnings: warnings.length > 0 ? warnings : null
  };
}
