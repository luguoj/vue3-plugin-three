import * as THREE from "three"

export namespace Object3DUtils {
    export function dispose(object?: THREE.Object3D) {
        if (object) {
            for (const child of object.children) {
                Object3DUtils.dispose(child)
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose()
                    if (child.material instanceof THREE.Material) {
                        child.material.dispose()
                    } else {
                        for (const materialElement of child.material) {
                            materialElement.dispose()
                        }
                    }
                }
            }
        }
    }
}