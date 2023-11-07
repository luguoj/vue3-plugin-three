import * as THREE from "three"

export namespace Object3DUtils {
    export function dispose(object?: THREE.Object3D & { dispose?: () => void, geometry?: THREE.BufferGeometry, material?: THREE.Material | THREE.Material[] }) {
        if (object) {
            if (object.dispose) {
                object.dispose()
            }
            if (object.geometry instanceof THREE.BufferGeometry) {
                object.geometry.dispose()
            }
            if (object.material instanceof THREE.Material) {
                object.material.dispose()
            } else if (object.material) {
                for (const materialElement of object.material) {
                    materialElement.dispose()
                }
            }
            // 递归释放子对象
            for (const child of object.children) {
                Object3DUtils.dispose(child)
            }
            // 清空子对象
            object.clear()
        }
    }
}