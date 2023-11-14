import {computed, ComputedRef, markRaw, ref, Ref, shallowReactive, ShallowUnwrapRef, watch} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DUtils} from "../utils/Object3DUtils.ts";

export class Object3DContextImpl<O extends THREE.Object3D, H extends THREE.Object3D | void = void> implements PsrThreePluginTypes.Object3DContext<O, H> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Object3D';
    readonly id: string;
    readonly object: O;

    readonly helperOptions: Ref<any | false> = ref(false)
    helper: H | undefined
    readonly buildHelper?: (helperOptions?: any) => H
    readonly children: ShallowUnwrapRef<PsrThreePluginTypes.Object3DContext<any>[]> = shallowReactive<PsrThreePluginTypes.Object3DContext<any>[]>([])
    readonly childById: ComputedRef<Record<string, PsrThreePluginTypes.Object3DContext<any>>> = computed(() => {
        const childById: Record<string, PsrThreePluginTypes.Object3DContext<any>> = {}
        for (const child of this.children) {
            childById[child.id] = markRaw(child)
        }
        return childById
    })
    // 更新处理器
    readonly updateHandlers: Set<(delta: number) => boolean> = new Set()
    private dirty = false

    constructor(id: string, object: O, options?: {
        buildHelper?: (helperOptions?: any) => H
    }) {
        this.id = id
        this.object = object
        this.buildHelper = options?.buildHelper
        if (this.buildHelper) {
            watch(this.helperOptions, newOptions => {
                if (newOptions && this.buildHelper) {
                    this.initHelper(this.buildHelper(newOptions))
                } else {
                    this.initHelper()
                }
            }, {deep: true})
        }
        // 更新需要渲染的3d对象
        watch(this.childById, (newChildById, oldChildById) => {
            for (const oldObjectId in oldChildById) {
                if (!newChildById[oldObjectId]) {
                    this.object.remove(oldChildById[oldObjectId].object)
                    this.dirty = true
                }
            }
            for (const newObjectId in newChildById) {
                if (!oldChildById[newObjectId]) {
                    this.object.add(newChildById[newObjectId].object)
                    this.dirty = true
                }
            }
        })
    }

    private initHelper(newHelper?: H) {
        if (this.helper) {
            this.object.children.splice(this.object.children.indexOf(this.helper), 1)
            Object3DUtils.dispose(this.helper)
            delete this.helper
        }
        if (newHelper) {
            this.helper = newHelper
            this.object.children.push(newHelper)
        }
    }

    update(delta: number): boolean {
        let flag = this.dirty
        this.dirty = false
        for (const updateHandler of this.updateHandlers) {
            flag = flag || updateHandler(delta)
        }
        for (const child of this.children) {
            flag = flag || child.update(delta)
        }
        return flag
    }
}