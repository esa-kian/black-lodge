import * as THREE from 'three'

export function createFloor() {
  const geometry = new THREE.PlaneGeometry(240, 240)

  const canvas = document.createElement('canvas')

  canvas.width = 1024
  canvas.height = 1024

  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#f0e7d6'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const step = 64
  const stripeGap = 78

  ctx.strokeStyle = '#1b120d'
  ctx.lineWidth = 28
  ctx.lineJoin = 'miter'
  ctx.lineCap = 'square'
  ctx.miterLimit = 2

  for (let y = -stripeGap; y < canvas.height + stripeGap; y += stripeGap) {
    ctx.beginPath()
    ctx.moveTo(-step, y + step / 2)

    for (let x = -step; x <= canvas.width + step; x += step) {
      const pointY = y + (x / step % 2 === 0 ? 0 : step)

      ctx.lineTo(x, pointY)
    }

    ctx.stroke()
  }

  ctx.globalAlpha = 0.08
  ctx.strokeStyle = '#6b2c1a'
  ctx.lineWidth = 6

  for (let y = -stripeGap; y < canvas.height + stripeGap; y += stripeGap) {
    ctx.beginPath()
    ctx.moveTo(-step, y + step / 2 + 30)

    for (let x = -step; x <= canvas.width + step; x += step) {
      const pointY = y + (x / step % 2 === 0 ? 30 : step + 30)

      ctx.lineTo(x, pointY)
    }

    ctx.stroke()
  }

  ctx.globalAlpha = 1

  const texture = new THREE.CanvasTexture(canvas)

  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  texture.repeat.set(30, 30)

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.34,
    metalness: 0.02
  })

  const floor = new THREE.Mesh(geometry, material)

  floor.rotation.x = -Math.PI / 2

  floor.receiveShadow = true

  return floor
}
