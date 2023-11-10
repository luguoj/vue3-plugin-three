import * as THREE from "three"

export namespace Object3DUtils {
    export function dispose(object?: THREE.Object3D & { dispose?: () => void, geometry?: THREE.BufferGeometry, material?: THREE.Material | THREE.Material[] }) {
        if (object) {
            const {geometry, material, children: [...children]} = object
            if (object.dispose) {
                object.dispose()
            }
            if (geometry instanceof THREE.BufferGeometry) {
                geometry.dispose()
            }
            if (material instanceof THREE.Material) {
                material.dispose()
            } else if (material) {
                for (const materialElement of material) {
                    materialElement.dispose()
                }
            }
            // 清空子对象
            object.clear()
            // 递归释放子对象
            for (const child of children) {
                Object3DUtils.dispose(child)
            }
        }
    }
}