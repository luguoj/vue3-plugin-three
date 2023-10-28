<script lang="ts" setup>

import * as Three from "three";
import {Font, FontLoader, TextGeometry} from "three/addons";
import {PsrThreeCanvas} from "../../package";
import {onMounted, ref, watch} from "vue";

// 创建摄像机
const camera: Three.Camera = new Three.PerspectiveCamera(30, 1, 1, 1500);
camera.position.set(0, 400, 700);
camera.lookAt(new Three.Vector3(0, 150, 0))

// 创建场景
const scene = new Three.Scene();
scene.background = new Three.Color(0x000000);
scene.fog = new Three.Fog(0x000000, 250, 1400);

const objects = ref<Three.Object3D[]>([])

// 创建光源
const dirLight = new Three.DirectionalLight(0xffffff, 0.4);
dirLight.position.set(0, 0, 1).normalize();
objects.value.push(dirLight)

const pointLight = new Three.PointLight(0xffffff, 4.5, 0, 0);
pointLight.color.setHSL(Math.random(), 1, 0.5);
pointLight.position.set(0, 100, 90);
objects.value.push(pointLight);

// 创建材质
const materials: Three.MeshPhongMaterial[] = [
  new Three.MeshPhongMaterial({color: 0xffffff, flatShading: true}), // front
  new Three.MeshPhongMaterial({color: 0xffffff}) // side
];

// 创建3d对象组
const group = new Three.Group();
group.position.y = 100;
objects.value.push(group);

// 创建背景平面
const plane = new Three.Mesh(
    new Three.PlaneGeometry(10000, 10000),
    new Three.MeshBasicMaterial({color: 0xffffff, opacity: 0.5, transparent: true})
);
plane.position.y = 100;
plane.rotation.x = -Math.PI / 2;
objects.value.push(plane);

// 创建渲染器
const renderer = new Three.WebGLRenderer({
  antialias: true, // 启用抗锯齿
});
// 设置设备像素比，避免HiDPI设备上绘图模糊
renderer.setPixelRatio(window.devicePixelRatio);


const text = ref('three.js'),
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
        createText(text.value);
      }
  );
}

let textMesh1: Three.Mesh, textMesh2: Three.Mesh, textGeo: TextGeometry;

// 创建文本
function createText(text: string) {
  // 删除现有文本
  if (textMesh1) {
    group.remove(textMesh1);
  }
  if (mirror && textMesh2) {
    group.remove(textMesh2);
  }
  if (!text) return;

  textGeo = new TextGeometry(text, {
    font: font,
    size: size,
    height: height,
    curveSegments: curveSegments,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: bevelEnabled

  });

  textGeo.computeBoundingBox();

  const centerOffset = textGeo.boundingBox ? -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x) : 0;

  textMesh1 = new Three.Mesh(textGeo, materials);
  textMesh1.position.x = centerOffset;
  textMesh1.position.y = hover;
  textMesh1.position.z = 0;
  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;
  group.add(textMesh1);

  if (mirror) {
    textMesh2 = new Three.Mesh(textGeo, materials);
    textMesh2.position.x = centerOffset;
    textMesh2.position.y = -hover;
    textMesh2.position.z = height;
    textMesh2.rotation.x = Math.PI;
    textMesh2.rotation.y = Math.PI * 2;
    group.add(textMesh2);
  }
}

onMounted(() => {
  loadFont()
})

watch(text, text => {
  createText(text)
})
</script>

<template>
  <div>
    <psr-three-canvas
        style="height: 100%;"
        :three-renderer="renderer"
        :three-scene="scene"
        :three-camara="camera"
        :three-objects="objects"
    />
    <input v-model="text"/>
  </div>
</template>

<style scoped>

</style>