import {computed, ComputedRef, markRaw, ref, shallowReactive, ShallowUnwrapRef, watch} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";


export class SceneContextImpl implements PsrThreePluginTypes.SceneContext {
    readonly scene: THREE.Scene = new THREE.Scene()
    readonly objects: ShallowUnwrapRef<PsrThreePluginTypes.Object3DContext<any>[]> = shallowReactive<PsrThreePluginTypes.Object3DContext<any>[]>([])
    readonly objectById: ComputedRef<Record<string, PsrThreePluginTypes.Object3DContext<any>>> = computed(() => {
        const objectByName: Record<string, PsrThreePluginTypes.Object3DContext<any>> = {}
        for (const object of this.objects) {
            objectByName[object.id] = markRaw(object)
        }
        return objectByName
    })
    readonly activatedCameraId = ref<string>()
    readonly activatedCamera: ComputedRef<PsrThreePluginTypes.CameraContext<any> | undefined> = computed(() =>
        this.activatedCameraId.value && this.objectById.value[this.activatedCameraId.value] as PsrThreePluginTypes.CameraContext<any> || undefined
    )

    constructor() {
        // 更新需要渲染的3d对象
        watch(this.objectById, (newObjectById, oldObjectById) => {
            for (const oldObjectId in oldObjectById) {
                if (!newObjectById[oldObjectId]) {
                    this.scene.remove(oldObjectById[oldObjectId].object)
                }
            }
            for (const newObjectId in newObjectById) {
                if (!oldObjectById[newObjectId]) {
                    this.scene.add(newObjectById[newObjectId].object)
                }
            }
        })
    }
}