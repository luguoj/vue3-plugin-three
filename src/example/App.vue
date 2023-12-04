<script setup lang="ts">

import Example from "./components/Example12.vue";
import {ref} from "vue";

const show = ref(true)
</script>

<template>
  <div v-if="show" style="height: 100%;width: 100%;">
    <example style="height: 100%;width: 100%;"/>
  </div>
</template>

<style scoped>
</style>
