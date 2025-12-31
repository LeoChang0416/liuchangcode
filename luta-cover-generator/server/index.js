import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import { DEGREES } from './prompts/system.js';
import { analyzeContent, generatePrompt, buildEditPrompt } from './services/llm.js';
import { generateImage, editImage, getTaskStatus } from './services/imageGen.js';
import { evaluateImage, verifyImagery, buildQuickCheckSuggestions } from './services/evaluate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 获取六度列表（V2：返回氛围摘要，不暴露形态菜单）
app.get('/api/degrees', (req, res) => {
  const list = Object.entries(DEGREES).map(([key, val]) => ({
    key,
    name: val.name,
    nameEn: val.nameEn,
    theme: val.theme,
    // 氛围摘要（供 UI 展示）
    atmosphereSummary: val.atmosphere?.spatial ? 
      `${val.atmosphere.spatial.split('，')[0]}` : val.theme,
    // 情感锚点（用于内容匹配提示）
    emotionalAnchors: val.emotionalAnchors || []
  }));
  res.json({ success: true, data: list });
});

// 分析内容（可单独调用）
app.post('/api/analyze', async (req, res) => {
  try {
    const { podcastContent } = req.body;
    if (!podcastContent) {
      return res.status(400).json({ success: false, error: '缺少播客内容' });
    }
    
    const result = await analyzeContent(podcastContent);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('分析失败:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 生成提示词（两阶段：分析 + 生成）
app.post('/api/generate-prompt', async (req, res) => {
  try {
    const { podcastContent, degree, analysisResult, improvementSuggestions, previousIssues } = req.body;
    if (!podcastContent) {
      return res.status(400).json({ success: false, error: '缺少播客内容' });
    }
    
    const result = await generatePrompt(podcastContent, degree, analysisResult, {
      improvementSuggestions,
      previousIssues
    });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('生成提示词失败:', err.message);
    const msg = err?.message || '生成提示词失败';
    const isDegreeSelectFailure = typeof msg === 'string' && msg.includes('无法可靠选择度');
    res.status(isDegreeSelectFailure ? 400 : 500).json({ success: false, error: msg });
  }
});

// 生成图片
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, negativePrompt, degree, podcastContent, analysis, geometryDescription, colorLogic } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: '缺少提示词' });
    }
    
    // Gemini 文生图：将负面约束写成自然语言硬拼进 prompt（不使用 --no 语法）
    const fullPrompt = negativePrompt
      ? `${prompt}\n\nStrict constraints (must NOT appear):\n${negativePrompt}`
      : prompt;
    
    const result = await generateImage(fullPrompt);
    
    // 保存记录（包含分析结果）
    const record = {
      id: uuidv4(),
      taskId: result.taskId,
      degree,
      podcastContent: podcastContent?.substring(0, 500),
      analysis,
      geometryDescription,
      colorLogic,
      prompt,
      negativePrompt,
      status: result.status || 'submitted',
      imageUrl: result.imageUrl || null,
      createdAt: new Date().toISOString()
    };
    
    const recordPath = path.join(DATA_DIR, `${record.id}.json`);
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2));
    
    res.json({ success: true, data: { ...result, recordId: record.id } });
  } catch (err) {
    console.error('生成图片失败:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 查询任务状态
app.get('/api/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await getTaskStatus(taskId);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('查询任务失败:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 评估图片
app.post('/api/evaluate', async (req, res) => {
  try {
    const { imageUrl, recordId, degree } = req.body;
    console.log('[/api/evaluate] 开始评估, imageUrl:', imageUrl?.substring(0, 50));
    
    if (!imageUrl) {
      return res.status(400).json({ success: false, error: '缺少图片URL' });
    }
    
    let degreeKey = degree || null;
    if (!degreeKey && recordId) {
      const recordPath = path.join(DATA_DIR, `${recordId}.json`);
      if (fs.existsSync(recordPath)) {
        const record = JSON.parse(fs.readFileSync(recordPath, 'utf-8'));
        degreeKey = record?.degree || null;
      }
    }

    const result = await evaluateImage(imageUrl, degreeKey);
    console.log('[/api/evaluate] 评估成功, pass:', result?.pass);
    
    // 更新记录
    if (recordId) {
      const recordPath = path.join(DATA_DIR, `${recordId}.json`);
      if (fs.existsSync(recordPath)) {
        const record = JSON.parse(fs.readFileSync(recordPath, 'utf-8'));
        record.imageUrl = imageUrl;
        record.evaluation = result;
        record.evaluatedAt = new Date().toISOString();
        fs.writeFileSync(recordPath, JSON.stringify(record, null, 2));
      }
    }
    
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[/api/evaluate] 评估失败:', err.stack || err.message || err);
    res.status(500).json({ success: false, error: err.message || '评估失败' });
  }
});

// 意象校验（验证图片是否体现了内容意象）
app.post('/api/verify-imagery', async (req, res) => {
  try {
    const { imageUrl, analysisResult, recordId, evaluation } = req.body;
    if (!imageUrl || !analysisResult) {
      return res.status(400).json({ success: false, error: '缺少图片URL或分析结果' });
    }
    
    const result = await verifyImagery(imageUrl, analysisResult);

    // 合并快检建议（未通过或低分<75）
    let evalForMerge = evaluation || null;
    if (!evalForMerge && recordId) {
      const recordPath = path.join(DATA_DIR, `${recordId}.json`);
      if (fs.existsSync(recordPath)) {
        const record = JSON.parse(fs.readFileSync(recordPath, 'utf-8'));
        evalForMerge = record?.evaluation || null;
      }
    }
    const qcSuggestions = buildQuickCheckSuggestions(evalForMerge, 75);
    if (qcSuggestions.length) {
      const merged = Array.from(new Set([...(result.suggestions || []), ...qcSuggestions]));
      result.suggestions = merged;
      result.quickCheckMerged = true;
    } else {
      result.quickCheckMerged = false;
    }
    
    // 更新记录
    if (recordId) {
      const recordPath = path.join(DATA_DIR, `${recordId}.json`);
      if (fs.existsSync(recordPath)) {
        const record = JSON.parse(fs.readFileSync(recordPath, 'utf-8'));
        record.imageryVerification = result;
        record.verifiedAt = new Date().toISOString();
        fs.writeFileSync(recordPath, JSON.stringify(record, null, 2));
      }
    }
    
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('意象校验失败:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 意象校验 → 多模态改图（参考图编辑）
app.post('/api/edit-image', async (req, res) => {
  try {
    const { imageUrl, recordId, degree, analysisResult, originalPrompt, negativePrompt, imageryVerification } = req.body;
    if (!imageUrl || !degree || !analysisResult || !originalPrompt) {
      return res.status(400).json({ success: false, error: '缺少 imageUrl/degree/analysisResult/originalPrompt' });
    }

    const editSpec = await buildEditPrompt({
      degreeKey: degree,
      originalPrompt,
      analysis: analysisResult,
      imageryVerification
    });

    const fullPrompt = negativePrompt
      ? `${editSpec.editPrompt}\n\nStrict constraints (must NOT appear):\n${negativePrompt}`
      : editSpec.editPrompt;

    const result = await editImage({ imageUrl, prompt: fullPrompt });

    if (recordId) {
      const recordPath = path.join(DATA_DIR, `${recordId}.json`);
      if (fs.existsSync(recordPath)) {
        const record = JSON.parse(fs.readFileSync(recordPath, 'utf-8'));
        record.edit = {
          sourceImageUrl: imageUrl,
          editPrompt: editSpec.editPrompt,
          changes: editSpec.changes,
          keeps: editSpec.keeps,
          negativePrompt: negativePrompt || null,
          taskId: result.taskId,
          status: result.status || 'submitted',
          createdAt: new Date().toISOString()
        };
        fs.writeFileSync(recordPath, JSON.stringify(record, null, 2));
      }
    }

    res.json({ success: true, data: { ...result, editPrompt: editSpec.editPrompt, changes: editSpec.changes, keeps: editSpec.keeps } });
  } catch (err) {
    console.error('改图失败:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 获取历史记录
app.get('/api/history', (req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    const records = files.map(f => {
      const content = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
      return JSON.parse(content);
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(config.PORT, () => {
  console.log(`Server running at http://localhost:${config.PORT}`);
});
