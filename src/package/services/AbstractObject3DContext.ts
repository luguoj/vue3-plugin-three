import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";

export abstract class AbstractObject3DContextImpl<O extends THREE.Object3D> implements PsrThreePluginTypes.AbstractObject3DContext<O> {
    readonly context: PsrThreePluginTypes.ThreeContext
    readonly abstract type: PsrThreePluginTypes.Object3DType
    readonly id: string;
    readonly object: O;
    parent?: PsrThreePluginTypes.AbstractObject3DContext<any>

    constructor(context: PsrThreePluginTypes.ThreeContext, id: string, object: O) {
        this.context = context
        this.id = id
        this.object = object
    }

    private children: PsrThreePluginTypes.AbstractObject3DContext<any>[] = []
    private childById: Record<string, PsrThreePluginTypes.AbstractObject3DContext<any>> = {}

    addChildren(...objectCtxArr: PsrThreePluginTypes.AbstractObject3DContext<any>[]): void {
        for (const objectCtx of objectCtxArr) {
            if (!this.childById[objectCtx.id]) {
                if (objectCtx.parent) {
                    objectCtx.parent.deleteChildren(objectCtx)
                }
                objectCtx.parent = this
                this.children.push(objectCtx)
                this.childById[objectCtx.id] = objectCtx
                this.object.add(objectCtx.object)
                this.dirty = true
            }
        }
    }

    deleteChildren(...objectCtxArr: PsrThreePluginTypes.AbstractObject3DContext<any>[]): void {
        for (const objectCtx of objectCtxArr) {
            if (this.childById[objectCtx.id]) {
                objectCtx.parent = undefined
                this.children.splice(this.children.indexOf(objectCtx), 1)
                delete this.childById[objectCtx.id]
                this.object.remove(objectCtx.object)
                this.dirty = true
            }
        }
    }

    getChildren(): PsrThreePluginTypes.AbstractObject3DContext<any>[] {
        return [...this.children]
    }

    getChild(id: string): PsrThreePluginTypes.AbstractObject3DContext<any> | undefined {
        return this.childById[id]
    }

    // 更新处理器
    private readonly updateHandlers: Map<any, (delta: number) => boolean | void> = new Map<any, (delta: number) => boolean | void>()

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

    private dirty = true
    private lastUpdatedTime: number = 0

    isDirty() {
        return this.dirty
    }

    update(delta: number, time: number): void {
        // 如果更新事件与当前时间一致则跳过（由上级对象触发过更新）
        if (this.lastUpdatedTime == time) {
            return
        }
        this.lastUpdatedTime = time
        // 接受更新处理器外部的更新标识
        let flag = false
        for (const updateHandler of this.updateHandlers.values()) {
            flag = flag || (updateHandler(delta) !== false)
        }
        for (const child of this.children) {
            child.update(delta, time)
            flag = flag || child.isDirty()
        }
        this.dirty = flag
    }

    useHelper(options?: any): PsrThreePluginTypes.AbstractObject3DContext<any> {
        return this.context.useObject(this.id + 'helper', () => this.buildHelper(options))
    }

    protected abstract buildHelper(options: any): THREE.Object3D
}