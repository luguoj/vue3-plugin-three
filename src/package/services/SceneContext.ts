import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {AbstractObject3DContextImpl} from "./AbstractObject3DContext.ts";

export class SceneContextImpl extends AbstractObject3DContextImpl<THREE.Scene> implements PsrThreePluginTypes.SceneContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'Scene';

    constructor(context: PsrThreePluginTypes.ThreeContext, id: string) {
        super(context, id, new THREE.Scene())
    }

    protected buildHelper(): THREE.Object3D {
        throw new Error('not support')
    }
}