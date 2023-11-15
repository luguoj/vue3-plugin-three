import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractLightContextImpl} from "./AbstractLightContext.ts";

export class SpotLightContextImpl extends AbstractLightContextImpl<THREE.SpotLight, THREE.SpotLightHelper> implements PsrThreePluginTypes.SpotLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'SpotLight';

    constructor(id: string) {
        super(id, new THREE.SpotLight());
    }

    buildHelper(): THREE.SpotLightHelper {
        return new THREE.SpotLightHelper(this.object)
    }
}