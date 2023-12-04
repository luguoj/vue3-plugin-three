import {computed, ComputedRef, ref, Ref, ShallowReactive, shallowReactive, watch, WatchStopHandle} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../../types";
import {CameraContextImpl} from "./CameraContext.ts";
import {ViewportUtils} from "../../utils/ViewportUtils.ts";
import {PerspectiveCameraContextImpl} from "./PerspectiveCameraContext.ts";

export class ArrayCameraViewportContextImpl extends PerspectiveCameraContextImpl implements PsrThreePluginTypes.ArrayCameraViewportContext {
    readonly arrayCamera: ArrayCameraContextImpl
    readonly viewport: Ref<PsrThreePluginTypes.Viewport | undefined> = ref()
    readonly viewportRect: ComputedRef<THREE.Vector4> = computed<THREE.Vector4>(() =>
        ViewportUtils.calcViewport(this.viewport.value, this.arrayCamera.size.value)
    )

    updateViewportHandler = () => {
        (this.object as any).viewport = this.viewportRect.value
    }

    constructor(arrayCamera: ArrayCameraContextImpl, viewport?: PsrThreePluginTypes.Viewport) {
        super(arrayCamera.context);
        this.arrayCamera = arrayCamera
        this.viewport.value = viewport
        this.adaptingSizing(this.viewportRect)
        watch(this.viewportRect, () => {
            this.addUpdateHandler(this.updateViewportHandler, {once: true})
        })
    }

}

export class ArrayCameraContextImpl extends CameraContextImpl<THREE.ArrayCamera> implements PsrThreePluginTypes.ArrayCameraContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'ArrayCamera';
    readonly viewports: ShallowReactive<PsrThreePluginTypes.ArrayCameraViewportContext[]> = shallowReactive([])
    size: Ref<PsrThreePluginTypes.Size | undefined> = ref()

    private stopAdaptingSizing?: WatchStopHandle = undefined

    constructor(context: PsrThreePluginTypes.ThreeContext) {
        super(context, new THREE.ArrayCamera());
    }

    adaptingSizing(size?: Ref<THREE.Vector4 | undefined>) {
        if (this.stopAdaptingSizing) {
            this.stopAdaptingSizing()
        }
        if (size) {
            this.stopAdaptingSizing = watch(size, newSize => {
                const {width, height} = newSize || {width: 0, height: 0}
                this.size.value = {width, height}
            })
        }
        return this
    }

    createViewport(name: string, viewport?: PsrThreePluginTypes.Viewport): PsrThreePluginTypes.ArrayCameraViewportContext {
        if (this.viewports.findIndex(viewport => viewport.name == name) > -1) {
            throw new Error("conflict array camera viewport name:" + name)
        }
        const viewportCtx = new ArrayCameraViewportContextImpl(this, viewport)
        viewportCtx.object.name = this.name + '-cam-' + name
        this.viewports.push(viewportCtx)
        this.object.cameras.push(viewportCtx.object)
        this.markDirty()
        return viewportCtx
    }

    update(delta: number, time: number): void {
        // 更新子视图
        let flag = false
        for (const viewport of this.viewports) {
            viewport.update(delta, time)
            flag = flag || viewport.isDirty()
        }
        if (flag) {
            this.markDirty()
        }
        super.update(delta, time)
    }

    dispose() {
        super.dispose();
        for (const viewport of this.viewports) {
            viewport.dispose()
        }
        this.viewports.splice(0, this.viewports.length)
    }
}