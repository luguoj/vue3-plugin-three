import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractObject3DContextImpl} from "../AbstractObject3DContext.ts";

export abstract class AbstractLightContextImpl<L extends THREE.Light, H extends THREE.Object3D | void = void> extends AbstractObject3DContextImpl<L, H> implements PsrThreePluginTypes.AbstractLightContext<L, H> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Light';
}