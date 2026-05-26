import * as THREE from 'three'
import { createFloor } from './floor'
import { createCurtains } from './curtains'
import { createFurniture } from './furniture'
import { createMaze } from './maze'
import { createCharacters } from './characters'

export function createBlackLodge(scene: THREE.Scene) {
  const floor = createFloor()

  scene.add(floor)

  createCurtains(scene)
  createFurniture(scene)
  createMaze(scene)
  const updateCharacters = createCharacters(scene)

  const doorway = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 5.6, 0.18),
    new THREE.MeshStandardMaterial({
      color: 0x070303,
      roughness: 0.9
    })
  )

  doorway.position.set(0, 2.8, -12.08)

  scene.add(doorway)

  const doorwayGlow = new THREE.PointLight(0xaa0808, 18, 18)

  doorwayGlow.position.set(0, 2.4, -10.8)

  scene.add(doorwayGlow)

  return updateCharacters
}
