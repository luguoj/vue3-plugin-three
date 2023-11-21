import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DUtils} from "../utils/Object3DUtils.ts";

const HANDLER_MARK_DIRTY = () => {
}

export abstract class AbstractObject3DContextImpl<O extends THREE.Object3D> implements PsrThreePluginTypes.AbstractObject3DContext<O> {
    readonly context: PsrThreePluginTypes.ThreeContext
    readonly abstract type: PsrThreePluginTypes.Object3DType
    readonly object: O;
    parent?: PsrThreePluginTypes.AbstractObject3DContext<any>

    get id(): string {
        return this.object.name
    }

    constructor(context: PsrThreePluginTypes.ThreeContext, object: O) {
        this.context = context
        this.object = object
    }

    private children: PsrThreePluginTypes.AbstractObject3DContext<any>[] = []

    addChildren(...objectCtxArr: PsrThreePluginTypes.AbstractObject3DContext<any>[]): void {
        for (const objectCtx of objectCtxArr) {
            if (objectCtx.parent !== this) {
                if (objectCtx.parent) {
                    objectCtx.parent.removeChildren(objectCtx)
                }
                objectCtx.parent = this
                this.children.push(objectCtx)
                this.object.add(objectCtx.object)
                this.markDirty()
            }
        }
    }

    removeChildren(...objectCtxArr: PsrThreePluginTypes.AbstractObject3DContext<any>[]): void {
        for (const objectCtx of objectCtxArr) {
            if (objectCtx.parent == this) {
                objectCtx.parent = undefined
                this.children.splice(this.children.indexOf(objectCtx), 1)
                this.object.remove(objectCtx.object)
                this.markDirty()
            }
        }
    }

    getChildren(): PsrThreePluginTypes.AbstractObject3DContext<any>[] {
        return [...this.children]
    }

    getChild(id: string): PsrThreePluginTypes.AbstractObject3DContext<any> | undefined {
        if (this.object.getObjectByName(id)) {
            return this.context.retrieveObject(id)
        }
    }

    // 更新处理器
    private readonly updateHandlers: Map<any, (delta: number) => boolean | void> = new Map<any, (delta: number) => boolean | void>()

    // 添加更新处理器
    addUpdateHandler(
        handler: (delta: number) => boolean | void,
        options?: {
            once?: boolean
        }
    ): void {
        const {once} = options || {}
        this.updateHandlers.delete(handler)
        if (once) {
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

    markDirty() {
        this.addUpdateHandler(HANDLER_MARK_DIRTY, {once: true})
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
            flag = (updateHandler(delta) !== false) || flag
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

    dispose(): void {
        Object3DUtils.dispose(this.object)
    }
}