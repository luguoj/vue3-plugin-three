<script setup lang="ts">
import {inject, watchEffect} from "vue";
import {vPsrMutationObserver, vPsrResizeObserver} from "@psr-framework/vue3-plugin-utils"
import {PsrThreePluginTypes} from "../types";
import {INJECTION_KEY_THREE_CONTEXT, INJECTION_KEY_THREE_RENDERER} from "./index.ts";

const props = defineProps<{
  objectName: string
  sceneName: string,
  cameraName?: string
}>()
const threeContext = inject<PsrThreePluginTypes.ThreeContext>(INJECTION_KEY_THREE_CONTEXT)
if (!threeContext) throw new Error("No ThreeContext found")
const renderer = inject<PsrThreePluginTypes.RendererContext>(INJECTION_KEY_THREE_RENDERER)
if (!renderer) throw new Error("No RendererContext found")

const viewport = renderer.createViewport(props.objectName, threeContext.useScene(props.sceneName));
// 监听camera
watchEffect(() => {
  if (props.cameraName) {
    const camera = viewport.scene.objects[props.cameraName]
    if (camera && PsrThreePluginTypes.CameraTypes.includes(camera.type)) {
      viewport.camera.value = camera as any
      return
    }
  }
  viewport.camera.value = undefined
})

// 监听resize事件
function handleResize(entry: ResizeObserverEntry) {
  const target: HTMLDivElement = entry.target as HTMLDivElement
  viewport.viewport.value = {
    width: entry.contentRect.width,
    height: entry.contentRect.height,
    left: target.offsetLeft,
    top: target.offsetTop
  }
}
// 监听div的位置变化
const handleMutation = {
  options: {
    attributeFilter: ['style']
  },
  handler: (mutations: MutationRecord[]) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const div = mutation.target as HTMLDivElement
        viewport.viewport.value.left =div.offsetLeft
        viewport.viewport.value.top = div.offsetTop
      }
    })
  }
}
</script>

<template>
  <div
      ref="divRef"
      v-psr-resize-observer="handleResize"
      v-psr-mutation-observer="handleMutation"
      style="pointer-events: none; position: absolute;overflow:hidden;"
  >
    <slot/>
  </div>
</template>

<style scoped>

</style>