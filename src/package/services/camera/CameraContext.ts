import * as THREE from "three";
import {CameraHelper} from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractObject3DContextImpl} from "./../AbstractObject3DContext.ts";

export class CameraContextImpl<C extends THREE.Camera> extends AbstractObject3DContextImpl<C, THREE.CameraHelper> implements PsrThreePluginTypes.CameraContext<C> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Camera';

    buildHelper(): CameraHelper {
        return new THREE.CameraHelper(this.object);
    }
}