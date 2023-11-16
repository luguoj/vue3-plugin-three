import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractLightContextImpl} from "./AbstractLightContext.ts";

export class SpotLightContextImpl extends AbstractLightContextImpl<THREE.SpotLight> implements PsrThreePluginTypes.SpotLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'SpotLight';

    constructor(context: PsrThreePluginTypes.ThreeContext, id: string) {
        super(context, id, new THREE.SpotLight());
    }

    protected buildHelper() {
        return new THREE.SpotLightHelper(this.object)
    }
}