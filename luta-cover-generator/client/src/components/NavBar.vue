<template>
  <header class="header">
    <div class="logo">
      <div class="logo-box">
        <img src="/logo.png" alt="汝塔" class="logo-img" />
      </div>
      <div class="logo-text">
        <h1>汝塔</h1>
        <p class="tagline">六度播客封面生成器</p>
      </div>
    </div>
    
    <nav class="nav-links">
      <button 
        :class="{ active: currentView === 'generator' }" 
        @click="$emit('change-view', 'generator')"
      >
        生成器
      </button>
      <button 
        :class="{ active: currentView === 'docs' }" 
        @click="$emit('change-view', 'docs')"
      >
        规则文档
      </button>
      <button 
        :class="{ active: currentView === 'tech' }" 
        @click="$emit('change-view', 'tech')"
      >
        技术文档
      </button>
    </nav>
  </header>
</template>

<script setup>
defineProps({
  currentView: String
});
defineEmits(['change-view']);
</script>

<style scoped>
.header { 
  padding: 16px 40px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  background: white; 
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo { display: flex; align-items: center; gap: 16px; }

.logo-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-img { 
  width: 28px; 
  height: 28px; 
  object-fit: contain; 
}

.logo-text h1 { 
  font-size: 1.2rem; 
  font-weight: 600; 
  color: var(--text); 
  letter-spacing: 0.02em;
}

.tagline { 
  font-size: 0.7rem; 
  color: var(--text-secondary); 
  letter-spacing: 0.01em;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-links button {
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-links button:hover {
  background: var(--bg);
  color: var(--text);
}

.nav-links button.active {
  background: var(--primary-bg);
  color: var(--primary);
  font-weight: 600;
}
</style>

