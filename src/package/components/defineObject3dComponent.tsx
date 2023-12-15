import {defineComponent, onUnmounted, provide} from "vue";
import {PsrThree} from "../plugins";
import {PsrThreePluginTypes} from "../types";

type PropsType<O> = {
    objectName: string
    objectUpdateHandler?: ({delta, object}: { delta: number, object: O }) => boolean | void
}
type EmitsType<O> = {
    objectReady(object: O): void
}
export type Object3dComponentType<O> = (props: (PropsType<O> & {
    onObjectReady?: ((object: O) => any) | undefined
})) => any


export function defineObject3dComponent<O extends PsrThreePluginTypes.AbstractSceneObject3DContext<any>>(
    name: string,
    objectProvider: (objectName: string, scene: PsrThreePluginTypes.SceneContext) => O
): Object3dComponentType<O> {
    return defineComponent<PropsType<O>, EmitsType<O>>(
        (props: PropsType<O>, context) => {
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

            if (props.objectUpdateHandler) {
                const _objectUpdateHandler = props.objectUpdateHandler

                function objectUpdateHandler(delta: number) {
                    return _objectUpdateHandler({delta, object})
                }

                object.addUpdateHandler(objectUpdateHandler)
                onUnmounted(() => {
                    object.removeUpdateHandler(objectUpdateHandler)
                })
            }
            return () => context.slots?.default ? (<>{context.slots.default()}</>) : null
        },
        {
            name,
            props: ['objectName', 'objectUpdateHandler'],
            emits: ['objectReady']
        }
    )
}