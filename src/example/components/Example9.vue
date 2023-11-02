<script lang="ts" setup>
import * as THREE from "three";
import {PsrThree, PsrThreeCanvas} from "../../package";
import {PointerLockControls} from 'three/examples/jsm/Addons';

const context = PsrThree.createContext()
// 创建渲染器
const rendererContext = context.useRenderer('renderer', {
  antialias: true, // 启用抗锯齿
})

// 创建场景
const sceneContext = context.useScene<THREE.PerspectiveCamera>('scene')
rendererContext.sceneContextRef.value = sceneContext

// 创建相机
const camera = context.usePerspectiveCamera('camera').autoAspect(rendererContext.sizeRef)
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

// 对需要控制的摄像机创建指针锁定控制器
let controls: PointerLockControls = new PointerLockControls(camera.camera, rendererContext.renderer.domElement);

</script>

<template>
  <psr-Three-canvas
      :renderer-context="rendererContext"
      @click="controls?.lock()"
  />
</template>

<style scoped>

</style>