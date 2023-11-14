import {computed, ComputedRef, Ref, ref, shallowReactive, ShallowReactive, shallowRef, ShallowRef, watch} from "vue";
import {createEventHook} from "@vueuse/core";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {ViewportUtils} from "../utils/ViewportUtils.ts";
import {OrthographicCameraContextImpl} from "./OrthographicCameraContext.ts";
import {PerspectiveCameraContextImpl} from "./PerspectiveCameraContext.ts";
import {ArrayCameraContextImpl} from "./ArrayCameraContext.ts";

export class RendererViewportContextImpl implements PsrThreePluginTypes.RendererViewportContext {
    readonly renderer: PsrThreePluginTypes.RendererContext
    readonly id: string
    readonly scene: PsrThreePluginTypes.SceneContext
    readonly activatedCameraId = ref<string>()
    readonly activatedCamera: ShallowRef<PsrThreePluginTypes.CameraContext<any> | undefined> = shallowRef<PsrThreePluginTypes.CameraContext<any>>()
    readonly viewport: Ref<PsrThreePluginTypes.Viewport | undefined> = ref<PsrThreePluginTypes.Viewport>()
    visible: boolean = true
    readonly viewportRect: ComputedRef<THREE.Vector4> = computed<THREE.Vector4>(() =>
        ViewportUtils.calcViewport(this.viewport.value, this.renderer.size.value)
    )

    constructor(renderer: PsrThreePluginTypes.RendererContext, id: string, scene: PsrThreePluginTypes.SceneContext, viewport?: PsrThreePluginTypes.Viewport) {
        this.renderer = renderer
        this.id = id
        this.scene = scene
        this.viewport.value = viewport
        watch(this.activatedCameraId, activatedCameraId => {
            const cameraOld = this.activatedCamera.value
            this.activatedCamera.value = undefined
            if (cameraOld instanceof OrthographicCameraContextImpl) {
                cameraOld.autoAspect()
            } else if (cameraOld instanceof PerspectiveCameraContextImpl) {
                cameraOld.autoAspect()
            } else if (cameraOld instanceof ArrayCameraContextImpl) {
                cameraOld.adaptingSizing()
            }
            let camera = activatedCameraId && this.scene.objectById.value[activatedCameraId] as PsrThreePluginTypes.CameraContext<any> || undefined
            if (camera?.object.isCamera) {
                this.activatedCamera.value = camera
                if (camera instanceof OrthographicCameraContextImpl) {
                    camera.autoAspect(this.viewportRect)
                } else if (camera instanceof PerspectiveCameraContextImpl) {
                    camera.autoAspect(this.viewportRect)
                } else if (camera instanceof ArrayCameraContextImpl) {
                    camera.adaptingSizing(this.viewportRect)
                }
            }
        })
    }

    getObjectCssPosition(objectId: string): PsrThreePluginTypes.ObjectCssPosition | undefined {
        const camera = this.activatedCamera.value?.object
        const object = this.scene.objectById.value[objectId]?.object
        if (camera && object) {
            // 获取对象位置
            const tempV = new THREE.Vector3()
            // 更新模型在世界坐标系中的位置（updateWorldMatrix(true, false)在getWorldPosition中调用了，无需单独调用）
            object.getWorldPosition(tempV)
            // 获取标准化屏幕坐标（x,y在-1~1之间）
            // x = -1 标识最左侧
            // y = -1 标识最底部
            tempV.project(camera)
            // 转换为CSS坐标
            const left = (tempV.x * 0.5 + 0.5) * this.viewportRect.value.width
            const bottom = (tempV.y * 0.5 + 0.5) * this.viewportRect.value.height
            return {
                left: left + 'px',
                bottom: bottom + 'px'
            }
        }
        return undefined
    }
}

export class RendererContextImpl implements PsrThreePluginTypes.RendererContext {
    readonly containerRef: ShallowRef<HTMLElement | undefined> = shallowRef<HTMLElement>()
    readonly renderer: THREE.WebGLRenderer
    readonly running: Ref<boolean> = ref(false)

    readonly size: Ref<PsrThreePluginTypes.Size | undefined> = ref()
    readonly events = {
        update: createEventHook<number>(),
        mounted: createEventHook<THREE.WebGLRenderer>(),
        beginUpdate: createEventHook<void>(),
        endUpdate: createEventHook<void>()
    }
    // 时钟
    private readonly clock: THREE.Clock = new THREE.Clock()
    readonly viewports: ShallowReactive<PsrThreePluginTypes.RendererViewportContext[]> = shallowReactive([])
    readonly viewportById: Record<string, PsrThreePluginTypes.RendererViewportContext> = {}

    constructor(params?: THREE.WebGLRendererParameters) {
        this.renderer = this.buildRenderer(params)
        watch(this.containerRef, container => {
            if (container) {
                // 将画布追加到容器
                container.appendChild(this.renderer.domElement);
                // 监控容器resize
                const resizeObserver = new ResizeObserver(entries => this.size.value = {
                    width: entries[0].contentRect.width,
                    height: entries[0].contentRect.height
                })
                resizeObserver.observe(container)
                // 触发挂载事件
                this.events.mounted.trigger(this.renderer).then(() => {
                    this.running.value = true
                })
            }
        })
        // 更新渲染器尺寸
        watch(this.size, size => {
            const {width, height} = size || {width: 0, height: 0}
            this.renderer.setSize(Math.floor(width / this.renderer.getPixelRatio()), Math.floor(height / this.renderer.getPixelRatio()), false);
        })
        let animationId: number | undefined = undefined
        watch(this.running, running => {
            if (running) {
                // 重置时钟
                this.clock.getDelta()
                // 在浏览器下一帧进行重绘
                animationId = requestAnimationFrame(() => this.update());
            } else if (animationId) {
                cancelAnimationFrame(animationId)
            }
        })
    }

    createViewport(id: string, scene: PsrThreePluginTypes.SceneContext, viewport?: PsrThreePluginTypes.Viewport): PsrThreePluginTypes.RendererViewportContext {
        if (this.viewportById[id]) {
            throw new Error("conflict renderer viewport id:" + id)
        }
        const viewportCtx = new RendererViewportContextImpl(this, id, scene, viewport)
        this.viewportById[id] = viewportCtx
        this.viewports.push(viewportCtx)
        return viewportCtx
    }

    // 构造渲染器
    protected buildRenderer(params?: THREE.WebGLRendererParameters): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer(params);
        // 设置设备像素比，避免HiDPI设备上绘图模糊
        renderer.setPixelRatio(window.devicePixelRatio)
        return renderer
    }

    readonly clearColor = new THREE.Color(0x000000)

    private update() {
        if (this.running.value) {
            this.events.beginUpdate.trigger().then()
            // 获取两次绘制的时间差
            const delta = this.clock.getDelta()
            // 触发渲染器更新事件
            this.events.update.trigger(delta).then()
            // 更新场景
            let callDraw = false
            // 场景关联的对象集合
            const objects = new Set<PsrThreePluginTypes.Object3DContext<any, any>>()
            for (const viewportId in this.viewportById) {
                const viewport = this.viewportById[viewportId]
                if (viewport.visible) {
                    const scene = viewport.scene
                    callDraw = callDraw || scene.update(delta)
                    for (const object of scene.objects) {
                        callDraw = callDraw || object.update(delta)
                    }
                    for (const object of scene.objects) {
                        objects.add(object)
                    }
                }
            }
            // 更新对象
            for (const object of objects) {
                callDraw = callDraw || object.update(delta)
            }
            if (callDraw) {
                this.draw()
            }
            this.events.endUpdate.trigger().then()
            // 在浏览器下一帧进行重绘
            requestAnimationFrame(() => this.update());
        }
    }

    // 帧绘制
    private draw() {
        // 清空画布
        this.renderer.setScissorTest(false)
        this.renderer.setClearColor(this.clearColor, 0)
        this.renderer.clear(true, true)
        this.renderer.setScissorTest(true)
        // 绘制场景
        for (const viewportId in this.viewportById) {
            const viewport = this.viewportById[viewportId]
            if (viewport.visible) {
                const scene = viewport.scene.scene
                const camera = viewport.activatedCamera.value?.object
                if (scene && camera && this.size.value) {
                    const {x, y, width, height} = viewport.viewportRect.value
                    const outOfScreen =
                        x >= this.size.value.width
                        || y >= this.size.value.height
                        || x + width <= 0
                        || y + height <= 0
                    if (!outOfScreen) {
                        this.renderer.setScissor(x, y, width, height)
                        this.renderer.setViewport(x, y, width, height)
                        this.renderer.render(scene, camera)
                    }
                }
            }
        }
    }
}