import {ComputedRef, Ref, ShallowReactive, ShallowRef} from "vue";
import {EventHook} from "@vueuse/core/index";
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export namespace PsrThreePluginTypes {
    export type Size = {
        width: number
        height: number
    }

    export type ObjectCssPosition = {
        left: string
        bottom: string
    }

    export type Viewport = {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
        width: number,
        height: number
    }

    export interface ThreeContext {
        // 运行标识
        readonly running: Ref<boolean>
        // 事件
        readonly events: {
            // 更新场景
            beginUpdate: EventHook<void>
            endUpdate: EventHook<void>
        }

        useRenderer(name: string, params?: THREE.WebGLRendererParameters): RendererContext;

        retrieveObject(name: string): PsrThreePluginTypes.Object3DContext<any>

        useObject<O extends THREE.Object3D>(name: string, provider: () => O): Object3DContext<O>;

        useScene(name: string): SceneContext;

        useCamera<C extends THREE.Camera>(name: string, provider: () => C): CameraContext<C>;

        usePerspectiveCamera(name: string): PerspectiveCameraContext;

        useOrthographicCamera(name: string): OrthographicCameraContext;

        useArrayCamera(name: string): ArrayCameraContext;

        useDirectionalLight(name: string): DirectionalLightContext

        useHemisphereLight(name: string): HemisphereLightContext

        usePointLight(name: string): PointLightContext

        useSpotLight(name: string): SpotLightContext

        dispose(): void;
    }

    export interface RendererContext {
        readonly context: ThreeContext
        // 画布容器引用
        readonly containerRef: ShallowRef<HTMLElement | undefined>
        // 渲染器
        readonly object: THREE.WebGLRenderer
        // 运行标识
        readonly running: Ref<boolean>
        readonly size: Ref<Size | undefined>
        // 视口
        readonly viewports: ShallowReactive<RendererViewportContext[]>
        // 按需绘制标识
        drawOnDemand: boolean

        // 创建视口
        createViewport(name: string, scene: SceneContext, viewport?: Viewport): RendererViewportContext

        draw(): void

        clear(): void
    }

    export interface RendererViewportContext {
        readonly name: string
        // 场景上下文
        readonly scene: SceneContext
        // 激活的摄像机
        readonly camera: ShallowRef<CameraContext<any> | undefined>
        // 视口
        readonly viewport: Ref<Viewport | undefined>
        readonly viewportRect: ComputedRef<THREE.Vector4>
        // 运行标识
        readonly running: Ref<boolean>

        getObjectCssPosition(objectId: string): ObjectCssPosition | undefined
    }

    export type Object3DType =
        'Object3D'
        | 'Scene'
        | 'Camera'
        | 'PerspectiveCamera'
        | 'OrthographicCamera'
        | 'ArrayCamera'
        | 'Light'
        | 'DirectionalLight'
        | 'HemisphereLight'
        | 'PointLight'
        | 'SpotLight'

    export interface AbstractObject3DContext<O extends THREE.Object3D> {
        readonly context: ThreeContext
        readonly type: Object3DType
        readonly name: string
        // 3D对象
        readonly object: O;
        parent?: AbstractObject3DContext<any>

        // 脏标识
        isDirty(): boolean

        markDirty(): void

        addChildren(...objectCtxArr: AbstractObject3DContext<any>[]): void

        removeChildren(...objectCtxArr: AbstractObject3DContext<any>[]): void

        getChildren(): AbstractObject3DContext<any>[]

        getObjectByName(name: string): AbstractObject3DContext<any> | undefined

        // 添加更新处理器
        addUpdateHandler(handler: (delta: number) => boolean | void, options?: { once?: boolean }): void

        // 移除更新处理器
        removeUpdateHandler(handler: (delta: number) => boolean | void): void

        // 更新对象
        update(delta: number, time: number): void

        // 获取辅助器对象
        useHelper(options?: any): AbstractObject3DContext<any>

        // 释放
        dispose(): void
    }

    export interface Object3DContext<O extends THREE.Object3D> extends AbstractObject3DContext<O> {
        useHelper(options?: { color?: THREE.ColorRepresentation }): Object3DContext<THREE.BoxHelper>
    }

    export type CameraControlsType = 'arcball' | 'orbit' | 'trackball' | 'first-person' | 'fly' | 'map' | 'point-lock'

    export interface CameraContext<C extends THREE.Camera> extends AbstractObject3DContext<C> {
        useHelper(): Object3DContext<THREE.CameraHelper>

        useOrbitControls(eventTarget: HTMLElement): OrbitControlsContext
    }

    export interface PerspectiveCameraContext extends CameraContext<THREE.PerspectiveCamera> {
        zoom: Ref<number>;
        near: Ref<number>;
        far: Ref<number>;
        fov: Ref<number>;
        viewOffset: Ref<PsrThreePluginTypes.Viewport | undefined>;
    }

    export interface OrthographicCameraContext extends CameraContext<THREE.OrthographicCamera> {
        zoom: Ref<number>;
        near: Ref<number>;
        far: Ref<number>;
        radius: Ref<number>;
        viewOffset: Ref<PsrThreePluginTypes.Viewport | undefined>;
    }

    export interface ArrayCameraContext extends CameraContext<THREE.ArrayCamera> {
        // 视口
        readonly viewports: ShallowReactive<ArrayCameraViewportContext[]>

        // 创建视口
        createViewport(name: string, viewport?: Viewport): ArrayCameraViewportContext
    }

    export interface ArrayCameraViewportContext extends PerspectiveCameraContext {
        // 视口
        readonly viewport: Ref<Viewport | undefined>
        readonly viewportRect: ComputedRef<THREE.Vector4>
    }


    export interface SceneContext extends AbstractObject3DContext<THREE.Scene> {
    }

    export interface AbstractLightContext<L extends THREE.Light> extends AbstractObject3DContext<L> {
    }

    export interface DirectionalLightContext extends AbstractLightContext<THREE.DirectionalLight> {
        useHelper(options?: { size?: number, color?: THREE.ColorRepresentation }): Object3DContext<THREE.DirectionalLightHelper>
    }

    export interface HemisphereLightContext extends AbstractLightContext<THREE.HemisphereLight> {
        useHelper(options: { size: number, color?: THREE.ColorRepresentation }): Object3DContext<THREE.HemisphereLightHelper>
    }

    export interface PointLightContext extends AbstractLightContext<THREE.PointLight> {
        useHelper(options: { size: number, color?: THREE.ColorRepresentation }): Object3DContext<THREE.PointLightHelper>
    }

    export interface SpotLightContext extends AbstractLightContext<THREE.SpotLight> {
        useHelper(options?: { color?: THREE.ColorRepresentation }): Object3DContext<THREE.SpotLightHelper>
    }

    export interface CameraControlsContext {
        readonly type: CameraControlsType
        readonly camera: CameraContext<any>
        readonly eventTarget: HTMLElement

        dispose(): void
    }

    export interface OrbitControlsContext extends CameraControlsContext {
        readonly object: OrbitControls
        autoRotate: Ref<boolean>
        enableDamping: Ref<boolean>
    }
}