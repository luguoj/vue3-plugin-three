<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createCube} from "./createCube.ts";
import {ref} from "vue";

const {renderer, context, scene, camera, viewport} = createExampleContext()
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0);
camera.object.updateProjectionMatrix();

viewport.viewport.value = {height: 0.5, width: 0.5, left: 0.25, top: 0.25}

// 坐标格辅助器
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
scene.objects.push(context.useObject('grid', gridHelper))

const controls = new OrbitControls(camera.object, renderer.renderer.domElement)
controls.target = new THREE.Vector3(0, 0, 0)
renderer.events.update.on(() => {
  controls.update()
})
const {cube} = createCube(context, scene)

const titlePos = ref({left: '0px', bottom: '0px'})

renderer.events.endUpdate.on(() => {
  titlePos.value = viewport.getObjectCssPosition(cube.object, camera.object)
})
</script>

<template>
  <div>
    <psr-three-canvas
        style="height: 100%;"
        :renderer-context="renderer"
        :state-enabled="true"
    >
      <template #[`viewport-${viewport.id}`]>
        <div
            style="position: absolute"
            :style="{
              ...titlePos
            }"
        >box
        </div>
      </template>
    </psr-three-canvas>
  </div>
</template>

<style scoped>

</style>