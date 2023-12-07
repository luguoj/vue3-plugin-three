import {FlyControls} from "three/examples/jsm/controls/FlyControls";
import {PsrThreePluginTypes} from "../../../types";
import {ref, Ref, watch} from "vue";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";

export class FlyControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.FlyControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'fly'
    object: FlyControls
    // 激活标识
    readonly enabled: Ref<boolean> = ref(true)
    readonly controlsInteractionHandler = (delta: number) => {
        this.object.update(delta)
    }

    constructor(camera: PsrThreePluginTypes.CameraContext<any>, eventTarget: HTMLElement) {
        super(camera, eventTarget)
        this.object = new FlyControls(camera.object, eventTarget)
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
        this.object.dispose()
    }
}