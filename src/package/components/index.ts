import PsrThreeCanvas from "./ThreeCanvas.vue"
import PsrThreeContext from "./ThreeContext.vue"
import PsrThreeRenderer from "./ThreeRenderer.vue"
import PsrThreeRendererViewport from "./ThreeRendererViewport.vue";
import PsrThreeScene from "./ThreeScene.vue";
import PsrThreePerspectiveCamera from "./ThreePerspectiveCamera.vue"
import PsrThreeObject3d from "./ThreeObject3d.vue"
import {PsrThreePluginTypes} from "../types";


export {
    PsrThreeCanvas,
    PsrThreeContext,
    PsrThreeRenderer,
    PsrThreeRendererViewport,
    PsrThreeScene,
    PsrThreePerspectiveCamera,
    PsrThreeObject3d
}

export const INJECTION_KEY_THREE_CONTEXT = Symbol('three-context')
export const INJECTION_KEY_THREE_RENDERER = Symbol('three-renderer')
export const INJECTION_KEY_THREE_SCENE = Symbol('three-scene')
export const INJECTION_KEY_THREE_PARENT = Symbol('three-parent')

export type PsrThreePerspectiveCameraExposed = {
    camera: PsrThreePluginTypes.PerspectiveCameraContext
}