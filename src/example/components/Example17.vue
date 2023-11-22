<script lang="ts" setup>
import {ref} from "vue";
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

const controls = new OrbitControls(camera.object, renderer.object.domElement)
controls.target = new THREE.Vector3(0, 0, 0)
controls.addEventListener('change', () => {
  console.log('change')
})
const controlHandler = () => {
  controls.update() // 提前更新相机，避免被动屏滞后
  localStorage.setItem('cam-pos', JSON.stringify(camera.object.position))
  localStorage.setItem('cam-target', JSON.stringify(controls.target))
  localStorage.setItem('cam-zoom', JSON.stringify(camera.object.zoom))
}
controls.addEventListener('start', () => {
  console.log('start')
  scene.addUpdateHandler(controlHandler)
})
controls.addEventListener('end', () => {
  console.log('end')
  scene.removeUpdateHandler(controlHandler)
})

const windowSize = ref<ResizeObserverEntry>()

function handleResize(entry: ResizeObserverEntry) {
  windowSize.value = entry
}

const views = [{}, {left: 0.5}, {top: 0.5}, {left: 0.5, top: 0.5}]

function handleSwitchView(viewId: number) {
  scene.addUpdateHandler(() => {
    if (viewId == 0) {
      camera.viewOffset.value = undefined
    } else {
      camera.viewOffset.value = windowSize.value && {width: windowSize.value.contentRect.width * 2, height: windowSize.value.contentRect.height * 2, ...views[viewId - 1]}
    }
  }, {once: true})
}

handleSwitchView(1)

window.addEventListener('storage', ev => {
  switch (ev.key) {
    case 'cam-pos':
    case 'cam-target':
    case 'cam-zoom':
      const newPos = JSON.parse(localStorage.getItem('cam-pos') || '{"x":0,"y":0,"z":0}')
      const newTarget = JSON.parse(localStorage.getItem('cam-target') || '{"x":0,"y":0,"z":0}')
      const newZoom = JSON.parse(localStorage.getItem('cam-zoom') || '1')
      scene.addUpdateHandler(() => {
        camera.object.position.set(newPos.x, newPos.y, newPos.z)
        camera.object.lookAt(newTarget.x, newTarget.y, newTarget.z)
        camera.object.zoom = newZoom
        controls.target.set(newTarget.x, newTarget.y, newTarget.z)
      }, {once: true})
      break
  }
})
</script>

<template>
  <div style="position: relative">
    <div>
      <button @click="handleSwitchView(0)">all</button>
      <button @click="handleSwitchView(1)">1</button>
      <button @click="handleSwitchView(2)">2</button>
      <button @click="handleSwitchView(3)">3</button>
      <button @click="handleSwitchView(4)">4</button>
    </div>
    <div style="height: calc(100% - 23px);" v-psr-resize-observer="handleResize">
      <psr-three-canvas
          style="height: 100%;"
          :renderer-context="renderer"
          :state-enabled="true"
      />
    </div>
  </div>
</template>

<style scoped>

</style>