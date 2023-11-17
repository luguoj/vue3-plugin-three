<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {PointerLockControls} from 'three/examples/jsm/Addons';
import {createExampleContext} from "./createExampleContext.ts";
import {createCube} from "./createCube.ts";

const {context, renderer, scene, camera} = createExampleContext()
camera.object.position.set(0, 0, 5);
camera.object.lookAt(new THREE.Vector3(0, 0, 0))

// 为场景添加模型
createCube(context, scene)

// 对需要控制的摄像机创建指针锁定控制器
let controls: PointerLockControls = new PointerLockControls(camera.object, renderer.renderer.domElement);
camera.addUpdateHandler(() => {
  return controls.isLocked
})
</script>

<template>
  <psr-Three-canvas
      :renderer-context="renderer"
      @click="controls?.lock()"
  />
</template>

<style scoped>

</style>