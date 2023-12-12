import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractPrimitiveContextImpl} from "./AbstractPrimitiveContext.ts";

export class LineContextImpl<O extends THREE.Line> extends AbstractPrimitiveContextImpl<O> implements PsrThreePluginTypes.LineContext<O> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Line';

    static newInstance(context: PsrThreePluginTypes.ThreeContext) {
        return new LineContextImpl(context, new THREE.Line())
    }
}