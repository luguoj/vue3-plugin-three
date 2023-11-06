<script lang="ts" setup>
import {onBeforeUnmount, onMounted, shallowRef, ShallowRef} from "vue";
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import cathedralUrl from "../asserts/cathedral.glb?url"
import horseUrl from "../asserts/horse.glb?url"
import {Object3DUtils} from "../../package/utils/Object3DUtils.ts";
import {createExampleContext} from "./createExampleContext.ts";


const {context, renderer, scene, camera} = createExampleContext()

camera.fov.value = 30
camera.object.position.set(3, 3, 3);
camera.object.lookAt(new THREE.Vector3(0, 0, 0))

// 创建光源
const light = new THREE.AmbientLight(0xffffff, 1);
scene.objects.push(context.useObject('l', light))

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 1000, 100);

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.objects.push(context.useObject('s-l', spotLight))

// 为场景添加模型
let model1: ShallowRef<THREE.Object3D | undefined> = shallowRef()
let model2: ShallowRef<THREE.Object3D | undefined> = shallowRef()

const loader = new GLTFLoader();
onMounted(() => {
  loader.load(cathedralUrl, function (gltf) {
    const model = gltf.scene
    model.scale.set(0.05, 0.05, 0.05)
    model.position.set(-0.8, 0, 0.8)
    scene.objects.push(context.useObject('m1', model));
    model1.value = model
  }, undefined, function (error) {
    console.error(error);
  });
  loader.load(horseUrl, function (gltf) {
    const model = gltf.scene
    model.scale.set(0.005, 0.005, 0.005)
    model.position.set(0.8, 0, -0.8)
    scene.objects.push(context.useObject('m2', model));
    model2.value = model
  }, undefined, function (error) {
    console.error(error);
  });
})
// 为模型添加动画
renderer.events.update.on(delta => {
  if (model1.value) {
    model1.value.rotation.y += delta
  }
  if (model2.value) {
    model2.value.rotation.y += delta
  }
})

onBeforeUnmount(() => {
  dispose()
})

function dispose() {
  renderer.running.value = false
  scene.scene.traverse(object => Object3DUtils.dispose(object))
  scene.scene.clear()
  renderer.renderer.dispose()
  THREE.Cache.clear()
  console.log('dispose')
}
</script>

<template>
  <psr-three-canvas
      :renderer-context="renderer"
      @click="dispose"
  />
</template>

<style scoped>

</style>