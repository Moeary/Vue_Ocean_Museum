<template>
  <div class="ocean-scene" ref="sceneContainer">
    <div v-if="mode === 'walk'" class="hint-panel">
      <p>PC：点击画面后鼠标锁定，使用 W/A/S/D 移动</p>
      <p>手机：单指滑动可旋转视角</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

export default defineComponent({
  name: 'OceanScene',
  props: {
    modelUrl: {
      type: String,
      default: '/models/museum.glb'
    },
    mode: {
      type: String,
      default: 'default'
    }
  },
  emits: ['ready'],
  setup(props, { emit }) {
    const sceneContainer = ref(null);

    let scene;
    let camera;
    let renderer;
    let clock;
    let pointerLockControls;
    let raycaster;
    let controller1;
    let controller2;
    let floorMesh;
    let playerRig;
    let vrButtonElement;
    let onRendererClick;
    let onKeyDown;
    let onKeyUp;
    let onTouchStart;
    let onTouchMove;
    let onTouchEnd;
    let onController1Select;
    let onController2Select;

    const keyboardState = {
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false
    };

    let touchActive = false;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let yaw = 0;
    let pitch = 0;

    const tempMatrix = new THREE.Matrix4();

    const onWindowResize = () => {
      if (!sceneContainer.value || !camera || !renderer) {
        return;
      }

      const width = sceneContainer.value.clientWidth;
      const height = sceneContainer.value.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const buildScene = () => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b1f35);
      scene.fog = new THREE.Fog(0x0b1f35, 30, 200);

      camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
      camera.position.set(0, 1.7, 5);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.xr.enabled = props.mode === 'vr';

      if (sceneContainer.value) {
        sceneContainer.value.appendChild(renderer.domElement);
      }

      onWindowResize();

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(8, 12, 6);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      const hemisphereLight = new THREE.HemisphereLight(0xb4e4ff, 0x1f2b3a, 0.5);
      scene.add(hemisphereLight);

      floorMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        new THREE.MeshStandardMaterial({
          color: 0x12314d,
          roughness: 1,
          metalness: 0
        })
      );
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = 0;
      floorMesh.receiveShadow = true;
      floorMesh.name = 'teleportable-ground';
      scene.add(floorMesh);
    };

    const loadMuseumModel = () => {
      const loader = new GLTFLoader();

      loader.load(
        props.modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
            }
          });
          scene.add(model);
        },
        undefined,
        () => {
          if (props.modelUrl !== '/models/鲸鱼馆大厅.glb') {
            loader.load(
              '/models/鲸鱼馆大厅.glb',
              (gltf) => {
                const fallbackModel = gltf.scene;
                fallbackModel.traverse((obj) => {
                  if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                  }
                });
                scene.add(fallbackModel);
              },
              undefined,
              (error) => {
                console.error('模型加载失败：', error);
              }
            );
          }
        }
      );
    };

    const setupWalkMode = () => {
      pointerLockControls = new PointerLockControls(camera, renderer.domElement);
      scene.add(pointerLockControls.getObject());

      onRendererClick = () => {
        if (!pointerLockControls.isLocked) {
          pointerLockControls.lock();
        }
      };
      renderer.domElement.addEventListener('click', onRendererClick);

      onKeyDown = (event) => {
        if (event.code in keyboardState) {
          keyboardState[event.code] = true;
        }
      };

      onKeyUp = (event) => {
        if (event.code in keyboardState) {
          keyboardState[event.code] = false;
        }
      };

      onTouchStart = (event) => {
        if (!event.touches.length) {
          return;
        }
        touchActive = true;
        lastTouchX = event.touches[0].clientX;
        lastTouchY = event.touches[0].clientY;
      };

      onTouchMove = (event) => {
        if (!touchActive || !event.touches.length || pointerLockControls?.isLocked) {
          return;
        }

        const touch = event.touches[0];
        const deltaX = touch.clientX - lastTouchX;
        const deltaY = touch.clientY - lastTouchY;
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;

        const rotateSpeed = 0.0035;
        yaw -= deltaX * rotateSpeed;
        pitch -= deltaY * rotateSpeed;
        pitch = THREE.MathUtils.clamp(pitch, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05);

        camera.rotation.order = 'YXZ';
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;
      };

      onTouchEnd = () => {
        touchActive = false;
      };

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
      renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: true });
      renderer.domElement.addEventListener('touchend', onTouchEnd, { passive: true });

      return () => {
        renderer.domElement.removeEventListener('click', onRendererClick);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        renderer.domElement.removeEventListener('touchstart', onTouchStart);
        renderer.domElement.removeEventListener('touchmove', onTouchMove);
        renderer.domElement.removeEventListener('touchend', onTouchEnd);
      };
    };

    const setupVRMode = () => {
      playerRig = new THREE.Group();
      playerRig.position.copy(camera.position);
      playerRig.add(camera);
      scene.add(playerRig);

      vrButtonElement = VRButton.createButton(renderer);
      if (sceneContainer.value) {
        sceneContainer.value.appendChild(vrButtonElement);
      }

      raycaster = new THREE.Raycaster();

      const teleportToPoint = (controller) => {
        tempMatrix.identity().extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersections = raycaster.intersectObject(floorMesh, false);
        if (intersections.length > 0 && playerRig) {
          const hitPoint = intersections[0].point;
          playerRig.position.set(hitPoint.x, 1.7, hitPoint.z);
        }
      };

      controller1 = renderer.xr.getController(0);
      controller2 = renderer.xr.getController(1);
      onController1Select = () => teleportToPoint(controller1);
      onController2Select = () => teleportToPoint(controller2);
      controller1.addEventListener('selectstart', onController1Select);
      controller2.addEventListener('selectstart', onController2Select);
      scene.add(controller1);
      scene.add(controller2);

      return () => {
        if (controller1) {
          controller1.removeEventListener('selectstart', onController1Select);
        }
        if (controller2) {
          controller2.removeEventListener('selectstart', onController2Select);
        }
      };
    };

    const moveInWalkMode = (delta) => {
      if (!pointerLockControls) {
        return;
      }

      const moveSpeed = 4;

      if (keyboardState.KeyW) {
        pointerLockControls.moveForward(moveSpeed * delta);
      }
      if (keyboardState.KeyS) {
        pointerLockControls.moveForward(-moveSpeed * delta);
      }
      if (keyboardState.KeyA) {
        pointerLockControls.moveRight(-moveSpeed * delta);
      }
      if (keyboardState.KeyD) {
        pointerLockControls.moveRight(moveSpeed * delta);
      }

      const currentPosition = pointerLockControls.getObject().position;
      currentPosition.y = 1.7;
    };

    let teardownModeListeners = null;

    const animate = () => {
      const delta = clock.getDelta();

      if (props.mode === 'walk') {
        moveInWalkMode(delta);
      }

      renderer.render(scene, camera);
    };

    onMounted(() => {
      buildScene();
      loadMuseumModel();

      if (props.mode === 'walk') {
        teardownModeListeners = setupWalkMode();
      } else if (props.mode === 'vr') {
        teardownModeListeners = setupVRMode();
      }

      clock = new THREE.Clock();
      renderer.setAnimationLoop(animate);

      window.addEventListener('resize', onWindowResize);

      emit('ready', {
        scene,
        camera,
        renderer,
        mode: props.mode
      });
    });

    onUnmounted(() => {
      window.removeEventListener('resize', onWindowResize);

      if (teardownModeListeners) {
        teardownModeListeners();
      }

      if (renderer) {
        renderer.setAnimationLoop(null);
      }

      if (vrButtonElement && vrButtonElement.parentElement) {
        vrButtonElement.parentElement.removeChild(vrButtonElement);
      }

      if (scene) {
        scene.traverse((obj) => {
          if (obj.geometry) {
            obj.geometry.dispose();
          }
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((material) => material.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
      }

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      }

    });

    return {
      sceneContainer
    };
  }
});
</script>

<style scoped>
.ocean-scene {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: #0b1f35;
  overflow: hidden;
}

.ocean-scene :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.hint-panel {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.45);
  color: #ffffff;
  font-size: 13px;
  line-height: 1.6;
}

.hint-panel p {
  margin: 0;
}
</style>
