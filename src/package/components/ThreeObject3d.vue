<script setup lang="ts">
import {inject, provide} from "vue";
import {PsrThreePluginTypes} from "../types";
import {INJECTION_KEY_THREE_PARENT, INJECTION_KEY_THREE_SCENE} from "./index.ts";

const props = defineProps<{
  objectName: string
  objectProvider: () => THREE.Object3D
}>()

const scene = inject<PsrThreePluginTypes.SceneContext>(INJECTION_KEY_THREE_SCENE)!
const object3D = scene.useObject(props.objectName, props.objectProvider)
const parent = inject<PsrThreePluginTypes.AbstractSceneObject3DContext<any>>(INJECTION_KEY_THREE_PARENT)!
if (parent) {
  parent.addChildren(object3D)
} else {
  scene.addChildren(object3D)
}
provide(INJECTION_KEY_THREE_PARENT, object3D)
</script>

<template>
  <slot/>
</template>