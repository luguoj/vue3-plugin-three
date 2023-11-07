<script setup lang="ts">
import {shallowRef, watch} from "vue";
import * as ThreeAddons from "three/examples/jsm/Addons";
import {PsrThreePluginTypes} from "../types";
import {StateContext} from "../services/StateContext.ts";

const props = withDefaults(defineProps<{
  rendererContext: PsrThreePluginTypes.RendererContext
  stateEnabled?: boolean
}>(), {
  stateEnabled: false
})

// 检查WebGL兼容性
const isWebGLAvailable = ThreeAddons.WebGL.isWebGLAvailable();

const containerRef = shallowRef<HTMLElement>()

watch(containerRef, container => {
  props.rendererContext.containerRef.value = container
})

const canvasRef = shallowRef<HTMLCanvasElement>()
const state = new StateContext()
props.rendererContext.events.beginUpdate.on(() => props.stateEnabled && state.begin())
props.rendererContext.events.endUpdate.on(() => props.stateEnabled && state.end())
watch(canvasRef, canvas => {
  state.canvasRef.value = canvas
})
</script>

<template>
  <div>
    <div style="height: 100%;width: 100%;position: relative;" v-if="isWebGLAvailable" ref="containerRef">
      <canvas
          v-if="stateEnabled"
          :width="StateContext.PANEL_SIZE.WIDTH"
          :height="StateContext.PANEL_SIZE.HEIGHT*3"
          style="width:80px;height:144px;position: absolute;"
          ref="canvasRef"/>
    </div>
    <div v-else>WebGL is not available!</div>
  </div>
</template>

<style scoped>

</style>