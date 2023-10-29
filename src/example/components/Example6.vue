<script lang="ts" setup>
import {onBeforeUnmount, onMounted, shallowRef, ShallowRef} from "vue";
import * as THREE from "three";
import {PsrThree, PsrThreeCanvas} from "../../package";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import cathedralUrl from "../asserts/cathedral.glb?url"
import horseUrl from "../asserts/horse.glb?url"
import {Object3DUtils} from "../../package/utils/Object3DUtils.ts";
// 创建渲染器
const rendererContext = PsrThree.createRenderer()

// 创建场景
const sceneContext = PsrThree.createScene<THREE.PerspectiveCamera>()
rendererContext.sceneContextRef.value = sceneContext

// 创建相机
const camera = PsrThree.createPerspectiveCamera().autoAspect(rendererContext.sizeRef)
camera.fov.value = 30
camera.camera.position.set(3, 3, 3);
camera.camera.lookAt(new THREE.Vector3(0, 0, 0))
sceneContext.cameraContextRef.value = camera

// 创建光源
const light = new THREE.AmbientLight(0xffffff, 1);
sceneContext.objects.push(light)

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 1000, 100);

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

sceneContext.objects.push(spotLight);

// 为场景添加模型
let model1: ShallowRef<THREE.Object3D | undefined> = shallowRef()
let model2: ShallowRef<THREE.Object3D | undefined> = shallowRef()

const loader = new GLTFLoader();
onMounted(() => {
  loader.load(cathedralUrl, function (gltf) {
    const model = gltf.scene
    model.scale.set(0.05, 0.05, 0.05)
    model.position.set(-0.8, 0, 0.8)
    sceneContext.objects.push(model);
    model1.value = model
  }, undefined, function (error) {
    console.error(error);
  });
  loader.load(horseUrl, function (gltf) {
    const model = gltf.scene
    model.scale.set(0.005, 0.005, 0.005)
    model.position.set(0.8, 0, -0.8)
    sceneContext.objects.push(model);
    model2.value = model
  }, undefined, function (error) {
    console.error(error);
  });
})
// 为模型添加动画
rendererContext.events.update.on(delta => {
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
  rendererContext.runningRef.value = false
  sceneContext.scene.traverse(object => Object3DUtils.dispose(object))
  sceneContext.scene.clear()
  rendererContext.renderer.dispose()
  THREE.Cache.clear()
  console.log('dispose')
}
</script>

<template>
  <psr-three-canvas
      :renderer-context="rendererContext"
      @click="dispose"
  />
</template>

<style scoped>

</style>