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

        useScene(id: string, scene?: THREE.Scene): SceneContext;

        useObject<O extends THREE.Object3D>(id: string, object: O): Object3DContext<O>;

        useCamera<C extends THREE.Camera>(id: string, camera: C): CameraContext<C>;

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
        readonly viewports: ShallowReactive<PsrThreePluginTypes.RendererViewportContext[]>
        // 视口与ID映射
        readonly viewportById: Record<string, PsrThreePluginTypes.RendererViewportContext>

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

    export interface AbstractObject3DContext<O extends THREE.Object3D, H extends THREE.Object3D | void = void> {
        readonly type: Object3DType
        readonly id: string
        // 3D对象
        readonly object: O;
        // 3d对象
        readonly children: ShallowUnwrapRef<AbstractObject3DContext<any, any>[]>
        // 3d对象与id映射
        readonly childById: ComputedRef<Record<string, AbstractObject3DContext<any, any>>>


        // 脏标识
        readonly dirty: { flag: boolean; time: number };

        // 添加更新处理器
        addUpdateHandler(handler: (delta: number) => boolean | void, options?: { once?: boolean }): void
        // 移除更新处理器
        removeUpdateHandler(handler: (delta: number) => boolean | void): void

        // 更新对象
        update(delta: number, time: number): void

        // 辅助器对象选项
        readonly helperOptions: Ref<any | undefined>

        // 获取辅助器对象
        getHelper(): H | undefined

        buildHelper(options: any): H;
    }

    export interface Object3DContext<O extends THREE.Object3D> extends AbstractObject3DContext<O, THREE.BoxHelper> {
        // 辅助器对象选项
        readonly helperOptions: Ref<{ color?: THREE.ColorRepresentation } | undefined>
    }

    export interface CameraContext<C extends THREE.Camera> extends AbstractObject3DContext<C, THREE.CameraHelper> {
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

    export interface AbstractLightContext<L extends THREE.Light, H extends THREE.Object3D | void = void> extends AbstractObject3DContext<L, H> {
    }

    export interface DirectionalLightContext extends AbstractLightContext<THREE.DirectionalLight, THREE.DirectionalLightHelper> {
        readonly helperOptions: Ref<{
            size?: number
        } | undefined>
    }

    export interface HemisphereLightContext extends AbstractLightContext<THREE.HemisphereLight, THREE.HemisphereLightHelper> {
        readonly helperOptions: Ref<{
            size: number
        } | undefined>
    }

    export interface PointLightContext extends AbstractLightContext<THREE.PointLight, THREE.PointLightHelper> {
        helperOptions: Ref<{
            size: number
        } | undefined>
    }

    export interface SpotLightContext extends AbstractLightContext<THREE.SpotLight, THREE.SpotLightHelper> {
    }
}