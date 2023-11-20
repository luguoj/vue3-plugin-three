import {reactive, Ref, shallowReactive, ShallowUnwrapRef, UnwrapRef, watch, watchEffect, WatchStopHandle} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../../types";
import {CameraContextImpl} from "./CameraContext.ts";
import {ViewportUtils} from "../../utils/ViewportUtils.ts";

export class ArrayCameraContextImpl extends CameraContextImpl<THREE.ArrayCamera> implements PsrThreePluginTypes.ArrayCameraContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'ArrayCamera';
    readonly cameras: ShallowUnwrapRef<PsrThreePluginTypes.PerspectiveCameraContext[]> = shallowReactive<PsrThreePluginTypes.PerspectiveCameraContext[]>([]);
    readonly viewports: UnwrapRef<PsrThreePluginTypes.Viewport[]> = reactive<PsrThreePluginTypes.Viewport[]>([]);
    size?: Ref<PsrThreePluginTypes.Size | undefined>

    private stopAdaptingSizing?: WatchStopHandle = undefined

    constructor(context: PsrThreePluginTypes.ThreeContext) {
        super(context, new THREE.ArrayCamera());
        watchEffect(() => {
            const newCameras: THREE.PerspectiveCamera[] = []
            for (let i = 0; i < this.cameras.length && i < this.viewports.length; i++) {
                const cameraObj = this.cameras[i].object as any
                const viewport = ViewportUtils.calcViewport(this.viewports[i], this.size?.value)
                cameraObj.viewport = viewport
                cameraObj.aspect = viewport.height ? viewport.width / viewport.height : 1
                cameraObj.updateProjectionMatrix()
                newCameras.push(cameraObj)
            }
            this.object.cameras = newCameras
        })
    }

    adaptingSizing(size?: Ref<PsrThreePluginTypes.Size | undefined>) {
        if (this.stopAdaptingSizing) {
            this.stopAdaptingSizing()
        }
        this.size = size
        if (this.size) {
            this.stopAdaptingSizing = watch(this.size, newSize => {
                for (let i = 0; i < this.cameras.length && i < this.viewports.length; i++) {
                    const cameraObj = this.cameras[i].object as any
                    const viewport = ViewportUtils.calcViewport(this.viewports[i], newSize)
                    cameraObj.viewport = viewport
                    cameraObj.aspect = viewport.height ? viewport.width / viewport.height : 1
                    cameraObj.updateProjectionMatrix()
                }
            })
        }
        return this
    }
}