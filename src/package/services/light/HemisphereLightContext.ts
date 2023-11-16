import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractLightContextImpl} from "./AbstractLightContext.ts";

export class HemisphereLightContextImpl extends AbstractLightContextImpl<THREE.HemisphereLight> implements PsrThreePluginTypes.HemisphereLightContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'HemisphereLight';

    constructor(context: PsrThreePluginTypes.ThreeContext, id: string) {
        super(context, id, new THREE.HemisphereLight());
    }

    protected buildHelper(options: {
        size: number
    }) {
        return new THREE.HemisphereLightHelper(this.object, options.size);
    }
}