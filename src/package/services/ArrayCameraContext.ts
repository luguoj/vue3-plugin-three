import {reactive, Ref, shallowReactive, ShallowUnwrapRef, UnwrapRef, watch, watchEffect, WatchStopHandle} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../types";
import {CameraContextImpl} from "./CameraContext.ts";

export class ArrayCameraContextImpl extends CameraContextImpl<THREE.ArrayCamera> implements PsrThreePluginTypes.ArrayCameraContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'ArrayCamera';
    readonly cameras: ShallowUnwrapRef<PsrThreePluginTypes.PerspectiveCameraContext[]> = shallowReactive<PsrThreePluginTypes.PerspectiveCameraContext[]>([]);
    readonly viewports: UnwrapRef<PsrThreePluginTypes.CameraViewport[]> = reactive<PsrThreePluginTypes.CameraViewport[]>([]);
    size?: Ref<PsrThreePluginTypes.Size | undefined>

    private stopAdaptingSizing?: WatchStopHandle = undefined

    constructor(id: string) {
        super(id, new THREE.ArrayCamera());
        watchEffect(() => {
            const newCameras: THREE.PerspectiveCamera[] = []
            for (let i = 0; i < this.cameras.length && i < this.viewports.length; i++) {
                const cameraObj = this.cameras[i].object as any
                const viewport = calcViewport(this.viewports[i], this.size?.value)
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
                    const viewport = calcViewport(this.viewports[i], newSize)
                    cameraObj.viewport = viewport
                    cameraObj.aspect = viewport.height ? viewport.width / viewport.height : 1
                    cameraObj.updateProjectionMatrix()
                }
            })
        }
        return this
    }
}

function calcLength(value: number, range: number): number {
    return value > 1 ? value : Math.floor(range * value)
}

function calcViewport(viewport: PsrThreePluginTypes.CameraViewport, size?: PsrThreePluginTypes.Size): THREE.Vector4 {
    const {width: fullWidth, height: fullHeight} = size || {width: 0, height: 0}
    const {left, right, top, bottom, width, height} = viewport;
    let x = 0, y = 0,
        w = calcLength(width, fullWidth),
        h = calcLength(height, fullHeight)
    if (left != undefined) {
        x = calcLength(left, w)
    } else if (right != undefined) {
        x = fullWidth - w - calcLength(right, w)
    }
    if (top != undefined) {
        y = calcLength(top, h)
    } else if (bottom != undefined) {
        y = fullHeight - h - calcLength(bottom, h)
    }
    return new THREE.Vector4(x, y, w, h)
}