<script lang="ts" setup>
import * as THREE from "three";
import {PsrThree, PsrThreeCanvas} from "../../package";
const context = PsrThree.createContext()
// 创建渲染器
const rendererContext = context.useRenderer('renderer')

// 创建场景
const sceneContext = context.useScene<THREE.PerspectiveCamera>('scene')
rendererContext.sceneContextRef.value = sceneContext

// 创建相机
const camera = context.usePerspectiveCamera('camera').autoAspect(rendererContext.sizeRef)
camera.camera.position.z = 5;
sceneContext.cameraContextRef.value = camera

// 为场景添加模型
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
sceneContext.objects.push(cube)

// 添加动画
function animate(delta: number) {
  cube.rotation.x += delta
  cube.rotation.y += delta
}

rendererContext.events.update.on(animate)

</script>

<template>
  <psr-three-canvas
      :renderer-context="rendererContext"
  />
</template>

<style scoped>

</style>