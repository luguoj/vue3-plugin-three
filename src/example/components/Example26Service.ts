import * as THREE from 'three'

export type CubeType = { name: string, position: THREE.Vector3 }
export const cubes: CubeType[] = []
for (let i = 0; i < 10000; i++) {
    cubes.push({
        name: 'cube-' + i,
        position: new THREE.Vector3(i / 100 - 50, i % 100 - 50, 0)
    })
}