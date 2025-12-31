<template>
  <div class="app">
    <NavBar :current-view="currentView" @change-view="setView" />
    
    <main class="main-container">
      <keep-alive>
        <component :is="currentViewComponent" />
      </keep-alive>
    </main>

    <footer class="footer">
      <p>基于六度智慧 · 生成风格统一的播客封面</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NavBar from './components/NavBar.vue';
import GeneratorView from './components/GeneratorView.vue';
import DocView from './components/DocView.vue';
import TechDocView from './components/TechDocView.vue';

const currentView = ref('generator');

const setView = (view) => {
  currentView.value = view;
  window.scrollTo(0, 0);
};

const currentViewComponent = computed(() => {
  if (currentView.value === 'generator') return GeneratorView;
  if (currentView.value === 'docs') return DocView;
  if (currentView.value === 'tech') return TechDocView;
  return GeneratorView;
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  color-scheme: light;
  --primary: #088350;
  --primary-light: #0a9960;
  --primary-bg: rgba(8, 131, 80, 0.08);
  --bg: #F2F2F2;
  --card: #FFFFFF;
  --text: #1d1d1f;
  --text-secondary: #86868b;
  --border: #d2d2d7;
  --border-light: #e8e8ed;
  --error: #ff3b30;
  --success: #088350;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.04);
  --radius: 12px;
  --radius-lg: 16px;
  --transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Noto Sans SC', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.app { min-height: 100vh; display: flex; flex-direction: column; }
.main-container { flex: 1; width: 100%; }

/* --- Generator View Styles (Global for now) --- */

/* Main Layout */
.main { padding: 40px; max-width: 1280px; margin: 0 auto; width: 100%; } /* Re-added .main class for GeneratorView structure */
.steps { display: flex; align-items: center; justify-content: center; gap: 0; margin: 40px 0; }
.step { display: flex; align-items: center; gap: 8px; opacity: 0.4; transition: var(--transition); }
.step.active { opacity: 1; }
.step-dot { width: 28px; height: 28px; border-radius: 50%; background: var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }
.step.active .step-dot { background: var(--primary); color: white; }
.step.done .step-dot { background: var(--primary); color: white; }
.step-line { width: 60px; height: 2px; background: var(--border); margin: 0 16px; }
.step-line.active { background: var(--primary); }

.content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; max-width: 1280px; margin: 0 auto; padding: 0 40px 40px; }
.card { background: var(--card); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; transition: var(--transition); }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border-light); }
.card-body { padding: 24px; }
.card-header h2 { font-size: 0.9rem; font-weight: 600; }
.hint { font-size: 0.8rem; color: var(--text-secondary); }

.input-panel { position: sticky; top: 100px; } /* Adjusted top for NavBar */
.textarea-wrapper { position: relative; margin-bottom: 24px; }
textarea { width: 100%; padding: 16px; border: none; border-radius: var(--radius); font-size: 0.95rem; background: var(--bg); resize: none; }
textarea:focus { outline: none; background: #EAEAEA; }
.textarea-border { position: absolute; inset: 0; border-radius: var(--radius); border: 2px solid transparent; pointer-events: none; transition: var(--transition); }
.textarea-border.focused { border-color: var(--primary); }

.degree-section { margin-bottom: 20px; }
.degree-section h3 { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 12px; }
.degree-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.degree-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 16px 12px; border: 1.5px solid var(--border-light); border-radius: var(--radius); background: var(--card); cursor: pointer; transition: var(--transition); }
.degree-card.selected { border-color: var(--primary); background: var(--primary-bg); }
.degree-name { font-size: 1rem; font-weight: 600; color: var(--text); }
.degree-theme { font-size: 0.7rem; color: var(--text-secondary); text-align: center; }
.degree-check { position: absolute; top: 6px; right: 6px; width: 18px; height: 18px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0.5); transition: var(--transition); }
.degree-check svg { width: 10px; height: 10px; color: white; }
.degree-card.selected .degree-check { opacity: 1; transform: scale(1); }

.primary-btn { width: 100%; padding: 16px 24px; border: none; border-radius: var(--radius); background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); color: white; font-size: 1rem; font-weight: 600; cursor: pointer; position: relative; overflow: hidden; }
.primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-content { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 10px; }
.btn-content svg { width: 20px; height: 20px; }
.spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.output-panel { display: flex; flex-direction: column; gap: 20px; }
.analysis-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 500; background: var(--primary-bg); color: var(--primary); }
.variant-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); color: white; }
.variant-desc { font-weight: 500; color: var(--primary); background: var(--primary-bg); padding: 8px 12px; border-radius: var(--radius); display: inline-block; }
.mapping-item { padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border-light); }
.content-mapping { font-size: 0.95rem; line-height: 1.8; color: var(--text); background: linear-gradient(135deg, rgba(8,131,80,0.03), rgba(8,131,80,0.08)); padding: 12px 16px; border-radius: var(--radius); border-left: 3px solid var(--primary); }
.recommended-variants { display: flex; gap: 8px; flex-wrap: wrap; }
.variant-tag { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; background: var(--bg); color: var(--text-secondary); transition: var(--transition); }
.variant-tag.selected { background: var(--primary); color: white; }
.constraint-item { padding-top: 16px; margin-top: 16px; border-top: 1px solid var(--border-light); }
.constraint-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
.constraint-cell { display: flex; flex-direction: column; align-items: center; padding: 8px; border-radius: var(--radius); background: var(--bg); }
.constraint-cell.pass { background: rgba(8,131,80,0.1); }
.constraint-cell:not(.pass) { background: rgba(255,59,48,0.1); }
.constraint-name { font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 2px; }
.constraint-value { font-size: 0.85rem; font-weight: 600; }
.constraint-cell.pass .constraint-value { color: var(--primary); }
.constraint-cell:not(.pass) .constraint-value { color: var(--error); }

/* Skeleton Card */
.skeleton-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.65rem; font-weight: 600; background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; }
.physical-metaphor { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.08)); border-radius: var(--radius); margin-bottom: 16px; border-left: 3px solid #f59e0b; }
.metaphor-icon { font-size: 1.1rem; color: #f59e0b; }
.metaphor-text { font-size: 0.95rem; font-weight: 500; color: var(--text); line-height: 1.5; }
.strong-vars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.strong-var-card { background: var(--bg); border-radius: var(--radius); padding: 14px; border: 1px solid var(--border-light); }
.var-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border-light); }
.var-number { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.var-title { font-size: 0.8rem; font-weight: 600; color: var(--text); }
.var-content { display: flex; flex-direction: column; gap: 8px; }
.var-row { display: flex; justify-content: space-between; align-items: center; }
.var-label { font-size: 0.7rem; color: var(--text-secondary); }
.var-value { font-size: 0.8rem; font-weight: 500; color: var(--text); }
.var-value.highlight { font-weight: 700; color: #ea580c; background: rgba(234,88,12,0.1); padding: 2px 8px; border-radius: 10px; }
.var-reason { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5; margin: 4px 0 0; padding-top: 8px; border-top: 1px dashed var(--border-light); }

/* Anti-Cliche */
.anti-cliche-check { padding: 14px; background: var(--bg); border-radius: var(--radius); margin-bottom: 16px; border: 1px solid var(--border-light); }
.anti-cliche-check.triggered { background: rgba(8,131,80,0.05); border-color: rgba(8,131,80,0.2); }
.acc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.acc-title { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; }
.acc-badge { padding: 3px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; background: rgba(107,114,128,0.1); color: #6b7280; }
.acc-badge.triggered { background: var(--primary-bg); color: var(--primary); }
.acc-content { display: flex; flex-direction: column; gap: 8px; }
.acc-row { display: flex; align-items: center; gap: 8px; }
.acc-label { font-size: 0.75rem; color: var(--text-secondary); min-width: 70px; }
.acc-value { font-size: 0.8rem; font-weight: 500; padding: 2px 10px; border-radius: 10px; }
.acc-value.cliche { background: rgba(239,68,68,0.1); color: #dc2626; text-decoration: line-through; }
.acc-value.avoided { background: var(--primary-bg); color: var(--primary); }
.acc-how { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin: 8px 0 0; padding-top: 8px; border-top: 1px dashed var(--border-light); }
.acc-skeleton-check { display: flex; align-items: center; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-light); }
.skeleton-check-label { font-size: 0.75rem; color: var(--text-secondary); }
.skeleton-check-value { font-size: 0.8rem; font-weight: 600; }
.skeleton-check-value.pass { color: var(--primary); }
.skeleton-check-value:not(.pass) { color: #dc2626; }

/* Influence Badge */
.influence-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
.influence-badge.high { background: var(--primary-bg); color: var(--primary); }
.influence-badge.medium { background: rgba(251,191,36,0.15); color: #d97706; }
.influence-badge.low { background: rgba(239,68,68,0.1); color: #dc2626; }
.influence-detail { padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border-light); }
.influence-text { font-size: 0.9rem; line-height: 1.6; color: var(--text); background: var(--primary-bg); padding: 10px 14px; border-radius: var(--radius); margin: 0; }

/* Degree Bias */
.degree-bias { padding: 14px; background: linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.08)); border-radius: var(--radius); margin-bottom: 16px; border: 1px solid rgba(99,102,241,0.15); }
.bias-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.bias-hint { font-size: 0.7rem; color: var(--text-secondary); font-style: italic; }
.degree-info { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.degree-name-badge { padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
.degree-theme-text { font-size: 0.85rem; color: var(--text-secondary); }
.bias-applied { padding-top: 10px; border-top: 1px solid rgba(99,102,241,0.1); }
.bias-label { font-size: 0.75rem; color: var(--text-secondary); display: block; margin-bottom: 6px; }
.bias-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.bias-tag { padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; background: rgba(99,102,241,0.1); color: #6366f1; }
.bias-detail { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

/* Spiritual Tone */
.spiritual-tone { display: flex; align-items: center; justify-content: center; padding: 16px; background: linear-gradient(135deg, rgba(8,131,80,0.05), rgba(8,131,80,0.1)); border-radius: var(--radius); margin-bottom: 20px; }
.tone-item { display: flex; flex-direction: column; align-items: center; }
.tone-label { font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
.tone-value { font-size: 1.1rem; font-weight: 600; color: var(--primary); font-family: 'SF Pro Display', sans-serif; }
.tone-separator { width: 1px; height: 24px; background: rgba(8,131,80,0.2); margin: 0 32px; }

/* Analysis Item */
.analysis-item { margin-bottom: 12px; }
.analysis-label { font-size: 0.75rem; font-weight: 500; color: var(--text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px; }
.analysis-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; background: var(--bg); }
.tag.accent { background: var(--primary-bg); color: var(--primary); }
.tension-flow { display: flex; align-items: center; gap: 10px; }
.tension-flow svg { width: 20px; height: 20px; color: var(--primary); }
.tension-from, .tension-to { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; background: var(--bg); }

/* Design Item */
.design-item { margin-bottom: 16px; }
.design-label { font-size: 0.75rem; font-weight: 500; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 6px; display: block; }
.design-item p { font-size: 0.9rem; line-height: 1.6; }

/* Prompt Block */
.prompt-block { padding: 16px; background: var(--bg); border-radius: var(--radius); margin-bottom: 12px; }
.prompt-label { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; }
.label-dot { width: 8px; height: 8px; border-radius: 50%; }
.label-dot.positive { background: var(--primary); }
.label-dot.negative { background: var(--error); }
.prompt-block p { font-size: 0.85rem; line-height: 1.6; }
.generate-btn, .evaluate-btn { margin-top: 16px; }

/* Secondary Button */
.secondary-btn { width: 100%; padding: 14px 24px; border: 2px solid var(--primary); border-radius: var(--radius); background: transparent; color: var(--primary); font-size: 0.95rem; font-weight: 600; cursor: pointer; margin-top: 12px; transition: var(--transition); }
.secondary-btn:hover { background: var(--primary-bg); }
.secondary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.verify-btn .btn-content { display: flex; align-items: center; justify-content: center; gap: 8px; }
.verify-btn svg { width: 18px; height: 18px; }

/* Imagery Card */
.imagery-score-badge { 
  padding: 6px 16px; 
  border-radius: 20px; 
  font-size: 1rem; 
  font-weight: 700; 
  background: rgba(239,68,68,0.1); 
  color: #dc2626; 
}
.imagery-score-badge.pass { background: rgba(8,131,80,0.1); color: var(--primary); }

.imagery-verdict-header { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-light); }
.verdict-status { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 24px; font-weight: 600; font-size: 0.9rem; background: rgba(239,68,68,0.1); color: #dc2626; margin-bottom: 10px; }
.verdict-status.pass { background: rgba(8,131,80,0.1); color: var(--primary); }
.verdict-status .status-icon { font-size: 1rem; }
.verdict-summary { font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); margin: 0; }

.dual-warning { display: flex; gap: 12px; padding: 14px 16px; background: rgba(239,68,68,0.06); border-radius: var(--radius); margin-bottom: 20px; border-left: 4px solid #dc2626; }
.dual-warning .warning-icon { font-size: 1.3rem; }
.dual-warning .warning-title { font-size: 0.85rem; font-weight: 600; color: #dc2626; margin-bottom: 4px; display: block; }
.dual-warning p { font-size: 0.8rem; color: #7f1d1d; line-height: 1.5; margin: 0; }

.imagery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
@media (max-width: 600px) { .imagery-grid { grid-template-columns: 1fr; } }

.imagery-match-card, .structure-match-card { padding: 16px; background: var(--bg); border-radius: var(--radius); border: 1px solid var(--border-light); }
.card-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.8rem; font-weight: 600; color: var(--text); }
.mini-score { font-size: 1rem; font-weight: 700; color: #dc2626; }
.mini-score.high { color: var(--primary); }

.mini-bar { height: 6px; background: var(--border-light); border-radius: 3px; overflow: hidden; margin-bottom: 14px; }
.mini-fill { height: 100%; background: var(--primary); border-radius: 3px; transition: width 0.5s ease; }
.mini-fill.low { background: #dc2626; }

.match-details { display: flex; flex-direction: column; gap: 10px; }
.detail-group { display: flex; gap: 8px; align-items: flex-start; }
.detail-icon { font-size: 0.75rem; font-weight: 700; width: 18px; flex-shrink: 0; }
.detail-icon.success { color: var(--primary); }
.detail-icon.error { color: #dc2626; }
.detail-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.mini-tag { font-size: 0.7rem; padding: 3px 8px; border-radius: 10px; font-weight: 500; }
.mini-tag.success { background: rgba(8,131,80,0.1); color: var(--primary); }
.mini-tag.error { background: rgba(239,68,68,0.1); color: #dc2626; }

.structure-rows { display: flex; flex-direction: column; gap: 8px; }
.structure-row { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; padding: 8px 10px; background: var(--card-bg); border-radius: 6px; }
.row-label { font-weight: 500; color: var(--text); min-width: 36px; }
.row-expected { color: var(--text-secondary); }
.row-arrow { color: var(--text-muted); font-size: 0.75rem; }
.row-actual { color: var(--primary); font-weight: 600; }
.row-actual.mismatch { color: #dc2626; }

.actual-description-compact { margin-bottom: 20px; }
.desc-label { font-size: 0.7rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; display: block; margin-bottom: 8px; }
.actual-description-compact p { font-size: 0.85rem; line-height: 1.6; color: var(--text); background: var(--bg); padding: 12px 14px; border-radius: var(--radius); margin: 0; }

.suggestions-action-section { background: linear-gradient(135deg, rgba(245,158,11,0.04), rgba(249,115,22,0.06)); border-radius: var(--radius); padding: 16px; border: 1px solid rgba(245,158,11,0.15); }
.suggestions-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.suggestions-header .section-title { margin: 0; font-size: 0.75rem; font-weight: 600; color: var(--text); text-transform: uppercase; }
.suggestions-count { font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; background: rgba(245,158,11,0.15); color: #d97706; font-weight: 600; }

.suggestions-compact { list-style: none; padding: 0; margin: 0 0 16px 0; display: flex; flex-direction: column; gap: 6px; }
.suggestions-compact li { font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary); padding: 8px 10px; background: rgba(255,255,255,0.6); border-radius: 6px; border-left: 3px solid #f59e0b; }

.regenerate-btn { width: 100%; padding: 12px; border-radius: var(--radius); font-size: 0.85rem; font-weight: 600; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
.regenerate-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245,158,11,0.3); }
.regenerate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.regenerate-btn .btn-content { display: flex; align-items: center; gap: 8px; }
.regenerate-btn svg { width: 16px; height: 16px; }
.regenerate-btn .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }

.section-title { font-size: 0.7rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; display: block; margin-bottom: 10px; }

.image-container { aspect-ratio: 1; border-radius: var(--radius); overflow: hidden; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); position: relative; }
.image-container img.result-image { width: 100%; height: 100%; object-fit: cover; animation: imageReveal 0.6s ease-out; }
@keyframes imageReveal { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

/* Generation Loader */
.generation-loader { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #fafbfc 0%, #f0f2f5 100%); }
.loader-canvas { position: relative; width: 200px; height: 200px; margin-bottom: 32px; }
.geo-shape { position: absolute; border-radius: 12px; opacity: 0.6; }
.geo-shape.shape-1 { width: 60px; height: 60px; background: linear-gradient(135deg, rgba(8, 131, 80, 0.15), rgba(8, 131, 80, 0.05)); top: 20px; left: 30px; animation: floatShape1 4s ease-in-out infinite; }
.geo-shape.shape-2 { width: 45px; height: 45px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(99, 102, 241, 0.04)); top: 50px; right: 25px; border-radius: 50%; animation: floatShape2 5s ease-in-out infinite; }
.geo-shape.shape-3 { width: 35px; height: 35px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.04)); bottom: 40px; left: 50px; animation: floatShape3 4.5s ease-in-out infinite; }
@keyframes floatShape1 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(15px, 20px) rotate(10deg); } }
@keyframes floatShape2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-20px, 15px) scale(1.1); } }
@keyframes floatShape3 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(25px, -10px) rotate(-15deg); } }
.ripple-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.ripple { width: 80px; height: 80px; border: 2px solid rgba(8, 131, 80, 0.2); border-radius: 50%; animation: rippleExpand 2.5s ease-out infinite; }
.ripple.delay-1 { animation-delay: 0.8s; }
.ripple.delay-2 { animation-delay: 1.6s; }
@keyframes rippleExpand { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
.loader-info { display: flex; align-items: center; gap: 20px; padding: 16px 24px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); }
.loader-progress-ring { position: relative; width: 48px; height: 48px; flex-shrink: 0; }
.loader-progress-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.loader-progress-ring .progress-bg { fill: none; stroke: #e8e8ed; stroke-width: 4; }
.loader-progress-ring .progress-fill { fill: none; stroke: var(--primary); stroke-width: 4; stroke-linecap: round; stroke-dasharray: 125.6; transition: stroke-dashoffset 0.5s ease; }
.loader-progress-ring .progress-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600; color: var(--primary); }
.loader-text { display: flex; flex-direction: column; gap: 4px; }
.loader-status { font-size: 0.95rem; font-weight: 600; color: var(--text); }
.loader-hint { font-size: 0.8rem; color: var(--text-secondary); }
.loader-hint.warning { color: #d97706; font-weight: 500; }

/* Cancel Button */
.cancel-btn { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  margin-top: 24px; 
  padding: 10px 20px; 
  background: rgba(239,68,68,0.08); 
  border: 1px solid rgba(239,68,68,0.2); 
  border-radius: var(--radius); 
  color: #dc2626; 
  font-size: 0.85rem; 
  font-weight: 500; 
  cursor: pointer; 
  transition: var(--transition); 
}
.cancel-btn:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); }
.cancel-btn svg { width: 18px; height: 18px; }
.status-badge { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; background: var(--bg); font-size: 0.75rem; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-secondary); }
.status-badge.completed .status-dot { background: var(--success); }
.pass-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; background: rgba(255,59,48,0.1); color: var(--error); }
.pass-badge.pass { background: var(--primary-bg); color: var(--primary); }
.score-display { display: flex; justify-content: center; align-items: center; position: relative; margin-bottom: 32px; }
.score-ring { width: 120px; height: 120px; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: var(--border-light); stroke-width: 8; }
.ring-fill { fill: none; stroke: var(--primary); stroke-width: 8; stroke-linecap: round; stroke-dasharray: 326.7; transition: stroke-dashoffset 1s; }
.score-value { position: absolute; display: flex; flex-direction: column; align-items: center; }
.score-number { font-size: 2.5rem; font-weight: 600; line-height: 1; }
.score-label { font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px; }
.metric-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.metric-name { font-size: 0.85rem; }
.metric-score { font-size: 0.9rem; font-weight: 600; }
.metric-score.high { color: var(--error); }
.metric-bar { height: 6px; background: var(--border-light); border-radius: 3px; overflow: hidden; margin-bottom: 6px; }
.metric-fill { height: 100%; background: var(--primary); border-radius: 3px; }
.metric-fill.risk-fill { background: var(--text-secondary); }
.metric-score.high + .metric-bar .risk-fill { background: var(--error); }
.metric-reason { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }
.eval-metrics { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.eval-summary { padding-top: 20px; border-top: 1px solid var(--border-light); font-size: 0.9rem; line-height: 1.7; }
.empty-state { background: var(--card); border-radius: var(--radius-lg); padding: 60px 40px; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: var(--shadow-sm); }
.empty-icon { width: 80px; height: 80px; background: var(--bg); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.empty-icon svg { width: 36px; height: 36px; color: var(--text-secondary); opacity: 0.5; }
.footer { padding: 24px 40px; text-align: center; border-top: 1px solid var(--border-light); background: var(--card); }
.footer p { font-size: 0.8rem; color: var(--text-secondary); }
@media (max-width: 900px) { .content-grid { grid-template-columns: 1fr; } }

/* Warnings List */
.warnings-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.warning-item { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(251,191,36,0.1); border-radius: var(--radius); border-left: 3px solid #f59e0b; }
.warning-item svg { width: 16px; height: 16px; color: #f59e0b; flex-shrink: 0; }
.warning-item span { font-size: 0.85rem; color: #92400e; }

/* Trace */
.decision-trace { padding-top: 16px; margin-top: 16px; border-top: 1px solid var(--border-light); }
.trace-header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 8px 0; }
.trace-header svg { width: 18px; height: 18px; color: var(--text-secondary); transition: transform 0.2s; }
.trace-header svg.expanded { transform: rotate(180deg); }
.trace-content { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; }
.trace-item { display: grid; grid-template-columns: 100px 70px 1fr; gap: 8px; align-items: start; padding: 8px 12px; background: var(--bg); border-radius: var(--radius); font-size: 0.8rem; }
.trace-key { font-weight: 500; color: var(--text); }
.trace-source { padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; text-align: center; }
.trace-source.content { background: var(--primary-bg); color: var(--primary); }
.trace-source.degree { background: rgba(99,102,241,0.1); color: #6366f1; }
.trace-source.variant { background: rgba(236,72,153,0.1); color: #db2777; }
.trace-source.mixed { background: rgba(251,191,36,0.15); color: #d97706; }
.trace-detail { color: var(--text-secondary); line-height: 1.4; }

/* Content Signature */
.content-signature { padding: 16px; background: linear-gradient(135deg, rgba(8,131,80,0.05), rgba(8,131,80,0.12)); border-radius: var(--radius); margin-bottom: 16px; border: 1px solid rgba(8,131,80,0.15); }
.signature-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.signature-icon { font-size: 1rem; color: var(--primary); }
.signature-title { font-size: 0.75rem; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em; }
.signature-action { font-size: 1rem; font-weight: 600; color: var(--text); line-height: 1.5; margin: 0 0 10px; }
.signature-meta { display: flex; gap: 12px; margin-bottom: 8px; }
.signature-source { font-size: 0.75rem; color: var(--text-secondary); background: var(--card); padding: 2px 8px; border-radius: 10px; }
.signature-visual { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0; padding-top: 8px; border-top: 1px solid rgba(8,131,80,0.1); }

/* ========== 智能选度推导面板 ========== */
.degree-inference-panel {
  background: linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.08));
  border: 1px solid rgba(99,102,241,0.15);
  border-radius: var(--radius);
  margin-bottom: 20px;
  overflow: hidden;
}

.inference-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.12));
  border-bottom: 1px solid rgba(99,102,241,0.1);
}

.inference-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.inference-icon {
  font-size: 1rem;
  color: #8b5cf6;
}

.inference-result {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-degree {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 2px 8px rgba(99,102,241,0.3);
}

.result-conf {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  background: rgba(239,68,68,0.1);
  color: #dc2626;
}

.result-conf.mid {
  background: rgba(251,191,36,0.15);
  color: #d97706;
}

.result-conf.high {
  background: rgba(8,131,80,0.1);
  color: var(--primary);
}

.inference-body {
  padding: 18px;
}

/* 推导路径 */
.inference-path {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 14px 16px;
  background: rgba(255,255,255,0.6);
  border-radius: var(--radius);
  margin-bottom: 16px;
  overflow-x: auto;
}

.path-step {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.path-step .step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(99,102,241,0.15);
  color: #6366f1;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.path-step .step-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
}

.path-step .step-arrow {
  font-size: 0.9rem;
  color: rgba(99,102,241,0.4);
  margin: 0 10px;
}

.path-step.final .step-num {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.path-step.final .step-label {
  font-weight: 700;
  color: #6366f1;
}

/* 核心推理 */
.inference-reasoning {
  background: rgba(255,255,255,0.7);
  border-radius: var(--radius);
  padding: 14px 16px;
  margin-bottom: 14px;
  border-left: 3px solid #8b5cf6;
}

.reasoning-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.reasoning-icon {
  font-size: 0.9rem;
  color: #8b5cf6;
}

.reasoning-header span {
  font-size: 0.7rem;
  font-weight: 600;
  color: #8b5cf6;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.reasoning-text {
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text);
  margin: 0;
}

/* 证据链 */
.inference-evidence {
  background: rgba(255,255,255,0.5);
  border-radius: var(--radius);
  padding: 12px 16px;
  margin-bottom: 14px;
}

.evidence-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.evidence-icon {
  font-size: 0.85rem;
  color: #6366f1;
}

.evidence-header span {
  font-size: 0.7rem;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.evidence-chain {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.evidence-item {
  display: inline-block;
}

.evidence-quote {
  padding: 5px 14px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.15));
  color: #5b21b6;
  font-style: italic;
}

/* 置信度条 */
.confidence-bar-wrap {
  background: rgba(255,255,255,0.6);
  border-radius: var(--radius);
  padding: 12px 16px;
}

.confidence-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 8px;
}

.confidence-bar {
  height: 8px;
  background: rgba(0,0,0,0.08);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.confidence-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #dc2626, #f59e0b);
  transition: width 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.confidence-fill.mid {
  background: linear-gradient(90deg, #f59e0b, #84cc16);
}

.confidence-fill.high {
  background: linear-gradient(90deg, #22c55e, var(--primary));
}

.confidence-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 0.65rem;
  color: var(--text-secondary);
}

.scale-threshold {
  color: #d97706;
  font-weight: 600;
}

/* ========== 优化后的建议区 ========== */
.suggestions-action-section {
  background: linear-gradient(135deg, rgba(99,102,241,0.03), rgba(139,92,246,0.06));
  border: 1px solid rgba(99,102,241,0.12);
  border-radius: var(--radius);
  padding: 20px;
  margin-top: 20px;
}

.suggestions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(99,102,241,0.1);
}

.suggestions-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestions-icon {
  font-size: 1rem;
  color: #8b5cf6;
}

.suggestions-header .section-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin: 0;
}

.suggestions-count {
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(239,68,68,0.1), rgba(245,158,11,0.1));
  color: #dc2626;
  font-weight: 600;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(255,255,255,0.7);
  border-radius: 10px;
  border-left: 3px solid #f59e0b;
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background: rgba(255,255,255,0.9);
  transform: translateX(2px);
}

.suggestion-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.suggestion-text {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text);
}

/* 操作按钮组 */
.action-btn-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
  text-align: left;
}

.action-btn.regenerate {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.action-btn.edit {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.action-btn .btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-btn .btn-icon svg {
  width: 18px;
  height: 18px;
}

.action-btn .btn-icon .spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.action-btn .btn-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.action-btn .btn-main {
  font-size: 0.9rem;
  font-weight: 600;
}

.action-btn .btn-sub {
  font-size: 0.7rem;
  opacity: 0.8;
  font-weight: 400;
}

/* ========== 改图区块 ========== */
.edit-section {
  margin-top: 24px;
  background: linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.08));
  border: 1px solid rgba(99,102,241,0.15);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.edit-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.12));
  border-bottom: 1px solid rgba(99,102,241,0.1);
}

.edit-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #6366f1;
}

.edit-icon {
  font-size: 1.1rem;
  color: #8b5cf6;
}

.edit-status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(107,114,128,0.1);
  color: #6b7280;
}

.edit-status-badge .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6b7280;
}

.edit-status-badge.pending {
  background: rgba(245,158,11,0.12);
  color: #d97706;
}

.edit-status-badge.pending .status-dot {
  background: #f59e0b;
  animation: pulse 1.5s ease-in-out infinite;
}

.edit-status-badge.done {
  background: rgba(8,131,80,0.1);
  color: var(--primary);
}

.edit-status-badge.done .status-dot {
  background: var(--primary);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* 改图提示词 */
.edit-prompt-block {
  padding: 20px;
  border-bottom: 1px solid rgba(99,102,241,0.08);
}

.prompt-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.prompt-label-icon {
  font-size: 0.9rem;
  color: #8b5cf6;
}

.prompt-label-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.prompt-content {
  background: rgba(255,255,255,0.7);
  border-radius: var(--radius);
  padding: 16px;
  border-left: 3px solid #8b5cf6;
}

.prompt-content p {
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--text);
  margin: 0;
}

.prompt-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(99,102,241,0.06);
  border-radius: 8px;
  font-size: 0.75rem;
  color: #6366f1;
}

.prompt-note svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* 改图进度 */
.edit-progress-block {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(99,102,241,0.08);
}

.progress-visual {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.progress-ring {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.progress-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring .ring-bg {
  fill: none;
  stroke: rgba(99,102,241,0.15);
  stroke-width: 4;
}

.progress-ring .ring-fill {
  fill: none;
  stroke: url(#editGradient);
  stroke: #8b5cf6;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 113;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-percent {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #6366f1;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-status {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
}

.progress-hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.progress-bar {
  height: 6px;
  background: rgba(99,102,241,0.12);
  border-radius: 3px;
  overflow: hidden;
}

.edit-progress-block .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* 改图结果 */
.edit-result-block {
  padding: 20px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.result-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.result-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(8,131,80,0.1);
  color: var(--primary);
}

.result-compare {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;
}

.compare-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compare-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-align: center;
}

.compare-item.original .compare-label {
  color: var(--text-secondary);
}

.compare-item.edited .compare-label {
  color: var(--primary);
}

.compare-img-wrap {
  aspect-ratio: 1;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg);
  box-shadow: var(--shadow-sm);
}

.compare-item.edited .compare-img-wrap {
  box-shadow: 0 4px 20px rgba(8,131,80,0.2);
  border: 2px solid var(--primary);
}

.compare-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.compare-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  box-shadow: 0 4px 12px rgba(8,131,80,0.3);
}

.compare-arrow svg {
  width: 20px;
  height: 20px;
  color: white;
}

@media (max-width: 600px) {
  .action-btn-group { grid-template-columns: 1fr; }
  .result-compare { grid-template-columns: 1fr; gap: 12px; }
  .compare-arrow { transform: rotate(90deg); margin: 0 auto; }
}
</style>
