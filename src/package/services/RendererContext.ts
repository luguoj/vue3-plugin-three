import {computed, ComputedRef, Ref, ref, shallowRef, ShallowRef, watch} from "vue";
import {createEventHook} from "@vueuse/core";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {ViewportUtils} from "../utils/ViewportUtils.ts";

export class RendererViewportContextImpl implements PsrThreePluginTypes.RendererViewportContext {
    readonly renderer: PsrThreePluginTypes.RendererContext
    readonly id: string
    readonly scene: PsrThreePluginTypes.SceneContext
    readonly activatedCameraId = ref<string>()
    readonly activatedCamera: ComputedRef<PsrThreePluginTypes.CameraContext<any> | undefined> = computed(() => {
            let camera = this.activatedCameraId.value && this.scene.objectById.value[this.activatedCameraId.value] as PsrThreePluginTypes.CameraContext<any> || undefined
            return camera?.object.isCamera ? camera : undefined
        }
    )
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

    readonly viewportById: Record<string, PsrThreePluginTypes.RendererViewportContext> = {}

    constructor(params?: THREE.WebGLRendererParameters) {
        this.renderer = this.buildRenderer(params)
        watch(this.containerRef, container => {
            if (container) {
                // 将画布追加到容器
                container.appendChild(this.renderer.domElement);
                // 监控容器resize
                const resizeObserver = new ResizeObserver(entries => this.size.value = {width: entries[0].contentRect.width, height: entries[0].contentRect.height})
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
                animationId = requestAnimationFrame(() => this.draw());
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

    // 帧绘制
    private draw() {
        // 更新场景
        this.events.update.trigger(this.clock.getDelta()).finally(() => {
            if (this.running.value) {
                this.events.beginUpdate.trigger().then()
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
                // 在浏览器下一帧进行重绘
                requestAnimationFrame(() => this.draw());
                this.events.endUpdate.trigger().then()
            }
        })
    }
}