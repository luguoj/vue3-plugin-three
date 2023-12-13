import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {AbstractSceneObject3DContextImpl} from "./AbstractSceneObject3DContext.ts";

export class Object3DContextImpl<O extends THREE.Object3D> extends AbstractSceneObject3DContextImpl<O> implements PsrThreePluginTypes.Object3DContext<O> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Object3D';

    protected buildHelper(options: any): THREE.Object3D {
        return new THREE.BoxHelper(this.object, options?.color)
    }
}