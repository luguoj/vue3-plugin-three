import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractLightContextImpl} from "./AbstractLightContext.ts";

export class HemisphereLightContextImpl extends AbstractLightContextImpl<THREE.HemisphereLight> implements PsrThreePluginTypes.HemisphereLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'HemisphereLight';

    constructor(scene: PsrThreePluginTypes.SceneContext) {
        super(scene, new THREE.HemisphereLight());
    }

    protected buildHelper(options: {
        size: number
    }) {
        return new THREE.HemisphereLightHelper(this.object, options.size);
    }
}