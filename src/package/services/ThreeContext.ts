import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {Object3DUtils} from "../utils/Object3DUtils.ts";
import {RendererContextImpl} from "./RendererContext.ts";
import {CameraContextImpl} from "./CameraContext.ts";
import {PerspectiveCameraContextImpl} from "./PerspectiveCameraContext.ts";
import {OrthographicCameraContextImpl} from "./OrthographicCameraContext.ts";
import {SceneContextImpl} from "./SceneContext.ts";
import {Object3DContextImpl} from "./Object3DContext.ts";
import {LightContextImpl} from "./LightContext.ts";
import {DirectionalLightContextImpl} from "./DirectionalLightContext.ts";
import {HemisphereLightContextImpl} from "./HemisphereLightContext.ts";
import {PointLightContextImpl} from "./PointLightContext.ts";
import {SpotLightContextImpl} from "./SpotLightContext.ts";
import {ArrayCameraContextImpl} from "./ArrayCameraContext.ts";

export class ThreeContextImpl implements PsrThreePluginTypes.ThreeContext {
    private readonly renderers: Record<string, PsrThreePluginTypes.RendererContext> = {}
    private readonly objects: Record<string, PsrThreePluginTypes.Object3DContext<any>> = {}

    useRenderer(id: string, params?: THREE.WebGLRendererParameters): PsrThreePluginTypes.RendererContext {
        if (!this.renderers[id]) {
            this.renderers[id] = new RendererContextImpl(params)
        }
        return this.renderers[id]
    }

    private getObject<O extends PsrThreePluginTypes.Object3DContext<any, any>>(id: string, type: PsrThreePluginTypes.Object3DType, provider: () => O): O {
        if (!this.objects[id]) {
            this.objects[id] = provider()
        } else if (this.objects[id].type !== type) {
            throw new Error("type mismatch")
        }
        return this.objects[id] as O
    }

    useObject<O extends THREE.Object3D, H extends THREE.Object3D = THREE.BoxHelper>(id: string, object: O): PsrThreePluginTypes.Object3DContext<O, H> {
        return this.getObject(id, 'Object3D', () => new Object3DContextImpl(id, object))
    }

    useScene(id: string, scene?: THREE.Scene): PsrThreePluginTypes.SceneContext {
        return this.getObject(id, 'Scene', () => new SceneContextImpl(id, scene))
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

    useArrayCamera(id: string): PsrThreePluginTypes.ArrayCameraContext {
        return this.getObject(id, 'ArrayCamera', () => new ArrayCameraContextImpl(id))
    }

    useLight<L extends THREE.Light>(id: string, light: L): PsrThreePluginTypes.LightContext<L> {
        return this.getObject(id, 'Light', () => new LightContextImpl(id, light))
    }

    useDirectionalLight(id: string): PsrThreePluginTypes.DirectionalLightContext {
        return this.getObject(id, 'DirectionalLight', () => new DirectionalLightContextImpl(id))
    }

    useHemisphereLight(id: string): PsrThreePluginTypes.HemisphereLightContext {
        return this.getObject(id, 'HemisphereLight', () => new HemisphereLightContextImpl(id))
    }

    usePointLight(id: string): PsrThreePluginTypes.PointLightContext {
        return this.getObject(id, 'PointLight', () => new PointLightContextImpl(id))
    }

    useSpotLight(id: string): PsrThreePluginTypes.SpotLightContext {
        return this.getObject(id, 'SpotLight', () => new SpotLightContextImpl(id))
    }

    dispose() {
        for (const rendererId in this.renderers) {
            this.renderers[rendererId].running.value = false
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