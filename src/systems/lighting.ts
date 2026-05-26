import * as THREE from 'three'

export function setupLighting(scene: THREE.Scene) {
  const ambient = new THREE.AmbientLight(0xffd6c7, 0.75)

  scene.add(ambient)

  const overheadLight = new THREE.PointLight(0xff4a24, 80, 60)

  overheadLight.position.set(0, 7, 0)

  overheadLight.castShadow = true

  scene.add(overheadLight)

  const frontLight = new THREE.PointLight(0xffb08a, 35, 30)

  frontLight.position.set(0, 3, 6)

  scene.add(frontLight)

  const fillLight = new THREE.HemisphereLight(0xffe0d0, 0x220000, 0.6)

  scene.add(fillLight)
}
