<script lang="ts" setup>
import {ref, watch} from "vue";
import * as THREE from "three";
import {vPsrResizeObserver} from "@psr-framework/vue3-plugin-utils"
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const {renderer, context, scene, camera} = createExampleContext()
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0)
camera.object.updateProjectionMatrix()

// 坐标格辅助器
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
scene.addChildren(context.useObject('grid', () => gridHelper))

const camera2 = context.usePerspectiveCamera('c2')
camera2.object.position.set(5, 5, 5);
camera2.object.lookAt(0, 0, 0)
camera2.object.updateProjectionMatrix()
scene.addChildren(camera2)

const renderer2 = context.useRenderer('render-2')
renderer2.createViewport('vp-1', scene).activatedCameraId.value = 'c2'

const containerRef = ref<HTMLDivElement>()
watch(containerRef, container => {
  if (container) {
    const controls = new OrbitControls(camera2.object, container)
    controls.target = new THREE.Vector3(0, 0, 0)
    controls.addEventListener('change', () => {
      console.log('change')
    })
    const controlHandler = () => {
      // 联动更新其他相机
      camera.object.position.set(camera2.object.position.x, camera2.object.position.y, camera2.object.position.z)
      camera.object.lookAt(controls.target)
      camera.object.zoom = camera2.object.zoom
    }
    controls.addEventListener('start', () => {
      console.log('start')
      scene.addUpdateHandler(controlHandler)
    })
    controls.addEventListener('end', () => {
      console.log('end')
      scene.removeUpdateHandler(controlHandler)
    })
  }
})

function handleResize(entry: ResizeObserverEntry) {
  scene.addUpdateHandler(() => {
    camera.viewOffset.value = {width: entry.contentRect.width, height: entry.contentRect.height}
    camera2.viewOffset.value = {width: entry.contentRect.width, height: entry.contentRect.height, left: 0.5, top: 0.5}
  }, {once: true})
}

</script>

<template>
  <div style="position: relative" ref="containerRef" v-psr-resize-observer="handleResize">
    <psr-three-canvas
        style="position: absolute;left: 0;top:0;width: 50%;height: 50%;border: 1px solid red;"
        :renderer-context="renderer"
        :state-enabled="true"
    />
    <psr-three-canvas
        style="position: absolute;left: 50%;top:50%;width: 50%;height: 50%;border: 1px solid red;"
        :renderer-context="renderer2"
        :state-enabled="true"
    />
  </div>
</template>

<style scoped>

</style>