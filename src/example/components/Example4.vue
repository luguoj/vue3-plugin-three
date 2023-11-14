<script lang="ts" setup>

import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";

const {context, renderer, scene, camera} = createExampleContext()

camera.object.position.z = 100;

//创建白色的线条基本材质
const material = new THREE.LineBasicMaterial({color: 0xffffff});
// 使用顶点创建几何结构
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
const geometry = new THREE.BufferGeometry().setFromPoints(points);
// 创建线段（连接几何结构中的连续顶点）
const line = new THREE.Line(geometry, material);
scene.children.push(context.useObject('l', line))
</script>

<template>
  <psr-three-canvas
      :renderer-context="renderer"
  />
</template>

<style scoped>

</style>