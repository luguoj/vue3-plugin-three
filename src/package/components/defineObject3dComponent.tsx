import {defineComponent, provide} from "vue";
import {PsrThree} from "../plugins";
import {PsrThreePluginTypes} from "../types";

type PropsType = {
    objectName: string
}
type EmitsType<O> = {
    objectReady(object: O): void
    objectUpdate({delta, object}: { delta: number, object: O }): void
}
export type Object3dComponentType<O> = (props: (PropsType & {
    onObjectReady?: ((object: O) => any) | undefined,
    onObjectUpdate?: ((args_0: { delta: number, object: O }) => any) | undefined
})) => any


export function defineObject3dComponent<O extends PsrThreePluginTypes.AbstractSceneObject3DContext<any>>(
    name: string,
    objectProvider: (objectName: string, scene: PsrThreePluginTypes.SceneContext) => O
): Object3dComponentType<O> {
    return defineComponent<PropsType, EmitsType<O>>(
        (props: {
            objectName: string
        }, context) => {
            const scene = PsrThree.useScene()
            const object: O = objectProvider(props.objectName, scene)
            provide(PsrThree.INJECTION_KEY_THREE_PARENT, object)
            context.emit('objectReady', object)

            const parent = PsrThree.useParent()
            if (parent) {
                parent.addChildren(object)
            } else {
                scene.addChildren(object)
            }
            object.addUpdateHandler(delta => context.emit('objectUpdate', {delta, object}))
            return () => context.slots?.default ? (<>{context.slots.default()}</>) : null
        },
        {
            name,
            props: {objectName: String},
            emits: ['objectReady', 'objectUpdate']
        }
    )
}