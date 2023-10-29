import * as THREE from "three"
import {PsrThreePluginTypes} from "../types";
import {RendererContextImpl} from "../services/RendererContext.ts";
import {CameraContextImpl} from "../services/CameraContext.ts";
import {SceneContextImpl} from "../services/SceneContext.ts";

export class PsrThree {
    static createRenderer<C extends THREE.Camera>(params?: THREE.WebGLRendererParameters): PsrThreePluginTypes.RendererContext<C> {
        return new RendererContextImpl(params)
    }

    static createCamera<C extends THREE.Camera>(camera: C): PsrThreePluginTypes.CameraContext<C> {
        return new CameraContextImpl(camera)
    }

    static createScene<C extends THREE.Camera>(): PsrThreePluginTypes.SceneContext<C> {
        return new SceneContextImpl<C>()
    }
}