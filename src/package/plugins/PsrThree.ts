import {PsrThreePluginTypes} from "../types";
import {ThreeContextImpl} from "../services/ThreeContext.ts";
import {onUnmounted} from "vue";

export class PsrThree {
    static createContext(): PsrThreePluginTypes.ThreeContext {
        const context = new ThreeContextImpl()
        onUnmounted(() => {
            context.dispose()
        })
        return context;
    }
}