import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractSceneObject3DContextImpl} from "../AbstractSceneObject3DContext.ts";

export abstract class AbstractLightContextImpl<L extends THREE.Light> extends AbstractSceneObject3DContextImpl<L> implements PsrThreePluginTypes.AbstractLightContext<L> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Light';
}