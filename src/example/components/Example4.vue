<script lang="ts" setup>

import * as THREE from "three";
import {PsrThree, PsrThreeCanvas} from "../../package";
// 创建渲染器
const rendererContext = PsrThree.createRenderer()

// 创建场景
const sceneContext = PsrThree.createScene<THREE.PerspectiveCamera>()
rendererContext.sceneContextRef.value = sceneContext

// 创建相机
const camera = new THREE.PerspectiveCamera(
    45,  // 视野角度
    1, // 长宽比
    1, // 近截面
    500, // 远截面
);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);
sceneContext.cameraContextRef.value = PsrThree.createCamera(camera).enableAspectAdaption(rendererContext.sizeRef)

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
sceneContext.objects.push(line)
</script>

<template>
  <psr-three-canvas
      :renderer-context="rendererContext"
  />
</template>

<style scoped>

</style>