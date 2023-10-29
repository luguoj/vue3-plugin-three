<script lang="ts" setup>
import * as THREE from "three";
import {PsrThree, PsrThreeCanvas} from "../../package";
import {DragControls} from 'three/examples/jsm/Addons';
// 创建渲染器
const rendererContext = PsrThree.createRenderer({
  antialias: true, // 启用抗锯齿
})

// 创建场景
const sceneContext = PsrThree.createScene<THREE.PerspectiveCamera>()
rendererContext.sceneContextRef.value = sceneContext

// 创建相机
const camera = new THREE.PerspectiveCamera(
    75,  // 视野角度
    1, // 长宽比
    0.1, // 近截面
    1000, // 远截面
);
camera.position.z = 5;
sceneContext.cameraContextRef.value = PsrThree.createCamera(camera).enableAspectAdaption(rendererContext.sizeRef)

// 为场景添加模型
function createCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  return new THREE.Mesh(geometry, material);
}

const cube = createCube();
const cube2 = createCube();
cube2.position.set(2, 0, 0)
sceneContext.objects.push(cube)
sceneContext.objects.push(cube2)

// 为模型添加动画
rendererContext.events.update.on(delta => {
  cube.rotation.x += delta
  cube.rotation.y += delta
})

// 对需要拖拽的组件创建拖拽控制器
const controls = new DragControls(sceneContext.objects, camera, rendererContext.renderer.domElement);
// 添加拖拽开始结束事件监听
controls.addEventListener('dragstart', function (event) {
  if (event.object instanceof THREE.Mesh) {
    event.object.material.color.set(0xaaaaaa);
  }
});
controls.addEventListener('dragend', function (event) {
  if (event.object instanceof THREE.Mesh) {
    event.object.material.color.set(0x00ffff);
  }
});
// 添加鼠标覆盖事件
controls.addEventListener('hoveron', function (event) {
  if (event.object instanceof THREE.Mesh) {
    event.object.material.color.set(0x00ffff);
  }
});
controls.addEventListener('hoveroff', function (event) {
  if (event.object instanceof THREE.Mesh) {
    event.object.material.color.set(0x00ff00);
  }
});
</script>

<template>
  <psr-three-canvas
      :renderer-context="rendererContext"
  />
</template>

<style scoped>

</style>