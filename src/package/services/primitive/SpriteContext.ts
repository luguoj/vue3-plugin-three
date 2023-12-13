import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractPrimitiveContextImpl} from "./AbstractPrimitiveContext.ts";

export class SpriteContextImpl<O extends THREE.Sprite> extends AbstractPrimitiveContextImpl<O> implements PsrThreePluginTypes.SpriteContext<O> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Sprite';

    static newInstance(scene: PsrThreePluginTypes.SceneContext) {
        return new SpriteContextImpl(scene, new THREE.Sprite());
    }
}