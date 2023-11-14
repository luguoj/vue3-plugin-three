import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DContextImpl} from "./Object3DContext.ts";

export class SceneContextImpl extends Object3DContextImpl<THREE.Scene> implements PsrThreePluginTypes.SceneContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'Scene';

    constructor(id: string, scene?: THREE.Scene) {
        super(id, scene || new THREE.Scene())
    }
}