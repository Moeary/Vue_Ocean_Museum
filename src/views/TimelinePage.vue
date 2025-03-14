<template>
  <div class="timeline-page">
    <div class="page-header">
      <h1>海洋历史时间线</h1>
      <div class="title-underline"></div>
      <p class="section-description">从古代到现代，探索人类与海洋互动的重要历史事件</p>
      <div class="timeline-instructions">
        <el-alert
          title="点击事件卡片可查看详细介绍与图片"
          type="info"
          show-icon
          :closable="false"
        ></el-alert>
      </div>
    </div>
    
    <ocean-timeline :showAll="true" />
    
    <div class="back-button">
      <el-button type="primary" size="large" @click="goBackToHome">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import OceanTimeline from '../components/Timeline.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'TimelinePage',
  components: {
    OceanTimeline
  },
  setup() {
    const router = useRouter();
    
    const goBackToHome = () => {
      router.push('/');
    };
    
    return {
      goBackToHome
    };
  }
});
</script>

<style scoped>
.timeline-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #303133;
}

.title-underline {
  width: 60px;
  height: 4px;
  background-color: #409EFF;
  margin: 0 auto;
}

.section-description {
  max-width: 600px;
  margin: 20px auto 0;
  color: #606266;
  font-size: 1.1rem;
}

.back-button {
  margin-top: 40px;
  text-align: center;
}

.timeline-instructions {
  max-width: 600px;
  margin: 20px auto;
}
</style>
