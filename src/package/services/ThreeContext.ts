import {ref, Ref, shallowReactive, ShallowReactive, watch} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {RendererContextImpl} from "./RendererContext.ts";
import {SceneContextImpl} from "./SceneContext.ts";
import {createEventHook} from "@vueuse/core";
import {GeometryContextImpl} from "./resource/geometry/GeometryContext.ts";
import {MaterialContextImpl} from "./resource/material/MaterialContext.ts";

export class ThreeContextImpl implements PsrThreePluginTypes.ThreeContext {
    private static readonly FALLBACK_GEOMETRY_DEFAULT = new THREE.BoxGeometry(1, 1, 1);
    private static readonly FALLBACK_MATERIAL_DEFAULT = new THREE.MeshBasicMaterial({color: 0x00ff00});
    // 运行标识
    readonly running: Ref<boolean> = ref(false)
    // 事件
    readonly events = {
        // 开始更新
        beginUpdate: createEventHook<void>(),
        // 结束更新
        endUpdate: createEventHook<void>()
    }
    // 场景集合
    readonly scenes: ShallowReactive<Record<string, PsrThreePluginTypes.SceneContext>> = shallowReactive({})
    // 集合结构集合
    readonly geometries: ShallowReactive<Record<string, PsrThreePluginTypes.GeometryContext<any>>> = shallowReactive({})
    // 材质集合
    readonly materials: ShallowReactive<Record<string, PsrThreePluginTypes.MaterialContext<any>>> = shallowReactive({})
    // 时钟
    private readonly _clock: THREE.Clock = new THREE.Clock()
    // 渲染器集合
    private readonly _renderers: Record<string, PsrThreePluginTypes.RendererContext> = {}
    // 动画帧请求ID
    private _frameId: number | undefined = undefined

    constructor() {
        // 监听运行状态，执行更新和绘制逻辑
        watch(() => {
            if (!this.running.value) {
                return false
            }
            let running = false
            for (const renderersKey in this._renderers) {
                running = running || this._renderers[renderersKey].running.value
            }
            return running
        }, running => {
            if (running) {
                // 重置时钟
                this._clock.getDelta()
                // 在浏览器下一帧进行重绘
                this._frameId = requestAnimationFrame(() => this.update());
            } else if (this._frameId) {
                // 停止时取消下一次动画帧
                cancelAnimationFrame(this._frameId)
                // 在下一帧清空渲染器
                this._frameId = requestAnimationFrame(() => this.clear())
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
            const time = this._clock.elapsedTime
            const delta = this._clock.getDelta()
            // 更新3D对象
            for (const scenesKey in this.scenes) {
                const sceneContext = this.scenes[scenesKey]
                sceneContext.update(delta, time)
            }
            // 触发渲染器绘制
            for (const renderersKey in this._renderers) {
                this._renderers[renderersKey].draw()
            }
            // 触发结束更新事件
            this.events.endUpdate.trigger().then()
            // 在浏览器下一帧进行重绘
            this._frameId = requestAnimationFrame(() => this.update());
        }
    }

    /**
     * 清空渲染器
     * @private
     */
    private clear() {
        for (const renderersKey in this._renderers) {
            const renderer = this._renderers[renderersKey]
            renderer.clear()
        }
    }

    useRenderer(name: string, params?: THREE.WebGLRendererParameters): PsrThreePluginTypes.RendererContext {
        if (!this._renderers[name]) {
            this._renderers[name] = new RendererContextImpl(this, params)
        }
        return this._renderers[name]
    }


    useScene(name: string): PsrThreePluginTypes.SceneContext {
        if(!this.scenes[name]){
            this.scenes[name] = new SceneContextImpl(this)
        }
        return this.scenes[name]
    }

    useGeometry<G extends THREE.BufferGeometry>(
        name: string,
        provider: () => Promise<G>,
        fallback?: () => Promise<THREE.BufferGeometry>
    ): PsrThreePluginTypes.GeometryContext<G> {
        if (!this.geometries[name]) {
            this.geometries[name] = new GeometryContextImpl(
                this,
                provider(),
                fallback ? fallback() : Promise.resolve(ThreeContextImpl.FALLBACK_GEOMETRY_DEFAULT)
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
            this.materials[name] = new MaterialContextImpl(
                this,
                provider(),
                fallback ? fallback() : Promise.resolve(ThreeContextImpl.FALLBACK_MATERIAL_DEFAULT)
            )
        }
        return this.materials[name]
    }

    dispose() {
        // 停止上下文运行
        this.running.value = false
        // 停止所有渲染器运行
        for (const rendererId in this._renderers) {
            this._renderers[rendererId].running.value = false
        }
        // 销毁所有场景
        for (const scenesKey in this.scenes) {
            const scene = this.scenes[scenesKey]
            scene.dispose()
            delete this.scenes[scenesKey]
        }
        // 销毁所有几何结构
        for (const geometryId in this.geometries) {
            const geometry = this.geometries[geometryId]
            geometry.dispose()
            delete this.geometries[geometryId]
        }
        ThreeContextImpl.FALLBACK_GEOMETRY_DEFAULT.dispose()
        // 销毁所有材质
        for (const materialId in this.materials) {
            const material = this.materials[materialId]
            material.dispose()
            delete this.materials[materialId]
        }
        ThreeContextImpl.FALLBACK_MATERIAL_DEFAULT.dispose()
        // 销毁所有渲染器
        for (const rendererId in this._renderers) {
            const renderer = this._renderers[rendererId].object
            renderer.dispose()
            renderer.forceContextLoss()
            delete this._renderers[rendererId]
        }
    }
}