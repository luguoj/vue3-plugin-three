import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractLightContextImpl} from "./AbstractLightContext.ts";

export class DirectionalLightContextImpl extends AbstractLightContextImpl<THREE.DirectionalLight, THREE.DirectionalLightHelper> implements PsrThreePluginTypes.DirectionalLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'DirectionalLight';

    constructor(id: string) {
        super(id, new THREE.DirectionalLight());
    }

    buildHelper(options: {
        size?: number
    }): THREE.DirectionalLightHelper {
        return new THREE.DirectionalLightHelper(this.object, options.size);
    }
}