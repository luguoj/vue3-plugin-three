<script setup lang="ts">
import {inject, provide} from "vue";
import {PsrThreePluginTypes} from "../types";
import {INJECTION_KEY_THREE_CONTEXT, INJECTION_KEY_THREE_SCENE} from "./index.ts";

const props = defineProps<{
  objectName: string
}>()

const threeContext = inject<PsrThreePluginTypes.ThreeContext>(INJECTION_KEY_THREE_CONTEXT)!
const scene = threeContext.useScene(props.objectName)
provide(INJECTION_KEY_THREE_SCENE, scene)
</script>

<template>
  <slot/>
</template>