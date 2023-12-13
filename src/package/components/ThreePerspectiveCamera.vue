<script setup lang="ts">
import {inject} from "vue";
import {PsrThreePluginTypes} from "../types";
import {INJECTION_KEY_THREE_SCENE} from "./index.ts";

const props = defineProps<{
  objectName: string
}>()

const scene = inject<PsrThreePluginTypes.SceneContext>(INJECTION_KEY_THREE_SCENE)!
const camera = scene.usePerspectiveCamera(props.objectName)
scene.addChildren(camera)

defineExpose({
  camera
})
</script>

<template>
  <slot/>
</template>