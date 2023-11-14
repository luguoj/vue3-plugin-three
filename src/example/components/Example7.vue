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

const cube = context.useObject('c1', createCube());
scene.children.push(cube)
const cube2 = context.useObject('c2', createCube());
cube2.object.position.set(2, 0, 0)
cube2.updateHandlers.add((delta, ctx) => {
  ctx.object.rotation.x += delta
  ctx.object.rotation.y += delta
  return true
})
scene.children.push(cube2)

// 对需要拖拽的组件创建拖拽控制器
const controls = new DragControls([], camera.object, renderer.renderer.domElement);
controls.getObjects().push(...scene.children.map(object => object.object))
controls.addEventListener('drag', function (event) {
});
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
      state-enabled
  />
</template>

<style scoped>

</style>