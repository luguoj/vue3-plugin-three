import {ref, Ref} from "vue";
import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";

export class PointerLockControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.PointerLockControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'pointer-lock'
    // 激活标识
    readonly enabled: Ref<boolean> = ref(true)

    protected buildObject(): any {
        return new PointerLockControls(this.camera.object, this.eventTarget)
    }


    readonly controlsInteractionHandler = () => {
    }

    protected initialize(): void {
        this.object.addEventListener('lock', () => {
            this.camera.addUpdateHandler(this.controlsInteractionHandler)
        })
        this.object.addEventListener('unlock', () => {
            this.camera.removeUpdateHandler(this.controlsInteractionHandler)
        })
    }

    dispose(): void {
        this.camera.removeUpdateHandler(this.controlsInteractionHandler)
        super.dispose()
    }
}