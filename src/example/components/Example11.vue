<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const {renderer, context, scene, camera} = createExampleContext()
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0)

// 坐标格辅助器
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
scene.addChildren(context.useObject('grid', () => gridHelper))

const camera2 = context.usePerspectiveCamera('c2')
camera2.object.fov = 15
camera2.object.aspect = 1
camera2.object.near = 0.1
camera2.object.far = 10
camera2.object.position.set(3, 1, 0)
camera2.object.updateProjectionMatrix()
scene.addChildren(camera2)
scene.addChildren(camera2.useHelper())

const renderer2 = context.useRenderer('render-2')
renderer2.createViewport('vp-1', scene).camera.value = camera2

const controls = new OrbitControls(camera2.object, renderer2.object.domElement)
controls.target = new THREE.Vector3(0, 0, 0)
controls.addEventListener('change', () => {
  console.log('change')
})
const controlHandler = () => {
}
controls.addEventListener('start', () => {
  console.log('start')
  camera2.addUpdateHandler(controlHandler)
})
controls.addEventListener('end', () => {
  console.log('end')
  camera2.removeUpdateHandler(controlHandler)
})


</script>

<template>
  <div style="position: relative">
    <psr-three-canvas
        style="position: absolute;left: 0;top:0;width: 50%;height: 100%;"
        :renderer-context="renderer"
        :state-enabled="true"
    />
    <psr-three-canvas
        style="position: absolute;left: 50%;top:0;width: 50%;height: 100%;"
        :renderer-context="renderer2"
        :state-enabled="true"
    />
  </div>
</template>

<style scoped>

</style>