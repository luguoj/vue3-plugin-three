<script lang="ts" setup>
import {watch} from "vue";
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {FirstPersonControls} from 'three/addons';
import {createExampleContext} from "./createExampleContext.ts";


const {context, renderer, scene, camera} = createExampleContext()

camera.object.position.set(0, 0, 5);
camera.object.lookAt(new THREE.Vector3(0, 0, 0))

// 为场景添加模型
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.objects.push(context.useObject('cube', cube))

// 为模型添加动画
renderer.events.update.on(delta => {
  cube.rotation.x += delta
  cube.rotation.y += delta
})


// 对需要控制的摄像机创建第一人称控制器
const controls = new FirstPersonControls(camera.object, renderer.renderer.domElement);
controls.lookSpeed = 0.05; //鼠标移动查看的速度
controls.movementSpeed = 10; //相机移动速度
controls.constrainVertical = true; //约束垂直
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;
renderer.events.update.on(delta => {
  controls.update(delta)
})
watch(renderer.size, () => {
  controls.handleResize()
})
</script>

<template>
  <psr-three-canvas
      :renderer-context="renderer"
  />
</template>

<style scoped>

</style>