<script setup lang="ts">
import * as THREE from 'three'
import {PsrThreeRendererViewport} from "../../package";
import {cubes, CubeType} from "./Example26Service.ts";
import {PsrThreePluginTypes} from "../../package/types";
import {reactive, UnwrapRef} from "vue";

type CubePosType = CubeType & {
  pos?: { left: string, bottom: string }
  outOfView: boolean
  inFrustum: boolean
}

const cubePoses: UnwrapRef<CubePosType[]> = reactive<CubePosType[]>([])

function handleViewportDraw(viewport: PsrThreePluginTypes.RendererViewportContext) {
  const camera = viewport.camera.value
  if (camera) {
    const frustum = new THREE.Frustum()
    frustum.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(
            camera.object.projectionMatrix,
            camera.object.matrixWorldInverse
        )
    )
    cubePoses.splice(0, cubePoses.length)
    cubePoses.push(...cubes.map(cube => {
      const pos = viewport.getObjectCssPosition(cube.name)
      return {
        ...cube,
        pos: pos && {left: pos.left + 'px', bottom: pos.bottom + 'px'},
        outOfView: !!pos?.outOfView,
        inFrustum: frustum.containsPoint(viewport.scene.objects[cube.name].object.position)
      }
    }).filter(cubePos => cubePos.pos && !cubePos.outOfView && cubePos.inFrustum))
  } else {
    cubePoses.forEach(cubePos => {
      cubePos.pos = undefined
      cubePos.inFrustum = false
    })
  }
}

</script>

<template>
  <psr-three-renderer-viewport
      object-name="viewport-0"
      scene-name="scene-1"
      camera-name="camera-1"
      style="width: 50%;height: 30%;top: 10%;left: 10%;"
      @viewport-draw="handleViewportDraw"
  >
    <div style="border:1px solid red;height: calc(100% - 2px);width: calc(100% - 2px);position: relative;">
      <div
          v-for="cube in cubePoses" :key="cube.name"
          style="position: absolute; pointer-events: all;"
          :style="{
                  ...cube.pos
                }"
      >
        <button>click me</button>
      </div>
    </div>
  </psr-three-renderer-viewport>
</template>

<style scoped>

</style>