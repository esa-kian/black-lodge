import * as THREE from 'three'

export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance'
  })

  renderer.setSize(window.innerWidth, window.innerHeight)

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))

  renderer.shadowMap.enabled = true

  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.35

  renderer.outputColorSpace = THREE.SRGBColorSpace

  const app = document.querySelector<HTMLDivElement>('#app')

  if (!app) {
    throw new Error('Missing #app element')
  }

  app.appendChild(renderer.domElement)

  return renderer
}
