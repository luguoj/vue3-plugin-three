<script lang="ts" setup>
import {onUnmounted} from "vue";
import * as Three from "three";
import {PsrThreeCanvas} from "../../package";
// 创建相机
const camera = new Three.PerspectiveCamera(
    75,  // 视野角度
    1, // 长宽比
    0.1, // 近截面
    1000, // 远截面
);
camera.position.z = 5;

// 为场景添加模型
const geometry = new Three.BoxGeometry(1, 1, 1);
const material = new Three.MeshBasicMaterial({color: 0x00ff00});
const cube = new Three.Mesh(geometry, material);
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
  <psr-three-canvas
      :three-camara="camera"
      :three-objects="[cube]"
  />
</template>

<style scoped>

</style>