import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractObject3DContextImpl} from "./../AbstractObject3DContext.ts";
import {OrbitControlsContextImpl} from "../controls/camera-controls/OrbitControlsContext.ts";

export class CameraContextImpl<C extends THREE.Camera> extends AbstractObject3DContextImpl<C> implements PsrThreePluginTypes.CameraContext<C> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Camera';
    private readonly _allControls: PsrThreePluginTypes.CameraControlsContext[] = []

    useOrbitControls(eventTarget: HTMLElement): PsrThreePluginTypes.OrbitControlsContext {
        const controls = new OrbitControlsContextImpl(this, eventTarget)
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