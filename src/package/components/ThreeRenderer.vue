<script setup lang="ts">
import {inject, provide, watch} from "vue";
import {INJECTION_KEY_THREE_CONTEXT, INJECTION_KEY_THREE_RENDERER, PsrThreeCanvas} from "./index.ts";
import {PsrThreePluginTypes} from "../types";


const props = withDefaults(defineProps<{
  objectName: string
  rendererRunning?: boolean
  stateEnabled?: boolean
}>(), {
  rendererRunning: true,
  stateEnabled: false
})

const threeContext = inject<PsrThreePluginTypes.ThreeContext>(INJECTION_KEY_THREE_CONTEXT)!
const renderer = threeContext.useRenderer(props.objectName)
provide(INJECTION_KEY_THREE_RENDERER, renderer)

watch(() => props.rendererRunning, (running) => {
  renderer.running.value = running
}, {immediate: true})
</script>

<template>
  <div style="position: relative;overflow: hidden;">
    <psr-three-canvas
        :renderer-context="renderer"
        :state-enabled="stateEnabled"
        style="position: absolute;width: 100%;height: 100%;"
    >
    </psr-three-canvas>
    <slot/>
  </div>
</template>