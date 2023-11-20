import {Ref, ref, watch, WatchStopHandle} from "vue";
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
        const updateProjectionHandler = () => this.object.updateProjectionMatrix()
        const updateLRTBHandler = (radius: number, aspect: number) => {
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
            this.addUpdateHandler(updateProjectionHandler, {once: true})
        }
        watch(this.radius, radius => updateLRTBHandler(radius, this.aspect.value), {immediate: true})
        watch(this.aspect, aspect => updateLRTBHandler(this.radius.value, aspect), {immediate: true})
        watch(this.near, near => {
            this.object.near = near
            this.addUpdateHandler(updateProjectionHandler, {once: true})
        }, {immediate: true})
        watch(this.far, far => {
            this.object.far = far
            this.addUpdateHandler(updateProjectionHandler, {once: true})
        }, {immediate: true})
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