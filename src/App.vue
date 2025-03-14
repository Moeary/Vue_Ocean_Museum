<template>
  <div id="app">
    <!-- 导航栏 -->
    <el-affix :offset="0">
      <nav-header :active-section="activeSection" />
    </el-affix>
    
    <!-- 主要内容区 - 使用router-view显示当前路由对应的组件 -->
    <router-view v-slot="{ Component }">
      <component :is="Component" @update:active-section="updateActiveSection" />
    </router-view>
    
    <!-- 页脚 -->
    <el-footer class="app-footer">
      <p>© {{ new Date().getFullYear() }} 虚拟海洋文史馆 - 探索海洋历史的数字平台</p>
      <p>本网站仅供学习和教育目的使用</p>
    </el-footer>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import NavHeader from './components/NavHeader.vue';

export default defineComponent({
  name: 'App',
  components: {
    NavHeader
  },
  setup() {
    // 默认活动区域为banner
    const activeSection = ref('banner');
    
    // 更新活动区域的方法
    const updateActiveSection = (section) => {
      activeSection.value = section;
    };
    
    return {
      activeSection,
      updateActiveSection
    };
  }
});
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* 页脚样式 */
.app-footer {
  text-align: center;
  padding: 40px 20px;
  background-color: #303133;
  color: #ffffff;
}

.app-footer p {
  margin: 5px 0;
}

/* ...other global styles... */
</style>
