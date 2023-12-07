import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";

export class ArcballControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.ArcballControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'arcball'

    protected buildObject(): any {
        return new ArcballControls(this.camera.object, this.eventTarget, this.options?.object)
    }
}