import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {LightContextImpl} from "./LightContext.ts";

export class HemisphereLightContextImpl extends LightContextImpl<THREE.HemisphereLight, THREE.HemisphereLightHelper> implements PsrThreePluginTypes.HemisphereLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'HemisphereLight';

    constructor(id: string) {
        super(id, new THREE.HemisphereLight(), {
            buildHelper: (options: { size: number }) => {
                return new THREE.HemisphereLightHelper(this.object, options.size)
            }
        })
    }
}