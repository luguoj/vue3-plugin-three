<script setup lang="ts">
import {inject} from "vue";
import {PsrThreePluginTypes} from "../types";
import {INJECTION_KEY_THREE_CONTEXT, INJECTION_KEY_THREE_SCENE} from "./index.ts";

const props = defineProps<{
  objectName: string
}>()

const threeContext = inject<PsrThreePluginTypes.ThreeContext>(INJECTION_KEY_THREE_CONTEXT)!
const camera = threeContext.usePerspectiveCamera(props.objectName)
const scene = inject<PsrThreePluginTypes.SceneContext>(INJECTION_KEY_THREE_SCENE)!
scene.addChildren(camera)

defineExpose({
  camera
})
</script>

<template>
  <slot/>
</template>