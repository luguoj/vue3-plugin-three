<script lang="ts" setup>
import {onMounted} from "vue";
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import horseUrl from "../asserts/horse.glb?url"
import {createExampleContext} from "./createExampleContext.ts";


const {context, renderer, scene, camera} = createExampleContext()

camera.fov.value = 30
camera.object.position.set(3, 3, 3);
camera.object.lookAt(new THREE.Vector3(0, 0, 0))

// 创建光源
const light = new THREE.AmbientLight(0xffffff, 1);
scene.addChildren(context.useObject('l', () => light))

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 1000, 100);

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.addChildren(context.useObject('s-l', () => spotLight))

const loader = new GLTFLoader();
onMounted(() => {
  loader.load(horseUrl, function (gltf) {
    const model = gltf.scene
    model.scale.set(0.005, 0.005, 0.005)
    model.position.set(0.8, 0, -0.8)
    const modelCtx = context.useObject('m2', () => model)
    modelCtx.addUpdateHandler(delta => {
      modelCtx.object.rotation.y += delta
      return true
    })
    scene.addChildren(modelCtx);
  }, undefined, function (error) {
    console.error(error);
  });
})
</script>

<template>
  <psr-three-canvas
      :renderer-context="renderer"
      state-enabled
  />
</template>

<style scoped>

</style>