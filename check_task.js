import config from './luta-cover-generator/server/config.js';
import axios from 'axios';

async function check() {
  const taskId = 'task_01KDZJVW05JRBQ1D9TVB05WSJ9';
  const apiKey = config.APIMART_API_KEY;
  console.log('Checking task:', taskId);
  try {
    const res = await axios.get(`https://api.apimart.ai/v1/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    console.log('Status:', res.data?.data?.status);
    console.log('Result:', JSON.stringify(res.data?.data?.result || {}));
  } catch (e) {
    console.error(e.message);
  }
}
check();
