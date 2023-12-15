<script setup lang="ts">
import {provide, watchEffect} from "vue";
import {vPsrMutationObserver, vPsrResizeObserver} from "@psr-framework/vue3-plugin-utils"
import {PsrThreePluginTypes} from "../types";
import {PsrThree} from "../plugins";

const props = defineProps<{
  objectName: string
  sceneName: string,
  cameraName?: string
}>()
const emits = defineEmits<{
  (e: 'viewportReady', viewport: PsrThreePluginTypes.RendererViewportContext): void
  (e: 'viewportDraw', viewport: PsrThreePluginTypes.RendererViewportContext): void
}>()

const context = PsrThree.useContext()
const renderer = PsrThree.useRenderer()

const viewport = renderer.createViewport(props.objectName, context.useScene(props.sceneName));
provide(PsrThree.INJECTION_KEY_THREE_RENDERER_VIEWPORT, viewport)
emits('viewportReady', viewport)
viewport.renderer.events.draw.on(() => {
  emits('viewportDraw', viewport)
})
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
        viewport.viewport.value.left = div.offsetLeft
        viewport.viewport.value.top = div.offsetTop
      }
    })
  }
}
</script>

<template>
  <div
      v-psr-resize-observer="handleResize"
      v-psr-mutation-observer="handleMutation"
      style="pointer-events: none; position: absolute;overflow:hidden;"
  >
    <slot/>
  </div>
</template>

<style scoped>

</style>