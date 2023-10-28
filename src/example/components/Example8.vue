<script lang="ts" setup>
import {ref} from "vue";
import * as Three from "three";
import {PsrThreeCanvas} from "../../package";
import {FirstPersonControls} from 'three/examples/jsm/Addons';
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
function rotateCube(delta: number) {
  cube.rotation.x += delta
  cube.rotation.y += delta
}

// 创建渲染器
const renderer = new Three.WebGLRenderer({
  antialias: true, // 启用抗锯齿
});

// 对需要控制的摄像机创建第一人称控制器
const controls = new FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed = 0.05; //鼠标移动查看的速度
controls.movementSpeed = 10; //相机移动速度
controls.noFly = true;
controls.constrainVertical = true; //约束垂直
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;
controls.lon = -100; //进入初始视角x轴的角度
controls.lat = 0; //初始视角进入后y轴的角度

function handleDraw(delta: number) {
  controls.update(delta)
  rotateCube(delta)
}

function handleResize(size: { width: number, height: number }) {
  controls.handleResize()
}
</script>

<template>
  <psr-three-canvas
      :three-renderer="renderer"
      :three-camara="camera"
      :three-objects="objects"
      @three-draw="handleDraw"
      @three-resize="handleResize"
  />
</template>

<style scoped>

</style>