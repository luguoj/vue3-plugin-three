import {PsrThreePluginTypes} from "../../../types";
import {ref, Ref, watch} from "vue";

export abstract class AbstractCameraControlsContextImpl implements PsrThreePluginTypes.CameraControlsContext {
    abstract readonly type: PsrThreePluginTypes.CameraControlsType

    readonly camera: PsrThreePluginTypes.CameraContext<any>
    readonly eventTarget: HTMLElement
    readonly options?: any

    readonly object: any
    // 激活标识
    readonly enabled: Ref<boolean> = ref(false)

    constructor(camera: PsrThreePluginTypes.CameraContext<any>, eventTarget: HTMLElement, options?: any) {
        this.camera = camera
        this.eventTarget = eventTarget
        this.options = options
        this.object = this.buildObject()
        this.initialize()
    }

    dispose(): void {
        this.camera.removeUpdateHandler(this.controlsInteractionHandler)
        this.object.dispose && this.object.dispose()
    }

    protected abstract buildObject(): any

    protected controlsInteractionHandler: (delta: number) => void = () => {
    }

    protected initialize() {
        // 激活时为相机添加交互处理器
        watch(this.enabled, enabled => {
            this.updateEnabled(enabled)
            if (enabled) {
                this.camera.addUpdateHandler(this.controlsInteractionHandler)
            } else {
                this.camera.removeUpdateHandler(this.controlsInteractionHandler)
            }
        }, {immediate: true})
    }

    protected updateEnabled(enabled: boolean) {
        this.object.enabled = enabled
    }
}