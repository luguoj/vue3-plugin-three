<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createCube} from "./createCube.ts";
import {ref} from "vue";
import {PsrThreePluginTypes} from "../../package/types";

const {renderer, context, scene, camera, viewport} = createExampleContext()
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0);
camera.object.updateProjectionMatrix();

viewport.viewport.value = {height: 0.5, width: 0.5, left: 0.25, top: 0.25}

// 坐标格辅助器
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
scene.addChildren(scene.useObject('grid', () => gridHelper))
const {cubeCtx} = createCube(context, scene)

const controls = new OrbitControls(camera.object, renderer.object.domElement)
controls.target = new THREE.Vector3(0, 0, 0)
controls.addEventListener('change', () => {
  console.log('change')
})
const controlHandler = () => {
  controls.update() // 提前更新防止抖动
  updateTitlePos()
}
controls.addEventListener('start', () => {
  console.log('start')
  camera.addUpdateHandler(controlHandler)
})
controls.addEventListener('end', () => {
  console.log('end')
  camera.removeUpdateHandler(controlHandler)
})


const titlePos = ref<PsrThreePluginTypes.ObjectCssPosition>()
const updateTitlePos = () => {
  titlePos.value = viewport.getObjectCssPosition(cubeCtx.name)
}
camera.addUpdateHandler(updateTitlePos, {once: true})
</script>

<template>
  <div>
    <psr-three-canvas
        style="height: 100%;"
        :renderer-context="renderer"
        :state-enabled="true"
    >
      <template #[`viewport-${viewport.name}`]>
        <div
            v-if="titlePos"
            style="position: absolute;color: lightyellow;"
            :style="{
              left: titlePos.left + 'px',
              bottom: titlePos.bottom + 'px',
            }"
        >box
        </div>
      </template>
    </psr-three-canvas>
  </div>
</template>

<style scoped>

</style>