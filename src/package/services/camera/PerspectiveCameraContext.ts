import {Ref, ref, watch, WatchStopHandle} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../../types";
import {CameraContextImpl} from "./CameraContext.ts";

export class PerspectiveCameraContextImpl extends CameraContextImpl<THREE.PerspectiveCamera> implements PsrThreePluginTypes.PerspectiveCameraContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'PerspectiveCamera';
    readonly zoom = ref(1)
    readonly fov = ref(50)
    readonly near = ref(0.1)
    readonly far = ref(2000)

    private aspect: number = 1

    private readonly updateProjectionHandler = () => {
        this.object.zoom = this.zoom.value
        this.object.fov = this.fov.value
        this.object.near = this.near.value
        this.object.far = this.far.value
        this.object.aspect = this.aspect
        this.object.updateProjectionMatrix()
    }

    constructor(context: PsrThreePluginTypes.ThreeContext) {
        super(context, new THREE.PerspectiveCamera());
        watch(this.zoom, () => {
            this.addUpdateHandler(this.updateProjectionHandler, {once: true})
        }, {immediate: true})
        watch(this.fov, () => {
            this.addUpdateHandler(this.updateProjectionHandler, {once: true})
        }, {immediate: true})
        watch(this.near, () => {
            this.addUpdateHandler(this.updateProjectionHandler, {once: true})
        }, {immediate: true})
        watch(this.far, () => {
            this.addUpdateHandler(this.updateProjectionHandler, {once: true})
        }, {immediate: true})
    }

    private stopAutoAspectHandle?: WatchStopHandle = undefined

    adaptingSizing(size?: Ref<THREE.Vector4 | undefined>): PsrThreePluginTypes.PerspectiveCameraContext {
        if (this.stopAutoAspectHandle) {
            this.stopAutoAspectHandle()
        }
        if (size) {
            this.stopAutoAspectHandle = watch(size, newSize => {
                const {width, height} = newSize || {width: 0, height: 0}
                // 更新透视相机长宽比
                this.aspect = height != 0 ? (width / height) : 1
                this.addUpdateHandler(this.updateProjectionHandler, {once: true})
            }, {immediate: true})
        }
        return this
    }
}