import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractLightContextImpl} from "./AbstractLightContext.ts";

export class HemisphereLightContextImpl extends AbstractLightContextImpl<THREE.HemisphereLight, THREE.HemisphereLightHelper> implements PsrThreePluginTypes.HemisphereLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'HemisphereLight';

    constructor(id: string) {
        super(id, new THREE.HemisphereLight());
    }

    buildHelper(options: {
        size: number
    }): THREE.HemisphereLightHelper {
        return new THREE.HemisphereLightHelper(this.object, options.size);
    }
}