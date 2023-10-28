<script lang="ts" setup>

import * as THREE from "three";
import {onUnmounted, ref, watch} from "vue";
import {vPsrResizeObserver} from "@psr-framework/vue3-plugin-utils"

// 画布容器
const canvasRef = ref<HTMLElement>()
const canvasSize = ref<{ width: number, height: number }>({width: 0, height: 0})

// 监控更新画布尺寸
function handleResize(entry: ResizeObserverEntry) {
  canvasSize.value = {width: entry.contentRect.width, height: entry.contentRect.height}
}

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
// 创建相机
const camera = new THREE.PerspectiveCamera(
    75,  // 视野角度
    1, // 长宽比
    0.1, // 近截面
    1000, // 远截面
);
camera.position.z = 5;
//创建场景
const scene = new THREE.Scene();
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
  renderer.render(scene, camera);
}

// 让渲染器尺寸随画布缩放
watch(canvasSize, canvasSize => {
  // 更新渲染器尺寸
  renderer.setSize(canvasSize.width, canvasSize.height, false);
  // 更新相机长宽比
  camera.aspect = canvasSize.width != 0 ? (canvasSize.width / canvasSize.height) : 1
  camera.updateProjectionMatrix()
})


// 为场景添加模型
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
// 为模型添加动画
const aniInterval = setInterval(() => {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
}, 1000 / 100)

onUnmounted(() => {
  clearInterval(aniInterval)
})
</script>

<template>
  <div ref="canvasRef" v-psr-resize-observer="handleResize"/>
</template>

<style scoped>

</style>