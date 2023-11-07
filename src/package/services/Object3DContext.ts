import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {ref, Ref, watch} from "vue";
import {Object3DUtils} from "../utils/Object3DUtils.ts";

export class Object3DContextImpl<O extends THREE.Object3D, H extends THREE.Object3D = THREE.BoxHelper> implements PsrThreePluginTypes.Object3DContext<O, H> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Object3D';
    readonly id: string;
    readonly object: O;

    readonly helperOptions: Ref<any | false> = ref(false)
    helper: H | undefined
    readonly buildHelper?: (helperOptions?: any) => H

    constructor(id: string, object: O, options?: {
        buildHelper?: (helperOptions?: any) => H
    }) {
        this.id = id
        this.object = object
        this.buildHelper = options?.buildHelper || (() => {
            return new THREE.BoxHelper(this.object) as any
        })
        if (this.buildHelper) {
            watch(this.helperOptions, newOptions => {
                if (newOptions && this.buildHelper) {
                    this.initHelper(this.buildHelper(newOptions))
                } else {
                    this.initHelper()
                }
            }, {deep: true})
        }
    }

    private initHelper(newHelper?: H) {
        if (this.helper) {
            this.object.children.splice(this.object.children.indexOf(this.helper), 1)
            Object3DUtils.dispose(this.helper)
            delete this.helper
        }
        if (newHelper) {
            this.helper = newHelper
            this.object.children.push(newHelper)
        }
    }

}