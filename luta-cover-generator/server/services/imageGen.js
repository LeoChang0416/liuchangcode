import axios from 'axios';
import config from '../config.js';

// ====== Grsai Nano Banana 图片生成 ======
// 文档: https://grsai.com/zh/dashboard/documents/nano-banana
async function generateImageGrsai(prompt) {
  console.log('[generateImage-Grsai] 开始生成, 模型:', config.IMAGE_MODEL);
  console.log('[generateImage-Grsai] Prompt长度:', prompt.length);
  
  try {
    const apiBase = config.GRSAI_API_BASE;
    const apiKey = config.GRSAI_API_KEY;
    
    const response = await axios.post(
      `${apiBase}/v1/draw/nano-banana`,
      {
        model: config.IMAGE_MODEL || 'nano-banana',
        prompt: prompt,
        aspectRatio: '1:1',
        imageSize: '1K',
        webHook: '-1'
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

    const code = response.data?.code;
    const msg = response.data?.msg;
    if (typeof code === 'number' && code !== 0) throw new Error(msg || `Grsai错误码: ${code}`);

    const taskId = response.data?.data?.id;
    if (taskId) return { taskId, status: 'submitted', provider: 'grsai' };
    
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
async function editImageGrsai({ imageUrl, prompt }) {
  console.log('[editImage-Grsai] 开始参考图改图, 模型:', config.IMAGE_MODEL);
  console.log('[editImage-Grsai] 参考图:', imageUrl);
  console.log('[editImage-Grsai] Prompt长度:', prompt.length);

  const apiBase = config.GRSAI_API_BASE;
  const apiKey = config.GRSAI_API_KEY;

  const response = await axios.post(
    `${apiBase}/v1/draw/nano-banana`,
    {
      model: config.IMAGE_MODEL || 'nano-banana',
      prompt,
      urls: [imageUrl],
      aspectRatio: '1:1',
      imageSize: '1K',
      webHook: '-1'
    },
    {
      timeout: 120000,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const code = response.data?.code;
  const msg = response.data?.msg;
  if (typeof code === 'number' && code !== 0) throw new Error(msg || `Grsai错误码: ${code}`);

  const taskId = response.data?.data?.id;
  if (taskId) return { taskId, status: 'submitted', provider: 'grsai' };

  console.error('[editImage-Grsai] 无法解析响应:', JSON.stringify(response.data).substring(0, 500));
  throw new Error('Grsai改图返回格式错误');
}

async function editImageApimart({ imageUrl, prompt }) {
  console.log('[editImage-APIMart] 开始参考图改图, 模型:', config.IMAGE_MODEL);
  console.log('[editImage-APIMart] 参考图:', imageUrl);
  console.log('[editImage-APIMart] Prompt长度:', prompt.length);

  const apiBase = config.APIMART_API_BASE;
  const apiKey = config.APIMART_API_KEY;
  const requestBody = {
    model: config.IMAGE_MODEL,
    prompt: prompt,
    size: '1:1',
    n: 1,
    resolution: '1K',
    image_urls: [{ url: imageUrl }]
  };

  const response = await axios.post(
    `${apiBase}/v1/images/generations`,
    requestBody,
    {
      timeout: 120000,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const taskId = response.data?.data?.[0]?.task_id;
  if (taskId) return { taskId, status: 'submitted', provider: 'apimart' };

  const imageData = response.data?.data?.[0];
  if (imageData?.url) return { taskId: 'sync_' + Date.now(), status: 'completed', imageUrl: imageData.url, provider: 'apimart' };
  if (imageData?.b64_json) return { taskId: 'sync_' + Date.now(), status: 'completed', imageUrl: `data:image/png;base64,${imageData.b64_json}`, provider: 'apimart' };

  console.error('[editImage-APIMart] 无法解析响应:', JSON.stringify(response.data).substring(0, 500));
  throw new Error('APIMart改图返回格式错误');
}

export async function editImage({ imageUrl, prompt }) {
  const provider = config.IMAGE_PROVIDER || 'grsai';
  console.log('[editImage] 使用提供商:', provider);
  try {
    if (provider === 'grsai') return await editImageGrsai({ imageUrl, prompt });
    return await editImageApimart({ imageUrl, prompt });
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
      { id: taskId },
      {
        timeout: 30000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[getTaskStatus-Grsai] 原始响应:`, JSON.stringify(response.data).substring(0, 500));

    const code = response.data?.code;
    const msg = response.data?.msg;
    if (typeof code === 'number' && code !== 0) {
      return { status: 'failed', imageUrl: null, error: msg || `Grsai错误码: ${code}`, progress: 0, provider: 'grsai' };
    }

    const data = response.data?.data || {};
    const remoteStatus = data?.status || 'running';
    const progress = typeof data?.progress === 'number' ? data.progress : 0;
    
    console.log(`[getTaskStatus-Grsai] ${taskId.slice(-8)}: ${remoteStatus} (${progress}%)`);

    let imageUrl = null;

    if (remoteStatus === 'succeeded') {
      imageUrl = data?.results?.[0]?.url || null;
      if (imageUrl) console.log('[getTaskStatus-Grsai] Image URL:', imageUrl);
    }

    const mappedStatus =
      remoteStatus === 'succeeded' ? 'completed' :
      remoteStatus === 'failed' ? 'failed' :
      'processing';
    
    return {
      status: mappedStatus,
      imageUrl: imageUrl,
      progress: mappedStatus === 'completed' ? 100 : progress,
      error: data?.failure_reason || data?.error || null,
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
