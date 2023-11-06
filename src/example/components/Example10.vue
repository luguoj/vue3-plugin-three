<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";

const {context, renderer, scene, camera} = createExampleContext()
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0)

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.objects.push(context.useObject('axes', axesHelper))
// 箭头辅助器
const arrowHelper = new THREE.ArrowHelper(
    new THREE.Vector3(1, 2, 0).normalize(),
    new THREE.Vector3(2, 0, 0),
    3,
    0xffff00
)
scene.objects.push(context.useObject('arrow', arrowHelper))

// 包围盒辅助器
const box3 = new THREE.Box3()
box3.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.1, 0.1, 0.1))
const box3Helper = new THREE.Box3Helper(box3, 0xffff00)
scene.objects.push(context.useObject('box3', box3Helper))

// 摄像机辅助器
const camera1 = new THREE.OrthographicCamera(-1, 1, 1, -1)
scene.objects.push(context.useCamera('c1', camera1))
const camera1Helper = new THREE.CameraHelper(camera1)
scene.objects.push(context.useObject('c1-h', camera1Helper))

const camera2 = new THREE.PerspectiveCamera(15, 1, 0.1, 3)
camera2.position.set(3, 0, 0)
camera2.lookAt(new THREE.Vector3(0, 0, 0))
scene.objects.push(context.useCamera('c2', camera2))
const camera2Helper = new THREE.CameraHelper(camera2)
scene.objects.push(context.useObject('c2-h', camera2Helper))

// 平行光辅助器
const light = new THREE.DirectionalLight(0xffffff)
light.position.set(2, 0, 0)
scene.objects.push(context.useObject('dl', light))
const lightTarget = new THREE.Object3D()
lightTarget.position.set(1, 2, 0)
scene.objects.push(context.useObject('dl-t', lightTarget))
light.target = lightTarget
const lightHelper = new THREE.DirectionalLightHelper(light, 0.5)
scene.objects.push(context.useObject('dl-h', lightHelper))

// 坐标格辅助器
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
scene.objects.push(context.useObject('grid', gridHelper))

// 极坐标网格
const polarGirdHelper = new THREE.PolarGridHelper(1, 16, 8, 64)
scene.objects.push(context.useObject('polar', polarGirdHelper))

// 半球形光源
const hemisphereLight = new THREE.HemisphereLight(0x00ffff, 0xff0000, 1)
scene.objects.push(context.useObject('hl', hemisphereLight))
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1)
scene.objects.push(context.useObject('hl-h', hemisphereLightHelper))

// 模拟平面
const plane = new THREE.Plane(new THREE.Vector3(1, 1, 0.2), 3)
const planeHelper = new THREE.PlaneHelper(plane, 1, 0xffff00)
scene.objects.push(context.useObject('plan', planeHelper))

// 点光源
const pointLight = new THREE.PointLight(0xff0000, 1, 100)
pointLight.position.set(0, 1, 0)
scene.objects.push(context.useObject('pl', pointLight))
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.objects.push(context.useObject('pl-h', pointLightHelper))

// 聚光灯
const spotLight = new THREE.SpotLight(0xffffff, 1, 1, Math.PI / 4)
spotLight.position.set(0, 1, 0)
scene.objects.push(context.useObject('sl', spotLight))
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.objects.push(context.useObject('sl-h', spotLightHelper))

// 为场景添加模型
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const material = new THREE.MeshLambertMaterial()
const cube = new THREE.Mesh(geometry, material);
scene.objects.push(context.useObject('cube', cube))

const edges = new THREE.EdgesGeometry(geometry)
const lineModel = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: 0x4b96ff,
      depthTest: false,
      transparent: true
    })
)
scene.objects.push(context.useObject('l', lineModel))

const box = new THREE.BoxHelper(lineModel, 0xffff00)
scene.objects.push(context.useObject('box', box))

// 添加动画
function animate(delta: number) {
  // cube.rotation.x += delta
  // cube.rotation.y += delta
  camera2.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta)
  camera2.lookAt(new THREE.Vector3(0, 0, 0))
  // camera.camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), delta)
  // camera.camera.lookAt(new THREE.Vector3(0,0,0))
  // lineModel.rotation.y += delta
  box.update(undefined)
}

renderer.events.update.on(animate)

</script>

<template>
  <psr-three-canvas
      :renderer-context="renderer"
  />
</template>

<style scoped>

</style>