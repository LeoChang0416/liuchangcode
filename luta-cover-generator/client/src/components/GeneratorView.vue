<template>
  <div class="generator-view">
    <div class="steps">
      <div class="step" :class="{ active: currentStep >= 1, done: currentStep > 1 }">
        <div class="step-dot">1</div>
        <span>内容分析</span>
      </div>
      <div class="step-line" :class="{ active: currentStep > 1 }"></div>
      <div class="step" :class="{ active: currentStep >= 2, done: currentStep > 2 }">
        <div class="step-dot">2</div>
        <span>生成封面</span>
      </div>
      <div class="step-line" :class="{ active: currentStep > 2 }"></div>
      <div class="step" :class="{ active: currentStep >= 3 }">
        <div class="step-dot">3</div>
        <span>质量评估</span>
      </div>
    </div>

    <div class="content-grid">
      <!-- 左侧输入区 -->
      <section class="input-panel card">
        <div class="card-header">
          <h2>播客内容</h2>
          <span class="hint">粘贴文字内容或摘要</span>
        </div>
        <div class="card-body">
          <div class="textarea-wrapper">
            <textarea 
              v-model="podcastContent" 
              placeholder="在这里输入播客的文字内容..."
              rows="8"
              @focus="textareaFocused = true"
              @blur="textareaFocused = false"
            ></textarea>
            <div class="textarea-border" :class="{ focused: textareaFocused }"></div>
          </div>

          <button 
            class="primary-btn" 
            @click="handleAnalyze"
            :disabled="!canAnalyze || analyzeLoading"
          >
            <span class="btn-content">
              <svg v-if="!analyzeLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <span class="spinner" v-else></span>
              <span>{{ analyzeLoading ? '分析中...' : '分析内容' }}</span>
            </span>
          </button>
        </div>
      </section>

      <!-- 右侧输出区 -->
      <section class="output-panel">
        <!-- 内容分析卡片 -->
        <div class="card analysis-card" v-if="analysisResult" :class="{ visible: analysisResult }">
          <div class="card-header">
            <h2>内容分析</h2>
            <div class="analysis-badge">AI 提取</div>
          </div>
          <div class="card-body">
            <!-- 自动选度推导面板 -->
            <div class="degree-inference-panel" v-if="degreeSelection">
              <div class="inference-header">
                <div class="inference-title">
                  <span class="inference-icon">◎</span>
                  <span>智能选度推导</span>
                </div>
                <div class="inference-result">
                  <span class="result-degree">{{ degreeSelection.degreeName }}</span>
                  <span class="result-conf" :class="{ high: degreeSelection.confidence >= 85, mid: degreeSelection.confidence >= 70 && degreeSelection.confidence < 85 }">
                    {{ degreeSelection.confidence }}%
                  </span>
                </div>
              </div>
              
              <div class="inference-body">
                <!-- 推导路径 -->
                <div class="inference-path">
                  <div class="path-step">
                    <span class="step-num">1</span>
                    <span class="step-label">内容解析</span>
                    <span class="step-arrow">→</span>
                  </div>
                  <div class="path-step">
                    <span class="step-num">2</span>
                    <span class="step-label">精神内核提取</span>
                    <span class="step-arrow">→</span>
                  </div>
                  <div class="path-step">
                    <span class="step-num">3</span>
                    <span class="step-label">六度匹配</span>
                    <span class="step-arrow">→</span>
                  </div>
                  <div class="path-step final">
                    <span class="step-num">✓</span>
                    <span class="step-label">{{ degreeSelection.degreeName }}</span>
                  </div>
                </div>
                
                <!-- 核心推理 -->
                <div class="inference-reasoning" v-if="degreeSelection.reason">
                  <div class="reasoning-header">
                    <span class="reasoning-icon">⚑</span>
                    <span>核心推理</span>
                  </div>
                  <p class="reasoning-text">{{ degreeSelection.reason }}</p>
                </div>
                
                <!-- 证据链 -->
                <div class="inference-evidence" v-if="degreeSelection.evidence?.length">
                  <div class="evidence-header">
                    <span class="evidence-icon">⟡</span>
                    <span>文本证据</span>
                  </div>
                  <div class="evidence-chain">
                    <span class="evidence-item" v-for="(e, i) in degreeSelection.evidence" :key="i">
                      <span class="evidence-quote">"{{ e }}"</span>
                    </span>
                  </div>
                </div>
                
                <!-- 置信度条 -->
                <div class="confidence-bar-wrap">
                  <div class="confidence-label">置信度</div>
                  <div class="confidence-bar">
                    <div class="confidence-fill" :style="{ width: degreeSelection.confidence + '%' }" :class="{ high: degreeSelection.confidence >= 85, mid: degreeSelection.confidence >= 70 && degreeSelection.confidence < 85 }"></div>
                  </div>
                  <div class="confidence-scale">
                    <span>0</span>
                    <span class="scale-threshold">70</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="spiritual-tone" v-if="analysisResult.spiritualTone">
              <div class="tone-item primary">
                <span class="tone-label">主调</span>
                <span class="tone-value">{{ analysisResult.spiritualTone.primary }}</span>
              </div>
              <div class="tone-separator"></div>
              <div class="tone-item secondary">
                <span class="tone-label">辅调</span>
                <span class="tone-value">{{ analysisResult.spiritualTone.secondary }}</span>
              </div>
            </div>

            <div class="analysis-grid">
              <div class="analysis-item">
                <span class="analysis-label">情感基调</span>
                <div class="analysis-tags">
                  <span class="tag" v-for="e in analysisResult.emotion" :key="e">{{ e }}</span>
                </div>
              </div>
              <div class="analysis-item">
                <span class="analysis-label">核心主题</span>
                <div class="analysis-tags">
                  <span class="tag" v-for="t in analysisResult.theme" :key="t">{{ t }}</span>
                </div>
              </div>
              <div class="analysis-item">
                <span class="analysis-label">抽象意象</span>
                <div class="analysis-tags">
                  <span class="tag accent" v-for="i in analysisResult.imagery" :key="i">{{ i }}</span>
                </div>
              </div>
              <div class="analysis-item" v-if="analysisResult.tension?.hasTension">
                <span class="analysis-label">叙事张力</span>
                <div class="tension-flow">
                  <span class="tension-from">{{ analysisResult.tension.from }}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <span class="tension-to">{{ analysisResult.tension.to }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 骨架强变量卡片 (V6新增) -->
        <div class="card skeleton-card" v-if="strongLayoutVars" :class="{ visible: strongLayoutVars }">
          <div class="card-header">
            <h2>骨架强变量</h2>
            <div class="skeleton-badge">内容决定 · 度禁止干预</div>
          </div>
          <div class="card-body">
            <!-- 物理隐喻 -->
            <div class="physical-metaphor" v-if="strongLayoutVars.physicalMetaphor">
              <span class="metaphor-icon">◈</span>
              <span class="metaphor-text">{{ strongLayoutVars.physicalMetaphor }}</span>
            </div>
            
            <!-- 三类强变量 -->
            <div class="strong-vars-grid">
              <!-- 1. 拓扑布局 -->
              <div class="strong-var-card">
                <div class="var-header">
                  <span class="var-number">1</span>
                  <span class="var-title">拓扑布局</span>
                </div>
                <div class="var-content" v-if="strongLayoutVars.topologicalLayout">
                  <div class="var-row">
                    <span class="var-label">区域数</span>
                    <span class="var-value highlight">{{ strongLayoutVars.topologicalLayout.zoneCount }}</span>
                  </div>
                  <div class="var-row">
                    <span class="var-label">分界方式</span>
                    <span class="var-value">{{ strongLayoutVars.topologicalLayout.divisionMethod }}</span>
                  </div>
                  <div class="var-row" v-if="strongLayoutVars.topologicalLayout.zoneRatios">
                    <span class="var-label">区域比例</span>
                    <span class="var-value">{{ strongLayoutVars.topologicalLayout.zoneRatios }}</span>
                  </div>
                  <p class="var-reason" v-if="strongLayoutVars.topologicalLayout.zoneCountReason">
                    {{ strongLayoutVars.topologicalLayout.zoneCountReason }}
                  </p>
                </div>
              </div>
              
              <!-- 2. 主关系 -->
              <div class="strong-var-card">
                <div class="var-header">
                  <span class="var-number">2</span>
                  <span class="var-title">主关系</span>
                </div>
                <div class="var-content" v-if="strongLayoutVars.primaryRelationship">
                  <div class="var-row">
                    <span class="var-label">关系类型</span>
                    <span class="var-value highlight">{{ strongLayoutVars.primaryRelationship.type }}</span>
                  </div>
                  <div class="var-row">
                    <span class="var-label">交互质量</span>
                    <span class="var-value">{{ strongLayoutVars.primaryRelationship.interactionQuality }}</span>
                  </div>
                  <p class="var-reason" v-if="strongLayoutVars.primaryRelationship.typeReason">
                    {{ strongLayoutVars.primaryRelationship.typeReason }}
                  </p>
                </div>
              </div>
              
              <!-- 3. 节奏签名 -->
              <div class="strong-var-card">
                <div class="var-header">
                  <span class="var-number">3</span>
                  <span class="var-title">节奏签名</span>
                </div>
                <div class="var-content" v-if="strongLayoutVars.rhythmSignature">
                  <div class="var-row">
                    <span class="var-label">节奏类型</span>
                    <span class="var-value highlight">{{ strongLayoutVars.rhythmSignature.type }}</span>
                  </div>
                  <div class="var-row">
                    <span class="var-label">元素数量</span>
                    <span class="var-value">{{ strongLayoutVars.rhythmSignature.elementCount }}</span>
                  </div>
                  <p class="var-reason" v-if="strongLayoutVars.rhythmSignature.typeReason">
                    {{ strongLayoutVars.rhythmSignature.typeReason }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 设计逻辑卡片 -->
        <div class="card design-card" v-if="designLogic" :class="{ visible: designLogic }">
          <div class="card-header">
            <h2>设计逻辑</h2>
            <div class="influence-badge" :class="influenceLevel">
              内容影响 {{ designLogic.contentInfluenceScore || 0 }}%
            </div>
          </div>
          <div class="card-body">
            <!-- 警告信息 -->
            <div class="warnings-list" v-if="designLogic.warnings?.length">
              <div class="warning-item" v-for="(w, i) in designLogic.warnings" :key="i">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{ w }}</span>
              </div>
            </div>
            
            <!-- 内容签名动作（V4新增） -->
            <div class="content-signature" v-if="designLogic.contentSignature">
              <div class="signature-header">
                <span class="signature-icon">✦</span>
                <span class="signature-title">内容签名动作</span>
              </div>
              <p class="signature-action">{{ designLogic.contentSignature.action }}</p>
              <div class="signature-meta">
                <span class="signature-source">来源: {{ designLogic.contentSignature.source }}</span>
              </div>
              <p class="signature-visual" v-if="designLogic.contentSignature.visualization">
                {{ designLogic.contentSignature.visualization }}
              </p>
            </div>
            
            <!-- 反先验验证（V6升级） -->
            <div class="anti-cliche-check" v-if="designLogic.antiClicheCheck" :class="{ triggered: designLogic.antiClicheCheck.triggered }">
              <div class="acc-header">
                <span class="acc-title">反先验验证</span>
                <span class="acc-badge" :class="{ triggered: designLogic.antiClicheCheck.triggered }">
                  {{ designLogic.antiClicheCheck.triggered ? '已触发规避' : '未触发' }}
                </span>
              </div>
              <div class="acc-content" v-if="designLogic.antiClicheCheck.triggered">
                <div class="acc-row" v-if="designLogic.antiClicheCheck.degreeDefaultCliche">
                  <span class="acc-label">默认 Cliché</span>
                  <span class="acc-value cliche">{{ designLogic.antiClicheCheck.degreeDefaultCliche }}</span>
                </div>
                <div class="acc-row" v-if="designLogic.antiClicheCheck.avoidedCliche">
                  <span class="acc-label">已规避</span>
                  <span class="acc-value avoided">{{ designLogic.antiClicheCheck.avoidedCliche }}</span>
                </div>
                <p class="acc-how" v-if="designLogic.antiClicheCheck.howAvoided">
                  {{ designLogic.antiClicheCheck.howAvoided }}
                </p>
              </div>
              <div class="acc-skeleton-check" v-if="designLogic.degreeBiasApplication">
                <span class="skeleton-check-label">骨架未被度影响:</span>
                <span class="skeleton-check-value" :class="{ pass: designLogic.degreeBiasApplication.skeletonUntouched }">
                  {{ designLogic.degreeBiasApplication.skeletonUntouched ? '✓ 是' : '✗ 否' }}
                </span>
              </div>
            </div>
            
            <!-- 内容影响详情 -->
            <div class="design-item influence-detail" v-if="designLogic.contentInfluenceDetail">
              <span class="design-label">内容驱动元素</span>
              <p class="influence-text">{{ designLogic.contentInfluenceDetail }}</p>
            </div>
            
            <!-- 度的氛围偏置（V5新增） -->
            <div class="design-item degree-bias" v-if="designLogic.degreeInfo">
              <div class="bias-header">
                <span class="design-label">度的氛围偏置</span>
                <span class="bias-hint">（仅影响细节，不决定骨架）</span>
              </div>
              <div class="degree-info">
                <span class="degree-name-badge">{{ designLogic.degreeInfo.name }}</span>
                <span class="degree-theme-text">{{ designLogic.degreeInfo.theme }}</span>
              </div>
              <div class="bias-applied" v-if="designLogic.degreeBiasApplication?.appliedBiases?.length">
                <span class="bias-label">已应用偏置:</span>
                <div class="bias-tags">
                  <span class="bias-tag" v-for="b in designLogic.degreeBiasApplication.appliedBiases" :key="b">{{ b }}</span>
                </div>
                <p class="bias-detail" v-if="designLogic.degreeBiasApplication.howApplied">
                  {{ designLogic.degreeBiasApplication.howApplied }}
                </p>
              </div>
            </div>
            
            <!-- 决策追踪（折叠） -->
            <div class="design-item decision-trace" v-if="designLogic.decisionTrace && Object.keys(designLogic.decisionTrace).length">
              <div class="trace-header" @click="showDecisionTrace = !showDecisionTrace">
                <span class="design-label">决策追踪</span>
                <svg :class="{ expanded: showDecisionTrace }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <div class="trace-content" v-show="showDecisionTrace">
                <div class="trace-item" v-for="(value, key) in designLogic.decisionTrace" :key="key">
                  <span class="trace-key">{{ key }}</span>
                  <span class="trace-source" :class="value.source">{{ value.source }}</span>
                  <span class="trace-detail">{{ value.detail }}</span>
                </div>
              </div>
            </div>
            
            <div class="design-item">
              <span class="design-label">几何形态</span>
              <p>{{ designLogic.geometryDescription }}</p>
            </div>
            <div class="design-item">
              <span class="design-label">配色逻辑</span>
              <p>{{ designLogic.colorLogic }}</p>
            </div>
            <div class="design-item constraint-item" v-if="designLogic.constraintCheck">
              <span class="design-label">约束自检</span>
              <div class="constraint-grid">
                <div class="constraint-cell" :class="{ pass: designLogic.constraintCheck.shapes <= 4 }">
                  <span class="constraint-name">形体</span>
                  <span class="constraint-value">{{ designLogic.constraintCheck.shapes }}/4</span>
                </div>
                <div class="constraint-cell" :class="{ pass: designLogic.constraintCheck.lines <= 3 }">
                  <span class="constraint-name">线条</span>
                  <span class="constraint-value">{{ designLogic.constraintCheck.lines }}/3</span>
                </div>
                <div class="constraint-cell" :class="{ pass: designLogic.constraintCheck.gradients <= 2 }">
                  <span class="constraint-name">渐变</span>
                  <span class="constraint-value">{{ designLogic.constraintCheck.gradients }}/2</span>
                </div>
                <div class="constraint-cell" :class="{ pass: designLogic.constraintCheck.hueColors <= 3 }">
                  <span class="constraint-name">色相</span>
                  <span class="constraint-value">{{ designLogic.constraintCheck.hueColors }}/2</span>
                </div>
                <div class="constraint-cell" :class="{ pass: designLogic.constraintCheck.whitespace >= 50 }">
                  <span class="constraint-name">留白</span>
                  <span class="constraint-value">{{ designLogic.constraintCheck.whitespace }}%</span>
                </div>
                <div class="constraint-cell" :class="{ pass: designLogic.constraintCheck.allPass }">
                  <span class="constraint-name">全部</span>
                  <span class="constraint-value">{{ designLogic.constraintCheck.allPass ? '✓' : '✗' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提示词卡片 -->
        <div class="card prompt-card" v-if="generatedPrompt" :class="{ visible: generatedPrompt }">
          <div class="card-header">
            <h2>生图提示词</h2>
            <button class="icon-btn" @click="copyPrompt" title="复制">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          <div class="card-body">
            <div class="prompt-block positive">
              <div class="prompt-label">
                <div class="label-dot positive"></div>
                <span>正向提示</span>
              </div>
              <p>{{ generatedPrompt.prompt }}</p>
            </div>
            <div class="prompt-block negative">
              <div class="prompt-label">
                <div class="label-dot negative"></div>
                <span>负向排除（系统强制）</span>
              </div>
              <p>{{ generatedPrompt.negative_prompt }}</p>
            </div>
            
            <button 
              class="primary-btn generate-btn" 
              @click="handleGenerateImage"
              :disabled="generateLoading"
              v-if="!imageStatus"
            >
              <span class="btn-content">
                <svg v-if="!generateLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span class="spinner" v-else></span>
                <span>{{ generateLoading ? generateLoadingText : '生成封面' }}</span>
              </span>
            </button>
          </div>
        </div>

        <!-- 图片预览卡片 -->
        <div class="card image-card" v-if="imageStatus" :class="{ visible: imageStatus }">
          <div class="card-header">
            <h2>生成结果</h2>
            <div class="status-badge" :class="imageStatus.status">
              <div class="status-dot"></div>
              <span>{{ statusText }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="image-container" :class="{ loaded: imageUrl }">
              <!-- 优雅的加载状态 -->
              <div class="generation-loader" v-if="!imageUrl">
                <div class="loader-canvas">
                  <!-- 动态几何图形 -->
                  <div class="geo-shape shape-1"></div>
                  <div class="geo-shape shape-2"></div>
                  <div class="geo-shape shape-3"></div>
                  <!-- 中心波纹 -->
                  <div class="ripple-container">
                    <div class="ripple"></div>
                    <div class="ripple delay-1"></div>
                    <div class="ripple delay-2"></div>
                  </div>
                </div>
                <!-- 进度信息 -->
                <div class="loader-info">
                  <div class="loader-progress-ring">
                    <svg viewBox="0 0 48 48">
                      <circle class="progress-bg" cx="24" cy="24" r="20" />
                      <circle 
                        class="progress-fill" 
                        cx="24" cy="24" r="20"
                        :style="{ strokeDashoffset: loaderOffset }"
                      />
                    </svg>
                    <span class="progress-text">{{ imageStatus.progress || 0 }}%</span>
                  </div>
                  <div class="loader-text">
                    <span class="loader-status">{{ loaderStatusText }}</span>
                    <span class="loader-hint" v-if="!showTimeoutWarning">AI 正在创作中，请稍候...</span>
                    <span class="loader-hint warning" v-else>排队时间较长，可以继续等待或取消重试</span>
                  </div>
                </div>
                <!-- 取消按钮 -->
                <button class="cancel-btn" @click="cancelGeneration" v-if="generateLoading">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  <span>取消生成</span>
                </button>
              </div>
              <img v-else :src="imageUrl" alt="生成的封面" class="result-image" />
            </div>
            
            <button 
              class="primary-btn evaluate-btn" 
              @click="handleEvaluate"
              :disabled="evaluateLoading"
              v-if="imageUrl && !evaluation"
            >
              <span class="btn-content">
                <svg v-if="!evaluateLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="spinner" v-else></span>
                <span>{{ evaluateLoading ? '评估中...' : '快检评分' }}</span>
              </span>
            </button>
          </div>
        </div>

        <!-- 评分卡片 -->
        <div class="card eval-card" v-if="evaluation" :class="{ visible: evaluation }">
          <div class="card-header">
            <h2>快检评分</h2>
            <div class="pass-badge" :class="{ pass: evaluation.pass }">
              {{ evaluation.pass ? '通过' : '未通过' }}
            </div>
          </div>
          <div class="card-body">
            <div class="score-display">
              <svg class="score-ring" viewBox="0 0 120 120">
                <circle class="ring-bg" cx="60" cy="60" r="52" />
                <circle 
                  class="ring-fill" 
                  cx="60" cy="60" r="52"
                  :style="{ strokeDashoffset: scoreOffset }"
                />
              </svg>
              <div class="score-value">
                <span class="score-number">{{ totalScore }}</span>
                <span class="score-label">总分</span>
              </div>
            </div>

            <div class="eval-metrics">
              <div class="metric-item" v-for="(item, key) in evalItems" :key="key">
                <div class="metric-header">
                  <span class="metric-name">{{ item.label }}</span>
                  <span class="metric-score">{{ evaluation[key]?.score }}</span>
                </div>
                <div class="metric-bar">
                  <div 
                    class="metric-fill" 
                    :style="{ width: evaluation[key]?.score + '%' }"
                    :class="{ low: evaluation[key]?.score < 70 }"
                  ></div>
                </div>
                <p class="metric-reason">{{ evaluation[key]?.reason }}</p>
              </div>
            </div>

            <div class="eval-summary">
              <p>{{ evaluation.summary }}</p>
            </div>
            
            <!-- 意象校验按钮 -->
            <button 
              class="secondary-btn verify-btn" 
              @click="handleVerifyImagery"
              :disabled="verifyLoading"
              v-if="!imageryVerification"
            >
              <span class="btn-content">
                <svg v-if="!verifyLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span class="spinner" v-else></span>
                <span>{{ verifyLoading ? '校验中...' : '意象校验' }}</span>
              </span>
            </button>
          </div>
        </div>
        
        <!-- 意象校验卡片 -->
        <div class="card imagery-card" v-if="imageryVerification" :class="{ visible: imageryVerification }">
          <div class="card-header">
            <h2>意象校验</h2>
            <div class="imagery-score-badge" :class="{ pass: imageryVerification.overallScore >= 70 }">
              {{ imageryVerification.overallScore || 0 }}分
            </div>
          </div>
          <div class="card-body">
            <!-- 综合评价头部 -->
            <div class="imagery-verdict-header">
              <div class="verdict-status" :class="{ pass: imageryVerification.pass }">
                <span class="status-icon">{{ imageryVerification.pass ? '✓' : '✗' }}</span>
                <span class="status-text">{{ imageryVerification.pass ? '意象匹配' : '意象不匹配' }}</span>
              </div>
              <p class="verdict-summary">{{ imageryVerification.verdict }}</p>
            </div>
            
            <!-- 左右双域警告 -->
            <div class="dual-warning" v-if="imageryVerification.isLeftRightDual">
              <div class="warning-icon">⚠️</div>
              <div class="warning-content">
                <span class="warning-title">检测到"左右双域对比"结构</span>
                <p>{{ imageryVerification.leftRightDualDetail }}</p>
              </div>
            </div>
            
            <!-- 双列布局：意象匹配 + 结构匹配 -->
            <div class="imagery-grid">
              <!-- 意象匹配度 -->
              <div class="imagery-match-card">
                <div class="card-title">
                  <span>意象匹配</span>
                  <span class="mini-score" :class="{ high: imageryVerification.metaphorMatch?.score >= 70 }">
                    {{ imageryVerification.metaphorMatch?.score || 0 }}
                  </span>
                </div>
                <div class="mini-bar">
                  <div 
                    class="mini-fill" 
                    :style="{ width: (imageryVerification.metaphorMatch?.score || 0) + '%' }"
                    :class="{ low: imageryVerification.metaphorMatch?.score < 70 }"
                  ></div>
                </div>
                <div class="match-details" v-if="imageryVerification.metaphorMatch">
                  <div class="detail-group" v-if="imageryVerification.metaphorMatch.matchedElements?.length">
                    <span class="detail-icon success">✓</span>
                    <div class="detail-tags">
                      <span class="mini-tag success" v-for="el in imageryVerification.metaphorMatch.matchedElements" :key="el">{{ el }}</span>
                    </div>
                  </div>
                  <div class="detail-group" v-if="imageryVerification.metaphorMatch.missingElements?.length">
                    <span class="detail-icon error">✗</span>
                    <div class="detail-tags">
                      <span class="mini-tag error" v-for="el in imageryVerification.metaphorMatch.missingElements" :key="el">{{ el }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 结构匹配 -->
              <div class="structure-match-card" v-if="imageryVerification.structureMatch">
                <div class="card-title">
                  <span>结构匹配</span>
                  <span class="mini-score" :class="{ high: imageryVerification.structureMatch?.isMatched }">
                    {{ imageryVerification.structureMatch?.isMatched ? '✓' : '✗' }}
                  </span>
                </div>
                <div class="structure-rows">
                  <div class="structure-row">
                    <span class="row-label">区域</span>
                    <span class="row-expected">{{ imageryVerification.structureMatch.expectedZoneCount }}</span>
                    <span class="row-arrow">→</span>
                    <span class="row-actual" :class="{ mismatch: imageryVerification.structureMatch.expectedZoneCount != imageryVerification.structureMatch.actualZoneCount }">
                      {{ imageryVerification.structureMatch.actualZoneCount }}
                    </span>
                  </div>
                  <div class="structure-row">
                    <span class="row-label">关系</span>
                    <span class="row-expected">{{ imageryVerification.structureMatch.expectedRelationship }}</span>
                    <span class="row-arrow">→</span>
                    <span class="row-actual" :class="{ mismatch: imageryVerification.structureMatch.expectedRelationship != imageryVerification.structureMatch.actualRelationship }">
                      {{ imageryVerification.structureMatch.actualRelationship }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 实际描述 -->
            <div class="actual-description-compact">
              <span class="desc-label">实际呈现</span>
              <p>{{ imageryVerification.actualDescription }}</p>
            </div>
            
            <!-- 改进建议区 -->
            <div class="suggestions-action-section" v-if="imageryVerification.suggestions?.length">
              <div class="suggestions-header">
                <div class="suggestions-title-group">
                  <span class="suggestions-icon">◇</span>
                  <span class="section-title">优化建议</span>
                </div>
                <span class="suggestions-count">{{ imageryVerification.suggestions.length }} 条待改进</span>
              </div>
              <div class="suggestions-list">
                <div class="suggestion-item" v-for="(s, i) in imageryVerification.suggestions" :key="i">
                  <span class="suggestion-num">{{ i + 1 }}</span>
                  <span class="suggestion-text">{{ s }}</span>
                </div>
              </div>
              
              <!-- 操作按钮组 -->
              <div class="action-btn-group">
                <button 
                  class="action-btn regenerate" 
                  @click="handleRegenerateWithSuggestions"
                  :disabled="regenerateLoading"
                >
                  <span class="btn-icon">
                    <svg v-if="!regenerateLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M23 4v6h-6"></path>
                      <path d="M1 20v-6h6"></path>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <span class="spinner" v-else></span>
                  </span>
                  <span class="btn-label">
                    <span class="btn-main">{{ regenerateLoading ? '重新生成中...' : '重新生成' }}</span>
                    <span class="btn-sub">完全重建提示词</span>
                  </span>
                </button>

                <button
                  class="action-btn edit"
                  @click="handleEditWithSuggestions"
                  :disabled="editLoading || !imageUrl"
                >
                  <span class="btn-icon">
                    <svg v-if="!editLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                    </svg>
                    <span class="spinner" v-else></span>
                  </span>
                  <span class="btn-label">
                    <span class="btn-main">{{ editLoading ? '参考图改图中...' : '参考图改图' }}</span>
                    <span class="btn-sub">基于当前图+建议微调</span>
                  </span>
                </button>
              </div>
            </div>

            <!-- 参考图改图结果区 -->
            <div class="edit-section" v-if="editPrompt || editStatus || editImageUrl">
              <div class="edit-section-header">
                <div class="edit-section-title">
                  <span class="edit-icon">✎</span>
                  <span>参考图改图</span>
                </div>
                <div class="edit-status-badge" :class="{ pending: editStatus && !editImageUrl, done: editImageUrl }">
                  <span class="status-dot"></span>
                  <span>{{ editImageUrl ? '已完成' : (editStatus ? '改图中' : '待执行') }}</span>
                </div>
              </div>

              <!-- 改图提示词 -->
              <div class="edit-prompt-block" v-if="editPrompt">
                <div class="prompt-header">
                  <span class="prompt-label-icon">⟡</span>
                  <span class="prompt-label-text">改图指令</span>
                </div>
                <div class="prompt-content">
                  <p>{{ editPrompt }}</p>
                </div>
                <div class="prompt-note">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                  <span>以当前图片为参考，仅针对建议点进行修改</span>
                </div>
              </div>

              <!-- 改图进度 -->
              <div class="edit-progress-block" v-if="editStatus && !editImageUrl">
                <div class="progress-visual">
                  <div class="progress-ring">
                    <svg viewBox="0 0 44 44">
                      <circle class="ring-bg" cx="22" cy="22" r="18" />
                      <circle class="ring-fill" cx="22" cy="22" r="18" 
                        :style="{ strokeDashoffset: 113 - (113 * (editStatus.progress || 0) / 100) }" />
                    </svg>
                    <span class="progress-percent">{{ editStatus.progress || 0 }}%</span>
                  </div>
                  <div class="progress-info">
                    <span class="progress-status">{{ editStatus.status === 'pending' ? '排队等待' : (editStatus.status === 'processing' ? '正在改图' : editStatus.status) }}</span>
                    <span class="progress-hint">基于参考图进行智能微调...</span>
                  </div>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (editStatus.progress || 0) + '%' }"></div>
                </div>
              </div>

              <!-- 对比结果 -->
              <div class="edit-result-block" v-if="editImageUrl">
                <div class="result-header">
                  <span class="result-label">改图对比</span>
                  <span class="result-badge">✓ 改图完成</span>
                </div>
                <div class="result-compare">
                  <div class="compare-item original">
                    <span class="compare-label">原图</span>
                    <div class="compare-img-wrap">
                      <img :src="imageUrl" alt="原图" />
                    </div>
                  </div>
                  <div class="compare-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                  <div class="compare-item edited">
                    <span class="compare-label">改图后</span>
                    <div class="compare-img-wrap">
                      <img :src="editImageUrl" alt="改图后" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-if="!showOutput">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <p>输入播客内容并开始分析</p>
          <span>点击"分析内容"开始</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const podcastContent = ref('');
const textareaFocused = ref(false);

const analyzeLoading = ref(false);
const generateLoading = ref(false);
const generateLoadingText = ref('提交中...');
const evaluateLoading = ref(false);
const verifyLoading = ref(false);
const regenerateLoading = ref(false);
const editLoading = ref(false);
const generateCancelled = ref(false);
const showTimeoutWarning = ref(false);

const analysisResult = ref(null);
const structureParams = ref(null);
const strongLayoutVars = ref(null);  // V6 新增：三类骨架强变量
const designLogic = ref(null);
const degreeSelection = ref(null);
const selectedDegreeKey = ref('');
const generatedPrompt = ref(null);
const imageStatus = ref(null);
const imageUrl = ref('');
const evaluation = ref(null);
const imageryVerification = ref(null);
const editPrompt = ref('');
const editStatus = ref(null);
const editImageUrl = ref('');
const currentRecordId = ref('');
const showDecisionTrace = ref(false);

const evalItems = {
  complexity: { label: '结构快检' },
  color: { label: '颜色快检' },
  abstraction: { label: '抽象快检' },
  aesthetic: { label: '品质快检' }
};

const canAnalyze = computed(() => podcastContent.value.trim());
const showOutput = computed(() => analysisResult.value || generatedPrompt.value || imageStatus.value || evaluation.value);

const influenceLevel = computed(() => {
  const score = designLogic.value?.contentInfluenceScore || 0;
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
});


const currentStep = computed(() => {
  if (evaluation.value) return 3;
  if (imageUrl.value) return 3;
  if (imageStatus.value) return 2;
  if (generatedPrompt.value) return 2;
  if (analysisResult.value) return 1;
  return 1;
});

const statusText = computed(() => {
  const s = imageStatus.value?.status;
  if (s === 'submitted' || s === 'pending') return '等待处理';
  if (s === 'processing') return '生成中';
  if (s === 'completed') return '已完成';
  if (s === 'failed') return '失败';
  return s;
});

const totalScore = computed(() => {
  if (!evaluation.value) return 0;
  if (evaluation.value.total !== undefined) return evaluation.value.total;
  // 自动计算：四维平均分
  const e = evaluation.value;
  const scores = [
    e.complexity?.score,
    e.color?.score,
    e.abstraction?.score,
    e.aesthetic?.score
  ].filter(s => typeof s === 'number');
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
});

const scoreOffset = computed(() => {
  const circumference = 2 * Math.PI * 52;
  return circumference - (totalScore.value / 100) * circumference;
});

const loaderOffset = computed(() => {
  const circumference = 2 * Math.PI * 20;
  const progress = imageStatus.value?.progress || 0;
  return circumference - (progress / 100) * circumference;
});

const loaderStatusText = computed(() => {
  const status = imageStatus.value?.status;
  const progress = imageStatus.value?.progress || 0;
  if (generateCancelled.value) return '已取消';
  if (status === 'completed') return '生成完成';
  if (status === 'processing') return `生成中 ${progress}%`;
  if (status === 'pending' || status === 'submitted') {
    if (showTimeoutWarning.value) return '排队时间较长...';
    return '排队中...';
  }
  if (status === 'failed') return '生成失败';
  return '准备中...';
});

async function handleAnalyze() {
  if (!canAnalyze.value || analyzeLoading.value) return;
  
  analyzeLoading.value = true;
  analysisResult.value = null;
  structureParams.value = null;
  strongLayoutVars.value = null;  // V6 新增
  designLogic.value = null;
  degreeSelection.value = null;
  selectedDegreeKey.value = '';
  generatedPrompt.value = null;
  imageStatus.value = null;
  imageUrl.value = null;
  evaluation.value = null;
  imageryVerification.value = null;
  editPrompt.value = '';
  editStatus.value = null;
  editImageUrl.value = '';
  showDecisionTrace.value = false;

  try {
    // 使用异步任务模式，彻底避免反向代理 60s 超时导致 504
    const res = await axios.post('/api/generate-prompt?async=1', {
      podcastContent: podcastContent.value
    });

    const payload = res.data.data;

    // 异步：返回 taskId → 轮询 /api/task/:taskId
    if (payload?.taskId) {
      const final = await pollPromptTaskStatus(payload.taskId);
      const data = final?.result || null;
      if (!data) throw new Error(final?.error || '分析失败：任务未返回结果');

      analysisResult.value = data.analysis;
      structureParams.value = data.structureParams;
      degreeSelection.value = data.degreeSelection || null;
      selectedDegreeKey.value = data.degreeKey || degreeSelection.value?.degreeKey || '';

      // V6 新增：提取三类骨架强变量
      strongLayoutVars.value = data.strongLayoutVars || {
        topologicalLayout: data.analysis?.topologicalLayout,
        primaryRelationship: data.analysis?.primaryRelationship,
        rhythmSignature: data.analysis?.rhythmSignature,
        physicalMetaphor: data.analysis?.physicalMetaphor
      };

      designLogic.value = {
        degreeInfo: data.degreeInfo,
        contentSignature: data.contentSignature,
        antiClicheCheck: data.antiClicheCheck,  // V6 更新：反先验验证
        degreeBiasApplication: data.degreeBiasApplication,
        warnings: data.warnings,
        constraintCheck: data.constraintCheck,
        geometryDescription: data.geometryDescription,
        colorLogic: data.colorLogic
      };

      generatedPrompt.value = {
        prompt: data.prompt,
        negative_prompt: data.negative_prompt
      };
      return;
    }

    // 同步兜底（本地开发/无需反代时）
    const data = payload;
    analysisResult.value = data.analysis;
    structureParams.value = data.structureParams;
    degreeSelection.value = data.degreeSelection || null;
    selectedDegreeKey.value = data.degreeKey || degreeSelection.value?.degreeKey || '';
    
    // V6 新增：提取三类骨架强变量
    strongLayoutVars.value = data.strongLayoutVars || {
      topologicalLayout: data.analysis?.topologicalLayout,
      primaryRelationship: data.analysis?.primaryRelationship,
      rhythmSignature: data.analysis?.rhythmSignature,
      physicalMetaphor: data.analysis?.physicalMetaphor
    };
    
    designLogic.value = {
      degreeInfo: data.degreeInfo,
      contentSignature: data.contentSignature,
      antiClicheCheck: data.antiClicheCheck,  // V6 更新：反先验验证
      degreeBiasApplication: data.degreeBiasApplication,
      warnings: data.warnings,
      constraintCheck: data.constraintCheck
    };
    generatedPrompt.value = {
      prompt: data.prompt,
      negative_prompt: data.negative_prompt
    };
  } catch (e) {
    console.error('分析失败', e);
    alert('分析失败: ' + (e.response?.data?.error || e.message));
  } finally {
    analyzeLoading.value = false;
  }
}

async function pollPromptTaskStatus(taskId) {
  const maxAttempts = 60;  // 5分钟（60 * 5s）
  const interval = 5000;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, interval));
    try {
      const res = await axios.get(`/api/task/${taskId}`);
      const t = res.data.data;
      if (t?.status === 'completed') return t;
      if (t?.status === 'failed') throw new Error(t?.error || '分析任务失败');
    } catch (e) {
      if (i >= maxAttempts - 3) console.error('轮询分析任务失败', e);
    }
  }

  throw new Error('分析超时（5分钟），请重试');
}

async function handleEditWithSuggestions() {
  if (!imageUrl.value || !imageryVerification.value?.suggestions?.length || editLoading.value) return;
  if (!selectedDegreeKey.value) {
    alert('缺少自动选度结果，请先重新分析内容');
    return;
  }
  editLoading.value = true;
  editPrompt.value = '';
  editStatus.value = { status: 'submitted', progress: 0 };
  editImageUrl.value = '';

  try {
    const res = await axios.post('/api/edit-image', {
      imageUrl: imageUrl.value,
      recordId: currentRecordId.value,
      degree: selectedDegreeKey.value,
      analysisResult: analysisResult.value,
      originalPrompt: generatedPrompt.value?.prompt,
      negativePrompt: generatedPrompt.value?.negative_prompt,
      imageryVerification: imageryVerification.value
    });

    const data = res.data.data;
    editPrompt.value = data.editPrompt || '';

    if (data.status === 'completed' && data.imageUrl) {
      editStatus.value = { status: 'completed', progress: 100 };
      editImageUrl.value = data.imageUrl;
      return;
    }

    const taskId = data.taskId;
    if (taskId) {
      const final = await pollEditTaskStatus(taskId);
      if (final?.imageUrl) editImageUrl.value = final.imageUrl;
    }
  } catch (e) {
    console.error('改图失败', e);
    alert('改图失败: ' + (e.response?.data?.error || e.message));
  } finally {
    editLoading.value = false;
  }
}

async function handleGenerateImage() {
  if (!generatedPrompt.value || generateLoading.value) return;
  if (!selectedDegreeKey.value) {
    alert('缺少自动选度结果，请先重新分析内容');
    return;
  }
  
  generateLoading.value = true;
  generateLoadingText.value = '提交中...';
  generateCancelled.value = false;
  showTimeoutWarning.value = false;

  try {
    const imageRes = await axios.post('/api/generate-image', {
      prompt: generatedPrompt.value.prompt,
      negativePrompt: generatedPrompt.value.negative_prompt,
      degree: selectedDegreeKey.value,
      podcastContent: podcastContent.value,
      analysis: analysisResult.value,
      geometryDescription: designLogic.value?.geometryDescription,
      colorLogic: designLogic.value?.colorLogic
    });
    
    const resData = imageRes.data.data;
    const taskId = resData.taskId;
    currentRecordId.value = resData.recordId;
    
    // 同步模式：直接返回了图片URL
    if (resData.status === 'completed' && resData.imageUrl) {
      imageStatus.value = { status: 'completed' };
      imageUrl.value = resData.imageUrl;
      return;
    }
    
    imageStatus.value = { status: 'submitted' };
    generateLoadingText.value = '排队中...';
    const result = await pollTaskStatus(taskId);
    if (result?.cancelled) {
      // 用户取消了生成
      return;
    }
  } catch (e) {
    if (!generateCancelled.value) {
      console.error('生成失败', e);
      alert('生成失败: ' + (e.response?.data?.error || e.message));
    }
  } finally {
    generateLoading.value = false;
    showTimeoutWarning.value = false;
  }
}

async function handleEvaluate() {
  if (!imageUrl.value || evaluateLoading.value) return;
  
  evaluateLoading.value = true;

  try {
    const evalRes = await axios.post('/api/evaluate', {
      imageUrl: imageUrl.value,
      recordId: currentRecordId.value
    });
    evaluation.value = evalRes.data.data;
  } catch (e) {
    console.error('评估失败', e);
    alert('评估失败: ' + (e.response?.data?.error || e.message));
  } finally {
    evaluateLoading.value = false;
  }
}

async function handleVerifyImagery() {
  if (!imageUrl.value || verifyLoading.value) return;
  
  verifyLoading.value = true;

  try {
    // 构建分析结果，包含骨架强变量
    const analysisForVerify = {
      ...analysisResult.value,
      ...(strongLayoutVars.value || {}),
      contentEssence: analysisResult.value?.contentEssence || ''
    };
    
    const verifyRes = await axios.post('/api/verify-imagery', {
      imageUrl: imageUrl.value,
      analysisResult: analysisForVerify,
      recordId: currentRecordId.value
    });
    imageryVerification.value = verifyRes.data.data;
  } catch (e) {
    console.error('意象校验失败', e);
    alert('意象校验失败: ' + (e.response?.data?.error || e.message));
  } finally {
    verifyLoading.value = false;
  }
}

// 根据意象校验的改进建议重新生成图片
async function handleRegenerateWithSuggestions() {
  if (!imageryVerification.value?.suggestions?.length || regenerateLoading.value) return;
  if (!selectedDegreeKey.value) {
    alert('缺少自动选度结果，请先重新分析内容');
    return;
  }
  
  regenerateLoading.value = true;
  generateCancelled.value = false;
  showTimeoutWarning.value = false;
  
  try {
    // 重新生成提示词，携带改进建议
    const promptRes = await axios.post('/api/generate-prompt', {
      podcastContent: podcastContent.value,
      analysisResult: analysisResult.value,
      degree: selectedDegreeKey.value,
      improvementSuggestions: imageryVerification.value.suggestions,
      previousIssues: {
        isLeftRightDual: imageryVerification.value.isLeftRightDual,
        missingElements: imageryVerification.value.metaphorMatch?.missingElements || [],
        actualDescription: imageryVerification.value.actualDescription
      }
    });
    
    // 修复：正确提取返回的 prompt 数据
    const promptData = promptRes.data.data;
    generatedPrompt.value = {
      prompt: promptData.prompt,
      negative_prompt: promptData.negative_prompt
    };
    
    // 更新骨架强变量（如果有变化）
    if (promptData.strongLayoutVars) {
      strongLayoutVars.value = promptData.strongLayoutVars;
    }
    
    // 清空上次的图片和评估结果
    imageUrl.value = '';
    evaluation.value = null;
    imageryVerification.value = null;
    
    // 重新生成图片
    generateLoading.value = true;
    generateLoadingText.value = '提交中...';
    
    const imageRes = await axios.post('/api/generate-image', {
      prompt: generatedPrompt.value.prompt,
      negativePrompt: generatedPrompt.value.negative_prompt,
      degree: selectedDegreeKey.value,
      podcastContent: podcastContent.value,
      analysis: analysisResult.value
    });
    
    const resData = imageRes.data.data;
    currentRecordId.value = resData.recordId;
    
    if (resData.status === 'completed' && resData.imageUrl) {
      imageUrl.value = resData.imageUrl;
      imageStatus.value = { status: 'completed' };
      generateLoading.value = false;
    } else if (resData.taskId) {
      const taskId = resData.taskId;
      imageStatus.value = { status: 'pending', progress: 0 };
      
      const result = await pollTaskStatus(taskId);
      if (result?.cancelled) {
        // 用户取消了
        return;
      }
      if (result?.imageUrl) {
        imageUrl.value = result.imageUrl;
      }
      generateLoading.value = false;
    }
  } catch (e) {
    console.error('重新生成失败', e);
    alert('重新生成失败: ' + (e.response?.data?.error || e.message));
  } finally {
    regenerateLoading.value = false;
    generateLoading.value = false;
  }
}

function cancelGeneration() {
  generateCancelled.value = true;
  generateLoading.value = false;
  imageStatus.value = null;
}

async function pollTaskStatus(taskId) {
  const maxAttempts = 60;  // 60 次
  const interval = 5000;   // 5 秒，减少请求频率
  const warningThreshold = 12; // 60秒后显示超时警告
  
  for (let i = 0; i < maxAttempts; i++) {
    // 检查是否已取消
    if (generateCancelled.value) {
      return { cancelled: true };
    }
    
    await new Promise(r => setTimeout(r, interval));
    
    // 再次检查取消状态
    if (generateCancelled.value) {
      return { cancelled: true };
    }
    
    // 超过阈值显示警告
    if (i >= warningThreshold && !showTimeoutWarning.value) {
      showTimeoutWarning.value = true;
    }
    
    try {
      const res = await axios.get(`/api/task/${taskId}`);
      const data = res.data.data;
      imageStatus.value = data;
      
      // 更新加载文本显示进度
      if (data.progress > 0) {
        generateLoadingText.value = `生成中... ${data.progress}%`;
        showTimeoutWarning.value = false; // 有进度就取消警告
      } else {
        const elapsed = Math.floor((i + 1) * interval / 1000);
        generateLoadingText.value = `排队中... ${elapsed}秒`;
      }
      
      if (data.status === 'completed' && data.imageUrl) {
        imageUrl.value = data.imageUrl;
        showTimeoutWarning.value = false;
        return data;
      }
      
      if (data.status === 'failed') {
        throw new Error(data.error || '生成失败');
      }
    } catch (e) {
      // 只有在最后几次尝试时才报错
      if (i >= maxAttempts - 3) {
        console.error('查询状态失败', e);
      }
    }
  }
  
  throw new Error('生成超时（5分钟），请重试');
}

async function pollEditTaskStatus(taskId) {
  const maxAttempts = 60;
  const interval = 5000;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, interval));
    try {
      const res = await axios.get(`/api/task/${taskId}`);
      const data = res.data.data;
      editStatus.value = data;
      if (data.status === 'completed' && data.imageUrl) return data;
      if (data.status === 'failed') throw new Error(data.error || '改图失败');
    } catch (e) {
      if (i >= maxAttempts - 3) console.error('查询改图状态失败', e);
    }
  }
  throw new Error('改图超时（5分钟），请重试');
}

function copyPrompt() {
  const text = `${generatedPrompt.value.prompt}\n\n--no ${generatedPrompt.value.negative_prompt}`;
  navigator.clipboard.writeText(text);
}
</script>

