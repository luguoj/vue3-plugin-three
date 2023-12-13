<script lang="ts" setup>
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {ref} from "vue";
import {createCube} from "./createCube.ts";

const {context, renderer, scene, camera} = createExampleContext()

camera.object.position.z = 5;
camera.object.position.y = 5;
camera.object.lookAt(0, 0, 0)
camera.object.updateProjectionMatrix()
camera.object.updateMatrixWorld()
const controls = camera.useTrackballControls(renderer.object.domElement)
controls.enabled.value = true
controls.object.rotateSpeed = 1
controls.object.zoomSpeed = 1.2
controls.object.panSpeed = 0.8
controls.object.noRotate = false
controls.object.noZoom = false
controls.object.noPan = false
controls.object.staticMoving = true
controls.object.dynamicDampingFactor = 0.3
controls.object.keys = ['KeyA', 'KeyS', 'KeyD']

createCube(context, scene)
const stateEnabled = ref(true)
</script>

<template>
  <div>
    <button @click="stateEnabled=!stateEnabled">sw</button>
    <psr-three-canvas
        style="height: 100%;"
        :renderer-context="renderer"
        :state-enabled="stateEnabled"
    />
  </div>
</template>

<style scoped>

</style>