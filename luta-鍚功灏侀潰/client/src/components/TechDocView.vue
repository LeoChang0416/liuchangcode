<template>
  <div class="tech-doc-view">
    <!-- 移动端顶部导航 -->
    <div class="mobile-nav">
      <button 
        v-for="section in sections" 
        :key="section.id"
        :class="{ active: currentSection === section.id }"
        @click="currentSection = section.id"
      >
        {{ section.short || section.title }}
      </button>
    </div>

    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-mark"></div>
        <span>技术文档</span>
      </div>
      <nav class="nav-list">
        <button 
          v-for="section in sections" 
          :key="section.id"
          :class="{ active: currentSection === section.id }"
          @click="currentSection = section.id"
        >
          <span class="nav-icon">{{ section.icon }}</span>
          <span class="nav-text">{{ section.title }}</span>
        </button>
      </nav>
      <div class="sidebar-footer">
        <span class="version">v1.7</span>
      </div>
    </aside>

    <main class="doc-content">
      <!-- 全景总览 -->
      <section v-if="currentSection === 'overview'" class="doc-section">
        <header class="section-header">
          <h1>全景总览</h1>
          <p class="subtitle">机制 · 规则 · 限制 · 提示词工程 · 代码落点</p>
        </header>

        <div class="overview-grid">
          <div class="overview-card highlight-new">
            <div class="overview-title">🆕 智能选度</div>
            <div class="overview-value">LLM自动推导六度</div>
            <div class="overview-meta">DEGREE_SELECT_SYSTEM → degreeKey/confidence/reason/evidence（置信度≥70%通过）</div>
          </div>
          <div class="overview-card highlight-new">
            <div class="overview-title">🆕 模型容灾</div>
            <div class="overview-value">多模型轮询切换</div>
            <div class="overview-meta">deepseek-v3.2-think → gpt-5.2（503/502/超时自动切换）</div>
          </div>
          <div class="overview-card">
            <div class="overview-title">核心链路</div>
            <div class="overview-value">选度 → 分析 → Prompt → 生图 → 评估 → 意象校验</div>
            <div class="overview-meta">selectDegree → analyzeContent → generatePrompt → generateImage → evaluate → verifyImagery</div>
          </div>
          <div class="overview-card">
            <div class="overview-title">提示词工程（系统 Prompt）</div>
            <div class="overview-value">5 份</div>
            <div class="overview-meta">DEGREE_SELECT_SYSTEM / ANALYZE_SYSTEM / PROMPT_SYSTEM / EVALUATE_SYSTEM / IMAGERY_VERIFY_SYSTEM</div>
          </div>
          <div class="overview-card">
            <div class="overview-title">负向约束（Negative）</div>
            <div class="overview-value">HARD_NEGATIVES</div>
            <div class="overview-meta">生图阶段拼接进最终 prompt（Strict constraints）</div>
          </div>
          <div class="overview-card">
            <div class="overview-title">骨架强变量</div>
            <div class="overview-value">三类强变量决定骨架</div>
            <div class="overview-meta">TopologicalLayout / PrimaryRelationship / RhythmSignature（度禁止干预）</div>
          </div>
          <div class="overview-card">
            <div class="overview-title">反先验机制</div>
            <div class="overview-value">Anti-Cliché</div>
            <div class="overview-meta">cliché 列表 + 自检字段输出 + 规避说明</div>
          </div>
          <div class="overview-card">
            <div class="overview-title">可靠性机制</div>
            <div class="overview-value">轮询 + 超时提示 + 取消</div>
            <div class="overview-meta">前端轮询 /api/task/:taskId</div>
          </div>
        </div>
      </section>

      <!-- 机制清单 -->
      <section v-if="currentSection === 'mechanisms'" class="doc-section">
        <header class="section-header">
          <h1>机制清单（穷尽版）</h1>
          <p class="subtitle">按环节穷尽列出所有已实现机制/规则/限制/提示词工程</p>
        </header>

        <div class="impl-block">
          <h3>规则与限制（硬约束/负向库）</h3>
          <div class="checklist">
            <div class="check-item">硬约束：形体≤4、线条≤3、渐变/光晕≤2、留白≥50%、安全边距10%、色相≤3+中性≤1（PROMPT_SYSTEM 强制 + constraintCheck 输出）</div>
            <div class="check-item">负向库：HARD_NEGATIVES（文字/符号/具象/宗教物件/写实3D/霓虹等）</div>
            <div class="check-item">负向注入：/api/generate-image 把 negativePrompt 拼接到 fullPrompt（Strict constraints）</div>
          </div>
        </div>

        <div class="impl-block highlight-new">
          <h3>🆕 智能选度（自动推导）</h3>
          <div class="checklist">
            <div class="check-item">DEGREE_SELECT_SYSTEM：六度语义取向定义 + JSON输出规范（degreeKey/confidence/reason/evidence/missingInfo）</div>
            <div class="check-item">selectDegree()：LLM调用 → 置信度校验（≥70%通过，否则引导重试）→ 返回选度结果</div>
            <div class="check-item">generatePrompt()：若无手动degree则先调selectDegree() → degreeSelection注入返回</div>
            <div class="check-item">前端展示：推导路径可视化 + 核心推理 + 文本证据 + 置信度条</div>
            <div class="check-item">失败策略：低置信度不盲选，返回missingInfo引导用户补充内容</div>
          </div>
        </div>

        <div class="impl-block highlight-new">
          <h3>🆕 模型容灾切换</h3>
          <div class="checklist">
            <div class="check-item">TEXT_MODELS 数组：按优先级排列（deepseek-v3.2-think → gpt-5.2）</div>
            <div class="check-item">callChatCompletions()：多模型轮询 + 指数退避重试（503/502/超时自动切换）</div>
            <div class="check-item">shouldRetryLLM()：判断可重试错误码（429/502/503/504/ECONNRESET/ETIMEDOUT）</div>
            <div class="check-item">getLLMErrorMessage()：生成用户友好错误信息</div>
          </div>
        </div>

        <div class="impl-block">
          <h3>骨架强变量（内容决定骨架）</h3>
          <div class="checklist">
            <div class="check-item">ANALYZE_SYSTEM：抽取 physicalMetaphor + 三类强变量 + antiTemplateCheck</div>
            <div class="check-item">PROMPT_SYSTEM：强变量优先级不可逆；度只能影响边缘/材质/温度</div>
            <div class="check-item">userMessage 注入：把强变量表格化写入 prompt 生成输入（强制执行说明）</div>
          </div>
        </div>

        <div class="impl-block">
          <h3>反先验（Anti-Cliché）</h3>
          <div class="checklist">
            <div class="check-item">度 cliché 列表（PROMPT_SYSTEM + getDegreeAntiCliche）</div>
            <div class="check-item">antiClicheCheck 输出字段：triggered / avoidedCliche / howAvoided</div>
          </div>
        </div>

        <div class="impl-block">
          <h3>配色系统（随机 + 约束 + 去重 + 视觉指导注入）</h3>
          <div class="checklist">
            <div class="check-item">BACKGROUND_COLORS（含 temp 标签）</div>
            <div class="check-item">FIVE_COLORS（五色×6变体，brightness/saturation）</div>
            <div class="check-item">DEGREE_COLOR_RULES（度规则：主色/对比色/背景温度/对比策略/点缀概率）</div>
            <div class="check-item">generateColorScheme()（contrastMethod + accentAreaPct + accentOpacityPct）</div>
            <div class="check-item">getUniqueColorScheme()（RECENT_COLOR_KEYS_BY_DEGREE 短期去重）</div>
            <div class="check-item">getContrastVisualInstruction() / getAccentVisualDescription()（把抽象参数转为可执行视觉指令）</div>
          </div>
        </div>

        <div class="impl-block">
          <h3>生图执行与可靠性</h3>
          <div class="checklist">
            <div class="check-item">generateImage()：异步任务模式返回 taskId（submitted）</div>
            <div class="check-item">getTaskStatus()：轮询任务状态并提取 imageUrl</div>
            <div class="check-item">GeneratorView：轮询上限/超时提示/取消生成</div>
          </div>
        </div>

        <div class="impl-block">
          <h3>质量评估与意象校验</h3>
          <div class="checklist">
            <div class="check-item">EVALUATE_SYSTEM：四维快检（任一 fail 即淘汰）</div>
            <div class="check-item">IMAGERY_VERIFY_SYSTEM + verifyPrompt：意象匹配 + 左右双域严重问题检测 + 改进建议</div>
          </div>
        </div>

        <div class="impl-block">
          <h3>数据留存</h3>
          <div class="checklist">
            <div class="check-item">生成记录落盘：data/*.json（含 prompt/negativePrompt/analysis/taskId）</div>
            <div class="check-item">评估/意象校验写回：/api/evaluate、/api/verify-imagery</div>
          </div>
        </div>
      </section>

      <!-- 规则 × 环节矩阵 -->
      <section v-if="currentSection === 'matrix'" class="doc-section">
        <header class="section-header">
          <h1>规则 × 环节矩阵</h1>
          <p class="subtitle">每个机制在链路中具体在哪些环节生效</p>
        </header>

        <div class="impl-block">
          <div class="matrix-wrap">
            <div class="matrix-table">
              <div class="matrix-row header">
                <div class="cell row-title">规则/机制</div>
                <div class="cell">分析</div>
                <div class="cell">Prompt</div>
                <div class="cell">生图</div>
                <div class="cell">轮询</div>
                <div class="cell">评估</div>
                <div class="cell">意象</div>
                <div class="cell">存储</div>
                <div class="cell">前端</div>
              </div>

              <div class="matrix-row" v-for="r in matrixRows" :key="r.name">
                <div class="cell row-title">{{ r.name }}</div>
                <div class="cell"><span class="dot" :class="r.analyze ? 'on' : 'off'"></span></div>
                <div class="cell"><span class="dot" :class="r.prompt ? 'on' : 'off'"></span></div>
                <div class="cell"><span class="dot" :class="r.image ? 'on' : 'off'"></span></div>
                <div class="cell"><span class="dot" :class="r.poll ? 'on' : 'off'"></span></div>
                <div class="cell"><span class="dot" :class="r.evaluate ? 'on' : 'off'"></span></div>
                <div class="cell"><span class="dot" :class="r.imagery ? 'on' : 'off'"></span></div>
                <div class="cell"><span class="dot" :class="r.storage ? 'on' : 'off'"></span></div>
                <div class="cell"><span class="dot" :class="r.client ? 'on' : 'off'"></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 流程 / 时序图 -->
      <section v-if="currentSection === 'sequence'" class="doc-section">
        <header class="section-header">
          <h1>流程 / 时序图</h1>
          <p class="subtitle">请求、响应、关键字段与注入点</p>
        </header>

        <div class="workflow-pipeline">
          <div class="pipeline-step" v-for="(step, idx) in sequenceSteps" :key="step.id">
            <div class="step-connector" v-if="idx > 0"></div>
            <div class="step-card-mini" :class="step.type">
              <div class="step-number">{{ idx + 1 }}</div>
              <div class="step-mini-head">
                <span class="mini-icon">{{ step.icon }}</span>
                <h3>{{ step.title }}</h3>
              </div>
              <p>{{ step.desc }}</p>
              <ul class="step-details" v-if="step.details">
                <li v-for="d in step.details" :key="d">{{ d }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="impl-block">
          <h3>关键注入点（必须看）</h3>
          <div class="checklist">
            <div class="check-item">Prompt 生成：system=PROMPT_SYSTEM + user=userMessage（含强变量/反先验/配色方案/视觉指导注入）</div>
            <div class="check-item">生图执行：fullPrompt = prompt + Strict constraints + negativePrompt（negative 以自然语言注入）</div>
          </div>
        </div>
      </section>

      <!-- 代码落点 -->
      <section v-if="currentSection === 'code-map'" class="doc-section">
        <header class="section-header">
          <h1>代码落点（文件 / 函数）</h1>
          <p class="subtitle">每个机制对应的实现位置（用于审计与维护）</p>
        </header>

        <div class="code-map">
          <div class="code-map-card" v-for="f in codeMap" :key="f.path">
            <div class="code-map-head">
              <div class="code-file">{{ f.path }}</div>
              <div class="code-tags">
                <span class="code-tag" v-for="t in f.tags" :key="t">{{ t }}</span>
              </div>
            </div>
            <div class="code-map-body">
              <div class="code-fn" v-for="fn in f.items" :key="fn.name">
                <div class="fn-name">{{ fn.name }}</div>
                <div class="fn-desc">{{ fn.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 完整 Prompt / 注入段落（原文代码） -->
      <section v-if="currentSection === 'full-prompts'" class="doc-section">
        <header class="section-header">
          <h1>完整 Prompt（system / negative / 注入段落）</h1>
          <p class="subtitle">展示当前实现的原文代码（可滚动查看全部）</p>
        </header>

        <div class="impl-block">
          <h3>server/prompts/system.js（含 system prompt / negative / 评估 / 意象校验）</h3>
          <div class="code-block raw">
            <pre>{{ rawFiles.system || '（加载中...）' }}</pre>
          </div>
        </div>

        <div class="impl-block">
          <h3>server/services/llm.js（含 userMessage 注入段落 + 反先验 + 配色去重）</h3>
          <div class="code-block raw">
            <pre>{{ rawFiles.llm || '（加载中...）' }}</pre>
          </div>
        </div>

        <div class="impl-block">
          <h3>server/index.js（含 negativePrompt 拼接进入 fullPrompt 的注入段落）</h3>
          <div class="code-block raw">
            <pre>{{ rawFiles.index || '（加载中...）' }}</pre>
          </div>
        </div>

        <div class="impl-block">
          <h3>server/services/evaluate.js / imageGen.js</h3>
          <div class="code-block raw">
            <pre>{{ rawFiles.evaluate || '（加载中...）' }}</pre>
          </div>
          <div class="code-block raw mt">
            <pre>{{ rawFiles.imageGen || '（加载中...）' }}</pre>
          </div>
        </div>
      </section>

      <!-- 系统架构 -->
      <section v-if="currentSection === 'architecture'" class="doc-section">
        <header class="section-header">
          <h1>系统架构</h1>
          <p class="subtitle">前后端分离 + LLM 调用链</p>
        </header>

        <div class="arch-diagram">
          <div class="arch-layer client">
            <div class="layer-label">Frontend (Vue 3 + Vite)</div>
            <div class="layer-content">
              <div class="arch-node">GeneratorView</div>
              <div class="arch-node">DocView</div>
              <div class="arch-node">TechDocView</div>
            </div>
          </div>
          <div class="arch-arrow">↓ HTTP API ↓</div>
          <div class="arch-layer server">
            <div class="layer-label">Backend (Node.js + Express)</div>
            <div class="layer-content">
              <div class="arch-node">index.js (路由)</div>
              <div class="arch-node">llm.js (LLM服务)</div>
              <div class="arch-node">imageGen.js (生图)</div>
              <div class="arch-node">evaluate.js (评估)</div>
            </div>
          </div>
          <div class="arch-arrow">↓ API 调用 ↓</div>
          <div class="arch-layer external">
            <div class="layer-label">External APIs (APIMart)</div>
            <div class="layer-content">
              <div class="arch-node api">DeepSeek (分析/Prompt)</div>
              <div class="arch-node api">Gemini (生图)</div>
              <div class="arch-node api">GPT-4o (评估)</div>
            </div>
          </div>
        </div>

        <div class="tech-cards">
          <div class="tech-card">
            <h3>前端技术栈</h3>
            <ul>
              <li><strong>Vue 3</strong> - Composition API</li>
              <li><strong>Vite</strong> - 开发构建工具</li>
              <li><strong>Axios</strong> - HTTP 客户端</li>
            </ul>
          </div>
          <div class="tech-card">
            <h3>后端技术栈</h3>
            <ul>
              <li><strong>Node.js</strong> - 运行时</li>
              <li><strong>Express</strong> - Web 框架</li>
              <li><strong>UUID</strong> - 记录ID生成</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- LLM 调用链 -->
      <section v-if="currentSection === 'llm-chain'" class="doc-section">
        <header class="section-header">
          <h1>LLM 调用链</h1>
          <p class="subtitle">三阶段 LLM 协作流程</p>
        </header>

        <div class="chain-flow">
          <div class="chain-step">
            <div class="step-badge">1</div>
            <div class="step-card">
              <h3>内容分析</h3>
              <div class="step-model">DeepSeek V3.2</div>
              <p>从播客文本提取：</p>
              <ul>
                <li>核心意象 (imagery)</li>
                <li>情感基调 (emotion)</li>
                <li>灵性气质 (spiritualTone)</li>
                <li>叙事张力 (tension)</li>
                <li>三类骨架强变量</li>
              </ul>
            </div>
          </div>
          <div class="chain-connector"></div>
          <div class="chain-step">
            <div class="step-badge">2</div>
            <div class="step-card">
              <h3>Prompt 生成</h3>
              <div class="step-model">DeepSeek V3.2</div>
              <p>基于分析结果构建：</p>
              <ul>
                <li>骨架强变量约束</li>
                <li>度的氛围偏置</li>
                <li>随机配色方案</li>
                <li>反先验检查</li>
                <li>≥200词详细Prompt</li>
              </ul>
            </div>
          </div>
          <div class="chain-connector"></div>
          <div class="chain-step">
            <div class="step-badge">3</div>
            <div class="step-card">
              <h3>图片生成</h3>
              <div class="step-model">Gemini 3 Pro</div>
              <p>执行文生图：</p>
              <ul>
                <li>aspect_ratio: 1:1</li>
                <li>异步任务模式</li>
                <li>轮询状态直到完成</li>
              </ul>
            </div>
          </div>
          <div class="chain-connector"></div>
          <div class="chain-step">
            <div class="step-badge">4</div>
            <div class="step-card">
              <h3>质量评估</h3>
              <div class="step-model">GPT-4o Vision</div>
              <p>多维度快检：</p>
              <ul>
                <li>结构快检 (complexity)</li>
                <li>颜色快检 (color)</li>
                <li>抽象快检 (abstraction)</li>
                <li>品质快检 (aesthetic)</li>
                <li>意象校验 (verify-imagery)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 配色系统 -->
      <section v-if="currentSection === 'color-system'" class="doc-section">
        <header class="section-header">
          <h1>配色系统实现</h1>
          <p class="subtitle">五色母库 × 度规则 × 随机策略</p>
        </header>

        <div class="impl-block">
          <h3>FIVE_COLORS 五色母库</h3>
          <p>每种颜色 6 个变体，包含 brightness 和 saturation 属性</p>
          <div class="color-demo">
            <div class="color-row" v-for="(color, name) in colorDemo" :key="name">
              <span class="color-name">{{ name }}</span>
              <div class="color-variants">
                <div 
                  class="color-chip" 
                  v-for="v in color" 
                  :key="v.hex"
                  :style="{ backgroundColor: v.hex }"
                  :title="`${v.name}: ${v.hex}`"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="impl-block">
          <h3>DEGREE_COLOR_RULES 度配色规则</h3>
          <div class="rule-table">
            <div class="rule-row header">
              <span>度</span>
              <span>主色</span>
              <span>对比色</span>
              <span>背景温度</span>
              <span>对比策略</span>
            </div>
            <div class="rule-row" v-for="rule in degreeRules" :key="rule.key">
              <span class="rule-name">{{ rule.name }}</span>
              <span>{{ rule.primary.join('/') }}</span>
              <span>{{ rule.accent.join('/') }}</span>
              <span>{{ rule.bgTemp }}</span>
              <span>{{ rule.contrast.join(', ') }}</span>
            </div>
          </div>
        </div>

        <div class="impl-block">
          <h3>generateColorScheme() 随机配色函数</h3>
          <div class="code-block">
            <pre>function generateColorScheme(degreeKey) {
  const rule = DEGREE_COLOR_RULES[degreeKey];
  
  // 1. 随机选主色相 → 选变体
  const primaryHue = pickOne(rule.primaryHues);
  const primaryVariant = selectColorVariant(primaryHue, ...);
  
  // 2. 随机选对比策略
  const contrastMethod = pickOne(rule.allowedContrastMethods);
  
  // 3. 根据概率决定是否使用对比色
  const useAccent = Math.random() &lt; rule.accentProbability;
  
  // 4. 选背景色（匹配温度偏好）
  const bgColor = pickOne(eligibleBgs);
  
  return { primaryColor, accentColor, background, contrastMethod, ... };
}</pre>
          </div>
        </div>

        <div class="impl-block">
          <h3>短期去重机制</h3>
          <p>防止连续生成相同配色：</p>
          <div class="code-block">
            <pre>const RECENT_COLOR_KEYS_BY_DEGREE = new Map();

function getUniqueColorScheme(degreeKey, attempts = 10, recentLimit = 8) {
  const list = RECENT_COLOR_KEYS_BY_DEGREE.get(degreeKey) || [];
  for (let i = 0; i &lt; attempts; i++) {
    const scheme = generateColorScheme(degreeKey);
    const key = colorKeyFromScheme(scheme);
    if (!list.includes(key)) {
      // 记录并返回
      RECENT_COLOR_KEYS_BY_DEGREE.set(degreeKey, [key, ...list].slice(0, recentLimit));
      return scheme;
    }
  }
  // 兜底返回
  return generateColorScheme(degreeKey);
}</pre>
          </div>
        </div>
      </section>

      <!-- 骨架强变量 -->
      <section v-if="currentSection === 'skeleton-vars'" class="doc-section">
        <header class="section-header">
          <h1>骨架强变量系统</h1>
          <p class="subtitle">内容驱动骨架，度禁止干预</p>
        </header>

        <div class="var-cards">
          <div class="var-card">
            <div class="var-header">
              <span class="var-num">1</span>
              <h3>TopologicalLayout</h3>
            </div>
            <p class="var-desc">拓扑布局 - 画面分几个区域、如何分界</p>
            <ul>
              <li><strong>zoneCount</strong>: 区域数量 (1-4)</li>
              <li><strong>divisionMethod</strong>: 分界方式 (diagonal, horizontal, vertical, radial, organic)</li>
              <li><strong>zoneRatios</strong>: 区域比例</li>
            </ul>
          </div>
          <div class="var-card">
            <div class="var-header">
              <span class="var-num">2</span>
              <h3>PrimaryRelationship</h3>
            </div>
            <p class="var-desc">主关系 - 主形体之间的空间关系</p>
            <ul>
              <li><strong>type</strong>: 关系类型 (solo, parallel, opposing, nested, scattered)</li>
              <li><strong>interactionQuality</strong>: 交互质量 (static, dynamic, tense)</li>
              <li><strong>spatialPosition</strong>: 空间位置</li>
            </ul>
          </div>
          <div class="var-card">
            <div class="var-header">
              <span class="var-num">3</span>
              <h3>RhythmSignature</h3>
            </div>
            <p class="var-desc">节奏签名 - 多元素的间距/大小规律</p>
            <ul>
              <li><strong>type</strong>: 节奏类型 (uniform, accelerating, decelerating, syncopated)</li>
              <li><strong>elementCount</strong>: 元素数量</li>
            </ul>
          </div>
        </div>

        <div class="impl-block">
          <h3>反先验机制 (Anti-Cliché)</h3>
          <p>每个度有典型的 cliché 需要规避：</p>
          <div class="cliche-table">
            <div class="cliche-row" v-for="c in cliches" :key="c.degree">
              <span class="cliche-degree">{{ c.degree }}</span>
              <span class="cliche-bad">❌ {{ c.cliche }}</span>
              <span class="cliche-good">✅ {{ c.avoid }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- API 接口 -->
      <section v-if="currentSection === 'api'" class="doc-section">
        <header class="section-header">
          <h1>API 接口</h1>
          <p class="subtitle">后端 RESTful API 列表</p>
        </header>

        <div class="api-list">
          <div class="api-item" v-for="api in apis" :key="api.path">
            <div class="api-header">
              <span class="api-method" :class="api.method.toLowerCase()">{{ api.method }}</span>
              <span class="api-path">{{ api.path }}</span>
            </div>
            <p class="api-desc">{{ api.desc }}</p>
            <div class="api-params" v-if="api.params">
              <span class="param-label">参数：</span>
              <code>{{ api.params }}</code>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据存储 -->
      <section v-if="currentSection === 'storage'" class="doc-section">
        <header class="section-header">
          <h1>数据存储</h1>
          <p class="subtitle">JSON 文件存储生成记录</p>
        </header>

        <div class="impl-block">
          <h3>存储位置</h3>
          <p><code>luta-cover-generator/data/*.json</code></p>
        </div>

        <div class="impl-block">
          <h3>记录结构</h3>
          <div class="code-block">
            <pre>{
  "id": "uuid",
  "taskId": "task_xxx",
  "degree": "dana",
  "podcastContent": "...",
  "analysis": { ... },
  "prompt": "...",
  "negativePrompt": "...",
  "status": "completed",
  "imageUrl": "https://...",
  "evaluation": { ... },
  "imageryVerification": { ... },
  "createdAt": "2025-12-27T...",
  "evaluatedAt": "2025-12-27T...",
  "verifiedAt": "2025-12-27T..."
}</pre>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const currentSection = ref('overview');

const sections = [
  { id: 'overview', title: '全景总览', short: '总览', icon: '◎' },
  { id: 'mechanisms', title: '机制清单', short: '清单', icon: '▤' },
  { id: 'matrix', title: '机制矩阵', short: '矩阵', icon: '▣' },
  { id: 'sequence', title: '流程时序', short: '时序', icon: '◇' },
  { id: 'code-map', title: '代码落点', short: '落点', icon: '◧' },
  { id: 'full-prompts', title: '完整Prompt', short: 'Prompt', icon: '✦' },
  { id: 'architecture', title: '系统架构', short: '架构', icon: '▣' },
  { id: 'llm-chain', title: 'LLM 调用链', short: '链路', icon: '◎' },
  { id: 'color-system', title: '配色系统', short: '配色', icon: '◐' },
  { id: 'skeleton-vars', title: '骨架强变量', short: '骨架', icon: '◇' },
  { id: 'api', title: 'API 接口', short: '接口', icon: '✦' },
  { id: 'storage', title: '数据存储', short: '存储', icon: '◧' }
];

const matrixRows = [
  { name: '🆕 智能选度（DEGREE_SELECT_SYSTEM）', analyze: true, prompt: true, image: false, poll: false, evaluate: false, imagery: false, storage: true, client: true },
  { name: '🆕 模型容灾切换（多模型轮询）', analyze: true, prompt: true, image: false, poll: false, evaluate: true, imagery: true, storage: false, client: false },
  { name: '硬约束（结构/颜色/留白）', analyze: false, prompt: true, image: false, poll: false, evaluate: true, imagery: true, storage: false, client: true },
  { name: 'Negative（HARD_NEGATIVES）', analyze: false, prompt: false, image: true, poll: false, evaluate: true, imagery: true, storage: true, client: true },
  { name: '骨架强变量（三类强变量）', analyze: true, prompt: true, image: false, poll: false, evaluate: false, imagery: true, storage: true, client: true },
  { name: '反先验（Anti-Cliché）', analyze: true, prompt: true, image: false, poll: false, evaluate: false, imagery: true, storage: true, client: true },
  { name: '配色系统（随机+约束）', analyze: false, prompt: true, image: false, poll: false, evaluate: true, imagery: false, storage: true, client: true },
  { name: '短期去重（颜色）', analyze: false, prompt: true, image: false, poll: false, evaluate: false, imagery: false, storage: false, client: false },
  { name: '异步任务生图', analyze: false, prompt: false, image: true, poll: true, evaluate: false, imagery: false, storage: true, client: true },
  { name: '快检评估（EVALUATE_SYSTEM）', analyze: false, prompt: false, image: false, poll: false, evaluate: true, imagery: false, storage: true, client: true },
  { name: '意象校验（IMAGERY_VERIFY_SYSTEM）', analyze: true, prompt: false, image: false, poll: false, evaluate: false, imagery: true, storage: true, client: true }
];

const sequenceSteps = [
  { id: 'degree', type: 'llm', icon: '0', title: '🆕 智能选度', desc: 'selectDegree()', details: ['DEGREE_SELECT_SYSTEM → degreeKey/confidence/reason/evidence', '置信度≥70%通过，否则返回missingInfo引导重试', '多模型轮询（deepseek→gpt-5.2）'] },
  { id: 'analyze', type: 'llm', icon: '1', title: '内容分析', desc: 'analyzeContent()', details: ['ANALYZE_SYSTEM → JSON 输出（意象/强变量）', '多模型容灾切换'] },
  { id: 'prompt', type: 'logic', icon: '2', title: '生成提示词', desc: 'generatePrompt()', details: ['若无degree则先调selectDegree()', 'system=PROMPT_SYSTEM', 'user=userMessage（强变量/反先验/配色注入）'] },
  { id: 'image', type: 'gen', icon: '3', title: '生图提交', desc: 'POST /api/generate-image', details: ['fullPrompt = prompt + Strict constraints + negativePrompt', '返回 taskId（异步）'] },
  { id: 'poll', type: 'verify', icon: '4', title: '轮询任务', desc: 'GET /api/task/:taskId', details: ['前端轮询/超时提示/取消'] },
  { id: 'eval', type: 'verify', icon: '5', title: '快检评估', desc: 'POST /api/evaluate', details: ['EVALUATE_SYSTEM → pass/score'] },
  { id: 'imagery', type: 'verify', icon: '6', title: '意象校验', desc: 'POST /api/verify-imagery', details: ['IMAGERY_VERIFY_SYSTEM', '左右双域检测 + 改进建议'] }
];

const codeMap = [
  {
    path: 'server/prompts/system.js',
    tags: ['规则库', '系统Prompt', '负向库', '配色母库', '🆕选度'],
    items: [
      { name: '🆕 DEGREE_SELECT_SYSTEM', desc: '智能选度系统提示词（六度语义取向 + 置信度输出规范）' },
      { name: 'ANALYZE_SYSTEM', desc: '内容分析系统提示词（输出强变量与反模板检查）' },
      { name: 'PROMPT_SYSTEM', desc: 'Prompt 生成系统提示词（强变量优先级 + 反先验 + 硬约束）' },
      { name: 'HARD_NEGATIVES', desc: '强制负向库（文字/符号/具象/风格禁忌）' },
      { name: 'EVALUATE_SYSTEM', desc: '快检评估系统提示词（四维淘汰规则）' },
      { name: 'IMAGERY_VERIFY_SYSTEM', desc: '意象校验系统提示词（左右双域严重问题）' },
      { name: 'FIVE_COLORS / DEGREE_COLOR_RULES / generateColorScheme', desc: '配色母库与度规则 + 随机生成' }
    ]
  },
  {
    path: 'server/services/llm.js',
    tags: ['提示词工程', '去重', '反先验', '注入段落', '🆕容灾'],
    items: [
      { name: '🆕 selectDegree()', desc: '智能选度：DEGREE_SELECT_SYSTEM调用 + 置信度校验（≥70%通过）' },
      { name: '🆕 callChatCompletions()', desc: '多模型轮询 + 指数退避重试（503/502自动切换）' },
      { name: '🆕 shouldRetryLLM()', desc: '判断可重试错误码（429/502/503/504/ECONNRESET）' },
      { name: 'analyzeContent()', desc: '调用 ANALYZE_SYSTEM 输出 JSON（使用容灾机制）' },
      { name: 'generatePrompt()', desc: '若无degree则先调selectDegree() + 注入degreeSelection' },
      { name: 'getUniqueColorScheme()', desc: '短期去重（RECENT_COLOR_KEYS_BY_DEGREE）' },
      { name: 'getContrastVisualInstruction()', desc: '对比策略视觉指令注入' },
      { name: 'getAccentVisualDescription()', desc: '点缀面积/不透明度视觉指令注入' },
      { name: 'getDegreeAntiCliche()', desc: '每度 cliché 与规避说明' }
    ]
  },
  {
    path: 'server/index.js',
    tags: ['API', '注入', '存储'],
    items: [
      { name: 'POST /api/generate-image', desc: 'negativePrompt 拼接进 fullPrompt（Strict constraints）' },
      { name: 'data/*.json', desc: '生成记录/评估/意象校验落盘' }
    ]
  },
  {
    path: 'server/services/imageGen.js',
    tags: ['生图', '异步任务', '轮询'],
    items: [
      { name: 'generateImage()', desc: '提交文生图（aspect_ratio: 1:1）' },
      { name: 'getTaskStatus()', desc: '查询任务状态并提取 imageUrl' }
    ]
  },
  {
    path: 'server/services/evaluate.js',
    tags: ['评估', '意象校验'],
    items: [
      { name: 'evaluateImage()', desc: '使用 EVALUATE_SYSTEM 快检评分' },
      { name: 'verifyImagery()', desc: '使用 IMAGERY_VERIFY_SYSTEM + verifyPrompt 意象校验' }
    ]
  },
  {
    path: 'client/src/components/GeneratorView.vue',
    tags: ['前端', '轮询', '取消', '超时提示'],
    items: [
      { name: 'pollTaskStatus()', desc: '轮询 /api/task/:taskId（上限 + 超时提示）' },
      { name: 'cancelGeneration()', desc: '取消生成，停止轮询' }
    ]
  }
];

const rawFiles = ref({
  system: '',
  llm: '',
  index: '',
  evaluate: '',
  imageGen: ''
});

onMounted(async () => {
  const load = async (url) => {
    const res = await fetch(url, { cache: 'no-store' });
    return await res.text();
  };
  try { rawFiles.value.system = await load('/tech/server_prompts_system.js'); } catch {}
  try { rawFiles.value.llm = await load('/tech/server_services_llm.js'); } catch {}
  try { rawFiles.value.index = await load('/tech/server_index.js'); } catch {}
  try { rawFiles.value.evaluate = await load('/tech/server_services_evaluate.js'); } catch {}
  try { rawFiles.value.imageGen = await load('/tech/server_services_imageGen.js'); } catch {}
});

const colorDemo = {
  '蓝': [
    { name: 'ice', hex: '#E8F4FC' },
    { name: 'sky', hex: '#D6EAF8' },
    { name: 'powder', hex: '#85C1E9' }
  ],
  '黄': [
    { name: 'cream', hex: '#FFF9E6' },
    { name: 'gold', hex: '#FFF3CD' },
    { name: 'amber', hex: '#FFE082' }
  ],
  '红': [
    { name: 'blush', hex: '#FFEBEE' },
    { name: 'rose', hex: '#FFCDD2' },
    { name: 'coral', hex: '#FFAB91' }
  ],
  '绿': [
    { name: 'mint', hex: '#E8F5E9' },
    { name: 'sage', hex: '#C8E6C9' },
    { name: 'spring', hex: '#A5D6A7' }
  ],
  '白': [
    { name: 'pure', hex: '#FFFFFF' },
    { name: 'cloud', hex: '#FAFAFA' },
    { name: 'fog', hex: '#F5F5F5' }
  ]
};

const degreeRules = [
  { key: 'dana', name: '布施', primary: ['黄', '绿'], accent: ['蓝', '红'], bgTemp: 'warm', contrast: ['area', 'brightness', 'warm-cool'] },
  { key: 'sila', name: '持戒', primary: ['白', '蓝'], accent: ['红', '黄'], bgTemp: 'cool', contrast: ['brightness', 'area'] },
  { key: 'ksanti', name: '忍辱', primary: ['白', '蓝'], accent: ['红', '黄'], bgTemp: 'neutral', contrast: ['layering', 'brightness'] },
  { key: 'virya', name: '精进', primary: ['红', '黄'], accent: ['蓝', '绿'], bgTemp: 'warm', contrast: ['brightness', 'area', 'warm-cool'] },
  { key: 'samadhi', name: '禅定', primary: ['白', '蓝', '绿'], accent: ['黄'], bgTemp: 'cool', contrast: ['none', 'brightness'] },
  { key: 'prajna', name: '般若', primary: ['白', '蓝', '黄'], accent: ['绿', '红'], bgTemp: 'neutral', contrast: ['warm-cool', 'brightness', 'area'] }
];

const cliches = [
  { degree: '布施', cliche: '向外扩散的同心圆', avoid: '边缘渐隐、留白分布' },
  { degree: '持戒', cliche: '矩形框架/网格线', avoid: '清晰边缘、规整间距' },
  { degree: '忍辱', cliche: '两股相向的柔和形体', avoid: '柔软边缘、层次叠加' },
  { degree: '精进', cliche: '阶梯式递进', avoid: '节奏变化、明度递进' },
  { degree: '禅定', cliche: '中心同心圆/环', avoid: '大面积留白、静止感' },
  { degree: '般若', cliche: '左右切分/双域对照', avoid: '明度对比、清晰边界' }
];

const apis = [
  { method: 'GET', path: '/api/degrees', desc: '获取六度列表', params: null },
  { method: 'POST', path: '/api/analyze', desc: '分析播客内容', params: '{ podcastContent }' },
  { method: 'POST', path: '/api/generate-prompt', desc: '生成提示词', params: '{ podcastContent, degree, analysisResult?, improvementSuggestions? }' },
  { method: 'POST', path: '/api/generate-image', desc: '生成图片', params: '{ prompt, negativePrompt, degree, ... }' },
  { method: 'GET', path: '/api/task/:taskId', desc: '查询任务状态', params: null },
  { method: 'POST', path: '/api/evaluate', desc: '评估图片', params: '{ imageUrl, recordId? }' },
  { method: 'POST', path: '/api/verify-imagery', desc: '意象校验', params: '{ imageUrl, analysisResult, recordId? }' },
  { method: 'GET', path: '/api/history', desc: '获取历史记录', params: null }
];
</script>

<style scoped>
.tech-doc-view {
  --sidebar-width: 220px;
  --content-max: 1100px;
  --gap-xs: 8px;
  --gap-sm: 12px;
  --gap-md: 20px;
  --gap-lg: 32px;
  --gap-xl: 48px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.06);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.08);
  --c-bg: #F7F7F8;
  --c-surface: #FFFFFF;
  --c-surface-alt: #FAFAFA;
  --c-border: #E5E5E7;
  --c-border-light: #F0F0F2;
  --c-text: #1D1D1F;
  --c-text-secondary: #6E6E73;
  --c-text-muted: #AEAEB2;
  --c-accent: #0A7B4E;
  --c-accent-bg: #E6F4EE;
  --c-warning: #FF9500;
  --c-danger: #FF3B30;
  --c-info: #007AFF;

  display: flex;
  min-height: calc(100vh - 73px);
  background: var(--c-bg);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
}

/* ===== 移动端导航 ===== */
.mobile-nav {
  display: none;
  position: fixed;
  top: 73px;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--c-surface);
  border-bottom: 1px solid var(--c-border);
  padding: 8px 12px;
  overflow-x: auto;
  gap: 6px;
  -webkit-overflow-scrolling: touch;
}
.mobile-nav::-webkit-scrollbar { display: none; }
.mobile-nav button {
  flex-shrink: 0;
  padding: 8px 14px;
  border: 1px solid var(--c-border);
  border-radius: 20px;
  background: var(--c-surface);
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.mobile-nav button.active {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: white;
}

/* ===== Sidebar ===== */
.sidebar {
  width: var(--sidebar-width);
  background: var(--c-surface);
  border-right: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 73px;
  height: calc(100vh - 73px);
}
.sidebar-header {
  padding: 24px 20px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--c-border-light);
}
.logo-mark {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--c-accent), #0EA5A1);
  border-radius: 6px;
}
.sidebar-header span {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-text);
}
.nav-list {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}
.nav-list button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}
.nav-list button:hover { background: var(--c-surface-alt); color: var(--c-text); }
.nav-list button.active { background: var(--c-accent-bg); color: var(--c-accent); font-weight: 500; }
.nav-list button.active .nav-icon { color: var(--c-accent); }
.nav-icon { width: 20px; text-align: center; font-size: 1rem; color: var(--c-text-muted); }

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--c-border-light);
}
.version {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

/* ===== Content ===== */
.doc-content {
  flex: 1;
  padding: var(--gap-xl) var(--gap-lg);
  overflow-y: auto;
}
.doc-section {
  max-width: var(--content-max);
  margin: 0 auto;
  animation: fadeIn 0.35s ease-out;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

.section-header { margin-bottom: 32px; }
.section-header h1 { font-size: 1.75rem; font-weight: 600; color: var(--c-text); margin: 0 0 8px; letter-spacing: -0.02em; }
.subtitle { font-size: 1rem; color: var(--c-text-secondary); margin: 0; }

/* ===== Overview ===== */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-md);
}
.overview-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 18px;
}
.overview-card.highlight-new {
  background: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.1));
  border-color: rgba(99,102,241,0.25);
}
.impl-block.highlight-new {
  background: linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.08));
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: var(--radius-lg);
  padding: 16px;
}
.impl-block.highlight-new h3 {
  color: #6366f1;
}
.overview-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-text-secondary);
  margin-bottom: 8px;
}
.overview-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
  line-height: 1.5;
}
.overview-meta {
  margin-top: 8px;
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  line-height: 1.5;
}

/* ===== Checklist ===== */
.checklist { display: flex; flex-direction: column; gap: 10px; }
.check-item {
  padding: 12px 14px;
  background: var(--c-surface-alt);
  border: 1px solid var(--c-border-light);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--c-text);
  line-height: 1.6;
}

/* ===== Matrix ===== */
.matrix-wrap { overflow-x: auto; }
.matrix-table {
  min-width: 860px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--c-surface);
}
.matrix-row { display: grid; grid-template-columns: 260px repeat(8, 1fr); }
.matrix-row.header { background: var(--c-surface-alt); border-bottom: 1px solid var(--c-border-light); }
.matrix-row:not(.header) { border-bottom: 1px solid var(--c-border-light); }
.matrix-row:last-child { border-bottom: none; }
.cell {
  padding: 12px 14px;
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell.row-title { justify-content: flex-start; color: var(--c-text); font-weight: 600; }
.matrix-row.header .cell { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; border: 1px solid var(--c-border); }
.dot.on { background: var(--c-accent); border-color: var(--c-accent); }
.dot.off { background: transparent; border-color: var(--c-border); }

/* ===== Sequence / Pipeline ===== */
.workflow-pipeline { display: flex; gap: 0; margin-bottom: var(--gap-lg); overflow-x: auto; padding-bottom: var(--gap-sm); }
.pipeline-step { display: flex; align-items: center; flex-shrink: 0; }
.step-connector { width: 42px; height: 2px; background: var(--c-border); margin: 0 10px; }
.step-card-mini {
  width: 260px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 16px;
}
.step-card-mini.llm { border-left: 4px solid var(--c-info); }
.step-card-mini.logic { border-left: 4px solid var(--c-accent); }
.step-card-mini.gen { border-left: 4px solid var(--c-warning); }
.step-card-mini.verify { border-left: 4px solid #7C3AED; }
.step-mini-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.mini-icon { font-size: 0.9rem; font-weight: 700; color: var(--c-text-secondary); }
.step-card-mini h3 { font-size: 1rem; font-weight: 600; color: var(--c-text); margin: 0; }
.step-card-mini p { font-size: 0.85rem; color: var(--c-text-secondary); margin: 0 0 10px; line-height: 1.5; }
.step-details { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.step-details li { font-size: 0.8rem; color: var(--c-text-secondary); padding-left: 14px; position: relative; line-height: 1.4; }
.step-details li::before { content: '•'; position: absolute; left: 0; color: var(--c-accent); }
.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--c-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 10px;
}

/* ===== Code map ===== */
.code-map { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--gap-md); }
.code-map-card { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--radius-lg); overflow: hidden; }
.code-map-head { padding: 14px 16px; background: var(--c-surface-alt); border-bottom: 1px solid var(--c-border-light); display: flex; flex-direction: column; gap: 10px; }
.code-file { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.85rem; color: var(--c-text); }
.code-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.code-tag { font-size: 0.75rem; padding: 3px 10px; border-radius: 12px; background: var(--c-accent-bg); color: var(--c-accent); font-weight: 600; }
.code-map-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 12px; }
.code-fn { padding: 10px 12px; background: var(--c-surface-alt); border: 1px solid var(--c-border-light); border-radius: var(--radius-sm); }
.fn-name { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.85rem; color: var(--c-text); font-weight: 700; }
.fn-desc { margin-top: 6px; font-size: 0.85rem; color: var(--c-text-secondary); line-height: 1.5; }

/* ===== Raw code blocks ===== */
.code-block.raw { background: var(--c-surface-alt); border: 1px solid var(--c-border-light); }
.code-block.raw pre { color: var(--c-text); white-space: pre; }
.code-block.raw.mt { margin-top: 12px; }

/* Architecture Diagram */
.arch-diagram { margin-bottom: 32px; }
.arch-layer {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 8px;
}
.arch-layer.client { border-left: 4px solid var(--c-accent); }
.arch-layer.server { border-left: 4px solid var(--c-info); }
.arch-layer.external { border-left: 4px solid var(--c-warning); }
.layer-label { font-size: 0.8rem; font-weight: 600; color: var(--c-text-secondary); text-transform: uppercase; margin-bottom: 12px; }
.layer-content { display: flex; gap: 12px; flex-wrap: wrap; }
.arch-node {
  padding: 8px 16px;
  background: var(--c-surface-alt);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--c-text);
  border: 1px solid var(--c-border-light);
}
.arch-node.api { background: #FFF7ED; color: #9A3412; border-color: rgba(184,110,0,0.15); }
.arch-arrow { text-align: center; padding: 8px; color: var(--c-text-muted); font-size: 0.85rem; }

.tech-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.tech-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.tech-card h3 { font-size: 1rem; font-weight: 600; margin: 0 0 12px; color: var(--c-text); }
.tech-card ul { list-style: none; padding: 0; margin: 0; }
.tech-card li { padding: 6px 0; font-size: 0.9rem; color: var(--c-text-secondary); }
.tech-card li strong { color: var(--c-text); }

/* Chain Flow */
.chain-flow { display: flex; flex-direction: column; gap: 0; }
.chain-step { display: flex; gap: 16px; }
.step-badge {
  width: 32px;
  height: 32px;
  background: var(--c-accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}
.step-card {
  flex: 1;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.step-card h3 { font-size: 1rem; font-weight: 600; margin: 0 0 8px; color: var(--c-text); }
.step-model { display: inline-block; padding: 4px 10px; background: rgba(8,131,80,0.12); color: var(--c-accent); border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-bottom: 12px; }
.step-card p { font-size: 0.9rem; color: var(--c-text-secondary); margin: 0 0 8px; }
.step-card ul { list-style: none; padding: 0; margin: 0; }
.step-card li { padding: 4px 0; font-size: 0.85rem; color: var(--c-text-secondary); padding-left: 16px; position: relative; }
.step-card li::before { content: '•'; position: absolute; left: 0; color: var(--c-accent); }
.chain-connector { width: 2px; height: 24px; background: rgba(8,131,80,0.35); margin-left: 15px; }

/* Implementation Blocks */
.impl-block {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 20px;
}
.impl-block h3 { font-size: 1rem; font-weight: 600; margin: 0 0 12px; color: var(--c-text); }
.impl-block p { font-size: 0.9rem; color: var(--c-text-secondary); margin: 0 0 16px; }

.color-demo { display: flex; flex-direction: column; gap: 12px; }
.color-row { display: flex; align-items: center; gap: 16px; }
.color-name { width: 40px; font-size: 0.9rem; font-weight: 500; color: var(--c-text); }
.color-variants { display: flex; gap: 8px; }
.color-chip { width: 48px; height: 32px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.06); }

.rule-table { font-size: 0.85rem; }
.rule-row { display: grid; grid-template-columns: 60px 1fr 1fr 80px 1.5fr; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--c-border-light); align-items: center; }
.rule-row.header { font-weight: 600; color: var(--c-text-secondary); font-size: 0.8rem; text-transform: uppercase; }
.rule-name { font-weight: 600; color: var(--c-text); }

.code-block {
  background: var(--c-surface-alt);
  border: 1px solid var(--c-border-light);
  border-radius: var(--radius-md);
  padding: 16px;
  overflow-x: auto;
}
.code-block pre {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--c-text);
}

/* Skeleton Vars */
.var-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
.var-card { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--radius-lg); padding: 20px; }
.var-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.var-num { width: 24px; height: 24px; background: var(--c-warning); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
.var-card h3 { font-size: 0.95rem; font-weight: 600; color: var(--c-text); margin: 0; }
.var-desc { font-size: 0.85rem; color: var(--c-text-secondary); margin: 0 0 12px; }
.var-card ul { list-style: none; padding: 0; margin: 0; }
.var-card li { padding: 4px 0; font-size: 0.85rem; color: var(--c-text-secondary); }
.var-card li strong { color: var(--c-text); }

.cliche-table { font-size: 0.85rem; }
.cliche-row { display: grid; grid-template-columns: 60px 1fr 1fr; gap: 16px; padding: 10px 0; border-bottom: 1px solid #F0F0F2; }
.cliche-degree { font-weight: 600; color: #1D1D1F; }
.cliche-bad { color: #DC2626; }
.cliche-good { color: #10B981; }

/* API List */
.api-list { display: flex; flex-direction: column; gap: 16px; }
.api-item { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--radius-lg); padding: 16px 20px; }
.api-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.api-method { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.api-method.get { background: #D1FAE5; color: #065F46; }
.api-method.post { background: #DBEAFE; color: #1E40AF; }
.api-path { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.9rem; color: var(--c-text); }
.api-desc { font-size: 0.9rem; color: var(--c-text-secondary); margin: 0; }
.api-params { margin-top: 8px; font-size: 0.85rem; color: var(--c-text-secondary); }
.api-params code { background: var(--c-surface-alt); border: 1px solid var(--c-border-light); padding: 2px 8px; border-radius: 4px; font-family: ui-monospace, monospace; }

@media (max-width: 900px) {
  .mobile-nav { display: flex; }
  .sidebar { display: none; }
  .doc-content { padding: 32px 20px; padding-top: 76px; }
  .var-cards { grid-template-columns: 1fr; }
  .tech-cards { grid-template-columns: 1fr; }
  .overview-grid { grid-template-columns: 1fr; }
  .code-map { grid-template-columns: 1fr; }
}
</style>

