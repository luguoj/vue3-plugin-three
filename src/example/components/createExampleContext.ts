import {PsrThree} from "../../package";

export function createExampleContext() {
    const context = PsrThree.createContext()
    // 创建渲染器
    const renderer = context.useRenderer('renderer', {
        antialias: true, // 启用抗锯齿
    })
    // 创建场景
    const scene = context.useScene('scene')
    const viewport = renderer.createViewport('viewport', scene)
    // 创建相机
    const camera = context.usePerspectiveCamera('camera')
    scene.objects.push(camera)
    // 设置默认相机
    viewport.activatedCameraId.value = camera.id
    camera.autoAspect(viewport.viewportRect)
    return {
        context, renderer, scene, camera, viewport
    }
}