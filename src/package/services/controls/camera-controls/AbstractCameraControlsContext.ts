import {PsrThreePluginTypes} from "../../../types";

export abstract class AbstractCameraControlsContextImpl implements PsrThreePluginTypes.CameraControlsContext {
    abstract readonly type: PsrThreePluginTypes.CameraControlsType

    readonly camera: PsrThreePluginTypes.CameraContext<any>
    readonly eventTarget: HTMLElement

    protected constructor(camera: PsrThreePluginTypes.CameraContext<any>, eventTarget: HTMLElement) {
        this.camera = camera
        this.eventTarget = eventTarget
    }

    abstract dispose(): void
}