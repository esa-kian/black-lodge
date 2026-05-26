import * as THREE from 'three'

export class AmbienceSystem {
  listener: THREE.AudioListener
  ambientLight: THREE.AmbientLight

  constructor(camera: THREE.Camera, scene: THREE.Scene) {
    this.listener = new THREE.AudioListener()

    camera.add(this.listener)

    this.ambientLight = new THREE.AmbientLight(
      0x220000,
      0.15
    )

    scene.add(this.ambientLight)
  }

  update(time: number) {
    // subtle ambient pulsing
    this.ambientLight.intensity =
      0.15 + Math.sin(time * 0.2) * 0.02
  }
}