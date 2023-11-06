<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {PointerLockControls} from 'three/examples/jsm/Addons';
import {createExampleContext} from "./createExampleContext.ts";

const {context, renderer, scene, camera} = createExampleContext()
camera.object.position.set(0, 0, 5);
camera.object.lookAt(new THREE.Vector3(0, 0, 0))

// 为场景添加模型
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.objects.push(context.useObject('cube', cube))

// 为模型添加动画
renderer.events.update.on(delta => {
  cube.rotation.x += delta
  cube.rotation.y += delta
})

// 对需要控制的摄像机创建指针锁定控制器
let controls: PointerLockControls = new PointerLockControls(camera.object, renderer.renderer.domElement);

</script>

<template>
  <psr-Three-canvas
      :renderer-context="renderer"
      @click="controls?.lock()"
  />
</template>

<style scoped>

</style>