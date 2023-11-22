import {ref, Ref, watch} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {RendererContextImpl} from "./RendererContext.ts";
import {CameraContextImpl} from "./camera/CameraContext.ts";
import {PerspectiveCameraContextImpl} from "./camera/PerspectiveCameraContext.ts";
import {OrthographicCameraContextImpl} from "./camera/OrthographicCameraContext.ts";
import {ArrayCameraContextImpl} from "./camera/ArrayCameraContext.ts";
import {SceneContextImpl} from "./SceneContext.ts";
import {Object3DContextImpl} from "./Object3DContext.ts";
import {DirectionalLightContextImpl} from "./light/DirectionalLightContext.ts";
import {HemisphereLightContextImpl} from "./light/HemisphereLightContext.ts";
import {PointLightContextImpl} from "./light/PointLightContext.ts";
import {SpotLightContextImpl} from "./light/SpotLightContext.ts";
import {createEventHook} from "@vueuse/core";

export class ThreeContextImpl implements PsrThreePluginTypes.ThreeContext {
    // 运行标识
    readonly running: Ref<boolean> = ref(false)
    readonly events = {
        beginUpdate: createEventHook<void>(),
        endUpdate: createEventHook<void>()
    }
    // 时钟
    private readonly clock: THREE.Clock = new THREE.Clock()

    private readonly renderers: Record<string, PsrThreePluginTypes.RendererContext> = {}
    private readonly objects: Record<string, PsrThreePluginTypes.Object3DContext<any>> = {}

    // 动画帧请求ID
    private animationId: number | undefined = undefined

    constructor() {
        watch(() => {
            if (!this.running.value) {
                return false
            }
            let running = false
            for (const renderersKey in this.renderers) {
                running = running || this.renderers[renderersKey].running.value
            }
            return running
        }, running => {
            if (running) {
                // 重置时钟
                this.clock.getDelta()
                // 在浏览器下一帧进行重绘
                this.animationId = requestAnimationFrame(() => this.update());
            } else if (this.animationId) {
                cancelAnimationFrame(this.animationId)
                this.animationId = requestAnimationFrame(() => this.clear())
            }
        })
    }

    private update() {
        if (this.running.value) {
            this.events.beginUpdate.trigger().then()
            // 获取两次绘制的时间差
            const time = this.clock.elapsedTime
            const delta = this.clock.getDelta()
            for (const objectsKey in this.objects) {
                const object = this.objects[objectsKey]
                object.update(delta, time)
            }
            for (const renderersKey in this.renderers) {
                this.renderers[renderersKey].draw()
            }
            this.events.endUpdate.trigger().then()
            // 在浏览器下一帧进行重绘
            this.animationId = requestAnimationFrame(() => this.update());
        }
    }

    private clear() {
        for (const renderersKey in this.renderers) {
            const renderer = this.renderers[renderersKey]
            renderer.clear()
        }
    }

    useRenderer(name: string, params?: THREE.WebGLRendererParameters): PsrThreePluginTypes.RendererContext {
        if (!this.renderers[name]) {
            this.renderers[name] = new RendererContextImpl(this, params)
        }
        return this.renderers[name]
    }

    retrieveObject(name: string): PsrThreePluginTypes.Object3DContext<any> {
        return this.objects[name]
    }

    private getObject<O extends PsrThreePluginTypes.AbstractObject3DContext<any>>(name: string, type: PsrThreePluginTypes.Object3DType, provider: () => O): O {
        if (!this.objects[name]) {
            this.objects[name] = provider()
        } else if (this.objects[name].type !== type) {
            throw new Error("type mismatch")
        }
        this.objects[name].object.name = name
        return this.objects[name] as O
    }

    useObject<O extends THREE.Object3D>(name: string, provider: () => O): PsrThreePluginTypes.Object3DContext<O> {
        return this.getObject(name, 'Object3D', () => new Object3DContextImpl(this, provider()))
    }

    useScene(name: string): PsrThreePluginTypes.SceneContext {
        return this.getObject(name, 'Scene', () => new SceneContextImpl(this))
    }

    useCamera<C extends THREE.Camera>(name: string, provider: () => C): PsrThreePluginTypes.CameraContext<C> {
        return this.getObject(name, 'Camera', () => new CameraContextImpl<C>(this, provider()))
    }

    usePerspectiveCamera(name: string): PsrThreePluginTypes.PerspectiveCameraContext {
        return this.getObject(name, 'PerspectiveCamera', () => new PerspectiveCameraContextImpl(this))
    }

    useOrthographicCamera(name: string): PsrThreePluginTypes.OrthographicCameraContext {
        return this.getObject(name, 'OrthographicCamera', () => new OrthographicCameraContextImpl(this))
    }

    useArrayCamera(name: string): PsrThreePluginTypes.ArrayCameraContext {
        return this.getObject(name, 'ArrayCamera', () => new ArrayCameraContextImpl(this))
    }

    useDirectionalLight(name: string): PsrThreePluginTypes.DirectionalLightContext {
        return this.getObject(name, 'DirectionalLight', () => new DirectionalLightContextImpl(this))
    }

    useHemisphereLight(name: string): PsrThreePluginTypes.HemisphereLightContext {
        return this.getObject(name, 'HemisphereLight', () => new HemisphereLightContextImpl(this))
    }

    usePointLight(name: string): PsrThreePluginTypes.PointLightContext {
        return this.getObject(name, 'PointLight', () => new PointLightContextImpl(this))
    }

    useSpotLight(name: string): PsrThreePluginTypes.SpotLightContext {
        return this.getObject(name, 'SpotLight', () => new SpotLightContextImpl(this))
    }

    dispose() {
        this.running.value = false
        for (const rendererId in this.renderers) {
            this.renderers[rendererId].running.value = false
        }
        for (const objectId in this.objects) {
            const object = this.objects[objectId]
            object.dispose()
            delete this.objects[objectId]
        }
        for (const rendererId in this.renderers) {
            const renderer = this.renderers[rendererId].object
            renderer.dispose()
            renderer.forceContextLoss()
            delete this.renderers[rendererId]
        }
    }
}