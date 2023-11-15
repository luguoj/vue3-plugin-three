import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {AbstractObject3DContextImpl} from "./AbstractObject3DContext.ts";

export class Object3DContextImpl<O extends THREE.Object3D> extends AbstractObject3DContextImpl<O, THREE.BoxHelper> implements PsrThreePluginTypes.Object3DContext<O> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Object3D';

    buildHelper(options: { color?: THREE.ColorRepresentation }): THREE.BoxHelper {
        return new THREE.BoxHelper(this.object, options.color)
    }
}