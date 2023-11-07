<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";

const {renderer, context, scene, camera} = createExampleContext()
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0)

// 摄像机辅助器
const camera1 = context.useCamera('c1', new THREE.OrthographicCamera(-1, 1, 1, -1))
camera1.helperOptions.value = true
camera1.object.position.set(3, 0, 0)
camera1.object.lookAt(new THREE.Vector3(0, 0, 0))
scene.objects.push(camera1)

const camera2 = context.useCamera('c2', new THREE.PerspectiveCamera(15, 1, 0.1, 3))
camera2.helperOptions.value = true
camera2.object.position.set(3, 0, 0)
camera2.object.lookAt(new THREE.Vector3(0, 0, 0))
renderer.events.update.on(delta => {
  console.log('camera2', delta)
  camera2.object.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta)
  camera2.object.lookAt(new THREE.Vector3(0, 0, 0))
  // camera2.object.updateProjectionMatrix()
  // camera2.helper?.update()
})
scene.objects.push(camera2)

// 平行光辅助器
const light = context.useDirectionalLight('dl')
light.helperOptions.value = {size: 0.5}
light.object.color = new THREE.Color(0xffffff)
light.object.position.set(2, 0, 0)
scene.objects.push(light)
const lightTarget = context.useObject('dl-t', new THREE.Object3D())
lightTarget.object.position.set(1, 2, 0)
scene.objects.push(lightTarget)
light.object.target = lightTarget.object

// 半球形光源
const hemisphereLight = context.useHemisphereLight('hl')
hemisphereLight.helperOptions.value = {size: 1}
hemisphereLight.object.color = new THREE.Color(0x00ffff)
hemisphereLight.object.groundColor = new THREE.Color(0xff0000)
hemisphereLight.object.intensity = 1
scene.objects.push(hemisphereLight)

// 点光源
const pointLight = context.usePointLight('pl')
pointLight.helperOptions.value = {size: 0.2}
pointLight.object.color = new THREE.Color(0xff0000)
pointLight.object.distance = 100
pointLight.object.position.set(0, 1, 0)
scene.objects.push(pointLight)

// 聚光灯
const spotLight = context.useSpotLight('sl')
spotLight.object.color = new THREE.Color(0xffffff)
spotLight.helperOptions.value = true
spotLight.object.distance = 1
spotLight.object.angle = Math.PI / 4
spotLight.object.position.set(0, 1, 0)
scene.objects.push(spotLight)
</script>

<template>
  <psr-three-canvas
      v-if="renderer"
      :renderer-context="renderer"
      :state-enabled="true"
  />
</template>

<style scoped>

</style>