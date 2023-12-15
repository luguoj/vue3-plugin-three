import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {defineObject3dComponent} from "./defineObject3dComponent.tsx";

export default defineObject3dComponent<PsrThreePluginTypes.Object3DContext<THREE.Object3D>>(
    'PsrThreeObject3d',
    (objectName: string, scene: PsrThreePluginTypes.SceneContext) => {
        return scene.useObject(objectName, () => new THREE.Object3D())
    }
)