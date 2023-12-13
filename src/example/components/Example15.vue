<script lang="ts" setup>
import {onMounted} from "vue";
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {PsrThreeAddons} from "../../../addons";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import cathedralUrl from "../asserts/cathedral-compressed.glb?url"
import {createExampleContext} from "./createExampleContext.ts";

const {renderer, scene, camera} = createExampleContext()

camera.fov.value = 30
camera.object.position.set(3, 3, 3);
camera.object.lookAt(new THREE.Vector3(0, 0, 0))

// 创建光源
const light = new THREE.AmbientLight(0xffffff, 1);
scene.addChildren(scene.useObject('l', () => light))

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 1000, 100);

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.addChildren(scene.useObject('s-l', () => spotLight))

// 为场景添加模型
const loader = new GLTFLoader();
const dracoLoader = new PsrThreeAddons.DRACOLoader()
loader.setDRACOLoader(dracoLoader)
onMounted(() => {
  loader.load(cathedralUrl, function (gltf) {
    const model = gltf.scene
    model.scale.set(0.05, 0.05, 0.05)
    model.position.set(-0.8, 0, 0.8)
    const modelCtx = scene.useObject('m1', () => model)
    scene.addChildren(modelCtx);
  }, undefined, function (error) {
    console.error(error);
  });
})
</script>

<template>
  <div style="position: relative;height: 100%;" ref="containerRef">
    <psr-three-canvas
        style="height: 100%;"
        :renderer-context="renderer"
        state-enabled
    />
  </div>
</template>

<style scoped>

</style>