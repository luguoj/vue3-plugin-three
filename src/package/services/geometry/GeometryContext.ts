import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {ShallowRef, shallowRef} from "vue";

export class GeometryContextImpl<G extends THREE.BufferGeometry> implements PsrThreePluginTypes.GeometryContext<G> {
    readonly context: PsrThreePluginTypes.ThreeContext
    readonly object: ShallowRef<G | undefined> = shallowRef<G>()
    readonly fallbackObject: ShallowRef<THREE.BufferGeometry | undefined> = shallowRef<THREE.BufferGeometry>()

    private _objectPromise: Promise<G>
    private _fallbackObjectPromise: Promise<THREE.BufferGeometry>

    constructor(context: PsrThreePluginTypes.ThreeContext, objectPromise: Promise<G>, fallbackObjectPromise: Promise<THREE.BufferGeometry>) {
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