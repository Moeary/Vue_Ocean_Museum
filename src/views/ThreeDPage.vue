<template>
  <section class="three-d-page">
    <div class="page-header">
      <h1>3D 展馆浏览</h1>
      <p>PC 支持鼠标锁定 + W/A/S/D 移动与一键全屏，手机支持单指旋转视角。</p>
    </div>
    <div class="scene-wrapper">
      <OceanScene mode="walk" model-url="/models/museum.glb" />
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue';
import OceanScene from '../components/OceanScene.vue';

export default defineComponent({
  name: 'ThreeDPage',
  components: {
    OceanScene
  }
});
</script>

<style scoped>
.three-d-page {
  padding: 16px;
}

.page-header {
  margin-bottom: 12px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 28px;
  color: #1f2b3a;
}

.page-header p {
  margin: 0;
  color: #606266;
}

.scene-wrapper {
  height: calc(100vh - 240px);
  min-height: 520px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

@media (max-width: 768px) {
  .three-d-page {
    padding: 10px;
  }

  .scene-wrapper {
    height: calc(100vh - 200px);
    min-height: 480px;
  }
}
</style>
