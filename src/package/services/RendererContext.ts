import {computed, ComputedRef, Ref, ref, shallowReactive, ShallowReactive, shallowRef, ShallowRef, watch} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {ViewportUtils} from "../utils/ViewportUtils.ts";
import {OrthographicCameraContextImpl} from "./camera/OrthographicCameraContext.ts";
import {PerspectiveCameraContextImpl} from "./camera/PerspectiveCameraContext.ts";
import {ArrayCameraContextImpl} from "./camera/ArrayCameraContext.ts";

export class RendererViewportContextImpl implements PsrThreePluginTypes.RendererViewportContext {
    readonly renderer: RendererContextImpl
    readonly name: string
    readonly scene: PsrThreePluginTypes.SceneContext
    readonly camera: ShallowRef<PsrThreePluginTypes.CameraContext<any> | undefined> = shallowRef<PsrThreePluginTypes.CameraContext<any>>()
    readonly viewport: Ref<PsrThreePluginTypes.Viewport> = ref<PsrThreePluginTypes.Viewport>({width: 1, height: 1})
    // 运行标识
    readonly running: Ref<boolean> = ref(true)
    readonly viewportRect: ComputedRef<THREE.Vector4> = computed<THREE.Vector4>(() =>
        ViewportUtils.calcViewport(this.viewport.value, this.renderer.size.value)
    )

    constructor(renderer: RendererContextImpl, name: string, scene: PsrThreePluginTypes.SceneContext, viewport?: PsrThreePluginTypes.Viewport) {
        this.renderer = renderer
        this.name = name
        this.scene = scene
        this.viewport.value = viewport || {width: 1, height: 1}
        watch(this.camera, (camera, cameraOld) => {
            if (cameraOld instanceof OrthographicCameraContextImpl) {
                cameraOld.adaptingSizing()
            } else if (cameraOld instanceof PerspectiveCameraContextImpl) {
                cameraOld.adaptingSizing()
            } else if (cameraOld instanceof ArrayCameraContextImpl) {
                cameraOld.adaptingSizing()
            }
            if (camera?.object.isCamera) {
                if (camera instanceof OrthographicCameraContextImpl) {
                    camera.adaptingSizing(this.viewportRect)
                } else if (camera instanceof PerspectiveCameraContextImpl) {
                    camera.adaptingSizing(this.viewportRect)
                } else if (camera instanceof ArrayCameraContextImpl) {
                    camera.adaptingSizing(this.viewportRect)
                }
            }
            this.renderer.dirty = true
        })
    }

    getObjectCssPosition(objectId: string): PsrThreePluginTypes.ObjectCssPosition | undefined {
        const camera = this.camera.value?.object
        const object = this.scene.getObjectByName(objectId)?.object
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
    readonly context: PsrThreePluginTypes.ThreeContext
    readonly containerRef: ShallowRef<HTMLElement | undefined> = shallowRef<HTMLElement>()
    readonly object: THREE.WebGLRenderer
    readonly running: Ref<boolean> = ref(false)

    readonly size: Ref<PsrThreePluginTypes.Size | undefined> = ref()
    dirty: boolean = true
    readonly viewports: ShallowReactive<PsrThreePluginTypes.RendererViewportContext[]> = shallowReactive([])
    drawOnDemand: boolean = true

    constructor(context: PsrThreePluginTypes.ThreeContext, params?: THREE.WebGLRendererParameters) {
        this.context = context
        this.object = new THREE.WebGLRenderer(params)
        watch(this.containerRef, container => {
            if (container) {
                this.dirty = true
                // 将画布追加到容器
                container.appendChild(this.object.domElement);
                // 监控容器resize
                const resizeObserver = new ResizeObserver(entries => this.size.value = {
                    width: entries[0].contentRect.width,
                    height: entries[0].contentRect.height
                })
                resizeObserver.observe(container)
                this.running.value = true
            }
        })
        // 更新渲染器尺寸
        watch(this.size, size => {
            this.dirty = true
            const {width, height} = size || {width: 0, height: 0}
            // 设置设备像素比，避免HiDPI设备上绘图模糊
            this.object.setPixelRatio(window.devicePixelRatio);
            this.object.setSize(width, height, true);
        })
    }

    createViewport(name: string, scene: PsrThreePluginTypes.SceneContext, viewport?: PsrThreePluginTypes.Viewport): PsrThreePluginTypes.RendererViewportContext {
        if (this.viewports.findIndex(viewport => viewport.name == name) > -1) {
            throw new Error("conflict renderer viewport name:" + name)
        }
        const viewportCtx = new RendererViewportContextImpl(this, name, scene, viewport)
        this.viewports.push(viewportCtx)
        this.dirty = true
        return viewportCtx
    }

    readonly clearColor = new THREE.Color(0x000000)

    clear() {
        // 清空画布
        this.object.setScissorTest(false)
        this.object.setClearColor(this.clearColor, 1)
        this.object.clear(true, true)
        this.object.setScissorTest(true)
    }

    private checkDirty(): boolean {
        let dirty = this.dirty
        this.dirty = false
        if (dirty || !this.drawOnDemand) {
            return true
        }
        for (const viewport of this.viewports) {
            if (viewport.running.value) {
                const scene = viewport.scene
                const camera = viewport.camera.value
                if (scene && camera && this.size.value) {
                    dirty = dirty || scene.isDirty() || camera.isDirty()
                    if (dirty) {
                        return dirty
                    }
                }
            }
        }
        return false
    }

    // 帧绘制
    draw() {
        if (this.running.value && this.checkDirty()) {
            this.clear()
            // 绘制场景
            for (const viewport of this.viewports) {
                if (viewport.running.value) {
                    const scene = viewport.scene
                    const camera = viewport.camera.value
                    if (scene && camera && this.size.value) {
                        const {x, y, width, height} = viewport.viewportRect.value
                        const outOfScreen =
                            x >= this.size.value.width
                            || y >= this.size.value.height
                            || x + width <= 0
                            || y + height <= 0
                        if (!outOfScreen) {
                            this.object.setScissor(x, y, width, height)
                            this.object.setViewport(x, y, width, height)
                            this.object.render(scene.object, camera.object)
                        }
                    }
                }
            }
        }
    }
}