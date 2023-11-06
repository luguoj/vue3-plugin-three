<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";

const {context, renderer, scene, camera} = createExampleContext()

camera.object.position.z = 5;

// 为场景添加模型
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.objects.push(context.useObject('cube', cube))

const edges = new THREE.EdgesGeometry(geometry)
const lineModel = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: 0x4b96ff,
      depthTest: false,
      transparent: true
    })
)
scene.objects.push(context.useObject('line', lineModel))

// 添加动画
function animate(delta: number) {
  cube.rotation.x += delta
  cube.rotation.y += delta
  lineModel.rotation.x += delta
  lineModel.rotation.y += delta
}

renderer.events.update.on(animate)

</script>

<template>
  <psr-three-canvas
      :renderer-context="renderer"
  />
</template>

<style scoped>

</style>