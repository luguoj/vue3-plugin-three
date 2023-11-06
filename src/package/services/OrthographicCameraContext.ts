import {ref, watch} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../types";
import {CameraContextImpl} from "./CameraContext.ts";

export class OrthographicCameraContextImpl extends CameraContextImpl<THREE.OrthographicCamera> implements PsrThreePluginTypes.OrthographicCameraContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'OrthographicCamera';
    readonly left = ref(-1)
    readonly right = ref(1)
    readonly top = ref(1)
    readonly bottom = ref(-1)
    readonly near = ref(0.1)
    readonly far = ref(2000)

    constructor(id: string) {
        super(id, new THREE.OrthographicCamera());
        watch(this.left, left => {
            this.object.left = left
            this.object.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.right, right => {
            this.object.right = right
            this.object.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.top, top => {
            this.object.top = top
            this.object.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.bottom, bottom => {
            this.object.bottom = bottom
            this.object.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.near, near => {
            this.object.near = near
            this.object.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.far, far => {
            this.object.far = far
            this.object.updateProjectionMatrix()
        }, {immediate: true})
    }
}