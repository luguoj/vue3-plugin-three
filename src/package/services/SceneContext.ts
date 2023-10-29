import {shallowReactive, shallowRef, ShallowRef, ShallowUnwrapRef, watch} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";


export class SceneContextImpl<C extends THREE.Camera> implements PsrThreePluginTypes.SceneContext<C> {
    readonly scene: THREE.Scene = new THREE.Scene()
    readonly objects: ShallowUnwrapRef<THREE.Object3D[]> = shallowReactive<THREE.Object3D[]>([])
    readonly cameraContextRef: ShallowRef<PsrThreePluginTypes.CameraContext<C> | undefined> = shallowRef<PsrThreePluginTypes.CameraContext<C>>()
    // 已经渲染的3d对象
    private renderedObjects: THREE.Object3D[] = []

    constructor() {
        // 更新需要渲染的3d对象
        watch(() => this.objects, objects => {
            const toRemove = this.renderedObjects.filter(renderedObject => !objects.includes(renderedObject))
            const toAdd = objects.filter(object => !this.renderedObjects.includes(object))
            if (toRemove.length) {
                this.scene.remove(...toRemove)
            }
            if (toAdd.length) {
                this.scene.add(...toAdd)
            }
            this.renderedObjects = [...objects]
        }, {deep: true})
    }
}