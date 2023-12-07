import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";

export class ArcballControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.ArcballControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'arcball'
    object: ArcballControls
    readonly controlsInteractionHandler = () => {
    }

    constructor(camera: PsrThreePluginTypes.CameraContext<any>, eventTarget: HTMLElement, scene?: PsrThreePluginTypes.SceneContext) {
        super(camera, eventTarget)
        this.object = new ArcballControls(camera.object, eventTarget, scene?.object)
        this.object.addEventListener('start', () => {
            this.camera.addUpdateHandler(this.controlsInteractionHandler)
        })
        this.object.addEventListener('end', () => {
            this.camera.removeUpdateHandler(this.controlsInteractionHandler)
        })
    }

    dispose(): void {
        this.camera.removeUpdateHandler(this.controlsInteractionHandler)
        this.object.dispose()
    }
}