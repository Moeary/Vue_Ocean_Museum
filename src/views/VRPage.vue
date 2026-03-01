<template>
  <section class="vr-page">
    <div class="page-header">
      <h1>VR 沉浸模式</h1>
      <p>Quest 3 中点击控制器可传送到地面目标点。</p>
    </div>
    <div class="scene-wrapper">
      <OceanScene mode="vr" model-url="/models/museum.glb" />
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue';
import OceanScene from '../components/OceanScene.vue';

export default defineComponent({
  name: 'VRPage',
  components: {
    OceanScene
  }
});
</script>

<style scoped>
.vr-page {
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
  .vr-page {
    padding: 10px;
  }

  .scene-wrapper {
    height: calc(100vh - 200px);
    min-height: 480px;
  }
}
</style>
