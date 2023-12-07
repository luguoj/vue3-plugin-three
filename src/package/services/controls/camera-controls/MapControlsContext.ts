import {MapControls} from "three/examples/jsm/controls/MapControls";
import {PsrThreePluginTypes} from "../../../types";
import {OrbitControlsContextImpl} from "./OrbitControlsContext.ts";

export class MapControlsContextImpl extends OrbitControlsContextImpl implements PsrThreePluginTypes.MapControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'map'

    protected buildObject(): any {
        return new MapControls(this.camera.object, this.eventTarget)
    }
}