import {ref, Ref, watch} from "vue";
import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";

export class FirstPersonControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.FirstPersonControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'first-person'
    // 激活标识
    readonly enabled: Ref<boolean> = ref(true)

    protected buildObject(): any {
        return new FirstPersonControls(this.camera.object, this.eventTarget)
    }

    readonly controlsInteractionHandler = (delta: number) => {
        this.object.update(delta)
    }
    resizeObserver?: ResizeObserver

    protected initialize(): void {
        // 事件对象元素尺寸变化时更新控制器
        this.resizeObserver = new ResizeObserver(() => {
            this.object.handleResize()
        })
        this.resizeObserver.observe(this.eventTarget)
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
        this.resizeObserver?.disconnect()
        this.camera.removeUpdateHandler(this.controlsInteractionHandler)
        super.dispose()
    }
}