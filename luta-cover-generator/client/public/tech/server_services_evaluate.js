import axios from 'axios';
import config from '../config.js';
import { EVALUATE_SYSTEM, IMAGERY_VERIFY_SYSTEM } from '../prompts/system.js';

// 下载图片并转为 base64
async function imageUrlToBase64(url) {
  if (!url || typeof url !== 'string') {
    throw new Error(`imageUrlToBase64: URL无效 - ${typeof url}`);
  }
  // 验证URL格式
  try {
    new URL(url);
  } catch (e) {
    throw new Error(`imageUrlToBase64: URL格式错误 - ${url}`);
  }
  console.log('[imageUrlToBase64] 下载图片:', url);
  const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
  const contentType = response.headers['content-type'] || 'image/jpeg';
  const base64 = Buffer.from(response.data, 'binary').toString('base64');
  console.log('[imageUrlToBase64] 下载成功, size:', response.data.byteLength, 'type:', contentType);
  return { base64, mimeType: contentType };
}

// 判断是否使用 Gemini 模型
function isGeminiModel(model) {
  return model && model.toLowerCase().includes('gemini');
}

// 从响应中提取文本内容
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
      return output[0].content[0].text || '';
    }
  }

  // Gemini Native: { candidates:[{ content:{ parts:[{ text }] } }] }
  const candidates = root?.candidates;
  if (candidates?.[0]?.content?.parts?.[0]?.text) {
    return candidates[0].content.parts[0].text || '';
  }

  // OpenAI ChatCompletions（非data包裹）
  const choices = root?.choices;
  if (choices?.[0]?.message?.content) {
    return choices[0].message.content || '';
  }
  console.error('[extractContent] 无法识别的响应格式:', JSON.stringify(responseData).substring(0, 500));
  return '';
}

// 从文本中提取JSON
function extractJsonFromText(text) {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  let jsonStr = null;
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  } else {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
  }
  if (!jsonStr) return null;
  // 清理控制字符
  jsonStr = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return jsonStr;
}

function safeJsonParse(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    const fixed = jsonStr
      .replace(/:\s*"([^"]*)\n([^"]*)"/g, ': "$1\\n$2"')
      .replace(/,\s*\n\s*}/g, '\n}')
      .replace(/,\s*\n\s*]/g, '\n]');
    return JSON.parse(fixed);
  }
}

export function buildQuickCheckSuggestions(evaluation, threshold = 75) {
  if (!evaluation) return [];
  const dims = ['complexity', 'color', 'abstraction', 'aesthetic'];
  const suggestions = [];
  for (const k of dims) {
    const item = evaluation?.[k];
    if (!item) continue;
    const pass = item?.pass === true;
    const score = Number(item?.score);
    const isLow = Number.isFinite(score) && score < threshold;
    if (!pass || isLow) {
      const reason = typeof item?.reason === 'string' ? item.reason : '';
      if (reason) suggestions.push(`${k}: ${reason}`);
      else suggestions.push(`${k}: 低分/未通过`);
    }
  }
  const overallPass = evaluation?.pass === true;
  const anyLow = dims.some(k => {
    const s = Number(evaluation?.[k]?.score);
    return Number.isFinite(s) && s < threshold;
  });
  if (overallPass && !anyLow) return [];
  return Array.from(new Set(suggestions)).slice(0, 6);
}

export async function evaluateImage(imageUrl, degreeKey = null) {
  console.log('[evaluateImage] 开始评估...');
  
  try {
    const model = config.VISION_MODEL;
    const userText = `请对这张播客封面图片进行快检评分。${degreeKey ? `本次度（degree）为：${degreeKey}。请按该度的V2明度/饱和度约束严格检查颜色快检。` : ''}`;
    
    let response;
    
    if (isGeminiModel(model)) {
      // Gemini Native Format: 需要下载图片转 base64
      console.log('[evaluateImage] 使用 Gemini Native Format');
      const { base64, mimeType } = await imageUrlToBase64(imageUrl);
      
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: EVALUATE_SYSTEM + '\n\n' + userText },
              { inlineData: { mimeType, data: base64 } }
            ]
          }
        ],
        generationConfig: { temperature: 0.3 }
      };
      
      response = await axios.post(
        `${config.APIMART_API_BASE}/v1beta/models/${model}:generateContent`,
        requestBody,
        {
          timeout: 120000,
          headers: {
            'Authorization': `Bearer ${config.APIMART_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } else {
      // OpenAI Responses Format
      const requestBody = {
        model,
        input: [
          {
            role: 'system',
            content: [{ type: 'input_text', text: EVALUATE_SYSTEM }]
          },
          {
            role: 'user',
            content: [
              { type: 'input_text', text: userText },
              { type: 'input_image', image_url: imageUrl }
            ]
          }
        ],
        temperature: 0.3
      };

      response = await axios.post(
        `${config.APIMART_API_BASE}/v1/responses`,
        requestBody,
        {
          timeout: 120000,
          headers: {
            'Authorization': `Bearer ${config.APIMART_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    console.log('[evaluateImage] API 响应状态:', response.status);
    
    const content = extractContent(response.data);
    console.log('[evaluateImage] Raw content:', content.substring(0, 500));
    
    if (!content) {
      console.error('[evaluateImage] extractContent 返回空');
      throw new Error('评估返回格式错误: API响应内容为空');
    }
    
    const jsonStr = extractJsonFromText(content);
    if (!jsonStr) {
      console.error('[evaluateImage] extractJsonFromText 返回空');
      throw new Error('评估返回格式错误: 未找到JSON');
    }
    
    console.log('[evaluateImage] JSON 提取成功, 长度:', jsonStr.length);
    
    const result = safeJsonParse(jsonStr);
    console.log('[evaluateImage] 解析成功, pass:', result?.pass);
    return result;
  } catch (e) {
    console.error('[evaluateImage] 错误:', e.response?.data || e.message || e);
    throw e;
  }
}

// 意象校验：验证图片是否体现了内容的独特意象
export async function verifyImagery(imageUrl, analysisResult) {
  const physicalMetaphor = analysisResult?.physicalMetaphor || '';
  const imagery = analysisResult?.imagery || [];
  const contentEssence = analysisResult?.contentEssence || '';
  const topologicalLayout = analysisResult?.topologicalLayout || {};
  const primaryRelationship = analysisResult?.primaryRelationship || {};
  
  const verifyPrompt = `## 你的任务
分析这张抽象几何封面图片，判断它是否体现了预期的视觉意象。

## 预期的视觉意象（来自播客内容分析）

### 物理隐喻（核心）
${physicalMetaphor || '未提供'}

### 内容精髓
${contentEssence || '未提供'}

### 关键意象词
${imagery.join('、') || '未提供'}

### 预期的骨架结构
- 区域数: ${topologicalLayout.zoneCount || '未指定'}
- 分界方式: ${topologicalLayout.divisionMethod || '未指定'}
- 主关系类型: ${primaryRelationship.type || '未指定'}
- 空间位置: ${primaryRelationship.spatialPosition || '未指定'}

## 你需要回答

1. **图片实际呈现了什么**：描述图片的几何结构、布局、形体关系
2. **是否是"左右双域对比"**：如果是，这是一个严重问题
3. **与预期意象的匹配度**：图片是否体现了 physicalMetaphor 描述的意象
4. **改进建议**：如果不匹配，应该如何调整

## 输出 JSON
{
  "actualDescription": "图片实际呈现的视觉结构描述",
  "isLeftRightDual": true/false,
  "leftRightDualDetail": "如果是左右双域，描述具体表现",
  
  "metaphorMatch": {
    "score": 0-100,
    "isMatched": true/false,
    "matchedElements": ["哪些视觉元素体现了意象"],
    "missingElements": ["缺少哪些关键意象表达"]
  },
  
  "structureMatch": {
    "expectedZoneCount": "预期区域数",
    "actualZoneCount": "实际区域数",
    "expectedRelationship": "预期关系",
    "actualRelationship": "实际关系",
    "isMatched": true/false
  },
  
  "overallScore": 0-100,
  "pass": true/false,
  "verdict": "通过/不通过的理由",
  "suggestions": ["改进建议列表"]
}`;

  const model = config.VISION_MODEL;
  let response;
  
  if (isGeminiModel(model)) {
    // Gemini Native Format
    console.log('[verifyImagery] 使用 Gemini Native Format');
    const { base64, mimeType } = await imageUrlToBase64(imageUrl);
    
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: IMAGERY_VERIFY_SYSTEM + '\n\n' + verifyPrompt },
            { inlineData: { mimeType, data: base64 } }
          ]
        }
      ],
      generationConfig: { temperature: 0.3 }
    };
    
    response = await axios.post(
      `${config.APIMART_API_BASE}/v1beta/models/${model}:generateContent`,
      requestBody,
      {
        timeout: 120000,
        headers: {
          'Authorization': `Bearer ${config.APIMART_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } else {
    // OpenAI Responses Format
    const requestBody = {
      model,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: IMAGERY_VERIFY_SYSTEM }]
        },
        {
          role: 'user',
          content: [
            { type: 'input_text', text: verifyPrompt },
            { type: 'input_image', image_url: imageUrl }
          ]
        }
      ],
      temperature: 0.3
    };

    response = await axios.post(
      `${config.APIMART_API_BASE}/v1/responses`,
      requestBody,
      {
        timeout: 120000,
        headers: {
          'Authorization': `Bearer ${config.APIMART_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const content = extractContent(response.data);
  console.log('[verifyImagery] Raw content:', content.substring(0, 500));
  
  const jsonStr = extractJsonFromText(content);
  if (!jsonStr) {
    throw new Error('意象校验返回格式错误: 未找到JSON');
  }
  
  try {
    return safeJsonParse(jsonStr);
  } catch (e) {
    throw new Error('意象校验返回格式错误: JSON解析失败 - ' + e.message);
  }
}
