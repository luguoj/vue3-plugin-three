import {Ref, watch, watchEffect} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";

export namespace PerspectiveCameraUtils {
    export function useAspectAdaption(camera: THREE.PerspectiveCamera, size: Ref<PsrThreePluginTypes.Size | undefined>) {
        watch(size, newSize => {
            const {width, height} = newSize || {width: 0, height: 0}
            if (camera instanceof THREE.ArrayCamera) {

            } else if (camera instanceof THREE.StereoCamera) {

            } else {
                // 更新透视相机长宽比
                camera.aspect = height != 0 ? (width / height) : 1
            }
            camera.updateProjectionMatrix()
        })
    }

    export function useViewOffsetAdaption(camera: THREE.PerspectiveCamera, size: Ref<PsrThreePluginTypes.Size | undefined>, offset: Ref<THREE.Vector4 | undefined>) {
        watchEffect(() => {
            if (size.value && offset.value) {
                const {width, height} = size.value
                const {x, y, z, w} = offset.value
                if (camera instanceof THREE.ArrayCamera) {

                } else if (camera instanceof THREE.StereoCamera) {

                } else {
                    // 更新透视相机视图偏移
                    camera.setViewOffset(Math.floor(width / x), Math.floor(height / y), z, w, width, height)
                }
            } else {
                if (camera instanceof THREE.ArrayCamera) {

                } else if (camera instanceof THREE.StereoCamera) {

                } else {
                    // 清楚透视相机视图偏移
                    camera.clearViewOffset()
                }
            }
        })
    }
}