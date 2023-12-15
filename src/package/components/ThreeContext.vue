<script setup lang="ts">
import {provide, watch} from "vue";
import {PsrThree} from "../plugins";

const props = withDefaults(defineProps<{
  contextRunning?: boolean
}>(), {
  contextRunning: true,
})
const context = PsrThree.createContext();
provide(PsrThree.INJECTION_KEY_THREE_CONTEXT, context);

watch(() => props.contextRunning, (running) => {
  context.running.value = running
}, {immediate: true})
</script>

<template>
  <div>
    <slot/>
  </div>
</template>