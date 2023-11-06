<script setup lang="ts">
import {shallowRef, watch} from "vue";
import * as ThreeAddons from "three/examples/jsm/Addons";
import {PsrThreePluginTypes} from "../types";

const props = defineProps<{
  rendererContext: PsrThreePluginTypes.RendererContext
}>()

// 检查WebGL兼容性
const isWebGLAvailable = ThreeAddons.WebGL.isWebGLAvailable();

const containerRef = shallowRef<HTMLElement>()

watch(containerRef, container => {
  props.rendererContext.containerRef.value = container
})
</script>

<template>
  <div>
    <div style="height: 100%;width: 100%;" v-if="isWebGLAvailable" ref="containerRef"/>
    <div v-else>WebGL is not available!</div>
  </div>
</template>

<style scoped>

</style>