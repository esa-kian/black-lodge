import * as THREE from 'three'

export function createScene() {
  const scene = new THREE.Scene()

  scene.background = new THREE.Color(0x100808)

  scene.fog = new THREE.FogExp2(0x180606, 0.018)

  return scene
}
