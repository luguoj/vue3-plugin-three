<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";

const {renderer, context, scene, camera} = createExampleContext()
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0)


// 为场景添加模型
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const material = new THREE.MeshLambertMaterial()
const cube = context.useObject('cube', new THREE.Mesh(geometry, material));
cube.helperOptions.value = true
scene.objects.push(cube)
renderer.events.update.on(delta => {
  cube.object.rotation.x += delta
  cube.object.rotation.y += delta
  cube.helper?.update()
})

const edges = new THREE.EdgesGeometry(geometry)
const lineModel = context.useObject('l', new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: 0x4b96ff,
      depthTest: false,
      transparent: true
    })
))
scene.objects.push(lineModel)
renderer.events.update.on(delta => {
  lineModel.object.rotation.x += delta
  lineModel.object.rotation.y += delta
})
</script>

<template>
  <psr-three-canvas
      v-if="renderer"
      :renderer-context="renderer"
      :state-enabled="true"
  />
</template>

<style scoped>

</style>