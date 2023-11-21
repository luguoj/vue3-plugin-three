<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createCube} from "./createCube.ts";

const {renderer, context, scene, viewport} = createExampleContext()

// 坐标格辅助器
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
scene.addChildren(context.useObject('grid', () => gridHelper))

const cameraArr = context.useArrayCamera('c-arr')
const viewport1 = cameraArr.createViewport('1', {width: 0.3, height: 0.3, top: 0.5, right: 0.5})
scene.addChildren(viewport1.useHelper())
viewport1.addUpdateHandler(() => {
  viewport1.object.position.set(5, 5, 5);
  viewport1.object.lookAt(new THREE.Vector3(0, 0, 0))
  // 没有这行相机朝向会有问题
  viewport1.object.updateMatrixWorld()
}, {once: true})
const viewport2 = cameraArr.createViewport('2', {width: 1, height: 1})
viewport2.fov.value = 15
viewport2.addUpdateHandler(() => {
  viewport2.object.position.set(30, 10, 0);
  viewport2.object.lookAt(0, 0, 0);
  // 没有这行相机朝向会有问题
  viewport2.object.updateMatrixWorld()
}, {once: true})
scene.addChildren(cameraArr)
viewport.activatedCameraId.value = 'c-arr'


const controls = new OrbitControls(viewport2.object, renderer.renderer.domElement)
controls.target = new THREE.Vector3(0, 0, 0)
controls.addEventListener('change', () => {
  console.log('change')
})
const controlHandler = () => {
  controls.update()
}
controls.addEventListener('start', () => {
  console.log('start')
  viewport2.addUpdateHandler(controlHandler)
})
controls.addEventListener('end', () => {
  console.log('end')
  viewport2.removeUpdateHandler(controlHandler)
})

createCube(context, scene)

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