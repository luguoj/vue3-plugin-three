<script setup lang="ts">
import * as THREE from "three";
import {
  PsrThreeContext,
  PsrThreeObject3d,
  PsrThreePerspectiveCamera,
  PsrThreePerspectiveCameraExposed,
  PsrThreeRenderer,
  PsrThreeRendererViewport,
  PsrThreeScene
} from "../../package";
import {ref, watch} from "vue";

function buildCube() {
  return new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({color: 0x00ff00})
  )
}

const cameraRef = ref<PsrThreePerspectiveCameraExposed>()
watch(cameraRef, camera => {
  if (camera) camera.camera.addUpdateHandler(() => {
    camera.camera.object.position.z = 5
  }, {once: true})
})
</script>

<template>
  <psr-three-context>
    <psr-three-renderer style="height: 100%;" object-name="renderer-1" state-enabled>
      <psr-three-renderer-viewport
          object-name="viewport-0"
          scene-name="scene-1"
          camera-name="camera-1"
          style="width: 50%;height: 30%;top: 10%;left: 10%;"
      >
        <div style="border:1px solid red;height: calc(100% - 2px);width: calc(100% - 2px);"></div>
      </psr-three-renderer-viewport>
    </psr-three-renderer>
    <psr-three-scene
        object-name="scene-1"
    >
      <psr-three-perspective-camera ref="cameraRef" object-name="camera-1"/>
      <psr-three-object3d :object-provider="buildCube" object-name="cube-1"/>
    </psr-three-scene>
  </psr-three-context>
</template>

<style scoped>

</style>