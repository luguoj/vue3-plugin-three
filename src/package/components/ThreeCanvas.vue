<script setup lang="ts">
import {ref, watch} from "vue";
import * as Three from "three";
import * as ThreeAddons from "three/examples/jsm/Addons";
import {vPsrResizeObserver} from "@psr-framework/vue3-plugin-utils"

const props = defineProps<{
  threeCamara: Three.Camera,
  threeObjects: Three.Object3D[]
}>()

// 画布容器
const canvasRef = ref<HTMLElement>()
const canvasSize = ref<{ width: number, height: number }>({width: 0, height: 0})

// 监控更新画布尺寸
function handleResize(entry: ResizeObserverEntry) {
  canvasSize.value = {width: entry.contentRect.width, height: entry.contentRect.height}
}

// 检查WebGL兼容性
const isWebGLAvailable = ThreeAddons.WebGL.isWebGLAvailable();
// 创建渲染器
const renderer = new Three.WebGLRenderer();
//创建场景
const scene = new Three.Scene();
// 在画布上渲染场景
watch(canvasRef, canvas => {
  if (canvas) {
    canvas.appendChild(renderer.domElement);
    animate()
  }
})

// 每次刷新时进行场景绘制
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, props.threeCamara);
}

// 让渲染器尺寸随画布缩放
watch(canvasSize, canvasSize => {
  // 更新渲染器尺寸
  renderer.setSize(canvasSize.width, canvasSize.height, false);
  const camara = props.threeCamara
  if (camara instanceof Three.PerspectiveCamera) {
    // 更新透视相机长宽比
    camara.aspect = canvasSize.width != 0 ? (canvasSize.width / canvasSize.height) : 1
    camara.updateProjectionMatrix()
  }
})
// 为场景添加/移除对象
let currentThreeObjects: Three.Object3D[] = []
watch(() => props.threeObjects, threeObjects => {
  const toRemove = currentThreeObjects.filter(currentThreeObject => !threeObjects.includes(currentThreeObject))
  const toAdd = threeObjects.filter(threeObject => !currentThreeObjects.includes(threeObject))
  scene.remove(...toRemove)
  scene.add(...toAdd)
  currentThreeObjects = [...threeObjects]
}, {immediate: true})

</script>

<template>
  <div>
    <div style="height: 100%;width: 100%;" v-if="isWebGLAvailable" ref="canvasRef" v-psr-resize-observer="handleResize"/>
    <div v-else>WebGL is not available!</div>
  </div>
</template>

<style scoped>

</style>