<script lang="ts" setup>
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {ref} from "vue";
import {createCube} from "./createCube.ts";
import * as THREE from "three";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";

const {context, renderer, scene, camera} = createExampleContext()

camera.object.position.z = 5;
camera.object.position.y = 5;
camera.object.lookAt(0, 0, 0)
camera.object.updateProjectionMatrix()
camera.object.updateMatrixWorld()
const controls = camera.useOrbitControls(renderer.object.domElement)

controls.object.target = new THREE.Vector3(0, 0, 0)
controls.autoRotate.value = true

const {cubeCtx,lineCtx} = createCube(context, scene)
const stateEnabled = ref(true)

const con2 = new TransformControls(camera.object,renderer.object.domElement)
scene.object.add(con2)
scene.addUpdateHandler(()=>{})
con2.addEventListener('dragging-changed', (event) => {
  controls.enabled.value = !event.value
  if(event.value){

  }
})

con2.attach(cubeCtx.object)
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