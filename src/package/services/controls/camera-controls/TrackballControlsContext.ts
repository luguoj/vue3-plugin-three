import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {ref, Ref, watch} from "vue";

export class TrackballControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.TrackballControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'trackball'
    // 激活标识
    readonly enabled: Ref<boolean> = ref(true)
    protected buildObject(): any {
        debugger
        return new TrackballControls(this.camera.object, this.eventTarget)
    }

    readonly controlsInteractionHandler = () => {
        this.object.update()
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