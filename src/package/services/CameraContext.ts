import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DContextImpl} from "./Object3DContext.ts";
import {Ref, ref, watch} from "vue";

export class CameraContextImpl<C extends THREE.Camera> extends Object3DContextImpl<C> implements PsrThreePluginTypes.CameraContext<C> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Camera';
    readonly enableHelper: Ref<boolean> = ref(false)

    helper: THREE.CameraHelper | undefined

    constructor(id: string, camera: C) {
        super(id, camera);
        watch(this.enableHelper, enable => {
            if (enable) {
                this.helper = new THREE.CameraHelper(camera)
                camera.children.push(this.helper)
            } else if (this.helper) {
                camera.children.splice(camera.children.indexOf(this.helper), 1)
                this.helper.dispose()
                delete this.helper
            }

        })
    }
}