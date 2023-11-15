import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractLightContextImpl} from "./AbstractLightContext.ts";

export class PointLightContextImpl extends AbstractLightContextImpl<THREE.PointLight, THREE.PointLightHelper> implements PsrThreePluginTypes.PointLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'PointLight';

    constructor(id: string) {
        super(id, new THREE.PointLight());
    }

    buildHelper(options: {
        size: number
    }): THREE.PointLightHelper {
        return new THREE.PointLightHelper(this.object, options.size);
    }
}