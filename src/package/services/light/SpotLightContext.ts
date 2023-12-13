import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractLightContextImpl} from "./AbstractLightContext.ts";

export class SpotLightContextImpl extends AbstractLightContextImpl<THREE.SpotLight> implements PsrThreePluginTypes.SpotLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'SpotLight';

    constructor(scene: PsrThreePluginTypes.SceneContext) {
        super(scene, new THREE.SpotLight());
    }

    protected buildHelper() {
        return new THREE.SpotLightHelper(this.object)
    }
}