<template>
  <div class="marine-life-container">
    <div class="page-header">
      <h1>海洋生物展示</h1>
      <p>探索海洋世界的神奇生物，通过图片和3D模型了解它们的特点</p>
    </div>

    <!-- 海洋生物选择选项卡 -->
    <el-tabs v-model="activeCreature" class="creature-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="抹香鲸" name="sperm-whale">
        <div class="creature-content">
          <div class="view-controls">
            <el-radio-group v-model="viewMode" size="large" @change="handleViewModeChange">
              <el-radio-button label="image">图片展示</el-radio-button>
              <el-radio-button label="model">3D模型</el-radio-button>
            </el-radio-group>
          </div>
          
          <div v-if="viewMode === 'image'" class="image-view">
            <el-carousel height="500px" indicator-position="outside">
              <el-carousel-item v-for="(image, index) in spermWhaleImages" :key="index">
                <div class="image-container">
                  <img :src="image.url" :alt="image.alt" class="creature-image">
                  <div class="image-caption">
                    <h3>{{ image.title }}</h3>
                    <p>{{ image.description }}</p>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            
            <div class="creature-info">
              <h2>抹香鲸</h2>
              <p>抹香鲸是已知最大的齿鲸物种，也是地球上现存最大的肉食动物。它们可以潜入3000米深的海洋中，是深潜能力最强的海洋生物之一。</p>
              <p>抹香鲸拥有世界上最大的大脑，体长可达18米，重量可达57吨。它们主要以中深层的鱿鱼和其他海洋生物为食。</p>
            </div>
          </div>
          
          <div v-else class="model-view">
            <div class="model-container">
              <!-- 3D模型容器 -->
              <div ref="spermWhaleModelContainer" class="model-canvas-container"></div>
            </div>
            
            <div class="model-controls">
              <el-button type="primary" @click="rotateModel">旋转模型</el-button>
              <el-button @click="resetModel">重置视角</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="海龟" name="sea-turtle">
        <div class="creature-content">
          <div class="view-controls">
            <el-radio-group v-model="viewMode" size="large" @change="handleViewModeChange">
              <el-radio-button label="image">图片展示</el-radio-button>
              <el-radio-button label="model">3D模型</el-radio-button>
            </el-radio-group>
          </div>
          
          <div v-if="viewMode === 'image'" class="image-view">
            <el-carousel height="500px" indicator-position="outside">
              <el-carousel-item v-for="(image, index) in seaTurtleImages" :key="index">
                <div class="image-container">
                  <img :src="image.url" :alt="image.alt" class="creature-image">
                  <div class="image-caption">
                    <h3>{{ image.title }}</h3>
                    <p>{{ image.description }}</p>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            
            <div class="creature-info">
              <h2>海龟</h2>
              <p>海龟是长寿的海洋爬行动物，已在地球上生存了上亿年。它们坚硬的外壳为其提供保护，而长长的鳍状肢让它们能够在水中优雅地游动。</p>
              <p>海龟是迁徙高手，有些种类能够在大洋之间往返数千公里。它们通常在出生的沙滩上产卵，幼龟必须独自面对危险的旅程才能到达海洋。</p>
            </div>
          </div>
          
          <div v-else class="model-view">
            <div class="model-container">
              <!-- 3D模型容器 -->
              <div ref="seaTurtleModelContainer" class="model-canvas-container"></div>
            </div>
            
            <div class="model-controls">
              <el-button type="primary" @click="rotateModel">旋转模型</el-button>
              <el-button @click="resetModel">重置视角</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default defineComponent({
  name: 'MarineLifeGallery',
  setup() {
    const activeCreature = ref('sperm-whale');
    const viewMode = ref('image');
    
    // 模型容器引用
    const spermWhaleModelContainer = ref(null);
    const seaTurtleModelContainer = ref(null);
    
    // Three.js相关变量
    // eslint-disable-next-line no-unused-vars
    let currentScene = null;
    let currentCamera = null;
    let currentRenderer = null;
    let currentControls = null;
    let currentModel = null;
    let animationFrameId = null;
    
    // 模型路径配置
    const modelConfigs = {
      'sperm-whale': {
        path: '/models/sperm_whale.glb',
        scale: 0.5,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        cameraPosition: { x: 0, y: 1, z: 5 }
      },
      'sea-turtle': {
        path: '/models/hawksbill_sea_turtle.glb',
        scale: 0.5,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        cameraPosition: { x: 0, y: 1, z: 5 }
      }
    };
    
    // 抹香鲸图片数据
    const spermWhaleImages = [
      {
        url: '/images/marine-life/sperm-whale-1.jpg',
        alt: '抹香鲸',
        title: '深海潜水专家',
        description: '抹香鲸能够潜入3000米深的海洋，停留长达90分钟'
      },
      {
        url: '/images/marine-life/sperm-whale-2.jpg',
        alt: '抹香鲸群',
        title: '社会性生物',
        description: '抹香鲸通常以家族群体形式生活，有复杂的社交结构'
      }
    ];
    
    // 海龟图片数据
    const seaTurtleImages = [
      {
        url: '/images/marine-life/sea-turtle-1.jpg',
        alt: '海龟',
        title: '海洋漫游者',
        description: '海龟能够在大洋中游行数千公里，回到出生的海滩产卵'
      },
      {
        url: '/images/marine-life/sea-turtle-2.jpg',
        alt: '海龟幼崽',
        title: '新生一代',
        description: '小海龟孵化后立即面临到达大海的艰难旅程'
      }
    ];
    
    // 初始化Three.js场景
    const initThreeJS = (container, modelName) => {
      if (!container) return;
      
      // 创建场景
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f7fa);
      
      // 添加光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 10);
      scene.add(directionalLight);
      
      // 创建相机
      const camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
      );
      
      const config = modelConfigs[modelName];
      camera.position.set(
        config.cameraPosition.x,
        config.cameraPosition.y,
        config.cameraPosition.z
      );
      
      // 创建渲染器
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      
      // 清除容器中的内容，并添加canvas
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);
      
      // 添加轨道控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      
      // 加载模型
      loadModel(scene, modelName);
      
      // 保存当前状态
      currentScene = scene;
      currentCamera = camera;
      currentRenderer = renderer;
      currentControls = controls;
      
      // 开始动画循环
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        if (currentControls) currentControls.update();
        if (currentModel) currentModel.rotation.y += 0.001; // 缓慢自转
        
        renderer.render(scene, camera);
      };
      
      animate();
      
      // 处理窗口大小变化
      const handleResize = () => {
        if (!container) return;
        
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (renderer && renderer.domElement) {
          try {
            container.removeChild(renderer.domElement);
            renderer.dispose();
          } catch (e) {
            console.error('Error cleaning up renderer:', e);
          }
        }
      };
    };
    
    // 加载GLTF模型
    const loadModel = (scene, modelName) => {
      const loader = new GLTFLoader();
      const config = modelConfigs[modelName];
      
      // 显示加载中的提示
      const loadingElem = document.createElement('div');
      loadingElem.className = 'loading-model';
      loadingElem.textContent = '加载模型中...';
      
      const container = modelName === 'sperm-whale' 
        ? spermWhaleModelContainer.value 
        : seaTurtleModelContainer.value;
      
      if (container) {
        container.appendChild(loadingElem);
      }
      
      loader.load(
        config.path,
        (gltf) => {
          const model = gltf.scene;
          
          // 设置模型比例和位置
          model.scale.set(config.scale, config.scale, config.scale);
          model.position.set(
            config.position.x,
            config.position.y,
            config.position.z
          );
          model.rotation.set(
            config.rotation.x,
            config.rotation.y,
            config.rotation.z
          );
          
          // 移除旧模型（如果有）
          if (currentModel) {
            scene.remove(currentModel);
          }
          
          scene.add(model);
          currentModel = model;
          
          // 移除加载提示
          if (container && loadingElem.parentNode === container) {
            container.removeChild(loadingElem);
          }
        },
        (progress) => {
          // 处理加载进度
          const percent = Math.round((progress.loaded / progress.total) * 100);
          if (loadingElem) {
            loadingElem.textContent = `加载模型中... ${percent}%`;
          }
        },
        (error) => {
          console.error('模型加载错误:', error);
          if (container && loadingElem.parentNode === container) {
            loadingElem.textContent = '模型加载失败';
          }
        }
      );
    };
    
    // 处理选项卡切换
    const handleTabChange = (tab) => {
      activeCreature.value = tab;
      resetViewMode();
      
      // 如果当前是模型视图，则需要初始化新模型
      if (viewMode.value === 'model') {
        nextTick(() => {
          initModelView(activeCreature.value);
        });
      }
    };
    
    // 处理视图模式变化
    const handleViewModeChange = (mode) => {
      if (mode === 'model') {
        nextTick(() => {
          initModelView(activeCreature.value);
        });
      } else {
        // 清理Three.js资源
        cleanupThreeJS();
      }
    };
    
    // 初始化模型视图
    const initModelView = (creatureName) => {
      const container = creatureName === 'sperm-whale' 
        ? spermWhaleModelContainer.value 
        : seaTurtleModelContainer.value;
      
      if (container) {
        cleanupThreeJS();
        const cleanup = initThreeJS(container, creatureName);
        
        // 保存清理函数以便在组件卸载时调用
        if (cleanup) {
          onBeforeUnmount(cleanup);
        }
      }
    };
    
    // 清理Three.js资源
    const cleanupThreeJS = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      if (currentRenderer) {
        const container = activeCreature.value === 'sperm-whale' 
          ? spermWhaleModelContainer.value 
          : seaTurtleModelContainer.value;
        
        if (container && currentRenderer.domElement && currentRenderer.domElement.parentNode === container) {
          container.removeChild(currentRenderer.domElement);
        }
        
        currentRenderer.dispose();
        currentRenderer = null;
      }
      
      if (currentControls) {
        currentControls.dispose();
        currentControls = null;
      }
      
      currentScene = null;
      currentCamera = null;
      currentModel = null;
    };
    
    // 重置视图模式（切换生物时）
    const resetViewMode = () => {
      viewMode.value = 'image';
    };
    
    // 旋转模型
    const rotateModel = () => {
      if (currentModel) {
        // 实现模型旋转动画
        const rotateAnimation = () => {
          currentModel.rotation.y += 0.05;
          
          if (Math.abs(currentModel.rotation.y % (Math.PI * 2)) < 0.05) {
            // 完成一圈后停止
            return;
          }
          
          requestAnimationFrame(rotateAnimation);
        };
        
        rotateAnimation();
      }
    };
    
    // 重置模型视角
    const resetModel = () => {
      if (currentControls && currentCamera) {
        const config = modelConfigs[activeCreature.value];
        
        // 重置相机位置
        currentCamera.position.set(
          config.cameraPosition.x,
          config.cameraPosition.y,
          config.cameraPosition.z
        );
        
        // 重置控制器
        currentControls.reset();
        
        // 重置模型旋转
        if (currentModel) {
          currentModel.rotation.set(
            config.rotation.x,
            config.rotation.y,
            config.rotation.z
          );
        }
      }
    };
    
    // 组件挂载时检查是否需要初始化模型
    onMounted(() => {
      if (viewMode.value === 'model') {
        nextTick(() => {
          initModelView(activeCreature.value);
        });
      }
    });
    
    // 组件卸载时清理Three.js资源
    onBeforeUnmount(() => {
      cleanupThreeJS();
    });
    
    return {
      activeCreature,
      viewMode,
      spermWhaleImages,
      seaTurtleImages,
      spermWhaleModelContainer,
      seaTurtleModelContainer,
      handleTabChange,
      handleViewModeChange,
      resetViewMode,
      rotateModel,
      resetModel
    };
  }
});
</script>

<style scoped>
.marine-life-container {
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
  margin-bottom: 15px;
  color: #303133;
}

.page-header p {
  font-size: 1.2rem;
  color: #606266;
  max-width: 700px;
  margin: 0 auto;
}

.creature-tabs {
  margin-bottom: 30px;
}

.view-controls {
  text-align: center;
  margin-bottom: 30px;
}

.creature-content {
  padding: 20px 0;
}

.image-view, .model-view {
  margin-top: 20px;
}

.image-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.creature-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 20px;
}

.image-caption h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
}

.creature-info {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.creature-info h2 {
  margin-bottom: 20px;
  color: #303133;
}

.creature-info p {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #606266;
}

.model-container {
  height: 500px;
  background-color: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.model-placeholder {
  text-align: center;
  color: #909399;
}

.model-controls {
  text-align: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .image-caption h3 {
    font-size: 1.2rem;
  }
  
  .image-caption p {
    font-size: 0.9rem;
  }
}

.model-canvas-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.loading-model {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #303133;
  font-size: 1.2rem;
  text-align: center;
}
</style>
