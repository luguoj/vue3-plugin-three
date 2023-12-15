<script setup lang="ts">
import {provide, shallowRef, watch} from "vue";
import {WebGL} from "three/examples/jsm/Addons";
import ThreeStatePanel from "./ThreeStatePanel.vue";
import {PsrThree} from "../plugins";


const props = withDefaults(defineProps<{
  objectName: string
  rendererRunning?: boolean
  stateEnabled?: boolean
}>(), {
  rendererRunning: true,
  stateEnabled: false
})

const context = PsrThree.useContext()
const renderer = context.useRenderer(props.objectName)
provide(PsrThree.INJECTION_KEY_THREE_RENDERER, renderer)

watch(() => props.rendererRunning, (running) => {
  renderer.running.value = running
}, {immediate: true})

// 检查WebGL兼容性
const isWebGLAvailable = WebGL.isWebGLAvailable();
const containerRef = shallowRef<HTMLElement>()

watch(containerRef, container => {
  renderer.containerRef.value = container
})
</script>

<template>
  <div
      style="position: relative;overflow: hidden;"
      v-if="isWebGLAvailable"
  >
    <div
        style="position: absolute;width:100%;height:100%;"
        ref="containerRef"
    />
    <three-state-panel
        style="position: absolute;"
        :renderer-context="renderer"
        :state-enabled="stateEnabled"
    />
    <slot/>
  </div>
</template>