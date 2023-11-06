import {Ref, ref, watch, WatchStopHandle} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../types";
import {CameraContextImpl} from "./CameraContext.ts";

export class PerspectiveCameraContextImpl extends CameraContextImpl<THREE.PerspectiveCamera> implements PsrThreePluginTypes.PerspectiveCameraContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'PerspectiveCamera';
    readonly zoom = ref(1)
    readonly fov = ref(50)
    readonly aspect = ref(1)
    readonly near = ref(0.1)
    readonly far = ref(2000)

    private stopAutoAspectHandle?: WatchStopHandle = undefined

    constructor(id: string) {
        super(id, new THREE.PerspectiveCamera());
        watch(this.zoom, zoom => {
            this.object.zoom = zoom
            this.object.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.fov, fov => {
            this.object.fov = fov
            this.object.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.aspect, aspect => {
            this.object.aspect = aspect
            this.object.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.near, near => {
            this.object.near = near
            this.object.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.far, far => {
            this.object.far = far
            this.object.updateProjectionMatrix()
        }, {immediate: true})
    }

    autoAspect(size: false | Ref<PsrThreePluginTypes.Size | undefined>): PsrThreePluginTypes.PerspectiveCameraContext {
        if (this.stopAutoAspectHandle) {
            this.stopAutoAspectHandle()
        }
        if (size) {
            this.stopAutoAspectHandle = watch(size, newSize => {
                const {width, height} = newSize || {width: 0, height: 0}
                if (this.object instanceof THREE.ArrayCamera) {

                } else {
                    // 更新透视相机长宽比
                    this.aspect.value = height != 0 ? (width / height) : 1
                }
            })
        }
        return this
    }
}