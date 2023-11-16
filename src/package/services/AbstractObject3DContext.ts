import {computed, ComputedRef, markRaw, shallowReactive, ShallowUnwrapRef, watch} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";

export abstract class AbstractObject3DContextImpl<O extends THREE.Object3D> implements PsrThreePluginTypes.AbstractObject3DContext<O> {
    readonly context: PsrThreePluginTypes.ThreeContext
    readonly abstract type: PsrThreePluginTypes.Object3DType
    readonly id: string;
    readonly object: O;
    readonly children: ShallowUnwrapRef<PsrThreePluginTypes.AbstractObject3DContext<any>[]> = shallowReactive<PsrThreePluginTypes.AbstractObject3DContext<any>[]>([])
    readonly childById: ComputedRef<Record<string, PsrThreePluginTypes.AbstractObject3DContext<any>>> = computed(() => {
        const childById: Record<string, PsrThreePluginTypes.AbstractObject3DContext<any>> = {}
        for (const child of this.children) {
            childById[child.id] = markRaw(child)
        }
        return childById
    })

    constructor(context: PsrThreePluginTypes.ThreeContext, id: string, object: O) {
        this.context = context
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

    useHelper(options?: any): PsrThreePluginTypes.AbstractObject3DContext<any> {
        return this.context.useObject(this.id + 'helper', this.buildHelper(options))
    }

    protected abstract buildHelper(options: any): THREE.Object3D
}