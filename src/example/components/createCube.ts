import * as THREE from "three"
import {PsrThreePluginTypes} from "../../package/types";

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
    const box = new THREE.BoxGeometry(1, 1, 1);
    const cubeCtx = context.useObject(id + '-cube', () => new THREE.Mesh(
        box,
        new THREE.MeshBasicMaterial({color: 0x00ff00})
    ));
    scene.addChildren(cubeCtx)

    const edges = new THREE.EdgesGeometry(box)
    const lineCtx = context.useObject(id + '-line', () => new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({
            color: 0x4b96ff,
            depthTest: false,
            transparent: true
        })
    ))
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