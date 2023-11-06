<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {DragControls} from 'three/examples/jsm/Addons';
import {createExampleContext} from "./createExampleContext.ts";

const {context, renderer, scene, camera} = createExampleContext()

camera.object.position.set(0, 0, 5);
camera.object.lookAt(new THREE.Vector3(0, 0, 0))

// 为场景添加模型
function createCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  return new THREE.Mesh(geometry, material);
}

const cube = createCube();
const cube2 = createCube();
cube2.position.set(2, 0, 0)
scene.objects.push(context.useObject('c1', cube))
scene.objects.push(context.useObject('c2', cube2))

// 为模型添加动画
renderer.events.update.on(delta => {
  cube.rotation.x += delta
  cube.rotation.y += delta
})

// 对需要拖拽的组件创建拖拽控制器
const controls = new DragControls(scene.objects.map(object => object.object), camera.object, renderer.renderer.domElement);
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
      :renderer-context="renderer"
  />
</template>

<style scoped>

</style>