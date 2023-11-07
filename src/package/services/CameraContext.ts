import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DContextImpl} from "./Object3DContext.ts";

export class CameraContextImpl<C extends THREE.Camera> extends Object3DContextImpl<C, THREE.CameraHelper> implements PsrThreePluginTypes.CameraContext<C> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Camera';

    constructor(id: string, camera: C) {
        super(id, camera, {
            buildHelper: () => {
                return new THREE.CameraHelper(this.object)
            }
        })
    }
}