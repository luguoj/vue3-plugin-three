import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractObject3DContextImpl} from "../AbstractObject3DContext.ts";

export abstract class AbstractLightContextImpl<L extends THREE.Light> extends AbstractObject3DContextImpl<L> implements PsrThreePluginTypes.AbstractLightContext<L> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Light';
}