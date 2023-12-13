<script lang="ts" setup>
import * as THREE from "three";
import {PsrThreeCanvas} from "../../package";
import {createExampleContext} from "./createExampleContext.ts";

const {renderer, scene, camera} = createExampleContext()
camera.object.position.set(5, 5, 5);
camera.object.lookAt(0, 0, 0)
// camera.addUpdateHandler(delta => {
//   camera.object.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), delta)
//   camera.object.lookAt(new THREE.Vector3(0, 0, 0))
//   return true
// })

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.addChildren(scene.useObject('axes', () => axesHelper))
// 箭头辅助器
const arrowHelper = new THREE.ArrowHelper(
    new THREE.Vector3(1, 2, 0).normalize(),
    new THREE.Vector3(2, 0, 0),
    3,
    0xffff00
)
scene.addChildren(scene.useObject('arrow', () => arrowHelper))

// 包围盒辅助器
const box3 = new THREE.Box3()
box3.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.1, 0.1, 0.1))
const box3Helper = new THREE.Box3Helper(box3, 0xffff00)
scene.addChildren(scene.useObject('box3', () => box3Helper))

// 摄像机辅助器
const camera1 = scene.useCamera('c1', () => new THREE.OrthographicCamera(-1, 1, 1, -1))
scene.addChildren(camera1)
scene.addChildren(camera1.useHelper())

const camera2 = scene.useCamera('c2', () => new THREE.PerspectiveCamera(15, 1, 0.1, 3))
camera2.object.position.set(3, 0, 0)
camera2.object.lookAt(new THREE.Vector3(0, 0, 0))
scene.addChildren(camera2)
camera2.addUpdateHandler(delta => {
  camera2.object.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta)
  camera2.object.lookAt(new THREE.Vector3(0, 0, 0))
  return true
})
scene.addChildren(camera2.useHelper())

// 平行光辅助器
const light = scene.useDirectionalLight('dl')
light.object.color = new THREE.Color(0xffffff)
light.object.position.set(2, 0, 0)
scene.addChildren(light)
const lightTarget = new THREE.Object3D()
lightTarget.position.set(1, 2, 0)
scene.addChildren(scene.useObject('dl-t', () => lightTarget))
light.object.target = lightTarget
scene.addChildren(light.useHelper({size: 0.5}))

// 坐标格辅助器
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
scene.addChildren(scene.useObject('grid', () => gridHelper))

// 极坐标网格
const polarGirdHelper = new THREE.PolarGridHelper(1, 16, 8, 64)
scene.addChildren(scene.useObject('polar', () => polarGirdHelper))

// 半球形光源
const hemisphereLight = scene.useHemisphereLight('hl')
hemisphereLight.object.color = new THREE.Color(0x00ffff)
hemisphereLight.object.groundColor = new THREE.Color(0xff0000)
hemisphereLight.object.intensity = 1
scene.addChildren(hemisphereLight)
scene.addChildren(hemisphereLight.useHelper({size: 1}))

// 模拟平面
const plane = new THREE.Plane(new THREE.Vector3(1, 1, 0.2), 3)
const planeHelper = new THREE.PlaneHelper(plane, 1, 0xffff00)
scene.addChildren(scene.useObject('plan', () => planeHelper))

// 点光源
const pointLight = scene.usePointLight('pl')
pointLight.object.color = new THREE.Color(0xff0000)
pointLight.object.intensity = 1
pointLight.object.distance = 100
pointLight.object.position.set(2, 1, 0)
scene.addChildren(pointLight)
scene.addChildren(pointLight.useHelper({size: 0.5}))

// 聚光灯
const spotLight = scene.useSpotLight('sl')
spotLight.object.color = new THREE.Color(0xffffff)
spotLight.object.intensity = 1
spotLight.object.distance = 1
spotLight.object.angle = Math.PI / 4
spotLight.object.position.set(0, 3, 0)
scene.addChildren(spotLight)
scene.addChildren(spotLight.useHelper())

// 为场景添加模型
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial()
const cube = scene.useObject('cube', () => new THREE.Mesh(geometry, material));
cube.addUpdateHandler(delta => {
  cube.object.rotation.x += delta
  cube.object.rotation.y += delta
})
scene.addChildren(cube)

const edges = new THREE.EdgesGeometry(geometry)
const lineModel = scene.useObject('l', () => new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: 0x4b96ff,
      depthTest: false,
      transparent: true
    })
))
lineModel.addUpdateHandler(delta => {
  lineModel.object.rotation.y += delta
  return true
})
scene.addChildren(lineModel)

const box = cube.useHelper()
box.addUpdateHandler(() => {
  box.object.update(undefined)
  return true
})
scene.addChildren(box)
</script>

<template>
  <psr-three-canvas
      :renderer-context="renderer"
      state-enabled
  />
</template>

<style scoped>

</style>