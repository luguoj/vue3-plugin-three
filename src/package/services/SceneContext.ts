import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {AbstractObject3DContextImpl} from "./AbstractObject3DContext.ts";

export class SceneContextImpl extends AbstractObject3DContextImpl<THREE.Scene> implements PsrThreePluginTypes.SceneContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'Scene';

    constructor(id: string, scene?: THREE.Scene) {
        super(id, scene || new THREE.Scene())
    }

    buildHelper(): void {
    }
}