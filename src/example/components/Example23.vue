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
const controls = camera.usePointerLockControls(renderer.object.domElement)
controls.enabled.value = false

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
        @click="controls.enabled.value = !controls.enabled.value"
    />
  </div>
</template>

<style scoped>

</style>