<template>
  <div class="home">
    <!-- 轮播图 -->
    <section id="banner" class="section banner-section" ref="bannerSection">
      <el-carousel height="500px" indicator-position="outside" :interval="5000">
        <el-carousel-item v-for="item in carouselItems" :key="item.id">
          <div class="carousel-content" :style="{ backgroundImage: `url(${item.imageUrl})` }">
            <div class="carousel-overlay">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>
    
    <!-- 介绍部分 -->
    <section id="intro" class="section intro-section" ref="introSection">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="section-title">
            <h2>关于海洋文史馆</h2>
            <div class="title-underline"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="intro-content">
        <el-col :md="12" :sm="24">
          <div class="intro-text">
            <p>欢迎来到虚拟海洋文史馆，这是一个致力于展示人类与海洋交互历史的数字平台。</p>
            <p>从古代文明的早期航海探索到现代深海科技的突破，我们记录了那些改变世界的海洋大事件。通过交互式时间线，您可以按时间顺序了解人类海洋文明的发展历程。</p>
            <p>海洋覆盖了地球表面的71%，自古以来就是人类交流、贸易、探索和科学发现的场所。我们希望通过这个虚拟展馆，让更多人了解海洋对人类历史的重要影响，以及我们保护海洋环境的责任。</p>
            <el-button type="primary" @click="scrollToSection('timeline')">开始探索</el-button>
          </div>
        </el-col>
        <el-col :md="12" :sm="24">
          <div class="intro-stats">
            <el-row :gutter="20">
              <el-col :span="12" v-for="stat in stats" :key="stat.title">
                <el-card class="stat-card">
                  <h3>{{ stat.value }}</h3>
                  <p>{{ stat.title }}</p>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </section>
    
    <!-- 功能导航 - Now hidden since we removed the nav button -->
    <!-- <section id="features" class="section features-section" ref="featuresSection">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="section-title">
            <h2>探索功能</h2>
            <div class="title-underline"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="features-list">
        <el-col :md="8" :sm="24" v-for="feature in features" :key="feature.title">
          <el-card class="feature-card">
            <div class="feature-icon">
              <el-icon :size="40"><component :is="feature.icon"></component></el-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <el-button 
              link 
              type="primary" 
              @click="feature.type === 'section' ? scrollToSection(feature.link) : navigateTo(feature.link)"
            >
              开始体验 <el-icon><ArrowRight /></el-icon>
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </section> -->
    
    <!-- 时间线部分 -->
    <section id="timeline" class="section timeline-section" ref="timelineSection">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="section-title">
            <h2>海洋历史时间线</h2>
            <div class="title-underline"></div>
            <p class="section-description">从古代到现代，探索人类与海洋互动的重要历史事件</p>
          </div>
        </el-col>
      </el-row>
      <ocean-timeline :showAll="false" :homeLimit="5" />
    </section>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import OceanTimeline from '../components/Timeline.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HomePage',
  components: {
    OceanTimeline,
  },
  emits: ['update:active-section'],
  setup(props, { emit }) {
    const router = useRouter();
    
    // 轮播图数据
    const carouselItems = [
      {
        id: 1,
        imageUrl: '/images/banner-ocean1.jpg',
        title: '探索海洋的无尽奥秘',
        description: '从古至今，人类不断挑战深海未知'
      },
      {
        id: 2,
        imageUrl: '/images/banner-ships.jpg',
        title: '航海时代的辉煌',
        description: '那些改变世界格局的伟大航海探险'
      },
      {
        id: 3,
        imageUrl: '/images/banner-conservation.jpg',
        title: '保护海洋生态',
        description: '当代人类面临的海洋环境保护责任'
      }
    ];
    
    // 统计数据
    const stats = [
      { title: '历史事件', value: '10+' },
      { title: '跨越年份', value: '5000+' },
      { title: '相关图片', value: '50+' },
      { title: '历史人物', value: '20+' }
    ];
    
    // 功能特色
    const features = [
      {
        title: '历史时间线',
        description: '按时间顺序浏览人类海洋探索的重大历史事件',
        icon: 'Ship',
        link: 'timeline',
        type: 'section'
      },
      {
        title: '海洋知识库',
        description: '探索关于海洋科学、生物多样性和环境保护的知识',
        icon: 'Collection',
        link: '/knowledge',
        type: 'route'
      },
      {
        title: '互动展示',
        description: '通过互动方式了解海洋文化和历史',
        icon: 'VideoPlay',
        link: 'timeline',
        type: 'section'
      }
    ];
    
    // 区域引用
    const bannerSection = ref(null);
    const introSection = ref(null);
    const featuresSection = ref(null);
    const timelineSection = ref(null);
    
    // 当前活动区域
    const activeSection = ref('banner');
    
    // 滚动到指定区域
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    // 导航到其他页面
    const navigateTo = (path) => {
      router.push(path);
    };
    
    // 监听滚动位置确定当前区域
    onMounted(() => {
      window.addEventListener('scroll', () => {
        const sections = ['banner', 'intro', 'timeline']; // Removed 'features'
        const currentPosition = window.scrollY + 100;
        
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const top = element.offsetTop;
            const height = element.offsetHeight;
            
            if (currentPosition >= top && currentPosition < top + height) {
              activeSection.value = section;
              break;
            }
          }
        }
      });
      
      // Emit active section update to parent App component
      const updateActiveSection = () => {
        emit('update:active-section', activeSection.value);
      };
      
      // Update when activeSection changes
      watch(activeSection, updateActiveSection);
      
      // Initial update
      updateActiveSection();
    });
    
    return {
      carouselItems,
      stats,
      features,
      bannerSection,
      introSection,
      featuresSection,
      timelineSection,
      activeSection,
      scrollToSection,
      navigateTo
    };
  }
});
</script>

<style scoped>
.section {
  padding: 60px 20px;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
}

.section-title h2 {
  font-size: 2.5rem;
  font-weight: 700;
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

.banner-section {
  padding: 0;
}

.carousel-content {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0 20px;
}

.carousel-overlay h2 {
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-overlay p {
  font-size: 1.5rem;
  max-width: 700px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.intro-section {
  background-color: #f5f7fa;
}

.intro-content {
  display: flex;
  align-items: center;
}

.intro-text {
  padding: 20px;
}

.intro-text p {
  margin-bottom: 20px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #606266;
}

.stat-card {
  text-align: center;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-10px);
}

.stat-card h3 {
  font-size: 2.5rem;
  color: #409EFF;
  margin-bottom: 10px;
}

.features-list {
  margin-top: 20px;
}

.feature-card {
  height: 100%;
  text-align: center;
  padding: 30px 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  margin-bottom: 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409EFF;
}

.feature-card h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.feature-card p {
  margin-bottom: 20px;
  color: #606266;
}

.timeline-section {
  background-color: #f5f7fa;
}

@media (max-width: 768px) {
  .carousel-overlay h2 {
    font-size: 2rem;
  }
  
  .carousel-overlay p {
    font-size: 1.2rem;
  }
  
  .section-title h2 {
    font-size: 2rem;
  }
  
  .intro-content {
    flex-direction: column;
  }
}
</style>
