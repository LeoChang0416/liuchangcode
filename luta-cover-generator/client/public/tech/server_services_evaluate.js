import axios from 'axios';
import config from '../config.js';
import { EVALUATE_SYSTEM, IMAGERY_VERIFY_SYSTEM } from '../prompts/system.js';

// 从响应中提取文本内容
function extractContent(responseData) {
  // APIMart 格式: { code: 200, data: { choices: [{ message: { content: "..." } }] } }
  if (responseData.data?.choices?.[0]?.message?.content) {
    return responseData.data.choices[0].message.content;
  }
  // 格式1: Anthropic/自定义格式 output[0].content[0].text
  const output = responseData.output;
  if (output && output[0] && output[0].content && output[0].content[0]) {
    return output[0].content[0].text || '';
  }
  // 格式2: OpenAI 格式 choices[0].message.content
  const choices = responseData.choices;
  if (choices && choices[0] && choices[0].message) {
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

export async function evaluateImage(imageUrl) {
  console.log('[evaluateImage] 开始评估...');
  
  try {
    const response = await axios.post(
      `${config.API_BASE}/v1/responses`,
      {
        model: config.VISION_MODEL,
        input: [
          {
            role: 'system',
            content: [{ type: 'input_text', text: EVALUATE_SYSTEM }]
          },
          {
            role: 'user',
            content: [
              { type: 'input_text', text: '请对这张播客封面图片进行快检评分。' },
              { type: 'input_image', image_url: imageUrl }
            ]
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${config.API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

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

  const response = await axios.post(
    `${config.API_BASE}/v1/responses`,
    {
      model: config.VISION_MODEL,
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
    },
    {
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

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
