<template>
  <div class="knowledge-base">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>海洋知识库</h1>
      <div class="title-underline"></div>
      <p>探索海洋科学与文化的丰富知识宝库</p>
    </div>

    <el-container>
      <!-- 左侧导航菜单 -->
      <el-aside width="250px" class="menu-aside">
        <el-menu
          :default-active="activeCategory"
          class="category-menu"
          @select="handleCategorySelect"
        >
          <el-menu-item v-for="category in categories" :key="category.id" :index="category.id">
            <el-icon><component :is="category.icon"></component></el-icon>
            <span>{{ category.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧内容区 -->
      <el-main>
        <div v-if="activeCategory === 'marine-biology'" class="knowledge-section">
          <h2>海洋生物学</h2>
          
          <el-card v-for="(item, index) in marineLifeData" :key="index" class="knowledge-card">
            <template #header>
              <div class="card-header">
                <h3>{{ item.title }}</h3>
              </div>
            </template>
            <div class="card-content">
              <el-image :src="item.image" fit="cover" class="card-image"></el-image>
              <div class="card-text">
                <p>{{ item.description }}</p>
                <el-tag v-for="tag in item.tags" :key="tag" size="small" class="card-tag">{{ tag }}</el-tag>
              </div>
            </div>
          </el-card>
        </div>

        <div v-else-if="activeCategory === 'oceanography'" class="knowledge-section">
          <h2>海洋学</h2>
          
          <el-row :gutter="20">
            <el-col :span="24" v-for="(item, index) in oceanographyData" :key="index">
              <el-card class="knowledge-card">
                <div class="content-with-image" :class="{'image-right': index % 2 === 1}">
                  <el-image :src="item.image" fit="cover" class="card-image-side"></el-image>
                  <div class="content-side">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div v-else-if="activeCategory === 'marine-technology'" class="knowledge-section">
          <h2>海洋技术</h2>
          
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in marineTechData"
              :key="index"
              :timestamp="item.year"
              :color="item.color || '#409EFF'"
            >
              <el-card>
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>

        <div v-else-if="activeCategory === 'conservation'" class="knowledge-section">
          <h2>海洋保护</h2>
          
          <el-alert
            title="全球海洋面临危机"
            type="warning"
            description="海洋覆盖了地球表面的71%，是地球上最大的生态系统。然而，由于人类活动的影响，海洋正面临严重的威胁。"
            show-icon
            :closable="false"
          ></el-alert>
          
          <el-collapse accordion>
            <el-collapse-item v-for="(item, index) in conservationData" :key="index" :title="item.title">
              <div>{{ item.description }}</div>
              <div class="action-steps">
                <h4>我们可以怎么做</h4>
                <el-steps direction="vertical" :active="1">
                  <el-step 
                    v-for="(step, sIndex) in item.steps" 
                    :key="sIndex"
                    :title="step.title" 
                    :description="step.description"
                  ></el-step>
                </el-steps>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div v-else class="knowledge-section">
          <h2>海洋文化与历史</h2>
          
          <el-tabs tab-position="left">
            <el-tab-pane 
              v-for="(section, index) in culturalData" 
              :key="index"
              :label="section.title"
            >
              <div class="tab-content">
                <el-image :src="section.image" fit="cover" class="section-image"></el-image>
                <h3>{{ section.title }}</h3>
                <p>{{ section.description }}</p>
                
                <el-divider></el-divider>
                
                <ul class="fact-list">
                  <li v-for="(fact, fIndex) in section.facts" :key="fIndex">
                    {{ fact }}
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>

    <div class="back-button">
      <el-button type="primary" size="large" icon="ArrowLeft" @click="goBackToHome">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Fish, MapLocation, Monitor, DataLine, Collection } from '@element-plus/icons-vue';

export default {
  name: 'KnowledgeBase',
  components: {
    Fish,
    MapLocation,
    Monitor,
    DataLine,
    Collection
  },
  setup() {
    const router = useRouter();
    const activeCategory = ref('marine-biology');
    
    const categories = [
      { id: 'marine-biology', name: '海洋生物学', icon: 'Fish' },
      { id: 'oceanography', name: '海洋学', icon: 'DataLine' },
      { id: 'marine-technology', name: '海洋技术', icon: 'Monitor' },
      { id: 'conservation', name: '海洋保护', icon: 'MapLocation' },
      { id: 'culture', name: '海洋文化', icon: 'Collection' }
    ];
    
    const marineLifeData = [
      {
        title: '深海生物适应性',
        description: '深海是地球上最极端的栖息地之一，深海生物已经进化出惊人的适应性来适应高压、低温和缺乏光照的环境。例如，一些深海鱼类产生自己的生物发光，有些则拥有特殊的压力耐受能力。',
        image: '/images/deep-sea-creatures.jpg',
        tags: ['深海鱼类', '生物发光', '适应性进化']
      },
      {
        title: '珊瑚礁生态系统',
        description: '珊瑚礁是海洋中最丰富多样的生态系统之一，尽管它们只覆盖了不到1%的海洋面积，但却为约25%的海洋生物提供了栖息地。珊瑚礁由数百万个微小的珊瑚虫共同建造，它们通过从共生的藻类获取能量来生长。',
        image: '/images/coral-reef.jpg',
        tags: ['珊瑚礁', '生物多样性', '共生关系']
      },
      {
        title: '鲸类智能',
        description: '鲸类动物，特别是虎鲸和瓶鼻海豚，拥有高度复杂的社会结构和认知能力。研究表明，它们使用独特的方言进行交流，展示了文化传承，甚至能够识别镜中的自己，表明它们具有自我意识。',
        image: '/images/whale-intelligence.jpg',
        tags: ['鲸类', '动物智能', '社会行为']
      }
    ];
    
    const oceanographyData = [
      {
        title: '洋流系统',
        description: '全球洋流系统，又称为"全球海洋传送带"，将热量从赤道输送到极地地区，对气候调节至关重要。这个系统由表面暖流和深层冷流组成，受温度和盐度差异驱动。',
        image: '/images/ocean-currents.jpg'
      },
      {
        title: '海底地形',
        description: '海底地形多种多样，包括海沟、海山、中洋脊和深海平原。其中，马里亚纳海沟是地球上最深的地方，深度超过11,000米，而海底山脉系统总长超过65,000公里。',
        image: '/images/seafloor-topography.jpg'
      },
      {
        title: '海水化学',
        description: '海水包含几乎所有自然元素，以不同的浓度存在。盐度是描述海水中溶解盐类总量的指标，全球平均值约为35‰。海洋还是地球碳循环的主要部分，吸收了约30%的人类产生的二氧化碳。',
        image: '/images/seawater-chemistry.jpg'
      }
    ];
    
    const marineTechData = [
      {
        year: '1872',
        title: '挑战者号探险',
        description: '英国"挑战者号"进行了首次全球性海洋科学探险，奠定了现代海洋学的基础。',
        color: '#409EFF'
      },
      {
        year: '1943',
        title: '阿奎龙水肺装置',
        description: '雅克·库斯托和埃米尔·加尼扬发明了现代水肺装置，开创了水下探险的新时代。',
        color: '#67C23A'
      },
      {
        year: '1960',
        title: '特里斯特号深海探险',
        description: '特里斯特号深潜器完成了人类首次到达地球最深处的马里亚纳海沟的壮举。',
        color: '#E6A23C'
      },
      {
        year: '1974',
        title: '首个海底热泉发现',
        description: '科学家在加拉帕戈斯裂谷发现了首个深海热液喷口系统，揭示了全新的海底生态系统。',
        color: '#F56C6C'
      },
      {
        year: '1995',
        title: '自主水下机器人',
        description: '先进的自主水下机器人(AUV)开始广泛应用于海洋科学研究。',
        color: '#909399'
      },
      {
        year: '2012',
        title: '深海挑战者号',
        description: '詹姆斯·卡梅隆驾驶深海挑战者号单人潜水器完成了历史性的马里亚纳海沟深潜。',
        color: '#409EFF'
      },
      {
        year: '2019',
        title: '五缘号深潜',
        description: '中国的"奋斗者"号载人潜水器成功到达马里亚纳海沟挑战者深渊，深度10,909米。',
        color: '#67C23A'
      }
    ];
    
    const conservationData = [
      {
        title: '海洋塑料污染',
        description: '每年约有800万吨塑料垃圾进入海洋，形成了巨大的垃圾带。这些塑料在海洋中分解成微塑料，被海洋生物摄入，最终可能进入人类食物链。',
        steps: [
          {
            title: '减少使用',
            description: '减少一次性塑料产品的使用，选择可重复使用或可生物降解的替代品。'
          },
          {
            title: '正确回收',
            description: '确保塑料废弃物得到适当回收，不要将垃圾丢弃在海滩或水道中。'
          },
          {
            title: '参与清理',
            description: '参与海滩清理活动或支持致力于清理海洋垃圾的组织。'
          }
        ]
      },
      {
        title: '过度捕捞',
        description: '全球约33%的鱼类种群被过度捕捞，可持续渔业管理对于维护海洋生态系统和人类粮食安全至关重要。',
        steps: [
          {
            title: '选择可持续海产品',
            description: '购买经认证的可持续海产品，使用如海洋管理委员会(MSC)等指南。'
          },
          {
            title: '支持渔业改革',
            description: '支持实施可持续渔业管理措施的政策和法规。'
          },
          {
            title: '减少浪费',
            description: '减少食物浪费，最大限度地利用所购买的海产品。'
          }
        ]
      },
      {
        title: '气候变化与海洋酸化',
        description: '海洋吸收了约30%的人类产生的二氧化碳，导致海洋酸化，威胁着珊瑚礁和其他钙化生物。同时，海洋变暖导致海平面上升、海洋生物迁移和极端天气事件增加。',
        steps: [
          {
            title: '减少碳足迹',
            description: '采取节能措施，减少能源消耗和碳足迹。'
          },
          {
            title: '支持可再生能源',
            description: '支持和使用可再生能源，减少对化石燃料的依赖。'
          },
          {
            title: '倡导环保政策',
            description: '支持旨在减缓气候变化和保护海洋生态系统的政策。'
          }
        ]
      }
    ];
    
    const culturalData = [
      {
        title: '古代航海文明',
        image: '/images/ancient-maritime.jpg',
        description: '古代海洋文明如腓尼基人、波利尼西亚人和阿拉伯航海家开发了复杂的导航技术，建立了广泛的贸易网络。',
        facts: [
          '腓尼基人在公元前1000年已经能够利用北极星导航',
          '波利尼西亚人利用星辰、海浪模式和鸟类迁徙来进行远洋航行',
          '郑和下西洋使用的宝船长达120米，远大于同时期欧洲的船只'
        ]
      },
      {
        title: '海洋艺术与文学',
        image: '/images/maritime-art.jpg',
        description: '从荷马的《奥德赛》到赫尔曼·梅尔维尔的《白鲸记》，海洋一直是文学和艺术作品中的重要主题。',
        facts: [
          '日本浮世绘艺术家葛饰北斋的《神奈川冲浪里》是世界上最著名的海洋艺术作品之一',
          '海明威的《老人与海》获得了1953年的普利策奖和1954年的诺贝尔文学奖',
          '许多古代文明都有关于大洪水的神话和传说'
        ]
      },
      {
        title: '现代海洋文化',
        image: '/images/modern-maritime.jpg',
        description: '现代海洋文化体现在各种形式中，从水上运动到海洋保护运动，展示了人类与海洋的持续联系。',
        facts: [
          '冲浪起源于古代波利尼西亚文化，后来在20世纪初在夏威夷重新流行起来',
          '海洋保护意识的提高导致了全球"无塑料"运动的兴起',
          '海洋科普纪录片如BBC的《蓝色星球》系列帮助数百万人了解和欣赏海洋生态系统'
        ]
      }
    ];
    
    const handleCategorySelect = (index) => {
      activeCategory.value = index;
    };
    
    const goBackToHome = () => {
      router.push('/');
    };
    
    return {
      activeCategory,
      categories,
      marineLifeData,
      oceanographyData,
      marineTechData,
      conservationData,
      culturalData,
      handleCategorySelect,
      goBackToHome
    };
  }
};
</script>

<style scoped>
.knowledge-base {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
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
  margin: 0 auto 20px;
}

.page-header p {
  font-size: 1.2rem;
  color: #606266;
  max-width: 600px;
  margin: 0 auto;
}

.menu-aside {
  margin-right: 20px;
  border-right: 1px solid #EBEEF5;
}

.category-menu {
  position: sticky;
  top: 80px;
}

.knowledge-section {
  margin-bottom: 40px;
}

.knowledge-section h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #EBEEF5;
}

.knowledge-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  margin-bottom: 15px;
  border-radius: 4px;
}

.card-text p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.card-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.content-with-image {
  display: flex;
  gap: 20px;
}

.image-right {
  flex-direction: row-reverse;
}

.card-image-side {
  flex: 0 0 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.content-side {
  flex: 1;
}

.content-side h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.action-steps {
  margin-top: 20px;
}

.section-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 20px;
}

.fact-list {
  padding-left: 20px;
}

.fact-list li {
  margin-bottom: 10px;
  line-height: 1.6;
}

.back-button {
  margin-top: 40px;
  text-align: center;
}

.tab-content {
  padding: 20px;
}

@media (max-width: 768px) {
  .content-with-image {
    flex-direction: column;
  }
  
  .image-right {
    flex-direction: column;
  }
  
  .card-image-side {
    width: 100%;
    flex-basis: auto;
  }
}
</style>
