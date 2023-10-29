import {Ref, ShallowRef, ShallowUnwrapRef} from "vue";
import {EventHook} from "@vueuse/core/index";
import * as THREE from "three"

export namespace PsrThreePluginTypes {
    export interface Size {
        width: number
        height: number
    }

    export interface RendererContext<C extends THREE.Camera> {
        // 画布容器引用
        readonly containerRef: ShallowRef<HTMLElement | undefined>
        // 渲染器
        readonly renderer: THREE.WebGLRenderer
        // 运行标识
        readonly runningRef: Ref<boolean>
        // 场景上下文
        readonly sceneContextRef: ShallowRef<SceneContext<C> | undefined>
        readonly sizeRef: Ref<Size | undefined>
        // 事件
        readonly events: {
            // 更新场景
            update: EventHook<number>
            // 完成挂载
            mounted: EventHook<THREE.WebGLRenderer>
        }
    }

    export interface CameraContext<C extends THREE.Camera> {
        // 摄像机
        readonly camera: C;
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

    export interface SceneContext<C extends THREE.Camera> {
        // 场景
        readonly scene: THREE.Scene;
        // 3d对象
        readonly objects: ShallowUnwrapRef<THREE.Object3D[]>;
        // 摄像机上下文
        readonly cameraContextRef: ShallowRef<CameraContext<C> | undefined>;
    }
}