<script setup lang="ts">
import {StateContext} from "../services/StateContext.ts";
import {shallowRef, watch} from "vue";
import {PsrThreePluginTypes} from "../types";

const props = withDefaults(defineProps<{
  rendererContext: PsrThreePluginTypes.RendererContext
  stateEnabled?: boolean
}>(), {
  stateEnabled: false
})


const canvasRef = shallowRef<HTMLCanvasElement>()
const state = new StateContext(props.rendererContext)
watch(canvasRef, canvas => {
  state.canvasRef.value = canvas
})
watch(() => props.stateEnabled, enabled => {
  state.enabled.value = enabled
}, {immediate: true})
</script>

<template>
  <div>
    <canvas
        v-if="stateEnabled"
        :width="StateContext.PANEL_SIZE.WIDTH"
        :height="StateContext.PANEL_SIZE.HEIGHT*3"
        style="width:80px;height:144px;"
        ref="canvasRef"/>
  </div>
</template>

<style scoped>

</style>