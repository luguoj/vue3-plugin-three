import {Ref, ref, shallowRef, ShallowRef, watch} from "vue";
import {createEventHook} from "@vueuse/core";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";

export class RendererContextImpl implements PsrThreePluginTypes.RendererContext {
    readonly containerRef: ShallowRef<HTMLElement | undefined> = shallowRef<HTMLElement>()
    readonly renderer: THREE.WebGLRenderer
    readonly running: Ref<boolean> = ref(false)
    readonly scene: ShallowRef<PsrThreePluginTypes.SceneContext | undefined> = shallowRef<PsrThreePluginTypes.SceneContext>()
    readonly size: Ref<PsrThreePluginTypes.Size | undefined> = ref()
    readonly events = {
        update: createEventHook<number>(),
        mounted: createEventHook<THREE.WebGLRenderer>(),
    }
    // 时钟
    private readonly clock: THREE.Clock = new THREE.Clock()
    // 更新场景合约
    private updatePromise?: Promise<unknown[]> = undefined

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

    // 构造渲染器
    protected buildRenderer(params?: THREE.WebGLRendererParameters): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer(params);
        // 设置设备像素比，避免HiDPI设备上绘图模糊
        renderer.setPixelRatio(window.devicePixelRatio)
        return renderer
    }

    // 帧绘制
    private draw() {
        if (this.running.value) {
            // 在浏览器下一帧进行重绘
            requestAnimationFrame(() => this.draw());
        }
        // 绘制场景
        const scene = this.scene.value?.scene
        const camera = this.scene.value?.activatedCamera.value?.object
        if (scene && camera) {
            this.renderer.render(scene, camera)
        }
        // 更新场景
        if (!this.updatePromise) {
            // 如果没有正在执行的更新则触发下一帧
            this.updatePromise = this.events.update.trigger(this.clock.getDelta()).finally(() => this.updatePromise = undefined)
        }
    }
}