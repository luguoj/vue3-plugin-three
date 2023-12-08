<script setup lang="ts">
import {inject} from "vue";
import {PsrThreePluginTypes} from "../types";
import {INJECTION_KEY_THREE_CONTEXT, INJECTION_KEY_THREE_SCENE} from "./index.ts";

const props = defineProps<{
  objectName: string
  objectProvider: () => THREE.Object3D
}>()

const threeContext = inject<PsrThreePluginTypes.ThreeContext>(INJECTION_KEY_THREE_CONTEXT)!
const object3D = threeContext.useObject(props.objectName, props.objectProvider)
const scene = inject<PsrThreePluginTypes.SceneContext>(INJECTION_KEY_THREE_SCENE)!
scene.addChildren(object3D)
</script>

<template>
  <slot/>
</template>