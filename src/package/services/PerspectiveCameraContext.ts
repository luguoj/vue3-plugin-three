import {Ref, ref, watch, WatchStopHandle} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../types";
import {CameraContextImpl} from "./CameraContext.ts";

export class PerspectiveCameraContextImpl extends CameraContextImpl<THREE.PerspectiveCamera> implements PsrThreePluginTypes.PerspectiveCameraContext {
    readonly zoom = ref(1)
    readonly fov = ref(50)
    readonly aspect = ref(1)
    readonly near = ref(0.1)
    readonly far = ref(2000)

    private stopAutoAspectHandle?: WatchStopHandle = undefined

    constructor() {
        super(new THREE.PerspectiveCamera());
        watch(this.zoom, zoom => {
            this.camera.zoom = zoom
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.fov, fov => {
            this.camera.fov = fov
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.aspect, aspect => {
            this.camera.aspect = aspect
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.near, near => {
            this.camera.near = near
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.far, far => {
            this.camera.far = far
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
    }

    autoAspect(size: false | Ref<PsrThreePluginTypes.Size | undefined>): PsrThreePluginTypes.PerspectiveCameraContext {
        if (this.stopAutoAspectHandle) {
            this.stopAutoAspectHandle()
        }
        if (size) {
            this.stopAutoAspectHandle = watch(size, newSize => {
                const {width, height} = newSize || {width: 0, height: 0}
                if (this.camera instanceof THREE.ArrayCamera) {

                } else if (this.camera instanceof THREE.StereoCamera) {

                } else {
                    // 更新透视相机长宽比
                    this.aspect.value = height != 0 ? (width / height) : 1
                }
            })
        }
        return this
    }
}