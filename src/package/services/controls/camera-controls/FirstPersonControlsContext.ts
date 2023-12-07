import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
import {PsrThreePluginTypes} from "../../../types";
import {ref, Ref, watch} from "vue";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";

export class FirstPersonControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.FirstPersonControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'first-person'
    object: FirstPersonControls
    // 激活标识
    readonly enabled: Ref<boolean> = ref(true)
    readonly controlsInteractionHandler = (delta: number) => {
        this.object.update(delta)
    }

    constructor(camera: PsrThreePluginTypes.CameraContext<any>, eventTarget: HTMLElement) {
        super(camera, eventTarget)
        this.object = new FirstPersonControls(camera.object, eventTarget)
        // 事件对象元素尺寸变化时更新控制器
        const resizeObserver = new ResizeObserver(() => {
            this.object.handleResize()
        })
        resizeObserver.observe(eventTarget)
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