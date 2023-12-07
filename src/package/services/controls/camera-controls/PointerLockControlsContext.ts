import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";

export class PointerLockControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.PointerLockControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'pointer-lock'

    protected buildObject(): any {
        return new PointerLockControls(this.camera.object, this.eventTarget)
    }

    protected updateEnabled(enabled: boolean) {
        if (enabled) {
            this.object.lock()
        } else {
            this.object.unlock()
        }
    }
}