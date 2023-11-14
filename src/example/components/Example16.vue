<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createCube} from "./createCube.ts";
import {reactive} from "vue";

const {renderer, context, scene, camera, viewport} = createExampleContext()
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0);
camera.object.updateProjectionMatrix();

viewport.viewport.value = {height: 0.5, width: 0.5, left: 0.25, top: 0.25}

// 坐标格辅助器
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
scene.children.push(context.useObject('grid', gridHelper))

const controls = new OrbitControls(camera.object, renderer.renderer.domElement)
controls.target = new THREE.Vector3(0, 0, 0)
renderer.events.update.on(() => {
  controls.update()
})
const {cube} = createCube(context, scene)

const titlePos = reactive({left: 0, top: 0})

renderer.events.endUpdate.on(() => {
  // 获取立方中心位置
  const tempV = new THREE.Vector3()
  // 更新模型在世界坐标系中的位置（在getWorldPosition中调用了，无需单独调用）
  // cube.object.updateWorldMatrix(true, false)
  cube.object.getWorldPosition(tempV)
  // 获取标准化屏幕坐标（x,y在-1~1之间）
  // x = -1 标识最左侧
  // y = -1 标识最底部
  tempV.project(camera.object)
  // 转换为CSS坐标
  titlePos.left = (tempV.x * 0.5 + 0.5) * viewport.viewportRect.value.width + viewport.viewportRect.value.x
  titlePos.top = (tempV.y * -0.5 + 0.5) * viewport.viewportRect.value.height + (renderer.size.value?.height || 0) - viewport.viewportRect.value.height - viewport.viewportRect.value.y
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
        <div>box</div>
      </template>
      <div style="position: absolute" :style="{
      top:titlePos.top+'px',
      left:titlePos.left+'px'
    }">box
      </div>
    </psr-three-canvas>
  </div>
</template>

<style scoped>

</style>