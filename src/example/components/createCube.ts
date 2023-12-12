import * as THREE from "three"
import {PsrThreePluginTypes} from "../../package/types";
import {watch} from "vue";

export function createCube(
    context: PsrThreePluginTypes.ThreeContext,
    scene: PsrThreePluginTypes.SceneContext,
    options?: {
        id?: string
        helper?: boolean
        ani?: boolean
    }
) {
    const {id, helper, ani} = options || {}
    // 为场景添加模型
    const cubeGeo = context.useGeometry('box-geo', () => Promise.resolve(new THREE.BoxGeometry(1, 1, 1)))
    const cubeMat = context.useMaterial('box-mat', () => Promise.resolve(new THREE.MeshBasicMaterial({color: 0x00ff00})))
    const cubeCtx = context.useMesh(id + '-cube')
    cubeCtx.geometry.value = cubeGeo
    cubeCtx.material.value = cubeMat
    scene.addChildren(cubeCtx)

    const edgesGeo = context.useGeometry(
        'box-edges-geo',
        () => new Promise<THREE.BufferGeometry>(resolve => {
            const watchHandle = watch(cubeGeo.object, cubeGeoObject => {
                if (cubeGeoObject) {
                    resolve(new THREE.EdgesGeometry(cubeGeoObject))
                    watchHandle()
                }
            }, {immediate: true})
        })
    )
    const edgesMat = context.useMaterial('box-edges-mat', () => Promise.resolve(new THREE.LineBasicMaterial({color: 0x4b96ff})))
    const lineCtx = context.useLine(id + '-edges', () => new THREE.LineSegments())
    lineCtx.geometry.value = edgesGeo
    lineCtx.material.value = edgesMat
    scene.addChildren(lineCtx)

    let helperCtx: PsrThreePluginTypes.Object3DContext<THREE.BoxHelper> | undefined
    if (helper) {
        helperCtx = cubeCtx.useHelper()
        scene.addChildren(helperCtx)
    }


    if (ani) {
        scene.addUpdateHandler(delta => {
            cubeCtx.object.rotation.x += delta
            cubeCtx.object.rotation.y += delta
            lineCtx.object.rotation.x += delta
            lineCtx.object.rotation.y += delta
            if (helperCtx) {
                helperCtx.object.update()
            }
        })
    }
    return {cubeCtx, lineCtx, helperCtx}
}