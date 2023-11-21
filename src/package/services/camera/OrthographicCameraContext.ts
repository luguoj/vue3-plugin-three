import {Ref, ref, watch, WatchStopHandle} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../../types";
import {CameraContextImpl} from "./CameraContext.ts";

export class OrthographicCameraContextImpl extends CameraContextImpl<THREE.OrthographicCamera> implements PsrThreePluginTypes.OrthographicCameraContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'OrthographicCamera';
    readonly radius = ref(1)
    readonly zoom = ref(1)
    readonly near = ref(0.1)
    readonly far = ref(2000)

    private aspect: number = 1

    private readonly updateProjectionHandler = () => {
        this.object.zoom = this.zoom.value
        this.object.near = this.near.value
        this.object.far = this.far.value
        if (this.aspect > 1) {
            this.object.left = -Math.floor(this.radius.value * this.aspect)
            this.object.right = Math.floor(this.radius.value * this.aspect)
            this.object.top = -this.radius.value
            this.object.bottom = this.radius.value
        } else {
            this.object.left = -this.radius.value
            this.object.right = this.radius.value
            this.object.top = -Math.floor(this.radius.value / this.aspect)
            this.object.bottom = Math.floor(this.radius.value / this.aspect)
        }
        this.object.updateProjectionMatrix()
    }

    constructor(context: PsrThreePluginTypes.ThreeContext) {
        super(context, new THREE.OrthographicCamera());
        watch(this.radius, () => {
            this.addUpdateHandler(this.updateProjectionHandler, {once: true})
        }, {immediate: true})
        watch(this.zoom, () => {
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

    adaptingSizing(size?: Ref<THREE.Vector4 | undefined>): PsrThreePluginTypes.OrthographicCameraContext {
        if (this.stopAutoAspectHandle) {
            this.stopAutoAspectHandle()
        }
        if (size) {
            this.stopAutoAspectHandle = watch(size, newSize => {
                const {width, height} = newSize || {width: 0, height: 0}
                // 更新透视相机长宽比
                this.aspect = height != 0 ? (width / height) : 1
                this.addUpdateHandler(this.updateProjectionHandler, {once: true})
            })
        }
        return this
    }
}