<script setup lang="ts">
import * as THREE from "three";
import {
  PsrThreeContext,
  PsrThreeObject3d,
  PsrThreePerspectiveCamera,
  PsrThreeRenderer,
  PsrThreeScene
} from "../../package";
import Example26Viewport from "./Example26Viewport.vue";
import {PsrThreePluginTypes} from "../../package/types";
import Example26Object from "./Example26Object.vue";
import {cubes} from "./Example26Service.ts";

function handleCameraReady(camera: PsrThreePluginTypes.PerspectiveCameraContext) {
  camera.object.far=10
  camera.object.position.z = 5
}

function handleObjectUpdate(event: { object: PsrThreePluginTypes.Object3DContext<THREE.Object3D>, delta: number }) {
  event.object.object.rotation.x += event.delta*0.1
  event.object.object.rotation.y += event.delta*0.1
}
</script>

<template>
  <psr-three-context>
    <psr-three-renderer
        style="height: 100%;"
        object-name="renderer-1"
        state-enabled
    >
      <example26-viewport/>
    </psr-three-renderer>
    <psr-three-scene
        object-name="scene-1"
    >
      <psr-three-perspective-camera object-name="camera-1" @object-ready="handleCameraReady"/>
      <psr-three-object3d object-name="cube-parent" @object-update="handleObjectUpdate">
        <example26-object
            v-for="cube in cubes" :key="cube.name"
            :object-name="cube.name"
            :object-position="cube.position"
        />
      </psr-three-object3d>
    </psr-three-scene>
  </psr-three-context>
</template>

<style scoped>

</style>