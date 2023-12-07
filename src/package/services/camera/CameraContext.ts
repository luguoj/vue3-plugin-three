import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractObject3DContextImpl} from "./../AbstractObject3DContext.ts";
import {OrbitControlsContextImpl} from "../controls/camera-controls/OrbitControlsContext.ts";
import {ArcballControlsContextImpl} from "../controls/camera-controls/ArcballControlsContext.ts";
import {FirstPersonControlsContextImpl} from "../controls/camera-controls/FirstPersonControlsContext.ts";
import {FlyControlsContextImpl} from "../controls/camera-controls/FlyControlsContext.ts";

export class CameraContextImpl<C extends THREE.Camera> extends AbstractObject3DContextImpl<C> implements PsrThreePluginTypes.CameraContext<C> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Camera';
    private readonly _allControls: PsrThreePluginTypes.CameraControlsContext[] = []

    useArcballControls(eventTarget: HTMLElement, scene?: PsrThreePluginTypes.SceneContext): PsrThreePluginTypes.ArcballControlsContext {
        const controls = new ArcballControlsContextImpl(this, eventTarget, scene)
        this._allControls.push(controls)
        return controls
    }

    useOrbitControls(eventTarget: HTMLElement): PsrThreePluginTypes.OrbitControlsContext {
        const controls = new OrbitControlsContextImpl(this, eventTarget)
        this._allControls.push(controls)
        return controls
    }

    useFirstPersonControls(eventTarget: HTMLElement): PsrThreePluginTypes.FirstPersonControlsContext {
        const controls = new FirstPersonControlsContextImpl(this, eventTarget)
        this._allControls.push(controls)
        return controls
    }

    useFlyControls(eventTarget: HTMLElement): PsrThreePluginTypes.FlyControlsContext {
        const controls = new FlyControlsContextImpl(this, eventTarget)
        this._allControls.push(controls)
        return controls
    }

    buildHelper() {
        return new THREE.CameraHelper(this.object);
    }

    dispose() {
        super.dispose();
        for (const controls of this._allControls) {
            controls.dispose()
        }
    }
}