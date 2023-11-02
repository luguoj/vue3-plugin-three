import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DUtils} from "../utils/Object3DUtils.ts";
import {RendererContextImpl} from "./RendererContext.ts";
import {CameraContextImpl} from "./CameraContext.ts";
import {PerspectiveCameraContextImpl} from "./PerspectiveCameraContext.ts";
import {OrthographicCameraContextImpl} from "./OrthographicCameraContext.ts";
import {SceneContextImpl} from "./SceneContext.ts";

export class ThreeContextImpl implements PsrThreePluginTypes.ThreeContext {
    private readonly renderers: Record<string, PsrThreePluginTypes.RendererContext<any>> = {}
    private readonly cameras: Record<string, PsrThreePluginTypes.CameraContext<any>> = {}
    private readonly scenes: Record<string, PsrThreePluginTypes.SceneContext<any>> = {}

    useRenderer<C extends THREE.Camera>(name: string, params?: THREE.WebGLRendererParameters): PsrThreePluginTypes.RendererContext<C> {
        if (!this.renderers[name]) {
            this.renderers[name] = new RendererContextImpl(params)
        }
        return this.renderers[name]
    }

    useCamera<C extends THREE.Camera>(name: string, camera: C): PsrThreePluginTypes.CameraContext<C> {
        if (!this.cameras[name]) {
            this.cameras[name] = new CameraContextImpl(camera)
        }
        return this.cameras[name]
    }

    usePerspectiveCamera(name: string): PsrThreePluginTypes.PerspectiveCameraContext {
        if (!this.cameras[name]) {
            this.cameras[name] = new PerspectiveCameraContextImpl()
        }
        return <PsrThreePluginTypes.PerspectiveCameraContext>this.cameras[name]
    }

    useOrthographicCamera(name: string): PsrThreePluginTypes.OrthographicCameraContext {
        if (!this.cameras[name]) {
            this.cameras[name] = new OrthographicCameraContextImpl()
        }
        return <PsrThreePluginTypes.OrthographicCameraContext>this.cameras[name]
    }


    useScene<C extends THREE.Camera>(name: string): PsrThreePluginTypes.SceneContext<C> {
        if (!this.scenes[name]) {
            this.scenes[name] = new SceneContextImpl<C>()
        }
        return this.scenes[name]
    }

    dispose() {
        for (const rendererName in this.renderers) {
            this.renderers[rendererName].runningRef.value = false
        }
        for (const sceneName in this.scenes) {
            const scene = this.scenes[sceneName].scene
            scene.traverse((object: any) => Object3DUtils.dispose(object))
            scene.clear()
            delete this.scenes[sceneName]
        }
        for (const rendererName in this.renderers) {
            const renderer = this.renderers[rendererName].renderer
            renderer.dispose()
            renderer.forceContextLoss()
            delete this.renderers[rendererName]
        }
    }
}