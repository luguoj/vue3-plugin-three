<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {DragControls} from 'three/examples/jsm/Addons';
import {createExampleContext} from "./createExampleContext.ts";
import {createCube} from "./createCube.ts";

const {context, renderer, scene, camera} = createExampleContext('1')
camera.object.position.set(0, 0, 5);
camera.object.lookAt(new THREE.Vector3(0, 0, 0))

// 为场景添加模型
const {cubeCtx, lineCtx, helperCtx} = createCube(context, scene, {id: 'c2', helper: true})
const {cubeCtx: cubeCtx2, helperCtx: helperCtx2} = createCube(context, scene, {id: 'c1', helper: true})
cubeCtx.addUpdateHandler(() => {
  cubeCtx.object.position.set(2, 0, 0)
  helperCtx?.object.update()
}, {once: true})
lineCtx.addUpdateHandler(() => {
  lineCtx.object.position.set(2, 0, 0)
}, {once: true})
helperCtx?.addUpdateHandler(() => {
  helperCtx?.object.update()
}, {once: true})

// 对需要拖拽的组件创建拖拽控制器
const controls = new DragControls([cubeCtx.object, cubeCtx2.object], camera.object, renderer.object.domElement);
const draggingHandler = () => {
  helperCtx?.object.update()
  helperCtx2?.object.update()
}
// 添加拖拽开始结束事件监听
controls.addEventListener('dragstart', function () {
  scene.addUpdateHandler(draggingHandler)
});
controls.addEventListener('dragend', function () {
  scene.removeUpdateHandler(draggingHandler)
});
// 添加鼠标覆盖事件
controls.addEventListener('hoveron', function (event) {
  const objCtx = context.retrieveObject(event.object.name)
  objCtx.addUpdateHandler(() => {
    if (objCtx.object instanceof THREE.Mesh) {
      objCtx.object.material.color.set(0x00ffff);
    }
  }, {once: true})
});
controls.addEventListener('hoveroff', function (event) {
  const objCtx = context.retrieveObject(event.object.name)
  objCtx.addUpdateHandler(() => {
    if (objCtx.object instanceof THREE.Mesh) {
      objCtx.object.material.color.set(0x00ff00);
    }
  }, {once: true})
});
</script>

<template>
  <psr-three-canvas
      :renderer-context="renderer"
      state-enabled
  />
</template>

<style scoped>

</style>