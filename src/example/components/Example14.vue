<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createCube} from "./createCube.ts";

const {renderer, context, scene, camera,viewport} = createExampleContext()
camera.autoAspect(false)
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0);
camera.object.updateProjectionMatrix();

// 坐标格辅助器
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
scene.objects.push(context.useObject('grid', gridHelper))

const camera2 = context.usePerspectiveCamera('c2')
camera2.object.fov = 15
camera2.object.aspect = 1
camera2.object.near = 0.1
camera2.object.far = 10
camera2.helperOptions.value = true
camera2.object.position.set(3, 1, 0);
camera2.object.updateProjectionMatrix();


scene.objects.push(camera2)

const cameraArr = context.useArrayCamera('c-arr')
cameraArr.cameras.push(camera, camera2)
cameraArr.viewports.push({width: 0.3, height: 0.3, top: 0.5, right: 0.5}, {width: 1, height: 1})
cameraArr.adaptingSizing(renderer.size)
scene.objects.push(cameraArr)
viewport.activatedCameraId.value = 'c-arr'

const controls = new OrbitControls(camera2.object, renderer.renderer.domElement)
controls.target = new THREE.Vector3(0, 0, 0)
renderer.events.update.on(() => {
  controls.update()
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