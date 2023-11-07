import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {LightContextImpl} from "./LightContext.ts";

export class SpotLightContextImpl extends LightContextImpl<THREE.SpotLight, THREE.SpotLightHelper> implements PsrThreePluginTypes.SpotLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'SpotLight';

    constructor(id: string) {
        super(id, new THREE.SpotLight(), {
            buildHelper: () => {
                return new THREE.SpotLightHelper(this.object)
            }
        })
    }
}