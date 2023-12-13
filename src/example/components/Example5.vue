<script lang="ts" setup>

import * as THREE from "three";
import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {PsrThreeCanvas} from "../../package";
import {onMounted, ref, watch} from "vue";
import {createExampleContext} from "./createExampleContext.ts";

const {renderer, scene, camera} = createExampleContext()

scene.object.background = new THREE.Color(0x000000);
scene.object.fog = new THREE.Fog(0x000000, 250, 1400);

camera.fov.value = 30
camera.object.position.set(0, 400, 700);
camera.object.lookAt(new THREE.Vector3(0, 150, 0))

// 创建光源
const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
dirLight.position.set(0, 0, 1).normalize();
scene.addChildren(scene.useObject('dir-l', () => dirLight))


scene.addChildren(scene.useObject('point-l', () => {
  const pointLight = new THREE.PointLight(0xffffff, 4.5, 0, 0);
  pointLight.color.setHSL(Math.random(), 1, 0.5);
  pointLight.position.set(0, 100, 90);
  return pointLight
}));

// 创建材质
const materials: THREE.MeshPhongMaterial[] = [
  new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true}), // front
  new THREE.MeshPhongMaterial({color: 0xffffff}) // side
];

// 创建3d对象组
const group = scene.useObject('text-g', () => {
  const group = new THREE.Group();
  group.position.y = 100;
  return group
})
scene.addChildren(group);

// 创建背景平面
scene.addChildren(scene.useObject('bg-p', () => {
  const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000),
      new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.5, transparent: true})
  );
  plane.position.y = 100;
  plane.rotation.x = -Math.PI / 2;
  return plane
}));

const textInput = ref('three.js'),
    bevelEnabled = true,
    fontName = 'optimer', // helvetiker, optimer, gentilis, droid sans, droid serif
    fontWeight = 'bold'; // normal bold
const mirror = true;

const height = 20,
    size = 70,
    hover = 30,
    curveSegments = 4,
    bevelThickness = 2,
    bevelSize = 1.5;

// 字体
let font: Font | undefined = undefined

// 加载字体
function loadFont() {
  const loader = new FontLoader();
  loader.load(
      'fonts/' + fontName + '_' + fontWeight + '.typeface.json',
      function (response) {
        font = response;
        updateTextGroup()
      }
  );
}

let textMesh1: THREE.Mesh, textMesh2: THREE.Mesh, textGeo: TextGeometry;

// 创建文本
function createText() {
  const text: string = textInput.value
  // 删除现有文本
  if (textMesh1) {
    group.object.remove(textMesh1);
  }
  if (mirror && textMesh2) {
    group.object.remove(textMesh2);
  }
  if (!text) return;

  textGeo = new TextGeometry(text, {
    font: font!,
    size: size,
    height: height,
    curveSegments: curveSegments,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: bevelEnabled

  });

  textGeo.computeBoundingBox();

  const centerOffset = textGeo.boundingBox ? -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x) : 0;

  textMesh1 = new THREE.Mesh(textGeo, materials);
  textMesh1.position.x = centerOffset;
  textMesh1.position.y = hover;
  textMesh1.position.z = 0;
  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;
  group.object.add(textMesh1);

  if (mirror) {
    textMesh2 = new THREE.Mesh(textGeo, materials);
    textMesh2.position.x = centerOffset;
    textMesh2.position.y = -hover;
    textMesh2.position.z = height;
    textMesh2.rotation.x = Math.PI;
    textMesh2.rotation.y = Math.PI * 2;
    group.object.add(textMesh2);
  }
}

onMounted(() => {
  loadFont()
})

watch(textInput, () => {
  updateTextGroup()
})

function updateTextGroup() {
  group.addUpdateHandler(createText, {once: true})
}
</script>

<template>
  <div>
    <psr-three-canvas
        style="height: 100%;"
        :renderer-context="renderer"
    />
    <input v-model="textInput"/>
  </div>
</template>

<style scoped>

</style>