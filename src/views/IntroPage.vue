<template>
  <div class="intro-page">
    <div class="page-header">
      <h1>关于海洋文史馆</h1>
      <div class="title-underline"></div>
    </div>
    
    <el-row :gutter="20" class="intro-content">
      <el-col :span="24">
        <el-card class="intro-card">
          <div class="intro-section">
            <h2>我们的使命</h2>
            <p>虚拟海洋文史馆致力于通过数字化方式保存和展示人类与海洋互动的丰富历史。我们旨在让更多人了解海洋对人类文明发展的深远影响，并激发大众对海洋保护的意识。</p>
            
            <div class="image-showcase">
              <el-image src="/images/mission.jpg" fit="cover"></el-image>
            </div>
          </div>
          
          <el-divider></el-divider>
          
          <div class="intro-section">
            <h2>历史视角</h2>
            <p>从古埃及的早期航海技术到现代的深海探索，海洋一直是人类探索、贸易、文化交流和科学发现的重要场所。通过我们的历史时间线，您可以了解那些改变世界的重大海洋事件，感受人类不断挑战深海未知的勇气与智慧。</p>
            <p>我们的内容涵盖了从公元前3000年到现代的众多重要历史事件，包括古代文明的航海成就、大航海时代的探险、现代海洋科技的突破，以及当代海洋环保的挑战。</p>
            
            <div class="stats-showcase">
              <div class="stat-item">
                <h3>5000+</h3>
                <p>跨越年份</p>
              </div>
              <div class="stat-item">
                <h3>10+</h3>
                <p>历史事件</p>
              </div>
              <div class="stat-item">
                <h3>50+</h3>
                <p>相关图片</p>
              </div>
            </div>
          </div>
          
          <el-divider></el-divider>
          
          <div class="intro-section">
            <h2>海洋科学与保护</h2>
            <p>海洋覆盖了地球表面的71%，对我们的气候、生态系统和整个生物圈的平衡至关重要。然而，人类活动对海洋环境造成了深远影响，从过度捕捞到塑料污染，从气候变化到海洋酸化。</p>
            <p>我们相信，了解海洋的过去对于保护海洋的未来至关重要。通过科学知识的传播和历史经验的借鉴，我们希望激发更多人参与到海洋保护的事业中来。</p>
            
            <div class="image-grid">
              <el-image src="/images/ocean-science-1.jpg" fit="cover"></el-image>
              <el-image src="/images/ocean-science-2.jpg" fit="cover"></el-image>
              <el-image src="/images/ocean-conservation-1.jpg" fit="cover"></el-image>
            </div>
          </div>
          
          <el-divider></el-divider>
          
          <div class="intro-section">
            <h2>关于我们</h2>
            <p>虚拟海洋文史馆是一个非营利性的教育项目，由对海洋历史和保护充满热情的团队创建。我们致力于通过数字技术，将海洋的历史、科学和文化以生动、互动的方式呈现给公众。</p>
            <p>如果您有任何建议或想了解更多信息，欢迎与我们联系。</p>
            
            <div class="contact-info">
              <p><el-icon><Message /></el-icon> cuvo@foxmail.com</p>
              <p><el-icon><Location /></el-icon> 我们深爱着这片大海</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <div class="back-button">
      <el-button type="primary" size="large" @click="goBackToHome">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { Message, Location } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'IntroPage',
  components: {
    Message,
    Location
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
.intro-page {
  max-width: 1000px;
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

.intro-card {
  padding: 20px;
}

.intro-section {
  margin-bottom: 30px;
}

.intro-section h2 {
  font-size: 1.8rem;
  color: #303133;
  margin-bottom: 20px;
}

.intro-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 15px;
}

.image-showcase {
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  height: 300px;
}

.image-showcase .el-image {
  width: 100%;
  height: 100%;
}

.stats-showcase {
  display: flex;
  justify-content: space-around;
  margin: 30px 0;
  text-align: center;
}

.stat-item h3 {
  font-size: 2.5rem;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-item p {
  font-size: 1.1rem;
  color: #606266;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 20px 0;
  height: 200px;
}

.image-grid .el-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.contact-info {
  margin-top: 20px;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
}

.contact-info p {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.contact-info .el-icon {
  margin-right: 10px;
  color: #409EFF;
}

.back-button {
  margin-top: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .stats-showcase {
    flex-direction: column;
  }
  
  .stat-item {
    margin-bottom: 20px;
  }
  
  .image-grid {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .image-grid .el-image {
    height: 200px;
    margin-bottom: 15px;
  }
}
</style>
