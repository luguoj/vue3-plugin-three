import {ref, Ref, shallowReactive, ShallowReactive, watch} from "vue";
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
import {GeometryContextImpl} from "./geometry/GeometryContext.ts";
import {MaterialContextImpl} from "./material/MaterialContext.ts";

export class ThreeContextImpl implements PsrThreePluginTypes.ThreeContext {
    static FALLBACK_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);
    static FALLBACK_MATERIAL = new THREE.MeshBasicMaterial({color: 0x00ff00});

    // 运行标识
    readonly running: Ref<boolean> = ref(false)
    // 事件
    readonly events = {
        // 开始更新
        beginUpdate: createEventHook<void>(),
        // 结束更新
        endUpdate: createEventHook<void>()
    }
    // 时钟
    private readonly clock: THREE.Clock = new THREE.Clock()
    // 渲染器集合
    private readonly renderers: Record<string, PsrThreePluginTypes.RendererContext> = {}
    // 3D对象集合
    readonly objects: ShallowReactive<Record<string, PsrThreePluginTypes.Object3DContext<any>>> = shallowReactive({})
    // 集合结构集合
    readonly geometries: ShallowReactive<Record<string, PsrThreePluginTypes.GeometryContext<any>>> = shallowReactive({})
    // 材质集合
    readonly materials: ShallowReactive<Record<string, PsrThreePluginTypes.MaterialContext<any>>> = shallowReactive({})
    // 动画帧请求ID
    private animationId: number | undefined = undefined

    constructor() {
        // 监听运行状态，执行更新和绘制逻辑
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
                // 停止时取消下一次动画帧
                cancelAnimationFrame(this.animationId)
                // 在下一帧清空渲染器
                this.animationId = requestAnimationFrame(() => this.clear())
            }
        })
    }

    /**
     * 更新逻辑
     * @private
     */
    private update() {
        if (this.running.value) {
            // 触发开始更新事件
            this.events.beginUpdate.trigger().then()
            // 获取两次绘制的时间差
            const time = this.clock.elapsedTime
            const delta = this.clock.getDelta()
            // 更新3D对象
            for (const objectsKey in this.objects) {
                const object = this.objects[objectsKey]
                object.update(delta, time)
            }
            // 触发渲染器绘制
            for (const renderersKey in this.renderers) {
                this.renderers[renderersKey].draw()
            }
            // 触发结束更新事件
            this.events.endUpdate.trigger().then()
            // 在浏览器下一帧进行重绘
            this.animationId = requestAnimationFrame(() => this.update());
        }
    }

    /**
     * 清空渲染器
     * @private
     */
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

    useGeometry<G extends THREE.BufferGeometry>(
        name: string,
        provider: () => Promise<G>,
        fallback?: () => Promise<THREE.BufferGeometry>
    ): PsrThreePluginTypes.GeometryContext<G> {
        if (!this.geometries[name]) {
            return this.geometries[name] = new GeometryContextImpl(
                this,
                provider(),
                fallback ? fallback() : Promise.resolve(ThreeContextImpl.FALLBACK_GEOMETRY)
            )
        }
        return this.geometries[name]
    }

    useMaterial<M extends THREE.Material>(
        name: string,
        provider: () => Promise<M>,
        fallback?: () => Promise<THREE.Material>
    ): PsrThreePluginTypes.MaterialContext<M> {
        if (!this.materials[name]) {
            return this.materials[name] = new MaterialContextImpl(
                this,
                provider(),
                fallback ? fallback() : Promise.resolve(ThreeContextImpl.FALLBACK_MATERIAL)
            )
        }
        return this.materials[name]
    }

    dispose() {
        // 停止上下文运行
        this.running.value = false
        // 停止所有渲染器运行
        for (const rendererId in this.renderers) {
            this.renderers[rendererId].running.value = false
        }
        // 销毁所有对象
        for (const objectId in this.objects) {
            const object = this.objects[objectId]
            object.dispose()
            delete this.objects[objectId]
        }
        // 销毁所有几何结构
        for (const geometryId in this.geometries) {
            const geometry = this.geometries[geometryId]
            geometry.dispose()
            delete this.geometries[geometryId]
        }
        ThreeContextImpl.FALLBACK_GEOMETRY.dispose()
        // 销毁所有材质
        for (const materialId in this.materials) {
            const material = this.materials[materialId]
            material.dispose()
            delete this.materials[materialId]
        }
        ThreeContextImpl.FALLBACK_MATERIAL.dispose()
        // 销毁所有渲染器
        for (const rendererId in this.renderers) {
            const renderer = this.renderers[rendererId].object
            renderer.dispose()
            renderer.forceContextLoss()
            delete this.renderers[rendererId]
        }
    }
}