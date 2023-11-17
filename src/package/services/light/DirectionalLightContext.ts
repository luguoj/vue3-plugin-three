import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractLightContextImpl} from "./AbstractLightContext.ts";

export class DirectionalLightContextImpl extends AbstractLightContextImpl<THREE.DirectionalLight> implements PsrThreePluginTypes.DirectionalLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'DirectionalLight';

    constructor(context: PsrThreePluginTypes.ThreeContext, id: string) {
        super(context, id, new THREE.DirectionalLight());
    }

    protected buildHelper(options?: {
        size?: number
    }) {
        return new THREE.DirectionalLightHelper(this.object, options?.size);
    }
}