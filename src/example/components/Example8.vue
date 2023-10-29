<script lang="ts" setup>
import {watch} from "vue";
import * as THREE from "three";
import {PsrThree, PsrThreeCanvas} from "../../package";
import {FirstPersonControls} from 'three/addons';
// 创建渲染器
const rendererContext = PsrThree.createRenderer({
  antialias: true, // 启用抗锯齿
})

// 创建场景
const sceneContext = PsrThree.createScene<THREE.PerspectiveCamera>()
rendererContext.sceneContextRef.value = sceneContext

// 创建相机
const camera = PsrThree.createPerspectiveCamera().autoAspect(rendererContext.sizeRef)
camera.camera.position.set(0, 0, 5);
camera.camera.lookAt(new THREE.Vector3(0, 0, 0))
sceneContext.cameraContextRef.value = camera

// 为场景添加模型
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
sceneContext.objects.push(cube)

// 为模型添加动画
rendererContext.events.update.on(delta => {
  cube.rotation.x += delta
  cube.rotation.y += delta
})


// 对需要控制的摄像机创建第一人称控制器
const controls = new FirstPersonControls(camera.camera, rendererContext.renderer.domElement);
controls.lookSpeed = 0.05; //鼠标移动查看的速度
controls.movementSpeed = 10; //相机移动速度
controls.constrainVertical = true; //约束垂直
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;
rendererContext.events.update.on(delta => {
  controls.update(delta)
})
watch(rendererContext.sizeRef,()=>{
  controls.handleResize()
})
</script>

<template>
  <psr-three-canvas
      :renderer-context="rendererContext"
  />
</template>

<style scoped>

</style>