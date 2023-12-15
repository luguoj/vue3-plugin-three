import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DUtils} from "../utils/Object3DUtils.ts";
import {createEventHook} from "@vueuse/core";

const HANDLER_MARK_DIRTY = () => {
}

export abstract class AbstractObject3DContextImpl<O extends THREE.Object3D> implements PsrThreePluginTypes.AbstractObject3DContext<O> {
    readonly abstract type: PsrThreePluginTypes.Object3DType
    readonly context: PsrThreePluginTypes.ThreeContext
    readonly object: O;
    parent?: PsrThreePluginTypes.AbstractObject3DContext<any>
    // 事件
    readonly events = {
        // 变更
        changed: createEventHook<void>()
    }

    get name(): string {
        return this.object.name
    }

    set name(name: string) {
        this.object.name = name
    }

    protected constructor(context: PsrThreePluginTypes.ThreeContext, object: O) {
        this.context = context
        this.object = object
    }

    // 下级对象
    private _children: PsrThreePluginTypes.AbstractObject3DContext<any>[] = []

    /**
     * 添加子对象
     * <pre>
     *     这个函数接受任意数量的参数，并将这些参数作为子对象添加到当前对象中。
     *     如果子对象的父对象不是当前对象，则将其从旧的父对象中移除，并添加到当前对象的子对象列表中。
     *     最后，将子对象添加到当前对象的关联对象中，并标记当前对象已更改。
     * </pre>
     *
     * @param objectCtxArr
     */
    addChildren(...objectCtxArr: PsrThreePluginTypes.AbstractObject3DContext<any>[]): void {
        for (const objectCtx of objectCtxArr) {
            if (objectCtx.parent !== this) {
                if (objectCtx.parent) {
                    objectCtx.parent.removeChildren(objectCtx)
                }
                objectCtx.parent = this
                this._children.push(objectCtx)
                this.object.add(objectCtx.object)
                this.markDirty()
            }
        }
    }

    /**
     * 移除子对象
     * <pre>
     *     这个函数用于移除子对象。它接受任意数量的参数，并将这些参数作为子对象移除。
     *     首先，将参数中的每个子对象从当前对象的子对象列表中移除，然后从关联对象中移除对应的对象。
     *     最后，标记当前对象已更改
     * </pre>
     * @param objectCtxArr
     */
    removeChildren(...objectCtxArr: PsrThreePluginTypes.AbstractObject3DContext<any>[]): void {
        for (const objectCtx of objectCtxArr) {
            if (objectCtx.parent == this) {
                objectCtx.parent = undefined
                this._children.splice(this._children.indexOf(objectCtx), 1)
                this.object.remove(objectCtx.object)
                this.markDirty()
            }
        }
    }

    // 更新处理器
    private readonly _updateHandlers: Map<any, (delta: number) => boolean | void> = new Map<any, (delta: number) => boolean | void>()

    /**
     * 添加更新处理器
     */
    addUpdateHandler(
        handler: (delta: number) => boolean | void,
        options?: {
            once?: boolean
        }
    ): void {
        const {once} = options || {}
        this._updateHandlers.delete(handler)
        if (once) {
            const handlerOnce = (delta: number) => {
                handler(delta)
                this._updateHandlers.delete(handler)
            }
            this._updateHandlers.set(handler, handlerOnce)
        } else {
            this._updateHandlers.set(handler, handler)
        }
    }

    removeUpdateHandler(handler: (delta: number) => (boolean | void)) {
        this._updateHandlers.delete(handler)
    }

    private _dirty = true
    private _lastUpdatedTime: number = 0

    isDirty() {
        return this._dirty
    }

    markDirty() {
        this.addUpdateHandler(HANDLER_MARK_DIRTY, {once: true})
    }

    update(delta: number, time: number): void {
        // 如果更新事件与当前时间一致则跳过（由上级对象触发过更新）
        if (this._lastUpdatedTime == time) {
            return
        }
        this._lastUpdatedTime = time
        // 接受更新处理器外部的更新标识
        let flag = false
        for (const updateHandler of this._updateHandlers.values()) {
            flag = (updateHandler(delta) !== false) || flag
        }
        if (flag) {
            this.events.changed.trigger().then()
        }
        for (const child of this._children) {
            child.update(delta, time)
            flag = flag || child.isDirty()
        }
        this._dirty = flag
    }

    dispose(): void {
        for (const child of this._children) {
            child.dispose()
        }
        this._children = []
        Object3DUtils.dispose(this.object)
    }
}