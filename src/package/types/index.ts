import {ComputedRef, Ref, ShallowRef, ShallowUnwrapRef} from "vue";
import {EventHook} from "@vueuse/core/index";
import * as THREE from "three"

export namespace PsrThreePluginTypes {
    export interface Size {
        width: number
        height: number
    }

    export interface ThreeContext {

        useRenderer(id: string, params?: THREE.WebGLRendererParameters): RendererContext;

        useScene(id: string): SceneContext;

        useObject<O extends THREE.Object3D>(id: string, object: O): Object3DContext<O>;

        useCamera<C extends THREE.Camera>(id: string, camera: C): CameraContext<C>;

        usePerspectiveCamera(id: string): PerspectiveCameraContext;

        useOrthographicCamera(id: string): OrthographicCameraContext;

        dispose(): void;
    }

    export interface RendererContext {
        // 画布容器引用
        readonly containerRef: ShallowRef<HTMLElement | undefined>
        // 渲染器
        readonly renderer: THREE.WebGLRenderer
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
            beginUpdate:EventHook<void>
            endUpdate:EventHook<void>
        }
    }

    export type Object3DType = 'Object3D' | 'Camera' | 'PerspectiveCamera' | 'OrthographicCamera'

    export interface Object3DContext<O extends THREE.Object3D> {
        readonly type: Object3DType
        readonly id: string
        // 摄像机
        readonly object: O;
    }

    export interface CameraContext<C extends THREE.Camera> extends Object3DContext<C> {
        readonly enableHelper: Ref<boolean>
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

    export interface SceneContext {
        // 场景
        readonly scene: THREE.Scene
        // 3d对象
        readonly objects: ShallowUnwrapRef<Object3DContext<any>[]>
        // 3d对象与id映射
        objectById: ComputedRef<Record<string, Object3DContext<any>>>
        // 激活的摄像机Id
        readonly activatedCameraId: Ref<string | undefined>
        // 激活的摄像机
        readonly activatedCamera: ComputedRef<CameraContext<any> | undefined>
    }
}