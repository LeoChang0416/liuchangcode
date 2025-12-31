# 汝塔｜六度播客封面生成器

播客内容 → LLM分析 → 结构化生图提示词 → 文生图 → 多模态快检评分

## 启动

```bash
# 1. 安装后端依赖
cd server
npm install

# 2. 启动后端（另开终端）
npm start

# 3. 安装前端依赖
cd ../client
npm install

# 4. 启动前端
npm run dev
```

访问 http://localhost:5173

## API

- `GET /api/degrees` - 获取六度列表
- `POST /api/generate-prompt` - 生成提示词
- `POST /api/generate-image` - 生成图片
- `GET /api/task/:taskId` - 查询任务状态
- `POST /api/evaluate` - 快检评分
- `GET /api/history` - 历史记录

