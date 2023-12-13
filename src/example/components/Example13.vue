<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createCube} from "./createCube.ts";

const {renderer, context, scene, camera, viewport} = createExampleContext()
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0);
camera.object.updateProjectionMatrix();

viewport.viewport.value = {height: 1, width: 0.5, left: 0.5}

// 坐标格辅助器
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
scene.addChildren(scene.useObject('grid', () => gridHelper))

const camera2 = scene.usePerspectiveCamera('c2')
camera2.object.fov = 15
camera2.object.aspect = 1
camera2.object.near = 0.1
camera2.object.far = 10
camera2.object.position.set(3, 1, 0);
camera2.object.updateProjectionMatrix();
scene.addChildren(camera2)
scene.addChildren(camera2.useHelper())

const controls = new OrbitControls(camera2.object, renderer.object.domElement)
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

const {lineCtx} = createCube(context, scene, {helper: true})

const scene2 = context.useScene('scene-2')
scene2.addChildren(lineCtx)
const camera3 = scene.useOrthographicCamera('camera-3')
camera3.object.position.set(3, 1, 2);
camera3.object.lookAt(new THREE.Vector3(0, 0, 0))
scene2.addChildren(camera3)
const viewport2 = renderer.createViewport('v-2', scene2, {width: 0.5, height: 1})
viewport2.camera.value = camera3
</script>

<template>
  <div style="position: relative">
    <psr-three-canvas
        style="position: absolute;left: 0;top:0;width: 100%;height: 100%;"
        :renderer-context="renderer"
        :state-enabled="true"
    />
  </div>
</template>

<style scoped>

</style>