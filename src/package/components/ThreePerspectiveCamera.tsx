import {PsrThreePluginTypes} from "../types";
import {defineObject3dComponent} from "./defineObject3dComponent.tsx";

export default defineObject3dComponent<PsrThreePluginTypes.PerspectiveCameraContext>(
    'PsrThreePerspectiveCamera',
    (objectName: string, scene: PsrThreePluginTypes.SceneContext) => {
        return scene.usePerspectiveCamera(objectName)
    }
)