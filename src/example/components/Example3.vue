<script lang="ts" setup>
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {ref} from "vue";
import {createCube} from "./createCube.ts";

const {context, renderer, scene, camera} = createExampleContext()

camera.object.position.z = 5;

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