<template>
  <div class="doc-view">
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
        <span>规则文档</span>
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
      <!-- ============ 0. 生图流程 ============ -->
      <section v-if="currentSection === 'workflow'" class="doc-section">
        <header class="section-header">
          <h1>生图流程</h1>
          <p class="subtitle">从文本输入到封面产出的完整链路</p>
        </header>

        <div class="workflow-pipeline">
          <div class="pipeline-step" v-for="(step, idx) in workflowSteps" :key="step.id">
            <div class="step-connector" v-if="idx > 0"></div>
            <div class="step-card" :class="step.type">
              <div class="step-number">{{ idx + 1 }}</div>
              <div class="step-icon">
                <component :is="step.iconComponent" />
              </div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
              <ul class="step-details" v-if="step.details">
                <li v-for="d in step.details" :key="d">{{ d }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="dual-pane">
          <div class="pane system-pane">
            <div class="pane-header">
              <span class="pane-badge system">系统实现</span>
            </div>
            <div class="pane-body">
              <div class="impl-card">
                <h4>LLM 调用链</h4>
                <div class="impl-flow">
                  <span class="impl-node">文本模型（可选）</span>
                  <span class="impl-arrow">→</span>
                  <span class="impl-node">Prompt 构建</span>
                  <span class="impl-arrow">→</span>
                  <span class="impl-node">Gemini 生图</span>
                  <span class="impl-arrow">→</span>
                  <span class="impl-node">Gemini 视觉评估/意象</span>
                </div>
              </div>
              <div class="impl-card">
                <h4>校验维度</h4>
                <div class="check-grid">
                  <span class="check-item pass">结构约束</span>
                  <span class="check-item pass">颜色限制</span>
                  <span class="check-item pass">意象匹配</span>
                  <span class="check-item warn">左右双域检测</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pane original-pane">
            <div class="pane-header">
              <span class="pane-badge original">原文规则</span>
            </div>
            <div class="pane-body">
              <div class="raw-block" v-for="(b, i) in getRawBlocks('exec')" :key="i">
                <div class="raw-text">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 1. 交付规格 ============ -->
      <section v-if="currentSection === 'specs'" class="doc-section">
        <header class="section-header">
          <h1>交付规格</h1>
          <p class="subtitle">硬性约束条件，不可违反</p>
        </header>

        <div class="dual-pane">
          <div class="pane system-pane">
            <div class="pane-header">
              <span class="pane-badge system">系统实现</span>
            </div>
            <div class="pane-body">
              <div class="specs-grid">
                <div class="spec-item">
                  <div class="spec-icon size"></div>
                  <div class="spec-info">
                    <span class="spec-label">画幅</span>
                    <span class="spec-value">1:1 正方形</span>
                    <span class="spec-impl">生图 1024×1024</span>
                  </div>
                </div>
                <div class="spec-item">
                  <div class="spec-icon margin"></div>
                  <div class="spec-info">
                    <span class="spec-label">安全边距</span>
                    <span class="spec-value">10%</span>
                    <span class="spec-impl">Prompt 强制注入</span>
                  </div>
                </div>
                <div class="spec-item critical">
                  <div class="spec-icon elements"></div>
                  <div class="spec-info">
                    <span class="spec-label">元素上限</span>
                    <span class="spec-value">形体≤4 线条≤3</span>
                    <span class="spec-impl">Prompt + 评估快检</span>
                  </div>
                </div>
                <div class="spec-item critical">
                  <div class="spec-icon colors"></div>
                  <div class="spec-info">
                    <span class="spec-label">颜色上限</span>
                    <span class="spec-value">色相≤3 中性≤1</span>
                    <span class="spec-impl">配色系统 + 约束</span>
                  </div>
                </div>
                <div class="spec-item forbidden">
                  <div class="spec-icon ban"></div>
                  <div class="spec-info">
                    <span class="spec-label">禁止</span>
                    <span class="spec-value">文字/符号/具象</span>
                    <span class="spec-impl">负向词库全程启用</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pane original-pane">
            <div class="pane-header">
              <span class="pane-badge original">原文规则</span>
            </div>
            <div class="pane-body">
              <div class="raw-block" v-for="(b, i) in getRawBlocks('specs')" :key="i">
                <div class="raw-text">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 2. 美学基调 ============ -->
      <section v-if="currentSection === 'aesthetics'" class="doc-section">
        <header class="section-header">
          <h1>日本美学基调</h1>
          <p class="subtitle">六种核心美学特质，贯穿所有生成</p>
        </header>

        <div class="dual-pane">
          <div class="pane system-pane wide">
            <div class="pane-header">
              <span class="pane-badge system">系统实现</span>
            </div>
            <div class="pane-body">
              <div class="aesthetics-showcase">
                <div class="aes-item" v-for="a in aesthetics" :key="a.name">
                  <div class="aes-kanji-wrap">
                    <span class="aes-kanji">{{ a.kanji }}</span>
                  </div>
                  <div class="aes-content">
                    <div class="aes-title">
                      <span class="aes-romaji">{{ a.name }}</span>
                    </div>
                    <p class="aes-desc">{{ a.desc }}</p>
                    <span class="aes-impl">{{ a.impl }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pane original-pane">
            <div class="pane-header">
              <span class="pane-badge original">原文规则</span>
            </div>
            <div class="pane-body">
              <div class="raw-block" v-for="(b, i) in getRawBlocks('aesthetics')" :key="i">
                <div class="raw-text">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 3. 颜色系统 ============ -->
      <section v-if="currentSection === 'colors'" class="doc-section">
        <header class="section-header">
          <h1>颜色系统</h1>
          <p class="subtitle">五方佛五色 × 度规则 × 随机策略</p>
        </header>

        <div class="dual-pane">
          <div class="pane system-pane wide">
            <div class="pane-header">
              <span class="pane-badge system">系统实现</span>
            </div>
            <div class="pane-body">
              <div class="color-palette-grid">
                <div class="palette-group" v-for="(group, name) in colorSystem" :key="name">
                  <div class="palette-header">
                    <span class="palette-name">{{ name }}</span>
                    <span class="palette-meaning">{{ group.meaning }}</span>
                  </div>
                  <div class="swatches">
                    <div 
                      class="swatch" 
                      v-for="v in group.variants" 
                      :key="v.hex"
                      :style="{ '--swatch-color': v.hex }"
                    >
                      <div class="swatch-color"></div>
                      <div class="swatch-info">
                        <span class="swatch-name">{{ v.name }}</span>
                        <code class="swatch-hex">{{ v.hex }}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="color-rules-summary">
                <h4>对比策略</h4>
                <div class="contrast-methods">
                  <span class="method">明度对比</span>
                  <span class="method">冷暖对比</span>
                  <span class="method">面积对比</span>
                  <span class="method">层次叠加</span>
                  <span class="method muted">无对比</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pane original-pane">
            <div class="pane-header">
              <span class="pane-badge original">原文规则</span>
            </div>
            <div class="pane-body">
              <div class="raw-block" v-for="(b, i) in getRawBlocks('colors')" :key="i">
                <div class="raw-text">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 4. 反向排除库 ============ -->
      <section v-if="currentSection === 'negatives'" class="doc-section">
        <header class="section-header">
          <h1>反向排除库</h1>
          <p class="subtitle">Negative Library — 全程启用</p>
        </header>

        <div class="dual-pane">
          <div class="pane system-pane">
            <div class="pane-header">
              <span class="pane-badge system">系统实现</span>
            </div>
            <div class="pane-body">
              <div class="negative-categories">
                <div class="neg-cat">
                  <h4>禁止具象与宗教物件</h4>
                  <div class="neg-tags">
                    <span>佛像</span><span>莲花</span><span>法轮</span><span>曼荼罗</span><span>人物</span><span>动物</span><span>山水</span><span>云</span>
                  </div>
                </div>
                <div class="neg-cat">
                  <h4>禁止符号化元素</h4>
                  <div class="neg-tags">
                    <span>文字</span><span>Enso禅圈</span><span>印章</span><span>神圣几何</span><span>UI图标</span><span>箭头</span>
                  </div>
                </div>
                <div class="neg-cat">
                  <h4>禁止风格与质感</h4>
                  <div class="neg-tags">
                    <span>摄影</span><span>写实3D</span><span>赛博霓虹</span><span>故障风</span><span>中式禅意</span>
                  </div>
                </div>
              </div>
              <div class="impl-note">
                <strong>实现方式：</strong>HARD_NEGATIVES 注入到每次生图请求，并在评估/意象校验中复核
              </div>
            </div>
          </div>
          <div class="pane original-pane">
            <div class="pane-header">
              <span class="pane-badge original">原文规则</span>
            </div>
            <div class="pane-body">
              <div class="raw-block" v-for="(b, i) in getRawBlocks('negatives')" :key="i">
                <div class="raw-text">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 5. 快检机制 ============ -->
      <section v-if="currentSection === 'quickcheck'" class="doc-section">
        <header class="section-header">
          <h1>快检机制</h1>
          <p class="subtitle">任何一条不通过即淘汰</p>
        </header>

        <div class="dual-pane">
          <div class="pane system-pane">
            <div class="pane-header">
              <span class="pane-badge system">系统实现</span>
            </div>
            <div class="pane-body">
              <div class="check-categories">
                <div class="check-cat">
                  <div class="cat-header">
                    <span class="cat-icon structure"></span>
                    <span>结构快检</span>
                  </div>
                  <ul>
                    <li>形体 ≤ 4</li>
                    <li>线条 ≤ 3</li>
                    <li>渐变/光晕 ≤ 2</li>
                    <li>留白 ≥ 50%</li>
                  </ul>
                </div>
                <div class="check-cat">
                  <div class="cat-header">
                    <span class="cat-icon color"></span>
                    <span>颜色快检</span>
                  </div>
                  <ul>
                    <li>色相 ≤ 3</li>
                    <li>高明度主色</li>
                    <li>无荧光/霓虹</li>
                    <li>缩略清爽</li>
                  </ul>
                </div>
                <div class="check-cat">
                  <div class="cat-header">
                    <span class="cat-icon abstract"></span>
                    <span>抽象快检</span>
                  </div>
                  <ul>
                    <li>无具体物体</li>
                    <li>无宗教器物</li>
                    <li>无符号联想</li>
                  </ul>
                </div>
                <div class="check-cat">
                  <div class="cat-header">
                    <span class="cat-icon quality"></span>
                    <span>品质快检</span>
                  </div>
                  <ul>
                    <li>間（Ma）成立</li>
                    <li>渋い 成立</li>
                    <li>幽玄 成立</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="pane original-pane">
            <div class="pane-header">
              <span class="pane-badge original">原文规则</span>
            </div>
            <div class="pane-body">
              <div class="raw-block" v-for="(b, i) in getRawBlocks('quickcheck')" :key="i">
                <div class="raw-text">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 6. 蒙版系统 ============ -->
      <section v-if="currentSection === 'mask'" class="doc-section">
        <header class="section-header">
          <h1>蒙版系统</h1>
          <p class="subtitle">Mask System — 每度一套可调规则</p>
        </header>

        <div class="dual-pane">
          <div class="pane system-pane">
            <div class="pane-header">
              <span class="pane-badge system">系统实现</span>
            </div>
            <div class="pane-body">
              <div class="mask-status">
                <div class="status-badge pending">Prompt 层描述</div>
                <p>当前通过 Prompt 语言描述蒙版效果，暂无源文件（Figma/PSD/AI）导出链路</p>
              </div>
              <div class="mask-params">
                <h4>通用参数范围</h4>
                <div class="param-row">
                  <span class="param-name">Color Mask</span>
                  <span class="param-range">叠色 12–22%</span>
                </div>
                <div class="param-row">
                  <span class="param-name">Opacity Mask</span>
                  <span class="param-range">变化幅度 ≤ 15%</span>
                </div>
                <div class="param-row">
                  <span class="param-name">Blur Mask</span>
                  <span class="param-range">20–80px</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pane original-pane">
            <div class="pane-header">
              <span class="pane-badge original">原文规则</span>
            </div>
            <div class="pane-body">
              <div class="raw-block" v-for="(b, i) in getRawBlocks('mask')" :key="i">
                <div class="raw-text">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 7. 构图语法 ============ -->
      <section v-if="currentSection === 'batch'" class="doc-section">
        <header class="section-header">
          <h1>六度构图语法映射</h1>
          <p class="subtitle">每度固定构图语法 + 蒙版策略</p>
        </header>

        <div class="dual-pane">
          <div class="pane system-pane wide">
            <div class="pane-header">
              <span class="pane-badge system">系统实现</span>
            </div>
            <div class="pane-body">
              <div class="composition-grid">
                <div class="comp-card" v-for="comp in compositionRules" :key="comp.degree">
                  <div class="comp-header" :style="{ background: comp.color }">
                    <span class="comp-degree">{{ comp.degree }}</span>
                  </div>
                  <div class="comp-body">
                    <div class="comp-row">
                      <span class="comp-label">构图语法</span>
                      <span class="comp-value">{{ comp.layout }}</span>
                    </div>
                    <div class="comp-row">
                      <span class="comp-label">形体/线条</span>
                      <span class="comp-value">{{ comp.elements }}</span>
                    </div>
                    <div class="comp-row">
                      <span class="comp-label">边缘偏置</span>
                      <span class="comp-value small">{{ comp.edgeBias }}</span>
                    </div>
                    <div class="comp-row">
                      <span class="comp-label">对比策略</span>
                      <span class="comp-value small">{{ comp.contrastMethod }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pane original-pane tall">
            <div class="pane-header">
              <span class="pane-badge original">原文规则（§7 六度构图语法映射）</span>
            </div>
            <div class="pane-body scrollable">
              <div class="raw-block" v-for="(b, i) in getRawBlocks('batch')" :key="i">
                <div class="raw-text">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 8. 六度规则 ============ -->
      <section v-if="currentSection === 'degrees'" class="doc-section">
        <header class="section-header">
          <h1>六度规则</h1>
          <p class="subtitle">骨架由内容决定，度做细节偏置 + 配色策略</p>
        </header>

        <div class="degrees-overview">
          <div class="degree-card" v-for="d in degreeRules" :key="d.key" :style="{ '--accent': d.color }">
            <div class="degree-header">
              <span class="degree-name">{{ d.name }}</span>
              <span class="degree-en">{{ d.nameEn }}</span>
              <span class="v2-badge" v-if="d.rule?.includes('V2')">V2</span>
            </div>
            <div class="degree-body">
              <!-- 精神内涵 -->
              <div class="degree-spirit" v-if="d.spirit">
                <span class="spirit-text">{{ d.spirit }}</span>
              </div>
              
              <!-- 参数网格 -->
              <div class="degree-params">
                <div class="param-item">
                  <span class="param-label">背景温度</span>
                  <span class="param-value">{{ d.bgTemp }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">最低明度</span>
                  <span class="param-value">{{ d.minBright }}%</span>
                </div>
                <div class="param-item">
                  <span class="param-label">最高饱和</span>
                  <span class="param-value">{{ d.maxSat }}%</span>
                </div>
                <div class="param-item">
                  <span class="param-label">点醒概率</span>
                  <span class="param-value">{{ d.accentProb }}%</span>
                </div>
              </div>

              <div class="degree-row">
                <span class="row-label">对比策略</span>
                <span class="row-value tag">{{ d.contrast }}</span>
              </div>
              <div class="degree-row">
                <span class="row-label">主色</span>
                <div class="color-dots">
                  <span 
                    class="dot" 
                    v-for="c in d.colors" 
                    :key="c" 
                    :style="{ backgroundColor: getColorHex(c) }"
                    :title="c"
                  ></span>
                </div>
              </div>
              <div class="degree-row" v-if="d.accentColors">
                <span class="row-label">点缀色</span>
                <div class="color-dots">
                  <span 
                    class="dot small" 
                    v-for="c in d.accentColors" 
                    :key="c" 
                    :style="{ backgroundColor: getColorHex(c) }"
                    :title="c + '（小面积）'"
                  ></span>
                </div>
              </div>
              
              <!-- 点醒强度建议 -->
              <div class="degree-row" v-if="d.accentHint">
                <span class="row-label">点醒强度</span>
                <span class="row-value hint">{{ d.accentHint }}</span>
              </div>

              <!-- 调色板 -->
              <div class="degree-palette" v-if="d.palette">
                <span class="palette-label">最终配色（主+2辅+底）</span>
                <div class="palette-swatches">
                  <div class="swatch" :title="d.palette.main">
                    <span class="swatch-color" :style="{ backgroundColor: d.palette.main.split(' ')[1] }"></span>
                    <span class="swatch-name">{{ d.palette.main.split(' ')[0] }}</span>
                  </div>
                  <div class="swatch" :title="d.palette.aux1">
                    <span class="swatch-color" :style="{ backgroundColor: d.palette.aux1.split(' ')[1] }"></span>
                    <span class="swatch-name">{{ d.palette.aux1.split(' ')[0] }}</span>
                  </div>
                  <div class="swatch" :title="d.palette.aux2">
                    <span class="swatch-color" :style="{ backgroundColor: d.palette.aux2.split(' ')[1] }"></span>
                    <span class="swatch-name">{{ d.palette.aux2.split(' ')[0] }}</span>
                  </div>
                  <div class="swatch" :title="d.palette.bg">
                    <span class="swatch-color" :style="{ backgroundColor: d.palette.bg.split(' ')[1] }"></span>
                    <span class="swatch-name">{{ d.palette.bg.split(' ')[0] }}</span>
                  </div>
                </div>
              </div>

              <!-- 规则要点 -->
              <div class="degree-rule" v-if="d.rule">
                <span class="rule-label">规则要点</span>
                <span class="rule-text">{{ d.rule }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="dual-pane mt-lg">
          <div class="pane system-pane">
            <div class="pane-header">
              <span class="pane-badge system">系统实现要点</span>
            </div>
            <div class="pane-body">
              <ul class="impl-list">
                <li><strong>骨架强变量</strong>：TopologicalLayout / PrimaryRelationship / RhythmSignature 由内容分析决定</li>
                <li><strong>度偏置</strong>：影响边缘处理、材质暗示、温度倾向、对比策略选择</li>
                <li><strong>配色生成</strong>：根据度规则随机选主色、对比色、背景色，避免重复</li>
                <li><strong>反 cliché</strong>：每度有典型误区描述，系统注入反向提示</li>
              </ul>
            </div>
          </div>
          <div class="pane original-pane tall">
            <div class="pane-header">
              <span class="pane-badge original">原文规则（7. 六度生图基础规则）</span>
            </div>
            <div class="pane-body scrollable">
              <div class="raw-block" v-for="(b, i) in getRawBlocks('degrees')" :key="i">
                <div class="raw-text">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, h } from 'vue';

const currentSection = ref('workflow');

const sections = [
  { id: 'workflow', title: '生图流程', short: '流程', icon: '◎' },
  { id: 'specs', title: '硬约束规格', short: '规格', icon: '▣' },
  { id: 'aesthetics', title: '美学基调', short: '美学', icon: '◇' },
  { id: 'colors', title: '颜色系统', short: '颜色', icon: '◐' },
  { id: 'negatives', title: '反向排除库', short: '排除', icon: '⊘' },
  { id: 'quickcheck', title: '快检机制', short: '快检', icon: '✓' },
  { id: 'mask', title: '蒙版系统', short: '蒙版', icon: '◧' },
  { id: 'batch', title: '构图语法', short: '构图', icon: '▤' },
  { id: 'degrees', title: '六度规则', short: '六度', icon: '✦' }
];

const workflowSteps = [
  { id: 'input', type: 'input', title: '用户输入', desc: '播客文本（无需手动选度）', details: null },
  { id: 'degree', type: 'llm', title: '🆕 智能选度', desc: 'selectDegree()：文本模型自动推导最匹配的「度」', details: ['置信度≥70%通过', '可指定 textModelId'] },
  { id: 'analyze', type: 'llm', title: '内容分析', desc: 'analyzeContent()：提取意象、确定骨架强变量', details: ['TopologicalLayout', 'PrimaryRelationship', 'RhythmSignature'] },
  { id: 'inject', type: 'logic', title: '规则注入', desc: 'generatePrompt()：Prompt 构建 + 配色生成', details: ['硬约束', '随机配色', '反 cliché'] },
  { id: 'gen', type: 'gen', title: '生图提交', desc: 'generateImage()：APIMart /v1/images/generations（异步 taskId）', details: ['IMAGE_MODEL: gemini-3-pro-image-preview'] },
  { id: 'verify', type: 'verify', title: '校验', desc: 'evaluateImage() + verifyImagery()：视觉快检 + 意象校验', details: ['VISION_MODEL: gemini-3-flash-preview'] }
];

const aesthetics = [
  { kanji: '間', name: 'Ma', desc: '留白优先，主体信息密度低', impl: 'Prompt: 留白≥50%' },
  { kanji: '簡', name: 'Kanso', desc: '极简，不装饰，不堆叠', impl: 'Prompt: 形体≤4' },
  { kanji: '渋', name: 'Shibui', desc: '克制、高级、不过分艳丽', impl: '配色: 低饱和' },
  { kanji: '幽', name: 'Yūgen', desc: '含蓄深度，微弱层次', impl: '蒙版: 叠色12-22%' },
  { kanji: '斉', name: 'Fukinsei', desc: '轻微不对称（禅定除外）', impl: '布局偏置' },
  { kanji: '寂', name: 'Seijaku', desc: '画面干净、呼吸感强', impl: '评估: 静寂维度' }
];

const degreeRules = [
  { 
    key: 'dana', name: '布施', nameEn: 'Dāna', color: '#FFF5D3', 
    spirit: '开放、给予、流动、轻盈的温暖',
    skeleton: '开放/流动', contrast: 'area, brightness, warm-cool', 
    colors: ['黄', '绿'], accentColors: ['蓝', '红'],
    bgTemp: '暖', minBright: 85, maxSat: 35, accentProb: 70,
    accentHint: '面积2–6%；不透明度10–15%',
    semantic: '开放、流动、轻盈', visualHint: '向外舒展，不封闭',
    palette: { main: 'butter #FFF5D3', aux1: 'celadon #D4EDB7', aux2: 'ice-blue #DFF0FC', bg: 'paper-white #F6F3EA' },
    rule: '高明度黄/绿为主，蓝/红只作"提示"，避免抢戏'
  },
  { 
    key: 'sila', name: '持戒', nameEn: 'Śīla', color: '#ECF2F8', 
    spirit: '清净、克制、边界感、规则与自持',
    skeleton: '边界/秩序', contrast: 'brightness, area, none', 
    colors: ['白', '蓝', '绿'], accentColors: ['红', '黄'],
    bgTemp: '冷', minBright: 88, maxSat: 25, accentProb: 35,
    accentHint: '面积1–4%；不透明度8–12%；作为"警醒点"',
    semantic: '边界、秩序、澄净', visualHint: '清晰界线，规整',
    palette: { main: 'moon-white #ECF2F8', aux1: 'ice-blue #DFF0FC', aux2: 'eucalyptus #D8F2F1', bg: 'mist-white #F2F5F6' },
    rule: '以冷白/淡蓝/淡绿建立秩序；红/黄仅用于"警醒点"'
  },
  { 
    key: 'ksanti', name: '忍辱', nameEn: 'Kṣānti', color: '#F7F9FA', 
    spirit: '柔软承受、缓冲刺激、含容不迫；更强调"等持/持有/保持"的稳定与温和',
    skeleton: '缓冲/柔化', contrast: 'layering, brightness, warm-cool, none', 
    colors: ['白', '绿'], accentColors: ['黄'],
    bgTemp: '中性偏暖', minBright: 84, maxSat: 32, accentProb: 40,
    accentHint: '暖黄轴面积6–18%；不透明度12–18%；避免强对比与高饱和红',
    semantic: '承受、缓冲、化解', visualHint: '柔边过渡，包容',
    palette: { main: 'pearl #F7F9FA', aux1: 'mint-mist #E2F5E4', aux2: 'warm-amber #FFDF91', bg: 'cream #FFFEF1' },
    rule: '🆕 V2：以留白与雾化叠层承受刺激；引入"温和暖黄"作为稳定中轴'
  },
  { 
    key: 'virya', name: '精进', nameEn: 'Vīrya', color: '#FFD24A', 
    spirit: '动能、推进、明快而不躁',
    skeleton: '推进/节律', contrast: 'brightness, area, warm-cool', 
    colors: ['红', '黄'], accentColors: ['蓝', '绿'],
    bgTemp: '暖', minBright: 85, maxSat: 40, accentProb: 75,
    accentHint: '面积2–6%；不透明度10–15%；避免大块高饱和',
    semantic: '推进、节律、明快', visualHint: '有方向感，节奏',
    palette: { main: 'honey-light #FFD24A', aux1: 'warm-rose #F8A0CB', aux2: 'serene-blue #92DBFC', bg: 'warm-beige #F7F0E1' },
    rule: '暖色主导但不压；用冷色作"呼吸口"，保持轻盈'
  },
  { 
    key: 'samadhi', name: '禅定', nameEn: 'Samādhi', color: '#FAFAFA', 
    spirit: '凝定、澄静、少即是多；在清明中保留一缕温热的"安住"',
    skeleton: '收束/安住', contrast: 'brightness, area, warm-cool, none', 
    colors: ['白', '蓝'], accentColors: ['黄'],
    bgTemp: '中性（不强冷）', minBright: 88, maxSat: 28, accentProb: 30,
    accentHint: '暖黄面积2–8%；不透明度10–15%；以"光感"而非"热闹"为准',
    semantic: '收束、安住、澄寂', visualHint: '中心锚定，大留白',
    palette: { main: 'cloud-white #FAFAFA', aux1: 'clear-cyan #D4F6FA', aux2: 'sunlight #FFE391', bg: 'ivory #FFFFE9' },
    rule: '🆕 V2：仍以留白与微差为核心，加入明亮暖黄作为"内在灯火"'
  },
  { 
    key: 'prajna', name: '般若', nameEn: 'Prajñā', color: '#ECF2F8', 
    spirit: '澄明洞见、清醒而温润',
    skeleton: '切透/对照', contrast: 'warm-cool, brightness, area', 
    colors: ['白', '蓝', '黄'], accentColors: ['绿', '红'],
    bgTemp: '冷', minBright: 85, maxSat: 32, accentProb: 55,
    accentHint: '面积2–5%；不透明度10–15%；避免大块强对比',
    semantic: '切透、澄明、洞见', visualHint: '干净切面，澄明',
    palette: { main: 'moon-white #ECF2F8', aux1: 'clear-cyan #D4F6FA', aux2: 'cream-yellow #FFF6DB', bg: 'cool-mist #F3F6FA' },
    rule: '🆕 V2：保留冷暖对照，但降低频率；点醒色更小、更淡'
  }
];

function getColorHex(name) {
  const map = { 
    '黄': '#FFDF91', 
    '绿': '#BAE6BC', 
    '蓝': '#C7E4F8', 
    '红': '#FFB7BE', 
    '白': '#FAFAFA' 
  };
  return map[name] || '#ddd';
}

const rawText = ref('');

onMounted(async () => {
  try {
    const res = await fetch('/lutaai.txt', { cache: 'no-store' });
    rawText.value = await res.text();
  } catch {
    rawText.value = '';
  }
});

const rawLines = computed(() => {
  return (rawText.value || '')
    .split(/\r?\n/)
    .map(l => l.replace(/\s+$/g, ''));
});

function sliceBetween(startIncludes, endIncludes) {
  const lines = rawLines.value;
  const startIdx = lines.findIndex(l => l.includes(startIncludes));
  if (startIdx === -1) return [];
  const endIdx = endIncludes
    ? lines.findIndex((l, i) => i > startIdx && l.includes(endIncludes))
    : -1;
  return lines.slice(startIdx, endIdx === -1 ? undefined : endIdx);
}

function blocksFromLines(lines) {
  const blocks = [];
  let buf = [];
  for (const l of lines) {
    if (!l.trim()) {
      if (buf.length) {
        blocks.push(buf.join('\n').trim());
        buf = [];
      }
      continue;
    }
    buf.push(l);
  }
  if (buf.length) blocks.push(buf.join('\n').trim());
  return blocks;
}

function getRawBlocks(sectionId) {
  if (!rawText.value) return ['（正在加载原文...）'];
  const map = {
    exec: ['## 0. 目标与产物边界', '## 1. 硬约束'],
    specs: ['## 1. 硬约束', '## 2. 固定审美约束'],
    aesthetics: ['## 2. 固定审美约束', '## 3. 色彩体系'],
    colors: ['## 3. 色彩体系', '## 4. 反向排除库'],
    negatives: ['## 4. 反向排除库', '## 5. 快检机制'],
    quickcheck: ['## 5. 快检机制', '## 6. 蒙版系统'],
    mask: ['## 6. 蒙版系统', '## 7. 六度构图语法映射'],
    batch: ['## 7. 六度构图语法映射', '## 8. 交付要求'],
    degrees: ['### 3.3 六度配色规则', '### 3.4 选色说明']
  };
  const [start, end] = map[sectionId] || [];
  if (!start) return [];
  const lines = end ? sliceBetween(start, end) : sliceBetween(start, null);
  return blocksFromLines(lines);
}

const colorSystem = {
  '蓝 · 东方': { 
    meaning: '澄明、冷静、深邃', 
    variants: [
      {name: 'ice-blue', hex: '#DFF0FC', brightness: 95, saturation: 12}, 
      {name: 'sky-mist', hex: '#C7E4F8', brightness: 92, saturation: 20}, 
      {name: 'soft-azure', hex: '#90CAF1', brightness: 85, saturation: 40}, 
      {name: 'powder-blue', hex: '#58AFE9', brightness: 78, saturation: 62},
      {name: 'clear-cyan', hex: '#D4F6FA', brightness: 94, saturation: 15},
      {name: 'serene-blue', hex: '#92DBFC', brightness: 88, saturation: 42}
    ] 
  },
  '黄 · 南方': { 
    meaning: '温暖、开阔、滋养', 
    variants: [
      {name: 'cream-yellow', hex: '#FFF6DB', brightness: 97, saturation: 14}, 
      {name: 'soft-gold', hex: '#FFEEB7', brightness: 95, saturation: 28}, 
      {name: 'warm-amber', hex: '#FFDF91', brightness: 92, saturation: 43}, 
      {name: 'honey-light', hex: '#FFD24A', brightness: 88, saturation: 71},
      {name: 'butter', hex: '#FFF5D3', brightness: 96, saturation: 17},
      {name: 'sunlight', hex: '#FFE391', brightness: 93, saturation: 43}
    ] 
  },
  '红 · 西方': { 
    meaning: '力量、温热、精进', 
    variants: [
      {name: 'blush', hex: '#FFE2E6', brightness: 96, saturation: 11}, 
      {name: 'rose-mist', hex: '#FFB7BE', brightness: 90, saturation: 28}, 
      {name: 'coral-light', hex: '#FF8560', brightness: 82, saturation: 63}, 
      {name: 'peach', hex: '#FFB59E', brightness: 88, saturation: 38},
      {name: 'warm-rose', hex: '#F8A0CB', brightness: 85, saturation: 36},
      {name: 'terracotta-light', hex: '#FFB59E', brightness: 88, saturation: 38}
    ] 
  },
  '绿 · 北方': { 
    meaning: '生机、平衡、流动', 
    variants: [
      {name: 'mint-mist', hex: '#E2F5E4', brightness: 96, saturation: 8}, 
      {name: 'soft-sage', hex: '#BAE6BC', brightness: 90, saturation: 19}, 
      {name: 'spring-green', hex: '#8FD692', brightness: 84, saturation: 33}, 
      {name: 'jade-light', hex: '#9EDFD9', brightness: 88, saturation: 29},
      {name: 'eucalyptus', hex: '#D8F2F1', brightness: 95, saturation: 11},
      {name: 'celadon', hex: '#D4EDB7', brightness: 92, saturation: 23}
    ] 
  },
  '白 · 中央': { 
    meaning: '清净、澄澈、空灵', 
    variants: [
      {name: 'pure-white', hex: '#FFFFFF', brightness: 100, saturation: 0}, 
      {name: 'cloud-white', hex: '#FAFAFA', brightness: 98, saturation: 0}, 
      {name: 'fog-white', hex: '#F5F5F5', brightness: 96, saturation: 0}, 
      {name: 'pearl', hex: '#F7F9FA', brightness: 97, saturation: 1},
      {name: 'silk', hex: '#FCFCFC', brightness: 99, saturation: 0},
      {name: 'moon-white', hex: '#ECF2F8', brightness: 95, saturation: 5}
    ] 
  },
};

const compositionRules = [
  { degree: '布施', color: '#FFF5D3', layout: '向外舒展、边界开放', elements: '形体≤3；线≤2', edgeBias: 'soft-fade', contrastMethod: 'area, brightness, warm-cool' },
  { degree: '持戒', color: '#ECF2F8', layout: '清晰内外分界、有秩序', elements: '形体≤4；线≤3', edgeBias: 'crisp', contrastMethod: 'brightness, area, none' },
  { degree: '忍辱', color: '#F7F9FA', layout: '缓冲感空间、有过渡', elements: '形体≤3；渐变≤2', edgeBias: 'gradient-fade', contrastMethod: 'layering, brightness, warm-cool' },
  { degree: '精进', color: '#FFD24A', layout: '有方向感、暗示推进', elements: '形体≤4；线≤2', edgeBias: 'crisp', contrastMethod: 'brightness, area, warm-cool' },
  { degree: '禅定', color: '#FAFAFA', layout: '收束向心、极大留白', elements: '形体≤2；线≤1', edgeBias: 'soft-fade', contrastMethod: 'brightness, area, none' },
  { degree: '般若', color: '#ECF2F8', layout: '有对照感、两域分明', elements: '形体≤3；线≤2', edgeBias: 'soft-division', contrastMethod: 'warm-cool, brightness, area' }
];
</script>

<style scoped>
/* ===== 基础变量 ===== */
.doc-view {
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

/* ===== 侧边栏 ===== */
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
.nav-list button:hover {
  background: var(--c-surface-alt);
  color: var(--c-text);
}
.nav-list button.active {
  background: var(--c-accent-bg);
  color: var(--c-accent);
  font-weight: 500;
}
.nav-list button.active .nav-icon {
  color: var(--c-accent);
}
.nav-icon {
  width: 20px;
  text-align: center;
  font-size: 1rem;
  color: var(--c-text-muted);
}
.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--c-border-light);
}
.version {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

/* ===== 主内容区 ===== */
.doc-content {
  flex: 1;
  padding: var(--gap-xl) var(--gap-lg);
  overflow-y: auto;
}
.doc-section {
  max-width: var(--content-max);
  margin: 0 auto;
  animation: fadeSlideIn 0.35s ease-out;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== 区块标题 ===== */
.section-header {
  margin-bottom: var(--gap-lg);
}
.section-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--c-text);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}
.subtitle {
  font-size: 1rem;
  color: var(--c-text-secondary);
  margin: 0;
}

/* ===== 双栏布局 ===== */
.dual-pane {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--gap-md);
  align-items: start;
}
.dual-pane.mt-lg {
  margin-top: var(--gap-lg);
}
.pane {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.pane.wide {
  grid-column: span 1;
}
.pane.tall .pane-body.scrollable {
  max-height: 500px;
  overflow-y: auto;
}
.pane-header {
  padding: 14px 20px;
  background: var(--c-surface-alt);
  border-bottom: 1px solid var(--c-border-light);
}
.pane-badge {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 4px;
}
.pane-badge.system {
  background: var(--c-accent-bg);
  color: var(--c-accent);
}
.pane-badge.original {
  background: #FFF4E5;
  color: #B86E00;
}
.pane-body {
  padding: 20px;
}

/* ===== 原文块 ===== */
.raw-block {
  background: var(--c-surface-alt);
  border: 1px solid var(--c-border-light);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  margin-bottom: var(--gap-sm);
}
.raw-block:last-child { margin-bottom: 0; }
.raw-text {
  font-size: 0.85rem;
  line-height: 1.65;
  color: var(--c-text);
  white-space: pre-wrap;
  word-break: break-word;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
}

/* ===== 工作流 ===== */
.workflow-pipeline {
  display: flex;
  gap: 0;
  margin-bottom: var(--gap-lg);
  overflow-x: auto;
  padding-bottom: var(--gap-sm);
}
.pipeline-step {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.step-connector {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--c-border), var(--c-accent));
  position: relative;
}
.step-connector::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: var(--c-accent);
}
.step-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: 20px;
  width: 180px;
  text-align: center;
  position: relative;
  transition: all 0.2s;
}
.step-card:hover {
  border-color: var(--c-accent);
  box-shadow: var(--shadow-md);
}
.step-number {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 22px;
  background: var(--c-accent);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  background: var(--c-surface-alt);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.step-card.input .step-icon { background: #E3F2FD; }
.step-card.llm .step-icon { background: #FFF3E0; }
.step-card.logic .step-icon { background: #E8F5E9; }
.step-card.gen .step-icon { background: #FCE4EC; }
.step-card.verify .step-icon { background: #F3E5F5; }
.step-card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 6px;
  color: var(--c-text);
}
.step-card p {
  font-size: 0.8rem;
  color: var(--c-text-secondary);
  margin: 0 0 10px;
}
.step-details {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}
.step-details li {
  font-size: 0.7rem;
  background: var(--c-surface-alt);
  padding: 3px 8px;
  border-radius: 4px;
  color: var(--c-text-secondary);
}

/* ===== 实现卡片 ===== */
.impl-card {
  background: var(--c-surface-alt);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-bottom: var(--gap-sm);
}
.impl-card:last-child { margin-bottom: 0; }
.impl-card h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-text);
  margin: 0 0 12px;
}
.impl-flow {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.impl-node {
  font-size: 0.8rem;
  padding: 6px 12px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  color: var(--c-text);
}
.impl-arrow {
  color: var(--c-text-muted);
  font-size: 0.9rem;
}
.check-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.check-item {
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 6px;
}
.check-item.pass {
  background: #E6F4EE;
  color: #0A7B4E;
}
.check-item.warn {
  background: #FFF4E5;
  color: #B86E00;
}

/* ===== 规格网格 ===== */
.specs-grid {
  display: grid;
  gap: var(--gap-sm);
}
.spec-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--c-surface-alt);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--c-border);
}
.spec-item.critical {
  border-left-color: var(--c-warning);
}
.spec-item.forbidden {
  border-left-color: var(--c-danger);
}
.spec-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--c-surface);
  flex-shrink: 0;
}
.spec-icon.size { background: linear-gradient(135deg, #E3F2FD, #BBDEFB); }
.spec-icon.margin { background: linear-gradient(135deg, #E8F5E9, #C8E6C9); }
.spec-icon.elements { background: linear-gradient(135deg, #FFF3E0, #FFE0B2); }
.spec-icon.colors { background: linear-gradient(135deg, #FCE4EC, #F8BBD9); }
.spec-icon.ban { background: linear-gradient(135deg, #FFEBEE, #FFCDD2); }
.spec-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.spec-label {
  font-size: 0.8rem;
  color: var(--c-text-secondary);
}
.spec-value {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--c-text);
}
.spec-impl {
  font-size: 0.8rem;
  color: var(--c-accent);
}

/* ===== 美学展示 ===== */
.aesthetics-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-sm);
}
.aes-item {
  display: flex;
  gap: 14px;
  padding: 18px;
  background: var(--c-surface-alt);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}
.aes-item:hover {
  background: var(--c-surface);
  box-shadow: var(--shadow-sm);
}
.aes-kanji-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--c-accent-bg), #D4EDDA);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}
.aes-kanji {
  font-size: 1.6rem;
  font-family: "Noto Serif SC", "Hiragino Mincho ProN", serif;
  color: var(--c-accent);
  font-weight: 500;
}
.aes-content {
  flex: 1;
  min-width: 0;
}
.aes-title {
  margin-bottom: 6px;
}
.aes-romaji {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-text);
}
.aes-desc {
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  margin: 0 0 8px;
  line-height: 1.4;
}
.aes-impl {
  font-size: 0.75rem;
  color: var(--c-accent);
  background: var(--c-accent-bg);
  padding: 3px 8px;
  border-radius: 4px;
}

/* ===== 颜色系统 ===== */
.color-palette-grid {
  display: grid;
  gap: var(--gap-md);
}
.palette-group {
  background: var(--c-surface-alt);
  border-radius: var(--radius-sm);
  padding: 18px;
}
.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 14px;
}
.palette-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
}
.palette-meaning {
  font-size: 0.85rem;
  color: var(--c-text-secondary);
}
.swatches {
  display: flex;
  gap: var(--gap-sm);
  flex-wrap: wrap;
}
.swatch {
  display: flex;
  flex-direction: column;
  gap: 8px;
  --swatch-color: #fff;
}
.swatch-color {
  width: 80px;
  height: 56px;
  background: var(--swatch-color);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: var(--shadow-sm);
}
.swatch-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.swatch-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--c-text);
}
.swatch-hex {
  font-size: 0.7rem;
  color: var(--c-text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.color-rules-summary {
  margin-top: var(--gap-md);
  padding: 16px;
  background: var(--c-surface-alt);
  border-radius: var(--radius-sm);
}
.color-rules-summary h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--c-text);
}
.contrast-methods {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.method {
  font-size: 0.8rem;
  padding: 6px 12px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  color: var(--c-text);
}
.method.muted {
  color: var(--c-text-muted);
  border-style: dashed;
}

/* ===== 反向排除库 ===== */
.negative-categories {
  display: grid;
  gap: var(--gap-sm);
}
.neg-cat {
  padding: 16px;
  background: var(--c-surface-alt);
  border-radius: var(--radius-sm);
}
.neg-cat h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-text);
  margin: 0 0 12px;
}
.neg-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.neg-tags span {
  font-size: 0.8rem;
  padding: 5px 10px;
  background: #FFEBEE;
  color: #C62828;
  border-radius: 4px;
}
.impl-note {
  margin-top: var(--gap-md);
  padding: 14px;
  background: var(--c-accent-bg);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--c-text);
}
.impl-note strong {
  color: var(--c-accent);
}

/* ===== 快检分类 ===== */
.check-categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap-sm);
}
.check-cat {
  padding: 16px;
  background: var(--c-surface-alt);
  border-radius: var(--radius-sm);
}
.cat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-text);
}
.cat-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
}
.cat-icon.structure { background: linear-gradient(135deg, #E3F2FD, #90CAF9); }
.cat-icon.color { background: linear-gradient(135deg, #FCE4EC, #F48FB1); }
.cat-icon.abstract { background: linear-gradient(135deg, #F3E5F5, #CE93D8); }
.cat-icon.quality { background: linear-gradient(135deg, #E8F5E9, #81C784); }
.check-cat ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.check-cat li {
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
}
.check-cat li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--c-accent);
  font-weight: bold;
}

/* ===== 蒙版/批量状态 ===== */
.mask-status, .batch-status {
  margin-bottom: var(--gap-md);
}
.status-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 8px;
}
.status-badge.pending {
  background: #FFF4E5;
  color: #B86E00;
}
.mask-status p, .batch-status p {
  font-size: 0.9rem;
  color: var(--c-text-secondary);
  margin: 0;
}
.mask-params, .batch-plan {
  padding: 16px;
  background: var(--c-surface-alt);
  border-radius: var(--radius-sm);
}
.mask-params h4, .batch-plan h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-text);
  margin: 0 0 12px;
}
.param-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--c-border-light);
  font-size: 0.85rem;
}
.param-row:last-child { border-bottom: none; }
.param-name { color: var(--c-text); }
.param-range { color: var(--c-text-secondary); }
.round-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-sm);
}
.round-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  padding: 14px;
  text-align: center;
}
.round-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-accent);
  margin-bottom: 4px;
}
.round-count {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--c-text);
  margin-bottom: 4px;
}
.round-desc {
  font-size: 0.8rem;
  color: var(--c-text-secondary);
}

/* ===== 构图语法卡片 ===== */
.composition-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-sm);
}
.comp-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.comp-header {
  padding: 12px 16px;
  text-align: center;
}
.comp-degree {
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
}
.comp-body {
  padding: 14px 16px;
}
.comp-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 0;
  border-bottom: 1px solid var(--c-border-light);
}
.comp-row:last-child { border-bottom: none; }
.comp-label {
  font-size: 0.75rem;
  color: var(--c-text-secondary);
  flex-shrink: 0;
}
.comp-value {
  font-size: 0.8rem;
  color: var(--c-text);
  text-align: right;
  max-width: 65%;
}
.comp-value.small {
  font-size: 0.75rem;
  color: var(--c-text-secondary);
}

/* ===== 六度卡片 ===== */
.degrees-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-md);
  margin-bottom: var(--gap-lg);
}
.degree-card {
  --accent: #0A7B4E;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.2s;
}
.degree-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.degree-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent), white 30%));
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.degree-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}
.degree-en {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.8);
  font-style: italic;
}
.degree-body {
  padding: 18px 20px;
}
.degree-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--c-border-light);
}
.degree-row:last-of-type { border-bottom: none; }
.row-label {
  font-size: 0.8rem;
  color: var(--c-text-secondary);
}
.row-value {
  font-size: 0.85rem;
  color: var(--c-text);
}
.row-value.tag {
  background: var(--c-surface-alt);
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
}
.color-dots {
  display: flex;
  gap: 5px;
}
.dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.dot.small {
  width: 14px;
  height: 14px;
  opacity: 0.8;
}
.v2-badge {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 700;
  background: rgba(255,255,255,0.25);
  color: white;
  text-transform: uppercase;
}
.degree-spirit {
  padding: 10px 12px;
  background: rgba(0,0,0,0.03);
  border-radius: 8px;
  margin-bottom: 12px;
}
.spirit-text {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--c-text-secondary);
  font-style: italic;
}
.degree-params {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid var(--c-border-light);
  margin-bottom: 8px;
}
.param-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: var(--c-surface-alt);
  border-radius: 6px;
}
.param-label {
  font-size: 0.7rem;
  color: var(--c-text-secondary);
}
.param-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-text);
}
.row-value.hint {
  font-size: 0.75rem;
  color: var(--c-text-secondary);
  font-style: italic;
}
.degree-palette {
  padding: 10px 0;
  border-bottom: 1px solid var(--c-border-light);
}
.palette-label {
  font-size: 0.75rem;
  color: var(--c-text-secondary);
  display: block;
  margin-bottom: 8px;
}
.palette-swatches {
  display: flex;
  gap: 8px;
}
.swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.swatch-color {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--c-border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.swatch-name {
  font-size: 0.6rem;
  color: var(--c-text-secondary);
  max-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.degree-rule {
  padding: 10px 0;
  margin-top: 8px;
  border-top: 1px dashed var(--c-border);
}
.rule-label {
  display: block;
  font-size: 0.7rem;
  color: var(--c-text-secondary);
  margin-bottom: 4px;
}
.rule-text {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--c-text);
}
.degree-visual {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed var(--c-border);
  display: flex;
  align-items: center;
  gap: 12px;
}
.visual-hint {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--c-surface-alt);
}
.visual-hint.dana { border-radius: 50% 50% 50% 20%; }
.visual-hint.sila { border: 2px solid var(--c-border); background: transparent; }
.visual-hint.ksanti { border-radius: 16px; opacity: 0.6; }
.visual-hint.virya { background: linear-gradient(135deg, var(--c-surface-alt), var(--c-border)); }
.visual-hint.samadhi { border-radius: 50%; }
.visual-hint.prajna { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 100%); }
.visual-text {
  font-size: 0.8rem;
  color: var(--c-text-secondary);
}

/* ===== 实现列表 ===== */
.impl-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.impl-list li {
  padding: 10px 0;
  border-bottom: 1px solid var(--c-border-light);
  font-size: 0.9rem;
  color: var(--c-text);
}
.impl-list li:last-child { border-bottom: none; }
.impl-list strong {
  color: var(--c-accent);
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .degrees-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  .aesthetics-showcase {
    grid-template-columns: repeat(2, 1fr);
  }
  .composition-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .mobile-nav { display: flex; }
  .sidebar { display: none; }
  .doc-content {
    padding: calc(60px + var(--gap-lg)) var(--gap-md) var(--gap-lg);
  }
  .dual-pane {
    grid-template-columns: 1fr;
  }
  .degrees-overview {
    grid-template-columns: 1fr;
  }
  .aesthetics-showcase {
    grid-template-columns: 1fr;
  }
  .check-categories {
    grid-template-columns: 1fr;
  }
  .round-cards {
    grid-template-columns: 1fr;
  }
  .composition-grid {
    grid-template-columns: 1fr;
  }
  .workflow-pipeline {
    flex-direction: column;
    align-items: stretch;
  }
  .step-connector {
    width: 2px;
    height: 24px;
    margin: 0 auto;
    background: linear-gradient(180deg, var(--c-border), var(--c-accent));
  }
  .step-connector::after {
    right: 50%;
    top: auto;
    bottom: 0;
    transform: translateX(50%);
    border: 5px solid transparent;
    border-top-color: var(--c-accent);
    border-left-color: transparent;
  }
  .step-card {
    width: 100%;
  }
}
</style>
