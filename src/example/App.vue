<script setup lang="ts">

import {ref} from "vue";
import {total} from "./router.ts";

const show = ref(true)
const exampleRoute = Array.from(new Array(total).keys()).map(i=>`/${i+1}`)
</script>

<template>
  <div>
    <router-link v-for="route in exampleRoute" :key="route" :to="route">{{ route}}</router-link>
  </div>
  <div v-if="show" style="height: 100%;width: 100%;">
    <router-view  style="height: 100%;width: 100%;"/>
  </div>
</template>

<style scoped>
</style>
