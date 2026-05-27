import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import * as THREE from 'three'

export class PlayerControls {
  controls: PointerLockControls
  camera: THREE.Camera
  domElement: HTMLElement

  velocity = new THREE.Vector3()

  moveForward = false
  moveBackward = false
  moveLeft = false
  moveRight = false

  speed = 8
  touchMoveX = 0
  touchMoveZ = 0
  lookPointerId: number | null = null
  movePointerId: number | null = null
  moveOrigin = new THREE.Vector2()
  lastLook = new THREE.Vector2()
  pitch = 0
  yaw = 0
  joystickKnob?: HTMLDivElement

  constructor(
    camera: THREE.Camera,
    domElement: HTMLElement
  ) {
    this.camera = camera
    this.domElement = domElement
    this.camera.rotation.order = 'YXZ'
    this.pitch = this.camera.rotation.x
    this.yaw = this.camera.rotation.y
    this.controls = new PointerLockControls(camera, domElement)

    document.addEventListener('click', () => {
      this.controls.lock()
    })

    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)

    this.createMobileControls()
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
    direction.x += this.touchMoveX
    direction.z += this.touchMoveZ

    direction.normalize()

    this.controls.moveRight(direction.x * this.speed * delta)
    this.controls.moveForward(direction.z * this.speed * delta)
  }

  createMobileControls() {
    const overlay = document.createElement('div')
    const movePad = document.createElement('div')
    const knob = document.createElement('div')
    const lookPad = document.createElement('div')

    overlay.className = 'mobile-controls'
    movePad.className = 'mobile-move-pad'
    knob.className = 'mobile-move-knob'
    lookPad.className = 'mobile-look-pad'

    movePad.appendChild(knob)
    overlay.appendChild(movePad)
    overlay.appendChild(lookPad)
    document.body.appendChild(overlay)

    this.joystickKnob = knob

    movePad.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.movePointerId = event.pointerId
      this.moveOrigin.set(event.clientX, event.clientY)
      movePad.setPointerCapture(event.pointerId)
      this.updateTouchMove(event.clientX, event.clientY)
    })

    movePad.addEventListener('pointermove', (event) => {
      if (event.pointerId !== this.movePointerId) return

      event.preventDefault()
      this.updateTouchMove(event.clientX, event.clientY)
    })

    const stopMove = (event: PointerEvent) => {
      if (event.pointerId !== this.movePointerId) return

      this.movePointerId = null
      this.touchMoveX = 0
      this.touchMoveZ = 0
      knob.style.transform = 'translate(-50%, -50%)'
    }

    movePad.addEventListener('pointerup', stopMove)
    movePad.addEventListener('pointercancel', stopMove)

    lookPad.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.lookPointerId = event.pointerId
      this.lastLook.set(event.clientX, event.clientY)
      lookPad.setPointerCapture(event.pointerId)
    })

    lookPad.addEventListener('pointermove', (event) => {
      if (event.pointerId !== this.lookPointerId) return

      event.preventDefault()

      const deltaX = event.clientX - this.lastLook.x
      const deltaY = event.clientY - this.lastLook.y

      this.lastLook.set(event.clientX, event.clientY)
      this.yaw -= deltaX * 0.004
      this.pitch -= deltaY * 0.004
      this.pitch = THREE.MathUtils.clamp(
        this.pitch,
        -Math.PI / 2 + 0.08,
        Math.PI / 2 - 0.08
      )
      this.camera.rotation.set(this.pitch, this.yaw, 0)
    })

    const stopLook = (event: PointerEvent) => {
      if (event.pointerId !== this.lookPointerId) return

      this.lookPointerId = null
    }

    lookPad.addEventListener('pointerup', stopLook)
    lookPad.addEventListener('pointercancel', stopLook)
  }

  updateTouchMove(
    x: number,
    y: number
  ) {
    const deltaX = x - this.moveOrigin.x
    const deltaY = y - this.moveOrigin.y
    const maxDistance = 54
    const distance = Math.min(
      Math.hypot(deltaX, deltaY),
      maxDistance
    )
    const angle = Math.atan2(deltaY, deltaX)
    const limitedX = Math.cos(angle) * distance
    const limitedY = Math.sin(angle) * distance

    this.touchMoveX = limitedX / maxDistance
    this.touchMoveZ = limitedY / maxDistance

    if (this.joystickKnob) {
      this.joystickKnob.style.transform =
        `translate(calc(-50% + ${limitedX}px), calc(-50% + ${limitedY}px))`
    }
  }
}
