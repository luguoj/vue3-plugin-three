import * as THREE from "three"
import {PsrThreePluginTypes} from "../../package/types";

export function createCube(context: PsrThreePluginTypes.ThreeContext, scene: PsrThreePluginTypes.SceneContext) {
    // 为场景添加模型
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const material = new THREE.MeshLambertMaterial()
    const cubeModel = context.useObject('cube', new THREE.Mesh(geometry, material));
    cubeModel.helperOptions.value = true
    scene.objects.push(cubeModel)

    const edges = new THREE.EdgesGeometry(geometry)
    const lineModel = context.useObject('l', new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({
            color: 0x4b96ff,
            depthTest: false,
            transparent: true
        })
    ))
    scene.objects.push(lineModel)
    return {
        cube: cubeModel,lineModel
    }
}