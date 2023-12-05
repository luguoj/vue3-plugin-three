import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {PsrThreePluginTypes} from "../../../types";
import {ref, Ref, watch} from "vue";

export class OrbitControlsContextImpl implements PsrThreePluginTypes.OrbitControlsContext {
    readonly camera: PsrThreePluginTypes.CameraContext<any>
    readonly eventTarget: HTMLElement
    object: OrbitControls
    // 自动旋转
    readonly autoRotate: Ref<boolean> = ref(false)
    // 启用阻尼
    readonly enableDamping: Ref<boolean> = ref(false)

    constructor(camera: PsrThreePluginTypes.CameraContext<any>, eventTarget: HTMLElement) {
        this.camera = camera
        this.eventTarget = eventTarget
        this.object = new OrbitControls(camera.object, eventTarget)
        const controlsInteractionHandler = () => {
        }
        this.object.addEventListener('start', () => {
            this.camera.addUpdateHandler(controlsInteractionHandler)
        })
        this.object.addEventListener('end', () => {
            this.camera.removeUpdateHandler(controlsInteractionHandler)
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
        this.object.dispose()
    }
}