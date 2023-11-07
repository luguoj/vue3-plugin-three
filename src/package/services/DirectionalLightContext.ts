import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {LightContextImpl} from "./LightContext.ts";

export class DirectionalLightContextImpl extends LightContextImpl<THREE.DirectionalLight, THREE.DirectionalLightHelper> implements PsrThreePluginTypes.DirectionalLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'DirectionalLight';

    constructor(id: string) {
        super(id, new THREE.DirectionalLight(), {
            buildHelper: (helperOptions: { size?: number }) => {
                return new THREE.DirectionalLightHelper(this.object, helperOptions.size)
            }
        })
    }
}