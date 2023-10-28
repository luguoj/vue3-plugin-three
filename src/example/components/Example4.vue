<script lang="ts" setup>

import * as Three from "three";
import {PsrThreeCanvas} from "../../package";
// 创建相机
const camera = new Three.PerspectiveCamera(
    45,  // 视野角度
    1, // 长宽比
    1, // 近截面
    500, // 远截面
);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

//创建白色的线条基本材质
const material = new Three.LineBasicMaterial( { color: 0xffffff } );
// 使用顶点创建几何结构
const points = [];
points.push( new Three.Vector3( - 10, 0, 0 ) );
points.push( new Three.Vector3( 0, 10, 0 ) );
points.push( new Three.Vector3( 10, 0, 0 ) );
const geometry = new Three.BufferGeometry().setFromPoints( points );
// 创建线段（连接几何结构中的连续顶点）
const line = new Three.Line( geometry, material );

</script>

<template>
  <psr-three-canvas
      :three-camara="camera"
      :three-objects="[line]"
  />
</template>

<style scoped>

</style>