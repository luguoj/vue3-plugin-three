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

        useRenderer(id: string, params?: THREE.WebGLRendererParameters): RendererContext;

        useScene(id: string): SceneContext;

        useObject<O extends THREE.Object3D, H extends THREE.Object3D = THREE.BoxHelper>(id: string, object: O): Object3DContext<O, H>;

        useCamera<C extends THREE.Camera>(id: string, camera: C): CameraContext<C>;

        usePerspectiveCamera(id: string): PerspectiveCameraContext;

        useOrthographicCamera(id: string): OrthographicCameraContext;

        useArrayCamera(id: string): ArrayCameraContext;

        useLight<L extends THREE.Light>(id: string, light: L): LightContext<L>

        useDirectionalLight(id: string): DirectionalLightContext

        useHemisphereLight(id: string): HemisphereLightContext

        usePointLight(id: string): PointLightContext

        useSpotLight(id: string): SpotLightContext

        dispose(): void;
    }

    export interface RendererContext {
        // 画布容器引用
        readonly containerRef: ShallowRef<HTMLElement | undefined>
        // 渲染器
        readonly renderer: THREE.WebGLRenderer
        // 运行标识
        readonly running: Ref<boolean>
        readonly size: Ref<Size | undefined>
        // 事件
        readonly events: {
            // 更新场景
            update: EventHook<number>
            // 完成挂载
            mounted: EventHook<THREE.WebGLRenderer>
            beginUpdate: EventHook<void>
            endUpdate: EventHook<void>
        }
        // 视口
        readonly viewports: ShallowReactive<PsrThreePluginTypes.RendererViewportContext[]>
        // 视口与ID映射
        readonly viewportById: Record<string, PsrThreePluginTypes.RendererViewportContext>

        // 创建视口
        createViewport(id: string, scene: SceneContext, viewport?: Viewport): RendererViewportContext
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
        visible: boolean

        getObjectCssPosition(objectId: string): ObjectCssPosition | undefined
    }

    export type Object3DType =
        'Object3D'
        | 'Camera'
        | 'PerspectiveCamera'
        | 'OrthographicCamera'
        | 'ArrayCamera'
        | 'Light'
        | 'DirectionalLight'
        | 'HemisphereLight'
        | 'PointLight'
        | 'SpotLight'

    export interface Object3DContext<O extends THREE.Object3D, H extends THREE.Object3D = THREE.BoxHelper> {
        readonly type: Object3DType
        readonly id: string
        // 摄像机
        readonly object: O;
        // 启用辅助器
        readonly helperOptions: Ref<any | false>
        // 辅助器对象
        helper: H | undefined
        // 更新处理器
        readonly updateHandlers: Set<(delta: number, ctx: Object3DContext<O, H>) => boolean>

        // 更新对象
        update(delta: number): boolean
    }

    export interface CameraContext<C extends THREE.Camera> extends Object3DContext<C, THREE.CameraHelper> {
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

    export interface SceneContext {
        // 场景
        readonly scene: THREE.Scene
        // 3d对象
        readonly objects: ShallowUnwrapRef<Object3DContext<any, any>[]>
        // 3d对象与id映射
        readonly objectById: ComputedRef<Record<string, Object3DContext<any, any>>>
        // 更新处理器
        readonly updateHandlers: Set<(delta: number, ctx: SceneContext) => boolean>

        // 更新场景
        update(delta: number): boolean
    }

    export interface LightContext<L extends THREE.Light, H extends THREE.Object3D = THREE.BoxHelper> extends Object3DContext<L, H> {
    }

    export interface DirectionalLightContext extends LightContext<THREE.DirectionalLight, THREE.DirectionalLightHelper> {
        helperOptions: Ref<{
            size?: number
        } | false>
    }

    export interface HemisphereLightContext extends LightContext<THREE.HemisphereLight, THREE.HemisphereLightHelper> {
        helperOptions: Ref<{
            size: number
        } | false>
    }

    export interface PointLightContext extends LightContext<THREE.PointLight, THREE.PointLightHelper> {
        helperOptions: Ref<{
            size: number
        } | false>
    }

    export interface SpotLightContext extends LightContext<THREE.SpotLight, THREE.SpotLightHelper> {
    }
}