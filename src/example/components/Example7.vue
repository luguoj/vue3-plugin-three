<script lang="ts" setup>
import {onUnmounted, ref, toRaw} from "vue";
import * as Three from "three";
import {PsrThreeCanvas} from "../../package";
import {DragControls} from 'three/examples/jsm/Addons';
// 创建相机
const camera = new Three.PerspectiveCamera(
    75,  // 视野角度
    1, // 长宽比
    0.1, // 近截面
    1000, // 远截面
);
camera.position.z = 5;

// 为场景添加模型
const objects = ref<Three.Object3D[]>([])
const geometry = new Three.BoxGeometry(1, 1, 1);
const material = new Three.MeshBasicMaterial({color: 0x00ff00});
const cube = new Three.Mesh(geometry, material);
objects.value.push(cube)
// 为模型添加动画
const aniInterval = setInterval(() => {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
}, 1000 / 100)

onUnmounted(() => {
  clearInterval(aniInterval)
})

// 创建渲染器
const renderer = new Three.WebGLRenderer({
  antialias: true, // 启用抗锯齿
});

// 对需要拖拽的组件创建拖拽控制器
const controls = new DragControls(toRaw(objects.value), camera, renderer.domElement);
// 添加拖拽开始结束事件监听
controls.addEventListener('dragstart', function (event) {
    event.object.material.color.set(0xaaaaaa);
});
controls.addEventListener('dragend', function (event) {
  event.object.material.color.set(0x00ffff);
});
// 添加鼠标覆盖事件
controls.addEventListener('hoveron', function (event) {
  event.object.material.color.set(0x00ffff);
});
controls.addEventListener('hoveroff', function (event) {
  event.object.material.color.set(0x00ff00);
});
</script>

<template>
  <psr-three-canvas
      :three-renderer="renderer"
      :three-camara="camera"
      :three-objects="objects"
  />
</template>

<style scoped>

</style>