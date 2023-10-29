import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";

export class CameraContextImpl<C extends THREE.Camera> implements PsrThreePluginTypes.CameraContext<C> {
    readonly camera: C;

    constructor(camera: C) {
        this.camera = camera
    }
}