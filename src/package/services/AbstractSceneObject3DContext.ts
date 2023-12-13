import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {AbstractObject3DContextImpl} from "./AbstractObject3DContext.ts";

export abstract class AbstractSceneObject3DContextImpl<O extends THREE.Object3D> extends AbstractObject3DContextImpl<O> implements PsrThreePluginTypes.AbstractSceneObject3DContext<O> {
    readonly scene: PsrThreePluginTypes.SceneContext

    constructor(scene: PsrThreePluginTypes.SceneContext, object: O) {
        super(scene.context, object)
        this.scene = scene
    }

    useHelper(options?: any): PsrThreePluginTypes.AbstractSceneObject3DContext<any> {
        return this.scene.useObject(this.name + 'helper', () => this.buildHelper(options))
    }

    protected abstract buildHelper(options: any): THREE.Object3D
}