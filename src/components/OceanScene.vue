<template>
  <div class="ocean-scene" ref="sceneContainer">
    <div v-if="mode === 'walk'" class="hint-panel">
      <p>PC：点击画面后鼠标锁定，使用 W/A/S/D 移动</p>
      <p>手机：单指滑动可旋转视角</p>
      <p>按 Esc 可退出鼠标锁定</p>
      <p>按 F 可切换全屏</p>
    </div>
    <div v-if="mode === 'vr'" class="hint-panel">
      <p>VR：左手摇杆移动，右手摇杆转向</p>
    </div>
    <button
      v-if="showFullscreenButton"
      class="fullscreen-btn"
      type="button"
      @click="toggleFullscreen"
    >
      {{ isFullscreen ? '退出全屏' : '进入全屏' }}
    </button>
    <div v-if="pointerLockFailed" class="warning-panel">
      浏览器阻止了鼠标锁定，请点击画面重试或检查权限设置。
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
    const isFullscreen = ref(false);
    const pointerLockFailed = ref(false);
    const showFullscreenButton = ref(false);

    let scene;
    let camera;
    let renderer;
    let clock;
    let pointerLockControls;
    let vrController0;
    let vrController1;
    let vrButtonElement;
    let vrSession = null;
    let vrBaseReferenceSpace = null;
    const vrPlayerPosition = new THREE.Vector3(0, 0, 0);
    let vrPlayerYaw = 0;
    let onXRSessionStart;
    let onXRSessionEnd;
    let onControllerConnected;
    let onControllerDisconnected;
    let onRendererClick;
    let onPointerLockError;
    let onPointerLockChange;
    let onKeyDown;
    let onKeyUp;
    let onTouchStart;
    let onTouchMove;
    let onTouchEnd;
    let onFullscreenChange;

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

    const forwardVector = new THREE.Vector3();
    const rightVector = new THREE.Vector3();
    const moveVector = new THREE.Vector3();
    const playerQuaternion = new THREE.Quaternion();
    const playerMatrix = new THREE.Matrix4();
    const inversePlayerMatrix = new THREE.Matrix4();
    const inversePlayerPosition = new THREE.Vector3();
    const inversePlayerQuaternion = new THREE.Quaternion();
    const inversePlayerScale = new THREE.Vector3();
    const vrInputAxes = {
      left: { x: 0, y: 0 },
      right: { x: 0, y: 0 }
    };

    const onWindowResize = () => {
      if (!sceneContainer.value || !camera || !renderer) {
        return;
      }

      const width = sceneContainer.value.clientWidth;
      const height = sceneContainer.value.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, props.mode === 'walk' ? 1.5 : 2));
    };

    const buildScene = () => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b1f35);
      scene.fog = new THREE.Fog(0x0b1f35, 30, 200);

      camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
      camera.position.set(0, 1.7, 5);

      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = props.mode !== 'walk';
      renderer.xr.enabled = props.mode === 'vr';
      if (props.mode === 'vr') {
        renderer.xr.setReferenceSpaceType('local-floor');
      }

      if (sceneContainer.value) {
        sceneContainer.value.appendChild(renderer.domElement);
      }

      onWindowResize();

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(8, 12, 6);
      directionalLight.castShadow = props.mode !== 'walk';
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      const hemisphereLight = new THREE.HemisphereLight(0xb4e4ff, 0x1f2b3a, 0.5);
      scene.add(hemisphereLight);
    };

    const loadMuseumModel = () => {
      const loader = new GLTFLoader();

      loader.load(
        props.modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.castShadow = props.mode !== 'walk';
              obj.receiveShadow = props.mode !== 'walk';
            }
          });
          scene.add(model);
        },
        undefined,
        (error) => {
          console.error(`模型加载失败：${props.modelUrl}`, error);
        }
      );
    };

    const setupWalkMode = () => {
      pointerLockControls = new PointerLockControls(camera, renderer.domElement);
      pointerLockControls.pointerSpeed = 0.85;
      scene.add(pointerLockControls.object);

      onRendererClick = () => {
        pointerLockFailed.value = false;
        if (!pointerLockControls.isLocked) {
          pointerLockControls.lock(true);
        }
      };
      renderer.domElement.addEventListener('click', onRendererClick);

      onPointerLockError = () => {
        pointerLockFailed.value = true;
      };
      document.addEventListener('pointerlockerror', onPointerLockError);

      onPointerLockChange = () => {
        if (pointerLockControls.isLocked) {
          pointerLockFailed.value = false;
        }
      };
      document.addEventListener('pointerlockchange', onPointerLockChange);

      onKeyDown = (event) => {
        if (event.code === 'KeyF' && !event.repeat) {
          event.preventDefault();
          toggleFullscreen();
          return;
        }

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
        document.removeEventListener('pointerlockerror', onPointerLockError);
        document.removeEventListener('pointerlockchange', onPointerLockChange);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        renderer.domElement.removeEventListener('touchstart', onTouchStart);
        renderer.domElement.removeEventListener('touchmove', onTouchMove);
        renderer.domElement.removeEventListener('touchend', onTouchEnd);
      };
    };

    const setupVRMode = () => {
      vrButtonElement = VRButton.createButton(renderer);
      if (sceneContainer.value) {
        sceneContainer.value.appendChild(vrButtonElement);
      }

      vrController0 = renderer.xr.getController(0);
      vrController1 = renderer.xr.getController(1);

      onControllerConnected = (event) => {
        const handedness = event?.data?.handedness || 'none';
        const gamepad = event?.data?.gamepad;
        if (!gamepad) {
          return;
        }

        if (handedness === 'left') {
          vrInputAxes.left.x = 0;
          vrInputAxes.left.y = 0;
        } else if (handedness === 'right') {
          vrInputAxes.right.x = 0;
          vrInputAxes.right.y = 0;
        }
      };

      onControllerDisconnected = () => {
        vrInputAxes.left.x = 0;
        vrInputAxes.left.y = 0;
        vrInputAxes.right.x = 0;
        vrInputAxes.right.y = 0;
      };

      vrController0.addEventListener('connected', onControllerConnected);
      vrController0.addEventListener('disconnected', onControllerDisconnected);
      vrController1.addEventListener('connected', onControllerConnected);
      vrController1.addEventListener('disconnected', onControllerDisconnected);
      scene.add(vrController0);
      scene.add(vrController1);

      onXRSessionStart = () => {
        vrSession = renderer.xr.getSession() || null;
        vrBaseReferenceSpace = renderer.xr.getReferenceSpace() || null;
        vrPlayerPosition.set(0, 0, 0);
        vrPlayerYaw = 0;
        updateVRReferenceSpace();
      };
      onXRSessionEnd = () => {
        vrSession = null;
        vrBaseReferenceSpace = null;
        vrPlayerPosition.set(0, 0, 0);
        vrPlayerYaw = 0;
      };
      renderer.xr.addEventListener('sessionstart', onXRSessionStart);
      renderer.xr.addEventListener('sessionend', onXRSessionEnd);

      return () => {
        if (vrController0) {
          vrController0.removeEventListener('connected', onControllerConnected);
          vrController0.removeEventListener('disconnected', onControllerDisconnected);
        }
        if (vrController1) {
          vrController1.removeEventListener('connected', onControllerConnected);
          vrController1.removeEventListener('disconnected', onControllerDisconnected);
        }
        renderer.xr.removeEventListener('sessionstart', onXRSessionStart);
        renderer.xr.removeEventListener('sessionend', onXRSessionEnd);
        vrSession = null;
        vrBaseReferenceSpace = null;
        vrPlayerPosition.set(0, 0, 0);
        vrPlayerYaw = 0;
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

      const currentPosition = pointerLockControls.object.position;
      currentPosition.y = 1.7;
    };

    const getSourceAxes = (axes = []) => {
      if (axes.length >= 4) {
        const altX = axes[2] ?? 0;
        const altY = axes[3] ?? 0;
        if (Math.abs(altX) > 0.01 || Math.abs(altY) > 0.01) {
          return { x: altX, y: altY };
        }
      }

      return {
        x: axes[0] ?? 0,
        y: axes[1] ?? 0
      };
    };

    const updateVRReferenceSpace = () => {
      if (!renderer || !vrBaseReferenceSpace) {
        return;
      }

      playerQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), vrPlayerYaw);
      playerMatrix.compose(vrPlayerPosition, playerQuaternion, new THREE.Vector3(1, 1, 1));
      inversePlayerMatrix.copy(playerMatrix).invert();
      inversePlayerMatrix.decompose(inversePlayerPosition, inversePlayerQuaternion, inversePlayerScale);

      const xrTransform = new XRRigidTransform(
        {
          x: inversePlayerPosition.x,
          y: inversePlayerPosition.y,
          z: inversePlayerPosition.z
        },
        {
          x: inversePlayerQuaternion.x,
          y: inversePlayerQuaternion.y,
          z: inversePlayerQuaternion.z,
          w: inversePlayerQuaternion.w
        }
      );

      renderer.xr.setReferenceSpace(vrBaseReferenceSpace.getOffsetReferenceSpace(xrTransform));
    };

    const moveInVRMode = (delta) => {
      if (!renderer.xr.isPresenting || !vrSession || !vrBaseReferenceSpace) {
        return;
      }

      let fallbackMoveX = 0;
      let fallbackMoveY = 0;
      for (const source of vrSession.inputSources) {
        const gamepad = source?.gamepad;
        if (!gamepad || !gamepad.axes) {
          continue;
        }

        const axes = getSourceAxes(gamepad.axes);
        if (source.handedness === 'left') {
          vrInputAxes.left.x = axes.x;
          vrInputAxes.left.y = axes.y;
        } else if (source.handedness === 'right') {
          vrInputAxes.right.x = axes.x;
          vrInputAxes.right.y = axes.y;
        } else {
          fallbackMoveX += axes.x;
          fallbackMoveY += axes.y;
        }
      }

      let moveX = vrInputAxes.left.x;
      let moveY = vrInputAxes.left.y;
      let turnX = vrInputAxes.right.x;

      if (!moveX && !moveY && !turnX) {
        moveX = fallbackMoveX;
        moveY = fallbackMoveY;
      }

      moveX = THREE.MathUtils.clamp(moveX, -1, 1);
      moveY = THREE.MathUtils.clamp(moveY, -1, 1);
      turnX = THREE.MathUtils.clamp(turnX, -1, 1);

      const deadZone = 0.1;
      if (Math.abs(moveX) < deadZone) {
        moveX = 0;
      }
      if (Math.abs(moveY) < deadZone) {
        moveY = 0;
      }
      if (Math.abs(turnX) < deadZone) {
        turnX = 0;
      }

      if (turnX) {
        const turnSpeed = 1.3;
        vrPlayerYaw -= turnX * turnSpeed * delta;
      }

      const xrCamera = renderer.xr.getCamera(camera);
      forwardVector.set(0, 0, -1).applyQuaternion(xrCamera.quaternion);
      forwardVector.y = 0;
      forwardVector.normalize();

      rightVector.set(1, 0, 0).applyQuaternion(xrCamera.quaternion);
      rightVector.y = 0;
      rightVector.normalize();

      moveVector
        .copy(forwardVector)
        .multiplyScalar(-moveY)
        .add(rightVector.multiplyScalar(moveX));

      if (moveVector.lengthSq() > 1) {
        moveVector.normalize();
      }

      if (moveX || moveY) {
        const speed = 3.2;
        vrPlayerPosition.addScaledVector(moveVector, speed * delta);
      }

      updateVRReferenceSpace();
    };

    const toggleFullscreen = async () => {
      const container = sceneContainer.value;
      if (!container) {
        return;
      }

      try {
        if (!document.fullscreenElement) {
          await container.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.warn('全屏切换失败：', error);
      }
    };

    let teardownModeListeners = null;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);

      if (props.mode === 'walk') {
        moveInWalkMode(delta);
      } else if (props.mode === 'vr') {
        moveInVRMode(delta);
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

      showFullscreenButton.value = !('ontouchstart' in window) && props.mode === 'walk';

      onFullscreenChange = () => {
        isFullscreen.value = Boolean(document.fullscreenElement);
        setTimeout(() => {
          onWindowResize();
        }, 60);
      };
      document.addEventListener('fullscreenchange', onFullscreenChange);

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

      document.removeEventListener('fullscreenchange', onFullscreenChange);

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
      sceneContainer,
      isFullscreen,
      pointerLockFailed,
      showFullscreenButton,
      toggleFullscreen
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

.fullscreen-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  border: 0;
  border-radius: 8px;
  padding: 9px 14px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.55);
  cursor: pointer;
}

.fullscreen-btn:hover {
  background: rgba(0, 0, 0, 0.72);
}

.warning-panel {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 2;
  border-radius: 8px;
  padding: 8px 10px;
  color: #fff;
  background: rgba(170, 40, 40, 0.72);
  font-size: 13px;
}
</style>
