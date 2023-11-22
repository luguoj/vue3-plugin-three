import {Ref, ref, watch, WatchStopHandle} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../../types";
import {CameraContextImpl} from "./CameraContext.ts";
import {ViewportUtils} from "../../utils/ViewportUtils.ts";

export class OrthographicCameraContextImpl extends CameraContextImpl<THREE.OrthographicCamera> implements PsrThreePluginTypes.OrthographicCameraContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'OrthographicCamera';
    readonly radius = ref(1)
    readonly zoom = ref(1)
    readonly near = ref(0.1)
    readonly far = ref(2000)
    readonly viewOffset: Ref<PsrThreePluginTypes.Viewport | undefined> = ref<PsrThreePluginTypes.Viewport>()

    private viewSize: PsrThreePluginTypes.Size = {width: 0, height: 0}

    private readonly updateProjectionHandler = () => {
        this.object.updateProjectionMatrix()
    }

    private updateView = () => {
        const {width, height} = this.viewSize
        const aspect = height != 0 ? (width / height) : 1
        // 更新透视相机长宽比
        if (aspect > 1) {
            this.object.left = -Math.floor(this.radius.value * aspect)
            this.object.right = Math.floor(this.radius.value * aspect)
            this.object.top = -this.radius.value
            this.object.bottom = this.radius.value
        } else {
            this.object.left = -this.radius.value
            this.object.right = this.radius.value
            this.object.top = -Math.floor(this.radius.value / aspect)
            this.object.bottom = Math.floor(this.radius.value / aspect)
        }
        // 更新视图偏移
        if (this.viewOffset.value) {
            const {width: fullWidth, height: fullHeight} = this.viewOffset.value
            const {x, y} = ViewportUtils.calcViewport({
                ...this.viewOffset.value,
                width,
                height
            }, {width: fullWidth, height: fullHeight})
            this.object.setViewOffset(fullWidth, fullHeight, x, y, width, height)
        } else {
            this.object.clearViewOffset()
        }
        this.addUpdateHandler(this.updateProjectionHandler, {once: true})
    }

    constructor(context: PsrThreePluginTypes.ThreeContext) {
        super(context, new THREE.OrthographicCamera());
        watch(this.zoom, zoom => {
            this.object.zoom = zoom
            this.addUpdateHandler(this.updateProjectionHandler, {once: true})
        }, {immediate: true})
        watch(this.near, near => {
            this.object.near = near
            this.addUpdateHandler(this.updateProjectionHandler, {once: true})
        }, {immediate: true})
        watch(this.far, far => {
            this.object.far = far
            this.addUpdateHandler(this.updateProjectionHandler, {once: true})
        }, {immediate: true})
        watch(this.radius, this.updateView, {immediate: true})
    }

    private stopAutoAspectHandle?: WatchStopHandle = undefined

    adaptingSizing(size?: Ref<THREE.Vector4 | undefined>): PsrThreePluginTypes.OrthographicCameraContext {
        if (this.stopAutoAspectHandle) {
            this.stopAutoAspectHandle()
        }
        if (size) {
            this.stopAutoAspectHandle = watch(size, newSize => {
                this.viewSize = {width: newSize?.width || 0, height: newSize?.height || 0}
                this.updateView()
            })
        }
        return this
    }
}