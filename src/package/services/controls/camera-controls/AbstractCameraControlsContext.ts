import {PsrThreePluginTypes} from "../../../types";

export abstract class AbstractCameraControlsContextImpl implements PsrThreePluginTypes.CameraControlsContext {
    abstract readonly type: PsrThreePluginTypes.CameraControlsType

    readonly camera: PsrThreePluginTypes.CameraContext<any>
    readonly eventTarget: HTMLElement
    readonly options?: any

    readonly object: any & { dispose(): void }

    constructor(camera: PsrThreePluginTypes.CameraContext<any>, eventTarget: HTMLElement, options?: any) {
        this.camera = camera
        this.eventTarget = eventTarget
        this.options = options
        this.object = this.buildObject()
        this.initialize()
    }

    dispose(): void {
        this.object.dispose && this.object.dispose()
    }

    protected abstract buildObject(): any

    protected abstract initialize(): void
}