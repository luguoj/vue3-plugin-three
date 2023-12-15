import {PsrThreePluginTypes} from "../types";
import {ThreeContextImpl} from "../services/ThreeContext.ts";
import {inject, onUnmounted} from "vue";

export class PsrThree {
    static readonly INJECTION_KEY_THREE_CONTEXT = Symbol('three-context')
    static readonly INJECTION_KEY_THREE_RENDERER = Symbol('three-renderer')
    static readonly INJECTION_KEY_THREE_RENDERER_VIEWPORT = Symbol('three-renderer-viewport')
    static readonly INJECTION_KEY_THREE_SCENE = Symbol('three-scene')
    static readonly INJECTION_KEY_THREE_PARENT = Symbol('three-parent')

    static createContext(): PsrThreePluginTypes.ThreeContext {
        const context = new ThreeContextImpl()
        onUnmounted(() => {
            context.dispose()
        })
        return context;
    }

    static useContext(): PsrThreePluginTypes.ThreeContext {
        const context = inject<PsrThreePluginTypes.ThreeContext>(PsrThree.INJECTION_KEY_THREE_CONTEXT)
        if (!context) throw new Error("No Context found")
        return context
    }

    static useRenderer(): PsrThreePluginTypes.RendererContext {
        const context = inject<PsrThreePluginTypes.RendererContext>(PsrThree.INJECTION_KEY_THREE_RENDERER)
        if (!context) throw new Error("No Renderer found")
        return context
    }

    static useViewport(): PsrThreePluginTypes.RendererViewportContext {
        const context = inject<PsrThreePluginTypes.RendererViewportContext>(PsrThree.INJECTION_KEY_THREE_RENDERER_VIEWPORT)
        if (!context) throw new Error("No RendererViewport found")
        return context
    }

    static useScene(): PsrThreePluginTypes.SceneContext {
        const context = inject<PsrThreePluginTypes.SceneContext>(PsrThree.INJECTION_KEY_THREE_SCENE)
        if (!context) throw new Error("No Scene found")
        return context
    }

    static useParent(): PsrThreePluginTypes.AbstractSceneObject3DContext<any> | undefined {
        return inject<PsrThreePluginTypes.AbstractSceneObject3DContext<any>>(PsrThree.INJECTION_KEY_THREE_PARENT)
    }
}