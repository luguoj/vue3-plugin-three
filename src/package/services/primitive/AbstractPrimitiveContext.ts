import {shallowRef, ShallowRef, watchEffect} from "vue";
import * as THREE from "three";
import {PsrThreePluginTypes} from "../../types";
import {Object3DContextImpl} from "../Object3DContext.ts";

export class AbstractPrimitiveContextImpl<O extends THREE.Mesh | THREE.Line | THREE.Points | THREE.Sprite> extends Object3DContextImpl<O> implements PsrThreePluginTypes.AbstractPrimitiveContext<O> {
    private static readonly GEOMETRY_DEFAULT = new THREE.BufferGeometry();
    private static readonly MATERIAL_DEFAULT = new THREE.MeshBasicMaterial();
    readonly type: PsrThreePluginTypes.Object3DType = 'Mesh';
    readonly geometry: ShallowRef<PsrThreePluginTypes.GeometryContext<THREE.BufferGeometry> | undefined> = shallowRef<PsrThreePluginTypes.GeometryContext<THREE.BufferGeometry>>();
    readonly material: ShallowRef<PsrThreePluginTypes.MaterialContext<THREE.Material> | undefined> = shallowRef<PsrThreePluginTypes.MaterialContext<THREE.Material>>();

    constructor(
        context: PsrThreePluginTypes.ThreeContext,
        object: O,
    ) {
        super(context, object);
        this.geometry = shallowRef<PsrThreePluginTypes.GeometryContext<THREE.BufferGeometry>>();
        watchEffect(() => {
            const geometry = this.geometry.value?.object.value || this.geometry.value?.fallbackObject.value
            if (geometry) {
                this.object.geometry = geometry
            } else {
                this.object.geometry = AbstractPrimitiveContextImpl.GEOMETRY_DEFAULT
            }
            this.markDirty()
        })
        watchEffect(() => {
            const material = this.material.value?.object.value || this.material.value?.fallbackObject.value
            if (material) {
                this.object.material = material
            } else {
                this.object.material = AbstractPrimitiveContextImpl.MATERIAL_DEFAULT
            }
            this.markDirty()
        })
    }
}