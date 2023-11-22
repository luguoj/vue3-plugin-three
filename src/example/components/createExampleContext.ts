import {PsrThree} from "../../package";

export function createExampleContext(id?: string) {
    id = id || 'default'
    const context = PsrThree.createContext()
    // 创建渲染器
    const renderer = context.useRenderer(id + '-renderer', {
        antialias: true, // 启用抗锯齿
    })
    // 创建场景
    const scene = context.useScene(id + '-scene')
    const viewport = renderer.createViewport(id + '-viewport', scene)
    // 创建相机
    const camera = context.usePerspectiveCamera(id + '-camera')
    scene.addChildren(camera)
    // 设置默认相机
    viewport.activatedCameraId.value = camera.name

    context.running.value = true
    return {
        context, renderer, scene, camera, viewport
    }
}