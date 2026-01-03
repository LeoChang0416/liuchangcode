import axios from 'axios';
import config from '../config.js';

// ====== Grsai Nano Banana 图片生成 ======
// 文档: https://grsai.com/zh/dashboard/documents/nano-banana
async function generateImageGrsai(prompt) {
  console.log('[generateImage-Grsai] 开始生成, 模型: nano-banana');
  console.log('[generateImage-Grsai] Prompt长度:', prompt.length);
  
  try {
    const apiBase = config.GRSAI_API_BASE;
    const apiKey = config.GRSAI_API_KEY;
    
    const response = await axios.post(
      `${apiBase}/v1/draw/nano-banana`,
      {
        prompt: prompt,
        size: '1K',          // 1K 分辨率
        aspect_ratio: '1:1'  // 正方形
      },
      {
        timeout: 120000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('[generateImage-Grsai] Response:', JSON.stringify(response.data).substring(0, 500));

    // Grsai 异步模式：返回 task_id
    const data = response.data?.data || response.data;
    const taskId = data?.task_id || data?.id;
    if (taskId) {
      return { taskId, status: 'submitted', provider: 'grsai' };
    }
    
    // 同步模式（如果直接返回图片）
    const imageUrl = data?.url || data?.image_url || data?.images?.[0]?.url;
    if (imageUrl) {
      return { taskId: 'sync_grsai_' + Date.now(), status: 'completed', imageUrl, provider: 'grsai' };
    }
    
    console.error('[generateImage-Grsai] 无法解析响应:', JSON.stringify(response.data).substring(0, 500));
    throw new Error('Grsai API返回格式错误');
  } catch (err) {
    console.error('[generateImage-Grsai] 请求失败:', err.response?.data || err.message);
    throw err;
  }
}

// ====== APIMart 图片生成（备用） ======
async function generateImageApimart(prompt) {
  console.log('[generateImage-APIMart] 开始生成, 模型:', config.IMAGE_MODEL);
  console.log('[generateImage-APIMart] Prompt长度:', prompt.length);
  
  try {
    const apiBase = config.APIMART_API_BASE;
    const apiKey = config.APIMART_API_KEY;
    const response = await axios.post(
      `${apiBase}/v1/images/generations`,
      {
        model: config.IMAGE_MODEL,
        prompt: prompt,
        size: '1:1',
        n: 1,
        resolution: '1K'
      },
      {
        timeout: 120000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('[generateImage-APIMart] Response:', JSON.stringify(response.data));

    // 异步模式
    const taskId = response.data?.data?.[0]?.task_id;
    if (taskId) {
      return { taskId, status: 'submitted', provider: 'apimart' };
    }
    
    // 同步模式
    const imageData = response.data?.data?.[0];
    if (imageData?.url) {
      return { taskId: 'sync_' + Date.now(), status: 'completed', imageUrl: imageData.url, provider: 'apimart' };
    }
    if (imageData?.b64_json) {
      return { taskId: 'sync_' + Date.now(), status: 'completed', imageUrl: `data:image/png;base64,${imageData.b64_json}`, provider: 'apimart' };
    }
    
    console.error('[generateImage-APIMart] 无法解析响应:', JSON.stringify(response.data).substring(0, 500));
    throw new Error('APIMart API返回格式错误');
  } catch (err) {
    console.error('[generateImage-APIMart] 请求失败:', err.response?.data || err.message);
    throw err;
  }
}

// ====== 统一入口 ======
export async function generateImage(prompt) {
  const provider = config.IMAGE_PROVIDER || 'grsai';
  console.log('[generateImage] 使用提供商:', provider);
  
  if (provider === 'grsai') {
    return generateImageGrsai(prompt);
  } else {
    return generateImageApimart(prompt);
  }
}

/**
 * 参考图改图（通过 image_urls 传递参考图）
 * 参考文档: https://docs.apimart.ai/en/api-reference/images/gemini-3-pro/generation
 */
export async function editImage({ imageUrl, prompt }) {
  console.log('[editImage] 开始参考图改图, 模型:', config.IMAGE_MODEL);
  console.log('[editImage] 参考图:', imageUrl);
  console.log('[editImage] Prompt长度:', prompt.length);
  
  try {
    const apiBase = config.APIMART_API_BASE;
    const apiKey = config.APIMART_API_KEY;
    const requestBody = {
      model: config.IMAGE_MODEL,
      prompt: prompt,
      size: '1:1',
      n: 1,
      resolution: '1K',
      image_urls: [
        { url: imageUrl }
      ]
    };
    
    console.log('[editImage] 请求体:', JSON.stringify(requestBody).substring(0, 500));
    
    const response = await axios.post(
      `${apiBase}/v1/images/generations`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('[editImage] Response:', JSON.stringify(response.data));

    // 异步模式：返回 task_id
    const taskId = response.data?.data?.[0]?.task_id;
    if (taskId) {
      return { taskId, status: 'submitted' };
    }
    
    // 同步模式
    const imageData = response.data?.data?.[0];
    if (imageData?.url) {
      return { taskId: 'sync_' + Date.now(), status: 'completed', imageUrl: imageData.url };
    }
    if (imageData?.b64_json) {
      return { taskId: 'sync_' + Date.now(), status: 'completed', imageUrl: `data:image/png;base64,${imageData.b64_json}` };
    }
    
    console.error('[editImage] 无法解析响应:', JSON.stringify(response.data).substring(0, 500));
    throw new Error('改图API返回格式错误');
  } catch (err) {
    console.error('[editImage] 请求失败:', err.response?.data || err.message);
    throw err;
  }
}

// ====== Grsai 任务状态查询 ======
async function getTaskStatusGrsai(taskId) {
  try {
    const apiBase = config.GRSAI_API_BASE;
    const apiKey = config.GRSAI_API_KEY;
    
    const response = await axios.post(
      `${apiBase}/v1/draw/result`,
      { task_id: taskId },
      {
        timeout: 30000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[getTaskStatus-Grsai] 原始响应:`, JSON.stringify(response.data).substring(0, 500));

    const data = response.data?.data || response.data;
    const status = data?.status || 'processing';
    const progress = data?.progress || 0;
    
    console.log(`[getTaskStatus-Grsai] ${taskId.slice(-8)}: ${status} (${progress}%)`);

    let imageUrl = null;
    
    // 完成时获取图片URL
    if (status === 'completed' || status === 'success') {
      imageUrl = data?.url || data?.image_url || data?.images?.[0]?.url || data?.result?.url;
      if (imageUrl) {
        console.log('[getTaskStatus-Grsai] Image URL:', imageUrl);
      }
    }
    
    if (status === 'failed' || data?.error) {
      console.error('[getTaskStatus-Grsai] Task failed:', data?.error || 'Unknown error');
    }
    
    return {
      status: status === 'success' ? 'completed' : status,
      imageUrl: imageUrl,
      progress: status === 'completed' || status === 'success' ? 100 : progress,
      error: data?.error || null,
      provider: 'grsai'
    };
  } catch (err) {
    console.error('[getTaskStatus-Grsai] 查询失败:', err.response?.data || err.message);
    return { status: 'processing', imageUrl: null, error: err.message, progress: 0, provider: 'grsai' };
  }
}

// ====== APIMart 任务状态查询 ======
async function getTaskStatusApimart(taskId) {
  try {
    const apiBase = config.APIMART_API_BASE;
    const apiKey = config.APIMART_API_KEY;
    const response = await axios.get(
      `${apiBase}/v1/tasks/${taskId}`,
      {
        timeout: 30000,
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log(`[getTaskStatus-APIMart] 原始响应:`, JSON.stringify(response.data).substring(0, 500));

    const data = response.data?.data;
    const status = data?.status || 'unknown';
    const progress = data?.progress || 0;
    
    console.log(`[getTaskStatus-APIMart] ${taskId.slice(-8)}: ${status} (${progress}%)`);
    
    if (!data) {
      return { status: 'pending', imageUrl: null, error: null, progress: 0, provider: 'apimart' };
    }

    let imageUrl = null;
    
    if (data.status === 'completed' && data.result?.images?.[0]?.url) {
      const urls = data.result.images[0].url;
      imageUrl = Array.isArray(urls) ? urls[0] : urls;
      console.log('[getTaskStatus-APIMart] Image URL:', imageUrl);
    }
    
    if (data.status === 'failed' || data.error) {
      console.error('[getTaskStatus-APIMart] Task failed:', data.error || 'Unknown error');
    }
    
    return {
      status: data.status,
      imageUrl: imageUrl,
      progress: progress,
      error: data.error || null,
      provider: 'apimart'
    };
  } catch (err) {
    console.error('[getTaskStatus-APIMart] 查询失败:', err.response?.data || err.message);
    return { status: 'pending', imageUrl: null, error: err.message, progress: 0, provider: 'apimart' };
  }
}

// ====== 统一任务状态查询 ======
export async function getTaskStatus(taskId, provider) {
  // 同步模式的任务直接返回
  if (taskId.startsWith('sync_')) {
    return { status: 'completed', imageUrl: null, error: '同步任务需从generateImage获取URL', progress: 100 };
  }
  
  // 根据 provider 或 taskId 前缀判断使用哪个查询接口
  const useProvider = provider || config.IMAGE_PROVIDER || 'grsai';
  
  if (useProvider === 'grsai') {
    return getTaskStatusGrsai(taskId);
  } else {
    return getTaskStatusApimart(taskId);
  }
}
