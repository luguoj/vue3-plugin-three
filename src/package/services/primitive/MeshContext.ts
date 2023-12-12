import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractPrimitiveContextImpl} from "./AbstractPrimitiveContext.ts";

export class MeshContextImpl<O extends THREE.Mesh> extends AbstractPrimitiveContextImpl<O> implements PsrThreePluginTypes.MeshContext<O> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Mesh';

    static newInstance(context: PsrThreePluginTypes.ThreeContext) {
        return new MeshContextImpl(context, new THREE.Mesh());
    }
}