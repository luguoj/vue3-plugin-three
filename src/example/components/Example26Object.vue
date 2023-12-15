<script setup lang="ts">
import * as THREE from "three";
import {PsrThreePluginTypes} from "../../package/types";
import {PsrThreeObject3d} from "../../package";

const props = defineProps<{
  objectName: string
  objectPosition: THREE.Vector3
}>()

function handleObjectReady(object: PsrThreePluginTypes.Object3DContext<THREE.Object3D>) {
  const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.MeshBasicMaterial({color: 0x00ff00})
  )
  object.object.add(mesh)
  const {x, y, z} = props.objectPosition
  object.object.position.set(x, y, z)
}
</script>

<template>
  <psr-three-object3d :object-name="objectName" @object-ready="handleObjectReady"/>
</template>

<style scoped>

</style>