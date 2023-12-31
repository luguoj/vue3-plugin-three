import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractLightContextImpl} from "./AbstractLightContext.ts";

export class PointLightContextImpl extends AbstractLightContextImpl<THREE.PointLight> implements PsrThreePluginTypes.PointLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'PointLight';

    constructor(scene: PsrThreePluginTypes.SceneContext) {
        super(scene, new THREE.PointLight());
    }

    protected buildHelper(options: {
        size: number
    }) {
        return new THREE.PointLightHelper(this.object, options.size);
    }
}