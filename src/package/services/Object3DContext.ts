import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {ref, Ref, watch} from "vue";
import {Object3DUtils} from "../utils/Object3DUtils.ts";

export class Object3DContextImpl<O extends THREE.Object3D, H extends THREE.Object3D | void = void> implements PsrThreePluginTypes.Object3DContext<O, H> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Object3D';
    readonly id: string;
    readonly object: O;

    readonly helperEnabled: Ref<boolean> = ref(false)
    helper: H | undefined
    protected buildHelper?: () => H = undefined

    constructor(id: string, object: O) {
        this.id = id
        this.object = object
        watch(this.helperEnabled, enabled => {
            if (enabled && this.buildHelper) {
                this.helper = this.buildHelper()
                if (this.helper) {
                    object.children.push(this.helper)
                }
            } else if (this.helper) {
                object.children.splice(object.children.indexOf(this.helper), 1)
                Object3DUtils.dispose(this.helper)
                delete this.helper
            }
        })
    }

}