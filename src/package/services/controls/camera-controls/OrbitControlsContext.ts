import {ref, Ref, watch} from "vue";
import {PsrThreePluginTypes} from "../../../types";
import {AbstractCameraControlsContextImpl} from "./AbstractCameraControlsContext.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class OrbitControlsContextImpl extends AbstractCameraControlsContextImpl implements PsrThreePluginTypes.OrbitControlsContext {
    readonly type: PsrThreePluginTypes.CameraControlsType = 'orbit'
    // 自动旋转
    readonly autoRotate: Ref<boolean> = ref(false)
    // 启用阻尼
    readonly enableDamping: Ref<boolean> = ref(false)

    protected buildObject(): any {
        return new OrbitControls(this.camera.object, this.eventTarget)
    }

    readonly controlsInteractionHandler = () => {
    }

    protected initialize(): void {
        this.object.addEventListener('start', () => {
            this.camera.addUpdateHandler(this.controlsInteractionHandler)
        })
        this.object.addEventListener('end', () => {
            this.camera.removeUpdateHandler(this.controlsInteractionHandler)
        })
        watch(this.autoRotate, autoRotate => {
            this.object.autoRotate = autoRotate
            this.updateControls()
        })
        watch(this.enableDamping, enableDamping => {
            this.object.enableDamping = enableDamping
            this.updateControls()
        })
    }

    private updateControls() {
        if (this.autoRotate.value || this.enableDamping.value) {
            this.camera.addUpdateHandler(this.updateControlsHandler)
        } else {
            this.camera.removeUpdateHandler(this.updateControlsHandler)
        }
    }

    private readonly updateControlsHandler = (delta: number) => {
        this.object.update(delta)
    }

    dispose(): void {
        this.camera.removeUpdateHandler(this.updateControlsHandler)
        this.camera.removeUpdateHandler(this.controlsInteractionHandler)
        super.dispose()
    }
}