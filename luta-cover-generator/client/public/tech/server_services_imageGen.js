import axios from 'axios';
import config from '../config.js';

export async function generateImage(prompt) {
  console.log('[generateImage] 开始生成, 模型:', config.IMAGE_MODEL);
  console.log('[generateImage] Prompt长度:', prompt.length);
  
  try {
    const response = await axios.post(
      `${config.API_BASE}/v1/images/generations`,
      {
        model: config.IMAGE_MODEL,
        prompt: prompt,
        aspect_ratio: '1:1',
        n: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${config.API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('[generateImage] Response:', JSON.stringify(response.data));

    // 格式1: 异步模式 { code: 200, data: [{ status, task_id }] }
    const taskId = response.data?.data?.[0]?.task_id;
    if (taskId) {
      return { taskId, status: 'submitted' };
    }
    
    // 格式2: OpenAI 同步模式 { data: [{ url, b64_json }] }
    const imageData = response.data?.data?.[0];
    if (imageData?.url) {
      return { taskId: 'sync_' + Date.now(), status: 'completed', imageUrl: imageData.url };
    }
    if (imageData?.b64_json) {
      return { taskId: 'sync_' + Date.now(), status: 'completed', imageUrl: `data:image/png;base64,${imageData.b64_json}` };
    }
    
    console.error('[generateImage] 无法解析响应:', JSON.stringify(response.data).substring(0, 500));
    throw new Error('生图API返回格式错误: 未找到task_id或图片数据');
  } catch (err) {
    console.error('[generateImage] 请求失败:', err.response?.data || err.message);
    throw err;
  }
}

export async function getTaskStatus(taskId) {
  // 同步模式的任务直接返回（taskId 以 sync_ 开头）
  if (taskId.startsWith('sync_')) {
    return { status: 'completed', imageUrl: null, error: '同步任务需从generateImage获取URL', progress: 100 };
  }
  
  try {
    const response = await axios.get(
      `${config.API_BASE}/v1/tasks/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${config.API_KEY}`
        }
      }
    );

    // 打印完整响应用于调试
    console.log(`[getTaskStatus] 原始响应:`, JSON.stringify(response.data).substring(0, 500));

    const data = response.data?.data;
    
    const status = data?.status || 'unknown';
    const progress = data?.progress || 0;
    console.log(`[getTaskStatus] ${taskId.slice(-8)}: ${status} (${progress}%)`);
    
    if (!data) {
      return { status: 'pending', imageUrl: null, error: null, progress: 0 };
    }

    let imageUrl = null;
    
    // 完成时，图片URL在 data.result.images[0].url[0]
    if (data.status === 'completed' && data.result?.images?.[0]?.url) {
      const urls = data.result.images[0].url;
      imageUrl = Array.isArray(urls) ? urls[0] : urls;
      console.log('[getTaskStatus] Image URL:', imageUrl);
    }
    
    if (data.status === 'failed' || data.error) {
      console.error('[getTaskStatus] Task failed:', data.error || 'Unknown error');
    }
    
    return {
      status: data.status,
      imageUrl: imageUrl,
      progress: progress,
      error: data.error || null,
      actualTime: data.actual_time || null
    };
  } catch (err) {
    console.error('[getTaskStatus] 查询失败:', err.response?.data || err.message);
    return { status: 'pending', imageUrl: null, error: err.message, progress: 0 };
  }
}
