import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const TASK_DIR = path.join(DATA_DIR, 'tasks');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(TASK_DIR);

const TASKS = new Map();

function now() {
  return new Date().toISOString();
}

function taskPath(taskId) {
  return path.join(TASK_DIR, `${taskId}.json`);
}

function persist(task) {
  try {
    fs.writeFileSync(taskPath(task.id), JSON.stringify(task, null, 2));
  } catch (e) {
    // 持久化失败不应影响主流程
    console.warn('[localTasks] persist failed:', e?.message || e);
  }
}

export function createLocalTask({ prefix, type, meta = null }) {
  const id = `${prefix}${uuidv4().replace(/-/g, '')}`;
  const task = {
    id,
    type,
    status: 'submitted',
    progress: 0,
    result: null,
    error: null,
    meta,
    createdAt: now(),
    updatedAt: now()
  };
  TASKS.set(id, task);
  persist(task);
  return task;
}

export function updateLocalTask(taskId, patch) {
  const task = TASKS.get(taskId) || null;
  if (!task) return null;
  Object.assign(task, patch, { updatedAt: now() });
  TASKS.set(taskId, task);
  persist(task);
  return task;
}

export function getLocalTask(taskId) {
  const inMem = TASKS.get(taskId);
  if (inMem) return inMem;
  // 兜底：从磁盘读一次（用于服务重启后查询历史 task）
  try {
    const p = taskPath(taskId);
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf-8');
      const task = JSON.parse(raw);
      TASKS.set(taskId, task);
      return task;
    }
  } catch (e) {
    console.warn('[localTasks] read failed:', e?.message || e);
  }
  return null;
}

export function runLocalTask(taskId, fn) {
  // 异步执行，避免阻塞 HTTP 请求周期（防止 Nginx 504）
  setTimeout(async () => {
    try {
      updateLocalTask(taskId, { status: 'processing', progress: 10, error: null });
      const result = await fn({
        setProgress: (p) => {
          const progress = Math.max(0, Math.min(99, Number(p) || 0));
          updateLocalTask(taskId, { progress });
        }
      });
      updateLocalTask(taskId, { status: 'completed', progress: 100, result, error: null });
    } catch (err) {
      updateLocalTask(taskId, {
        status: 'failed',
        progress: 100,
        error: err?.message || String(err)
      });
    }
  }, 0);
}


