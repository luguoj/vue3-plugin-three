import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DUtils} from "../utils/Object3DUtils.ts";
import {RendererContextImpl} from "./RendererContext.ts";
import {CameraContextImpl} from "./CameraContext.ts";
import {PerspectiveCameraContextImpl} from "./PerspectiveCameraContext.ts";
import {OrthographicCameraContextImpl} from "./OrthographicCameraContext.ts";
import {SceneContextImpl} from "./SceneContext.ts";
import {Object3D} from "three";
import {Object3DContextImpl} from "./Object3DContext.ts";

export class ThreeContextImpl implements PsrThreePluginTypes.ThreeContext {
    private readonly renderers: Record<string, PsrThreePluginTypes.RendererContext> = {}
    private readonly scenes: Record<string, PsrThreePluginTypes.SceneContext> = {}
    private readonly objects: Record<string, PsrThreePluginTypes.Object3DContext<any>> = {}

    useRenderer(id: string, params?: THREE.WebGLRendererParameters): PsrThreePluginTypes.RendererContext {
        if (!this.renderers[id]) {
            this.renderers[id] = new RendererContextImpl(params)
        }
        return this.renderers[id]
    }

    useScene(id: string): PsrThreePluginTypes.SceneContext {
        if (!this.scenes[id]) {
            this.scenes[id] = new SceneContextImpl()
        }
        return this.scenes[id]
    }

    private getObject<O extends PsrThreePluginTypes.Object3DContext<any>>(id: string, type: PsrThreePluginTypes.Object3DType, provider: () => O): O {
        if (!this.objects[id]) {
            this.objects[id] = provider()
        } else if (this.objects[id].type !== type) {
            throw new Error("type mismatch")
        }
        return this.objects[id] as O
    }

    useObject<O extends Object3D>(id: string, object: O): PsrThreePluginTypes.Object3DContext<O> {
        return this.getObject(id, 'Object3D', () => new Object3DContextImpl(id, object))
    }

    useCamera<C extends THREE.Camera>(id: string, camera: C): PsrThreePluginTypes.CameraContext<C> {
        return this.getObject(id, 'Camera', () => new CameraContextImpl<C>(id, camera))
    }

    usePerspectiveCamera(id: string): PsrThreePluginTypes.PerspectiveCameraContext {
        return this.getObject(id, 'PerspectiveCamera', () => new PerspectiveCameraContextImpl(id))
    }

    useOrthographicCamera(id: string): PsrThreePluginTypes.OrthographicCameraContext {
        return this.getObject(id, 'OrthographicCamera', () => new OrthographicCameraContextImpl(id))
    }


    dispose() {
        for (const rendererId in this.renderers) {
            this.renderers[rendererId].running.value = false
        }
        for (const sceneId in this.scenes) {
            const scene = this.scenes[sceneId].scene
            scene.clear()
            delete this.scenes[sceneId]
        }
        for (const objectId in this.objects) {
            const object = this.objects[objectId]
            Object3DUtils.dispose(object.object)
            delete this.objects[objectId]
        }
        for (const rendererId in this.renderers) {
            const renderer = this.renderers[rendererId].renderer
            renderer.dispose()
            renderer.forceContextLoss()
            delete this.renderers[rendererId]
        }
    }
}