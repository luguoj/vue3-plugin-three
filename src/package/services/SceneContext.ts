import {computed, ComputedRef, markRaw, shallowReactive, ShallowUnwrapRef, watch} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";


export class SceneContextImpl implements PsrThreePluginTypes.SceneContext {
    readonly scene: THREE.Scene = new THREE.Scene()
    readonly children: ShallowUnwrapRef<PsrThreePluginTypes.Object3DContext<any>[]> = shallowReactive<PsrThreePluginTypes.Object3DContext<any>[]>([])
    readonly childById: ComputedRef<Record<string, PsrThreePluginTypes.Object3DContext<any>>> = computed(() => {
        const childById: Record<string, PsrThreePluginTypes.Object3DContext<any>> = {}
        for (const child of this.children) {
            childById[child.id] = markRaw(child)
        }
        return childById
    })
    // 更新处理器
    readonly updateHandlers: Set<(delta: number, ctx: PsrThreePluginTypes.SceneContext) => boolean> = new Set()

    constructor() {
        // 更新需要渲染的3d对象
        watch(this.childById, (newChildById, oldChildById) => {
            for (const oldObjectId in oldChildById) {
                if (!newChildById[oldObjectId]) {
                    this.scene.remove(oldChildById[oldObjectId].object)
                }
            }
            for (const newObjectId in newChildById) {
                if (!oldChildById[newObjectId]) {
                    this.scene.add(newChildById[newObjectId].object)
                }
            }
        })
    }

    update(delta: number): boolean {
        let flag = false
        for (const updateHandler of this.updateHandlers) {
            flag = flag || updateHandler(delta, this)
        }
        return flag
    }
}