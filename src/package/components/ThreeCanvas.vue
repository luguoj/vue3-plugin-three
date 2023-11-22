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
props.rendererContext.context.events.beginUpdate.on(() => props.stateEnabled && state.begin())
props.rendererContext.context.events.endUpdate.on(() => props.stateEnabled && state.end())
watch(canvasRef, canvas => {
  state.canvasRef.value = canvas
})
</script>

<template>
  <div>
    <div style="height: 100%;width: 100%;position: relative;overflow:hidden;" v-if="isWebGLAvailable" ref="containerRef">
      <canvas
          v-if="stateEnabled"
          :width="StateContext.PANEL_SIZE.WIDTH"
          :height="StateContext.PANEL_SIZE.HEIGHT*3"
          style="width:80px;height:144px;position: absolute;"
          ref="canvasRef"/>
      <div
          v-for="viewport in rendererContext.viewports" :key="viewport.name"
          style="pointer-events: none; position: absolute;overflow:hidden;"
          :style="{
            width:viewport.viewportRect.value.width+'px',
            height:viewport.viewportRect.value.height+'px',
            left:viewport.viewportRect.value.x+'px',
            bottom:viewport.viewportRect.value.y+'px'
          }"
      >
        <slot :name="`viewport-${viewport.name}`"/>
      </div>
      <slot/>
    </div>
    <div v-else>WebGL is not available!</div>
  </div>
</template>

<style scoped>

</style>