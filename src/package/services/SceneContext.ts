import * as THREE from "three";
import {PsrThreePluginTypes} from "../types";
import {AbstractObject3DContextImpl} from "./AbstractObject3DContext.ts";
import {shallowReactive, ShallowReactive} from "vue";
import {Object3DContextImpl} from "./Object3DContext.ts";
import {MeshContextImpl} from "./primitive/MeshContext.ts";
import {CameraContextImpl} from "./camera/CameraContext.ts";
import {PerspectiveCameraContextImpl} from "./camera/PerspectiveCameraContext.ts";
import {OrthographicCameraContextImpl} from "./camera/OrthographicCameraContext.ts";
import {ArrayCameraContextImpl} from "./camera/ArrayCameraContext.ts";
import {DirectionalLightContextImpl} from "./light/DirectionalLightContext.ts";
import {HemisphereLightContextImpl} from "./light/HemisphereLightContext.ts";
import {PointLightContextImpl} from "./light/PointLightContext.ts";
import {SpotLightContextImpl} from "./light/SpotLightContext.ts";
import {LineContextImpl} from "./primitive/LineContext.ts";
import {PointsContextImpl} from "./primitive/PointsContext.ts";
import {SpriteContextImpl} from "./primitive/SpriteContext.ts";

export class SceneContextImpl extends AbstractObject3DContextImpl<THREE.Scene> implements PsrThreePluginTypes.SceneContext {
    readonly type: PsrThreePluginTypes.Object3DType = 'Scene';
    // 3D对象集合
    readonly objects: ShallowReactive<Record<string, PsrThreePluginTypes.AbstractSceneObject3DContext<any>>> = shallowReactive({})

    constructor(context: PsrThreePluginTypes.ThreeContext) {
        super(context, new THREE.Scene())
    }

    private getObject<O extends PsrThreePluginTypes.AbstractSceneObject3DContext<any>>(name: string, type: PsrThreePluginTypes.Object3DType, provider: () => O): O {
        if (!this.objects[name]) {
            this.objects[name] = provider()
        } else if (this.objects[name].type !== type) {
            throw new Error("type mismatch")
        }
        this.objects[name].name = name
        return this.objects[name] as O
    }

    useObject<O extends THREE.Object3D>(name: string, provider: () => O): PsrThreePluginTypes.AbstractSceneObject3DContext<O> {
        return this.getObject(name, 'Object3D', () => new Object3DContextImpl(this, provider()))
    }

    useCamera<C extends THREE.Camera>(name: string, provider: () => C): PsrThreePluginTypes.CameraContext<C> {
        return this.getObject(name, 'Camera', () => new CameraContextImpl<C>(this, provider()))
    }

    usePerspectiveCamera(name: string): PsrThreePluginTypes.PerspectiveCameraContext {
        return this.getObject(name, 'PerspectiveCamera', () => new PerspectiveCameraContextImpl(this))
    }

    useOrthographicCamera(name: string): PsrThreePluginTypes.OrthographicCameraContext {
        return this.getObject(name, 'OrthographicCamera', () => new OrthographicCameraContextImpl(this))
    }

    useArrayCamera(name: string): PsrThreePluginTypes.ArrayCameraContext {
        return this.getObject(name, 'ArrayCamera', () => new ArrayCameraContextImpl(this))
    }

    useDirectionalLight(name: string): PsrThreePluginTypes.DirectionalLightContext {
        return this.getObject(name, 'DirectionalLight', () => new DirectionalLightContextImpl(this))
    }

    useHemisphereLight(name: string): PsrThreePluginTypes.HemisphereLightContext {
        return this.getObject(name, 'HemisphereLight', () => new HemisphereLightContextImpl(this))
    }

    usePointLight(name: string): PsrThreePluginTypes.PointLightContext {
        return this.getObject(name, 'PointLight', () => new PointLightContextImpl(this))
    }

    useSpotLight(name: string): PsrThreePluginTypes.SpotLightContext {
        return this.getObject(name, 'SpotLight', () => new SpotLightContextImpl(this))
    }

    useLine<O extends THREE.Line = THREE.Line>(name: string, provider?: () => O): PsrThreePluginTypes.LineContext<O> {
        return this.getObject(
            name,
            'Line',
            provider
                ? () => new LineContextImpl(this, provider())
                : () => LineContextImpl.newInstance(this) as LineContextImpl<O>
        )
    }

    useMesh<O extends THREE.Mesh = THREE.Mesh>(name: string, provider?: () => O): PsrThreePluginTypes.MeshContext<O> {
        return this.getObject(
            name,
            'Mesh',
            provider
                ? () => new MeshContextImpl(this, provider())
                : () => MeshContextImpl.newInstance(this) as MeshContextImpl<O>
        )
    }

    usePoints<O extends THREE.Points = THREE.Points>(name: string, provider?: () => O): PsrThreePluginTypes.PointsContext<O> {
        return this.getObject(
            name,
            'Points',
            provider
                ? () => new PointsContextImpl(this, provider())
                : () => PointsContextImpl.newInstance(this) as PointsContextImpl<O>
        )
    }

    useSprite<O extends THREE.Sprite = THREE.Sprite>(name: string, provider?: () => O): PsrThreePluginTypes.SpriteContext<O> {
        return this.getObject(
            name,
            'Sprite',
            provider
                ? () => new SpriteContextImpl(this, provider())
                : () => SpriteContextImpl.newInstance(this) as SpriteContextImpl<O>
        )
    }
}