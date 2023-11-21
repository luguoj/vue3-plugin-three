import {ComputedRef, Ref, ShallowReactive, ShallowRef, ShallowUnwrapRef, UnwrapRef} from "vue";
import {EventHook} from "@vueuse/core/index";
import * as THREE from "three"

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

        useRenderer(id: string, params?: THREE.WebGLRendererParameters): RendererContext;

        retrieveObject(id: string): PsrThreePluginTypes.Object3DContext<any>

        useObject<O extends THREE.Object3D>(id: string, provider: () => O): Object3DContext<O>;

        useScene(id: string): SceneContext;

        useCamera<C extends THREE.Camera>(id: string, provider: () => C): CameraContext<C>;

        usePerspectiveCamera(id: string): PerspectiveCameraContext;

        useOrthographicCamera(id: string): OrthographicCameraContext;

        useArrayCamera(id: string): ArrayCameraContext;

        useDirectionalLight(id: string): DirectionalLightContext

        useHemisphereLight(id: string): HemisphereLightContext

        usePointLight(id: string): PointLightContext

        useSpotLight(id: string): SpotLightContext

        dispose(): void;
    }

    export interface RendererContext {
        readonly context: ThreeContext
        // 画布容器引用
        readonly containerRef: ShallowRef<HTMLElement | undefined>
        // 渲染器
        readonly renderer: THREE.WebGLRenderer
        // 运行标识
        readonly running: Ref<boolean>
        readonly size: Ref<Size | undefined>
        // 视口
        readonly viewports: ShallowReactive<RendererViewportContext[]>
        // 按需绘制标识
        drawOnDemand: boolean

        // 创建视口
        createViewport(id: string, scene: SceneContext, viewport?: Viewport): RendererViewportContext

        draw(): void

        clear(): void
    }

    export interface RendererViewportContext {
        readonly id: string
        // 场景上下文
        readonly scene: SceneContext
        // 激活的摄像机Id
        readonly activatedCameraId: Ref<string | undefined>
        // 激活的摄像机
        readonly activatedCamera: ShallowRef<CameraContext<any> | undefined>
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
        readonly id: string
        // 3D对象
        readonly object: O;
        parent?: AbstractObject3DContext<any>

        // 脏标识
        isDirty(): boolean

        addChildren(...objectCtxArr: AbstractObject3DContext<any>[]): void

        removeChildren(...objectCtxArr: AbstractObject3DContext<any>[]): void

        getChildren(): AbstractObject3DContext<any>[]

        getChild(id: string): AbstractObject3DContext<any> | undefined

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

    export interface CameraContext<C extends THREE.Camera> extends AbstractObject3DContext<C> {
        useHelper(): Object3DContext<THREE.CameraHelper>
    }

    export interface PerspectiveCameraContext extends CameraContext<THREE.PerspectiveCamera> {
        zoom: Ref<number>;
        fov: Ref<number>;
        aspect: Ref<number>;
        near: Ref<number>;
        far: Ref<number>;
    }

    export interface OrthographicCameraContext extends CameraContext<THREE.OrthographicCamera> {
        radius: Ref<number>;
        aspect: Ref<number>;
        near: Ref<number>;
        far: Ref<number>;
    }

    export interface ArrayCameraContext extends CameraContext<THREE.ArrayCamera> {
        readonly cameras: ShallowUnwrapRef<PerspectiveCameraContext[]>
        readonly viewports: UnwrapRef<Viewport[]>
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
}