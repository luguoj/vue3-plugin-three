import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
import {useResizeObserver} from "./useResizeObserver.ts";

export class FirstPersonControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.FirstPersonControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'first-person'

    protected buildObject(): any {
        return new FirstPersonControls(this.camera.object, this.eventTarget)
    }

    protected controlsInteractionHandler = (delta: number) => {
        this.object.update(delta)
    }

    resizeObserver = useResizeObserver(this)

    dispose(): void {
        this.resizeObserver.dispose()
        super.dispose()
    }
}