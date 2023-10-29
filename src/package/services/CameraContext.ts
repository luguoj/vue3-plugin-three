import {Ref} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {PerspectiveCameraUtils} from "../utils/PerspectiveCameraUtils.ts";

export class CameraContextImpl<C extends THREE.Camera> implements PsrThreePluginTypes.CameraContext<C> {
    readonly camera: C;

    constructor(camera: C) {
        this.camera = camera
    }

    enableAspectAdaption(size: Ref<PsrThreePluginTypes.Size | undefined>) {
        if (this.camera instanceof THREE.PerspectiveCamera) {
            PerspectiveCameraUtils.useAspectAdaption(this.camera, size)
        } else {
            console.error("enableAspectAdaption failed, PerspectiveCamera is required")
        }
        return this
    }
}