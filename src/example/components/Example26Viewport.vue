<script setup lang="ts">
import * as THREE from 'three'
import {PsrThreeRendererViewport} from "../../package";
import {cubes, CubeType} from "./Example26Service.ts";
import {PsrThreePluginTypes} from "../../package/types";
import {reactive, UnwrapRef, watch} from "vue";

type CubePosType = CubeType & {
  style?: { left: string, bottom: string }
  outOfView: boolean
  inFrustum: boolean
}

const cubePoses: UnwrapRef<CubePosType[]> = reactive<CubePosType[]>([])
const frustum = new THREE.Frustum()

function updateFrustum(camera: THREE.Camera) {
  frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse
      )
  )
}

let hook: { off: () => void } | undefined

function handleViewportReady(viewport: PsrThreePluginTypes.RendererViewportContext) {
  watch(viewport.camera, camera => {
    hook && hook.off()
    hook = undefined
    if (camera) {
      updateFrustum(camera.object)
      hook = camera.events.changed.on(() => updateFrustum(camera.object))
    }
  })
}

function handleViewportDraw(viewport: PsrThreePluginTypes.RendererViewportContext) {
  cubePoses.splice(0, cubePoses.length)
  cubePoses.push(...cubes.map(cube => {
    const pos = viewport.getObjectPosition(cube.name)
    return {
      ...cube,
      style: pos && {left: pos.viewPosition.x + 'px', bottom: pos.viewPosition.y + 'px'},
      outOfView: !!pos?.outOfView,
      inFrustum: (!!pos) && frustum.containsPoint(pos.worldPosition)
    }
  }).filter(cubePos => cubePos.style && !cubePos.outOfView && cubePos.inFrustum))
}

</script>

<template>
  <psr-three-renderer-viewport
      object-name="viewport-0"
      scene-name="scene-1"
      camera-name="camera-1"
      style="width: 50%;height: 30%;top: 10%;left: 10%;"
      @viewport-ready="handleViewportReady"
      @viewport-draw="handleViewportDraw"
  >
    <div style="border:1px solid red;height: calc(100% - 2px);width: calc(100% - 2px);position: relative;">
      <div
          v-for="cube in cubePoses" :key="cube.name"
          style="position: absolute; pointer-events: all;"
          :style="{
                  ...cube.style
                }"
      >
        <button>{{cube.name.split('-')[1]}}</button>
      </div>
    </div>
  </psr-three-renderer-viewport>
</template>

<style scoped>

</style>