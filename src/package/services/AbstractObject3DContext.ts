import {computed, ComputedRef, markRaw, ref, Ref, shallowReactive, ShallowUnwrapRef, watch} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DUtils} from "../utils/Object3DUtils.ts";

export abstract class AbstractObject3DContextImpl<O extends THREE.Object3D, H extends THREE.Object3D | void = void> implements PsrThreePluginTypes.AbstractObject3DContext<O, H> {
    readonly abstract type: PsrThreePluginTypes.Object3DType
    readonly id: string;
    readonly object: O;
    readonly children: ShallowUnwrapRef<PsrThreePluginTypes.AbstractObject3DContext<any, any>[]> = shallowReactive<PsrThreePluginTypes.AbstractObject3DContext<any, any>[]>([])
    readonly childById: ComputedRef<Record<string, PsrThreePluginTypes.AbstractObject3DContext<any, any>>> = computed(() => {
        const childById: Record<string, PsrThreePluginTypes.AbstractObject3DContext<any, any>> = {}
        for (const child of this.children) {
            childById[child.id] = markRaw(child)
        }
        return childById
    })

    readonly helperOptions: Ref<any | undefined> = ref()
    private helper: H | undefined

    getHelper(): H | undefined {
        return this.helper
    }

    constructor(id: string, object: O) {
        this.id = id
        this.object = object
        // 更新需要渲染的3d对象
        watch(this.childById, (newChildById, oldChildById) => {
            for (const oldObjectId in oldChildById) {
                if (!newChildById[oldObjectId]) {
                    this.object.remove(oldChildById[oldObjectId].object)
                    this.dirty.flag = true
                }
            }
            for (const newObjectId in newChildById) {
                if (!oldChildById[newObjectId]) {
                    this.object.add(newChildById[newObjectId].object)
                    this.dirty.flag = true
                }
            }
        })
        // 更新辅助器对象
        watch(this.helperOptions, newHelperOptions => {
            if (this.helper) {
                this.object.children.splice(this.object.children.indexOf(this.helper), 1)
                Object3DUtils.dispose(this.helper)
            }
            if (newHelperOptions) {
                this.helper = this.buildHelper(newHelperOptions)
                if (this.helper) {
                    this.object.children.push(this.helper)
                }
            }
        }, {deep: true})
    }

    // 更新处理器
    private readonly updateHandlers: Map<any, (delta: number) => boolean | void> = new Map<any, (delta: number) => boolean | void>()
    readonly dirty = {flag: false, time: 0}

    // 添加更新处理器
    addUpdateHandler(handler: (delta: number) => boolean | void, options?: { once?: boolean }): void {
        const {once} = options || {}
        if (once && !this.updateHandlers.get(handler)) {
            const handlerOnce = (delta: number) => {
                handler(delta)
                this.updateHandlers.delete(handler)
            }
            this.updateHandlers.set(handler, handlerOnce)
        } else {
            this.updateHandlers.set(handler, handler)
        }
    }

    removeUpdateHandler(handler: (delta: number) => (boolean | void)) {
        this.updateHandlers.delete(handler)
    }

    update(delta: number, time: number): void {
        if (this.dirty.time == time) {
            return
        }
        this.dirty.time = time
        let flag = false
        for (const updateHandler of this.updateHandlers.values()) {
            flag = flag || (updateHandler(delta) !== false)
        }
        for (const child of this.children) {
            child.update(delta, time)
            flag = flag || child.dirty.flag
        }
        this.dirty.flag = flag
    }

    abstract buildHelper(options: any): H
}