import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import * as THREE from 'three'

export class PlayerControls {
  controls: PointerLockControls

  velocity = new THREE.Vector3()

  moveForward = false
  moveBackward = false
  moveLeft = false
  moveRight = false

  speed = 8

  constructor(
    camera: THREE.Camera,
    domElement: HTMLElement
  ) {
    this.controls = new PointerLockControls(camera, domElement)

    document.addEventListener('click', () => {
      this.controls.lock()
    })

    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyS':
        this.moveForward = true
        break
      case 'KeyW':
        this.moveBackward = true
        break
      case 'KeyA':
        this.moveLeft = true
        break
      case 'KeyD':
        this.moveRight = true
        break
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyS':
        this.moveForward = false
        break
      case 'KeyW':
        this.moveBackward = false
        break
      case 'KeyA':
        this.moveLeft = false
        break
      case 'KeyD':
        this.moveRight = false
        break
    }
  }

  update(delta: number) {
    const direction = new THREE.Vector3()

    if (this.moveForward) direction.z -= 1
    if (this.moveBackward) direction.z += 1
    if (this.moveLeft) direction.x -= 1
    if (this.moveRight) direction.x += 1

    direction.normalize()

    this.controls.moveRight(direction.x * this.speed * delta)
    this.controls.moveForward(direction.z * this.speed * delta)
  }
}
