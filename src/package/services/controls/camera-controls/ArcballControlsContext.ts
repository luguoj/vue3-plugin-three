import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";

export class ArcballControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.ArcballControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'arcball'
    object: ArcballControls

    constructor(camera: PsrThreePluginTypes.CameraContext<any>, eventTarget: HTMLElement, scene?: PsrThreePluginTypes.SceneContext) {
        super(camera, eventTarget)
        this.object = new ArcballControls(camera.object, eventTarget, scene?.object)
        const controlsInteractionHandler = () => {
        }
        this.object.addEventListener('start', () => {
            this.camera.addUpdateHandler(controlsInteractionHandler)
        })
        this.object.addEventListener('end', () => {
            this.camera.removeUpdateHandler(controlsInteractionHandler)
        })
    }

    dispose(): void {
        this.object.dispose()
    }
}