import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {AbstractObject3DContextImpl} from "./AbstractObject3DContext.ts";
import {ref, Ref} from "vue";

export class Object3DContextImpl<O extends THREE.Object3D> extends AbstractObject3DContextImpl<O, THREE.BoxHelper> implements PsrThreePluginTypes.Object3DContext<O> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Object3D';
    // 辅助器对象选项
    readonly helperOptions: Ref<{ color?: THREE.ColorRepresentation } | undefined> = ref()

    buildHelper(options: { color?: THREE.ColorRepresentation }): THREE.BoxHelper {
        return new THREE.BoxHelper(this.object, options.color)
    }
}