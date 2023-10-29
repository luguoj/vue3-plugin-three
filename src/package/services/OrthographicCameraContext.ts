import {ref, watch} from "vue";
import * as THREE from "three"
import {PsrThreePluginTypes} from "../types";
import {CameraContextImpl} from "./CameraContext.ts";

export class OrthographicCameraContextImpl extends CameraContextImpl<THREE.OrthographicCamera> implements PsrThreePluginTypes.OrthographicCameraContext {
    readonly left = ref(-1)
    readonly right = ref(1)
    readonly top = ref(1)
    readonly bottom = ref(-1)
    readonly near = ref(0.1)
    readonly far = ref(2000)

    constructor() {
        super(new THREE.OrthographicCamera());
        watch(this.left, left => {
            this.camera.left = left
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.right, right => {
            this.camera.right = right
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.top, top => {
            this.camera.top = top
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.bottom, bottom => {
            this.camera.bottom = bottom
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.near, near => {
            this.camera.near = near
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
        watch(this.far, far => {
            this.camera.far = far
            this.camera.updateProjectionMatrix()
        }, {immediate: true})
    }
}