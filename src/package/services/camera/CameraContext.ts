import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {AbstractObject3DContextImpl} from "./../AbstractObject3DContext.ts";
import {OrbitControlsContextImpl} from "../controls/camera-controls/OrbitControlsContext.ts";

export class CameraContextImpl<C extends THREE.Camera> extends AbstractObject3DContextImpl<C> implements PsrThreePluginTypes.CameraContext<C> {
    readonly type: PsrThreePluginTypes.Object3DType = 'Camera';

    buildHelper() {
        return new THREE.CameraHelper(this.object);
    }

    private orbitControls?: PsrThreePluginTypes.OrbitControlsContext;

    useOrbitControls(eventTarget: HTMLElement): PsrThreePluginTypes.OrbitControlsContext {
        return this.orbitControls || (this.orbitControls = new OrbitControlsContextImpl(this, eventTarget))
    }
}