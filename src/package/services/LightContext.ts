import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DContextImpl} from "./Object3DContext.ts";

export class LightContextImpl<L extends THREE.Light, H extends THREE.Object3D = THREE.BoxHelper> extends Object3DContextImpl<L, H> implements PsrThreePluginTypes.LightContext<L, H> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Light';
}