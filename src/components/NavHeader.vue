/* eslint-disable */
<template>
  <header class="nav-header">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="logo-container">
        <router-link to="/" class="logo">
          <img src="/images/logo.png" alt="海洋文史馆" class="logo-img" onerror="this.src='https://via.placeholder.com/40x40?text=O'"/>
          <span class="logo-text">虚拟海洋文史馆</span>
        </router-link>
      </div>
      
      <!-- 导航链接 -->
      <div class="nav-links" :class="{ 'mobile-nav-active': mobileNavActive }">
        <ul>
          <li v-for="item in navItems" :key="item.id">
            <router-link 
              v-if="item.route" 
              :to="item.route" 
              class="nav-link"
            >
              {{ item.text }}
            </router-link>
            <a 
              v-else 
              :href="`#${item.id}`" 
              :class="{ 'active': activeSection === item.id }"
              @click="scrollToSection(item.id)"
              class="nav-link"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
      </div>
      
      <!-- 移动端菜单按钮 -->
      <div class="mobile-nav-toggle" @click="toggleMobileNav">
        <el-icon v-if="!mobileNavActive"><Menu /></el-icon>
        <el-icon v-else><Close /></el-icon>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, defineComponent } from 'vue';
import { Menu, Close } from '@element-plus/icons-vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'NavHeader',
  components: {
    Menu,
    Close
  },
  props: {
    activeSection: {
      type: String,
      default: 'banner'
    }
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const mobileNavActive = ref(false);
    
    const navItems = [
      { id: 'banner', text: '首页', route: '/' },
      { id: 'intro', text: '关于', route: '/intro' }, // Updated to link directly to the intro page
      { id: 'timeline', text: '历史时间线' },
      { id: 'knowledge', text: '知识库', route: '/knowledge' },
      { id: 'marinelife', text: '海洋生物', route: '/marine-life' }
    ];
    
    // Use props to check if the current section matches a navigation item
    const isActiveSection = (sectionId) => {
      return props.activeSection === sectionId;
    };
    
    const toggleMobileNav = () => {
      mobileNavActive.value = !mobileNavActive.value;
    };
    
    const scrollToSection = (sectionId) => {
      // If we're not on the home page, navigate home first
      if (route.path !== '/') {
        router.push('/').then(() => {
          // Wait for navigation to complete before scrolling
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // 如果是移动视图，点击后关闭菜单
      if (mobileNavActive.value) {
        mobileNavActive.value = false;
      }
    };
    
    return {
      mobileNavActive,
      navItems,
      toggleMobileNav,
      scrollToSection,
      isActiveSection
    };
  }
});
</script>

<style scoped>
.nav-header {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #303133;
}

.logo-img {
  height: 40px;
  width: auto;
  margin-right: 10px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
}

.nav-links ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links ul li {
  margin: 0 15px;
}

.nav-link {
  color: #606266;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.3s;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #409EFF;
  transition: width 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active,
.nav-link.active {
  color: #409EFF;
}

.nav-link:hover::after,
.nav-link.router-link-active::after,
.nav-link.active::after {
  width: 100%;
}

.mobile-nav-toggle {
  display: none;
  font-size: 24px;
  cursor: pointer;
  color: #303133;
}

@media (max-width: 768px) {
  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transform: translateY(-150%);
    transition: transform 0.3s ease-in-out;
    z-index: 99;
  }
  
  .nav-links.mobile-nav-active {
    transform: translateY(0);
  }
  
  .nav-links ul {
    flex-direction: column;
  }
  
  .nav-links ul li {
    margin: 10px 0;
  }
  
  .mobile-nav-toggle {
    display: block;
  }
}
</style>
