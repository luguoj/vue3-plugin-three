import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractPrimitiveContextImpl} from "./AbstractPrimitiveContext.ts";

export class MeshContextImpl<O extends THREE.Mesh> extends AbstractPrimitiveContextImpl<O> implements PsrThreePluginTypes.MeshContext<O> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Mesh';

    static newInstance(scene: PsrThreePluginTypes.SceneContext) {
        return new MeshContextImpl(scene, new THREE.Mesh());
    }
}