import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {LightContextImpl} from "./LightContext.ts";

export class PointLightContextImpl extends LightContextImpl<THREE.PointLight, THREE.PointLightHelper> implements PsrThreePluginTypes.PointLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'PointLight';

    constructor(id: string) {
        super(id, new THREE.PointLight(), {
            buildHelper: (options: { size: number }) => {
                return new THREE.PointLightHelper(this.object, options.size)
            }
        })
    }
}