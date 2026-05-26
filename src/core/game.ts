import * as THREE from 'three'

import { createRenderer } from './renderer'
import { createCamera } from './camera'
import { createScene } from './scene'

import { PlayerControls } from '../systems/controls'
import { setupLighting } from '../systems/lighting'

import { createBlackLodge } from '../world/blackLodge'

export class Game {
  renderer
  camera
  scene
  controls
  updateWorld

  clock = new THREE.Clock()

  constructor() {
    this.renderer = createRenderer()

    this.camera = createCamera()

    this.scene = createScene()

    this.controls = new PlayerControls(
      this.camera,
      this.renderer.domElement
    )

    setupLighting(this.scene)

    this.updateWorld = createBlackLodge(this.scene)

    window.addEventListener(
      'resize',
      this.onResize
    )
  }

  onResize = () => {
    this.camera.aspect =
      window.innerWidth / window.innerHeight

    this.camera.updateProjectionMatrix()

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    )
  }

  start() {
    this.animate()
  }

  animate = () => {
    requestAnimationFrame(this.animate)

    const delta = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()

    this.controls.update(delta)
    this.updateWorld(elapsed)

    this.renderer.render(
      this.scene,
      this.camera
    )
  }
}
