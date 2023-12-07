import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {useResizeObserver} from "./useResizeObserver.ts";

export class TrackballControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.TrackballControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'trackball'

    protected buildObject(): any {
        return new TrackballControls(this.camera.object, this.eventTarget)
    }

    protected controlsInteractionHandler = () => {
        this.object.update()
    }

    resizeObserver = useResizeObserver(this)

    dispose(): void {
        this.resizeObserver.dispose()
        super.dispose()
    }
}