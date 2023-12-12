import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractPrimitiveContextImpl} from "./AbstractPrimitiveContext.ts";

export class PointsContextImpl<O extends THREE.Points> extends AbstractPrimitiveContextImpl<O> implements PsrThreePluginTypes.PointsContext<O> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Points';

    static newInstance(context: PsrThreePluginTypes.ThreeContext) {
        return new PointsContextImpl(context, new THREE.Points());
    }
}