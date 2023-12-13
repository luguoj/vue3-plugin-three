import {Ref, ref, watch, WatchStopHandle} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../../types";
import {CameraContextImpl} from "./CameraContext.ts";
import {ViewportUtils} from "../../utils/ViewportUtils.ts";

export class PerspectiveCameraContextImpl extends CameraContextImpl<THREE.PerspectiveCamera> implements PsrThreePluginTypes.PerspectiveCameraContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'PerspectiveCamera';
    readonly zoom = ref(1)
    readonly near = ref(0.1)
    readonly far = ref(2000)
    readonly fov = ref(50)
    readonly viewOffset: Ref<PsrThreePluginTypes.Viewport | undefined> = ref<PsrThreePluginTypes.Viewport>()

    private viewSize: PsrThreePluginTypes.Size = {width: 0, height: 0}

    private readonly updateProjectionHandler = () => {
        this.object.updateProjectionMatrix()
    }

    private updateView = () => {
        const {width, height} = this.viewSize
        // 更新透视相机长宽比
        this.object.aspect = height != 0 ? (width / height) : 1
        // 更新视图偏移
        if (this.viewOffset.value) {
            const {width: fullWidth, height: fullHeight} = this.viewOffset.value
            const {x, y} = ViewportUtils.calcViewport({
                ...this.viewOffset.value,
                width,
                height
            }, {width: fullWidth, height: fullHeight})
            this.object.setViewOffset(fullWidth, fullHeight, x, fullHeight - height - y, width, height)
        } else {
            this.object.clearViewOffset()
        }
        this.addUpdateHandler(this.updateProjectionHandler, {once: true})
    }

    constructor(scene: PsrThreePluginTypes.SceneContext) {
        super(scene, new THREE.PerspectiveCamera());
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
        watch(this.fov, fov => {
            this.object.fov = fov
            this.addUpdateHandler(this.updateProjectionHandler, {once: true})
        }, {immediate: true})
        watch(this.viewOffset, this.updateView, {immediate: true})
    }

    private stopAutoAspectHandle?: WatchStopHandle = undefined

    adaptingSizing(size?: Ref<THREE.Vector4 | undefined>): PsrThreePluginTypes.PerspectiveCameraContext {
        if (this.stopAutoAspectHandle) {
            this.stopAutoAspectHandle()
        }
        if (size) {
            this.stopAutoAspectHandle = watch(size, newSize => {
                this.viewSize = {width: newSize?.width || 0, height: newSize?.height || 0}
                this.updateView()
            }, {immediate: true})
        }
        return this
    }
}