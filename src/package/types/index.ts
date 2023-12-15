import {ComputedRef, Ref, ShallowReactive, ShallowRef} from "vue";
import {EventHook} from "@vueuse/core/index";
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
import {FlyControls} from "three/examples/jsm/controls/FlyControls";
import {MapControls} from "three/examples/jsm/controls/MapControls";
import {PointerLockControls} from "three/examples/jsm/Addons";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";

export namespace PsrThreePluginTypes {
    export type Size = {
        width: number
        height: number
    }

    export type ObjectCssPosition = {
        worldPosition: THREE.Vector3
        viewPosition: THREE.Vector2
        outOfView: boolean
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
        readonly scenes: ShallowReactive<Record<string, PsrThreePluginTypes.SceneContext>>
        readonly geometries: ShallowReactive<Record<string, PsrThreePluginTypes.GeometryContext<any>>>
        readonly materials: ShallowReactive<Record<string, PsrThreePluginTypes.MaterialContext<any>>>

        useRenderer(name: string, params?: THREE.WebGLRendererParameters): RendererContext;

        useScene(name: string): SceneContext;

        useGeometry<G extends THREE.BufferGeometry>(
            name: string,
            provider: () => Promise<G>,
            fallback?: () => Promise<THREE.BufferGeometry>
        ): GeometryContext<G>

        useMaterial<M extends THREE.Material>(
            name: string,
            provider: () => Promise<M>,
            fallback?: () => Promise<THREE.Material>
        ): MaterialContext<M>

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
        // 事件
        readonly events: {
            // 绘制
            draw: EventHook<void>
        }
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
        // 渲染器上下文
        readonly renderer: RendererContext
        readonly name: string
        // 场景上下文
        readonly scene: SceneContext
        // 激活的摄像机
        readonly camera: ShallowRef<CameraContext<any> | undefined>
        // 视口
        readonly viewport: Ref<Viewport>
        readonly viewportRect: ComputedRef<THREE.Vector4>
        // 运行标识
        readonly running: Ref<boolean>

        getObjectPosition(objectName: string): ObjectCssPosition | undefined
    }

    export type CameraType =
        'Camera'
        | 'PerspectiveCamera'
        | 'OrthographicCamera'
        | 'ArrayCamera'
    export type LightType =
        'Light'
        | 'DirectionalLight'
        | 'HemisphereLight'
        | 'PointLight'
        | 'SpotLight'
    export type PrimitiveType =
        'Mesh'
        | 'Line'
        | 'Points'
        | 'Sprite'
    export type Object3DType =
        'Object3D'
        | 'Scene'
        | LightType
        | CameraType
        | PrimitiveType
    export const CameraTypes: String[] = ['Camera', 'PerspectiveCamera', 'OrthographicCamera', 'ArrayCamera']
    export const LightTypes: String[] = ['Light', 'DirectionalLight', 'HemisphereLight', 'PointLight', 'SpotLight']
    export const Object3DTypes: String[] = ['Object3D', 'Scene', ...LightTypes, ...CameraTypes]

    export interface AbstractObject3DContext<O extends THREE.Object3D> {
        readonly type: Object3DType
        name: string
        readonly context: PsrThreePluginTypes.ThreeContext
        // 3D对象
        readonly object: O;
        parent?: AbstractObject3DContext<any>
        // 事件
        readonly events: {
            // 变更
            changed: EventHook<void>
        }

        // 脏标识
        isDirty(): boolean

        markDirty(): void

        addChildren(...objectCtxArr: AbstractObject3DContext<any>[]): void

        removeChildren(...objectCtxArr: AbstractObject3DContext<any>[]): void

        // 添加更新处理器
        addUpdateHandler(handler: (delta: number) => boolean | void, options?: { once?: boolean }): void

        // 移除更新处理器
        removeUpdateHandler(handler: (delta: number) => boolean | void): void

        // 更新对象
        update(delta: number, time: number): void

        // 释放
        dispose(): void
    }

    export interface AbstractSceneObject3DContext<O extends THREE.Object3D> extends AbstractObject3DContext<O> {
        scene: SceneContext

        // 获取辅助器对象
        useHelper(options?: any): AbstractSceneObject3DContext<any>
    }

    export interface Object3DContext<O extends THREE.Object3D> extends AbstractSceneObject3DContext<O> {
        useHelper(options?: { color?: THREE.ColorRepresentation }): Object3DContext<THREE.BoxHelper>
    }

    export type CameraControlsType = 'arcball' | 'orbit' | 'trackball' | 'first-person' | 'fly' | 'map' | 'pointer-lock'

    export interface CameraContext<C extends THREE.Camera> extends AbstractSceneObject3DContext<C> {
        useHelper(): Object3DContext<THREE.CameraHelper>

        useArcballControls(eventTarget: HTMLElement, scene?: SceneContext): ArcballControlsContext

        useOrbitControls(eventTarget: HTMLElement): OrbitControlsContext

        useFirstPersonControls(eventTarget: HTMLElement): FirstPersonControlsContext

        useFlyControls(eventTarget: HTMLElement): FlyControlsContext

        useMapControls(eventTarget: HTMLElement): MapControlsContext

        usePointerLockControls(eventTarget: HTMLElement): PointerLockControlsContext

        useTrackballControls(eventTarget: HTMLElement): TrackballControlsContext
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
        objects: ShallowReactive<Record<string, AbstractSceneObject3DContext<any>>>

        useObject<O extends THREE.Object3D>(name: string, provider: () => O): AbstractSceneObject3DContext<O>;

        useCamera<C extends THREE.Camera>(name: string, provider: () => C): CameraContext<C>;

        usePerspectiveCamera(name: string): PerspectiveCameraContext;

        useOrthographicCamera(name: string): OrthographicCameraContext;

        useArrayCamera(name: string): ArrayCameraContext;

        useDirectionalLight(name: string): DirectionalLightContext

        useHemisphereLight(name: string): HemisphereLightContext

        usePointLight(name: string): PointLightContext

        useSpotLight(name: string): SpotLightContext

        useLine<O extends THREE.Line = THREE.Line>(name: string, provider?: () => O): LineContext<O>

        useMesh<O extends THREE.Mesh = THREE.Mesh>(name: string, provider?: () => O): MeshContext<O>

        usePoints<O extends THREE.Points = THREE.Points>(name: string, provider?: () => O): PointsContext<O>

        useSprite<O extends THREE.Sprite = THREE.Sprite>(name: string, provider?: () => O): SpriteContext<O>
    }

    export interface AbstractLightContext<L extends THREE.Light> extends AbstractSceneObject3DContext<L> {
    }

    export interface DirectionalLightContext extends AbstractLightContext<THREE.DirectionalLight> {
        useHelper(options?: {
            size?: number,
            color?: THREE.ColorRepresentation
        }): Object3DContext<THREE.DirectionalLightHelper>
    }

    export interface HemisphereLightContext extends AbstractLightContext<THREE.HemisphereLight> {
        useHelper(options: {
            size: number,
            color?: THREE.ColorRepresentation
        }): Object3DContext<THREE.HemisphereLightHelper>
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
        readonly options?: any
        readonly object: any
        enabled: Ref<boolean>

        dispose(): void
    }

    export interface ArcballControlsContext extends CameraControlsContext {
        readonly options?: SceneContext
        readonly object: ArcballControls
    }

    export interface OrbitControlsContext extends CameraControlsContext {
        readonly object: OrbitControls
        autoRotate: Ref<boolean>
        enableDamping: Ref<boolean>
    }

    export interface FirstPersonControlsContext extends CameraControlsContext {
        readonly object: FirstPersonControls
    }

    export interface FlyControlsContext extends CameraControlsContext {
        readonly object: FlyControls
    }

    export interface MapControlsContext extends OrbitControlsContext {
        readonly object: MapControls
    }

    export interface PointerLockControlsContext extends CameraControlsContext {
        readonly object: PointerLockControls
    }

    export interface TrackballControlsContext extends CameraControlsContext {
        readonly object: TrackballControls
    }

    export type Resource = THREE.BufferGeometry | THREE.Material
    export interface ResourceContext<R extends Resource, FR extends Resource> {
        readonly context: PsrThreePluginTypes.ThreeContext
        readonly object: ShallowRef<R | undefined>
        readonly fallbackObject: ShallowRef<FR | undefined>

        dispose(): void
    }

    export interface GeometryContext<G extends THREE.BufferGeometry> extends ResourceContext<G, THREE.BufferGeometry> {
    }

    export interface MaterialContext<M extends THREE.Material> extends ResourceContext<M, THREE.Material> {
    }

    export interface AbstractPrimitiveContext<O extends THREE.Mesh | THREE.Line | THREE.Points | THREE.Sprite> extends Object3DContext<O> {
        readonly geometry: ShallowRef<GeometryContext<THREE.BufferGeometry> | undefined>
        readonly material: ShallowRef<MaterialContext<THREE.Material> | undefined>
    }

    export interface MeshContext<O extends THREE.Mesh> extends AbstractPrimitiveContext<O> {
    }

    export interface LineContext<O extends THREE.Line> extends AbstractPrimitiveContext<O> {
    }

    export interface PointsContext<O extends THREE.Points> extends AbstractPrimitiveContext<O> {
    }

    export interface SpriteContext<O extends THREE.Sprite> extends AbstractPrimitiveContext<O> {
    }
}