import {PsrThreePluginTypes} from "../../types";
import {shallowRef, ShallowRef} from "vue";

export class ResourceContextImpl<R extends PsrThreePluginTypes.Resource, FR extends PsrThreePluginTypes.Resource> implements PsrThreePluginTypes.ResourceContext<R, FR> {
    readonly context: PsrThreePluginTypes.ThreeContext
    readonly object: ShallowRef<R | undefined> = shallowRef<R>()
    readonly fallbackObject: ShallowRef<FR | undefined> = shallowRef<FR>()

    private _objectPromise: Promise<R>
    private _fallbackObjectPromise?: Promise<FR>

    constructor(context: PsrThreePluginTypes.ThreeContext, objectPromise: Promise<R>, fallbackObjectPromise?: Promise<FR>) {
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