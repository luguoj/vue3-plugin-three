import {ComputedRef, Ref, ShallowRef, ShallowUnwrapRef, UnwrapRef} from "vue";
import {EventHook} from "@vueuse/core/index";
import * as THREE from "three"

export namespace PsrThreePluginTypes {
    export interface Size {
        width: number
        height: number
    }

    export type Viewport = { left?: number, right?: number, top?: number, bottom?: number, width: number, height: number }

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
        // 激活的摄像机Id
        readonly activatedCameraId: Ref<string | undefined>
        // 激活的摄像机
        readonly activatedCamera: ComputedRef<CameraContext<any> | undefined>
        // 运行标识
        readonly running: Ref<boolean>
        // 场景上下文
        readonly scene: ShallowRef<SceneContext | undefined>
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
    }

    export interface CameraContext<C extends THREE.Camera> extends Object3DContext<C, THREE.CameraHelper> {
    }

    export interface PerspectiveCameraContext extends CameraContext<THREE.PerspectiveCamera> {
        zoom: Ref<number>;
        fov: Ref<number>;
        aspect: Ref<number>;
        near: Ref<number>;
        far: Ref<number>;

        autoAspect(size: false | Ref<Size | undefined>): PerspectiveCameraContext;
    }

    export interface OrthographicCameraContext extends CameraContext<THREE.OrthographicCamera> {
        left: Ref<number>;
        right: Ref<number>;
        top: Ref<number>;
        bottom: Ref<number>;
        near: Ref<number>;
        far: Ref<number>;
    }

    export interface ArrayCameraContext extends CameraContext<THREE.ArrayCamera> {
        readonly cameras: ShallowUnwrapRef<PerspectiveCameraContext[]>
        readonly viewports: UnwrapRef<Viewport[]>

        adaptingSizing(size?: Ref<Size | undefined>): ArrayCameraContext
    }

    export interface SceneContext {
        // 场景
        readonly scene: THREE.Scene
        // 3d对象
        readonly objects: ShallowUnwrapRef<Object3DContext<any, any>[]>
        // 3d对象与id映射
        readonly objectById: ComputedRef<Record<string, Object3DContext<any, any>>>
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