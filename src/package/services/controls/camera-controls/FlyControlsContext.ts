import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";
import {FlyControls} from "three/examples/jsm/controls/FlyControls";

export class FlyControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.FlyControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'fly'

    protected buildObject(): any {
        return new FlyControls(this.camera.object, this.eventTarget)
    }

    protected controlsInteractionHandler = (delta: number) => {
        this.object.update(delta)
    }
}