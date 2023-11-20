import {Ref, ref, watch, watchEffect, WatchStopHandle} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../../types";
import {CameraContextImpl} from "./CameraContext.ts";

export class OrthographicCameraContextImpl extends CameraContextImpl<THREE.OrthographicCamera> implements PsrThreePluginTypes.OrthographicCameraContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'OrthographicCamera';
    readonly radius = ref(1)
    readonly aspect = ref(1)
    readonly near = ref(0.1)
    readonly far = ref(2000)

    constructor(context: PsrThreePluginTypes.ThreeContext) {
        super(context, new THREE.OrthographicCamera());
        watchEffect(() => {
            const radius = this.radius.value
            const aspect = this.aspect.value
            if (aspect > 1) {
                this.object.left = -Math.floor(radius * aspect)
                this.object.right = Math.floor(radius * aspect)
                this.object.top = -radius
                this.object.bottom = radius
            } else {
                this.object.left = -radius
                this.object.right = radius
                this.object.top = -Math.floor(radius / aspect)
                this.object.bottom = Math.floor(radius / aspect)
            }
            this.object.updateProjectionMatrix()
        })
    }

    private stopAutoAspectHandle?: WatchStopHandle = undefined

    adaptingSizing(size?: Ref<PsrThreePluginTypes.Size | undefined>): PsrThreePluginTypes.OrthographicCameraContext {
        if (this.stopAutoAspectHandle) {
            this.stopAutoAspectHandle()
        }
        if (size) {
            this.stopAutoAspectHandle = watch(size, newSize => {
                const {width, height} = newSize || {width: 0, height: 0}
                // 更新透视相机长宽比
                this.aspect.value = height != 0 ? (width / height) : 1
            })
        }
        return this
    }
}