import {ref, Ref, watch} from "vue";
import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";
import {FlyControls} from "three/examples/jsm/controls/FlyControls";

export class FlyControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.FlyControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'fly'
    // 激活标识
    readonly enabled: Ref<boolean> = ref(true)

    protected buildObject(): any {
        return new FlyControls(this.camera.object, this.eventTarget)
    }

    readonly controlsInteractionHandler = (delta: number) => {
        this.object.update(delta)
    }

    protected initialize(): void {
        // 激活时为相机添加交互处理器
        watch(this.enabled, enabled => {
            this.object.enabled = enabled
            if (enabled) {
                this.camera.addUpdateHandler(this.controlsInteractionHandler)
            } else {
                this.camera.removeUpdateHandler(this.controlsInteractionHandler)
            }
        }, {immediate: true})
    }

    dispose(): void {
        this.camera.removeUpdateHandler(this.controlsInteractionHandler)
        super.dispose()
    }
}