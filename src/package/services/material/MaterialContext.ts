import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {shallowRef, ShallowRef} from "vue";

export class MaterialContextImpl<M extends THREE.Material> implements PsrThreePluginTypes.MaterialContext<M> {
    readonly context: PsrThreePluginTypes.ThreeContext
    readonly object: ShallowRef<M | undefined> = shallowRef<M>()
    readonly fallbackObject: ShallowRef<THREE.Material | undefined> = shallowRef<THREE.Material>()

    private _objectPromise: Promise<M>
    private _fallbackObjectPromise?: Promise<THREE.Material>

    constructor(context: PsrThreePluginTypes.ThreeContext, objectPromise: Promise<M>, fallbackObjectPromise?: Promise<THREE.Material>) {
        this.context = context
        this._objectPromise = objectPromise
        this._fallbackObjectPromise = fallbackObjectPromise
        objectPromise.then(object => {
            this.object.value = object
        })
        fallbackObjectPromise?.then(object => {
            this.fallbackObject.value = object
        })
    }

    dispose(): void {
        this._objectPromise.then(object => object.dispose())
        this._fallbackObjectPromise?.then(object => object.dispose())
    }
}