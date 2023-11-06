import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";

export class Object3DContextImpl<O extends THREE.Object3D> implements PsrThreePluginTypes.Object3DContext<O> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Object3D';
    readonly id: string;
    readonly object: O;

    constructor(id: string, object: O) {
        this.id = id
        this.object = object
    }

}