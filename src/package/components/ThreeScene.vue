<script setup lang="ts">
import {provide} from "vue";
import {PsrThree} from "../plugins";

const props = defineProps<{
  objectName: string
}>()

const context = PsrThree.useContext()
const scene = context.useScene(props.objectName)
provide(PsrThree.INJECTION_KEY_THREE_SCENE, scene)
</script>

<template>
  <slot/>
</template>