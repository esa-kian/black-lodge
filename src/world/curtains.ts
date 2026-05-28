import * as THREE from 'three'

const CURTAIN_HEIGHT = 10
const curtainGeometryByWidth = new Map<number, THREE.PlaneGeometry>()

let curtainTexture: THREE.CanvasTexture | undefined
let curtainMaterial: THREE.MeshStandardMaterial | undefined
let rodMaterial: THREE.MeshStandardMaterial | undefined

function createCurtainTexture() {
  if (curtainTexture) return curtainTexture

  const canvas = document.createElement('canvas')

  canvas.width = 256
  canvas.height = 512

  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)

  gradient.addColorStop(0, '#4f0405')
  gradient.addColorStop(0.18, '#a20c10')
  gradient.addColorStop(0.34, '#6d0608')
  gradient.addColorStop(0.5, '#d01b22')
  gradient.addColorStop(0.66, '#74070a')
  gradient.addColorStop(0.82, '#b91419')
  gradient.addColorStop(1, '#3b0203')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let x = 0; x < canvas.width; x += 14) {
    ctx.fillStyle = x % 28 === 0
      ? 'rgba(25, 0, 0, 0.42)'
      : 'rgba(255, 90, 90, 0.18)'
    ctx.fillRect(x, 0, 3, canvas.height)
  }

  for (let y = 0; y < canvas.height; y += 18) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, y, canvas.width, 2)
  }

  curtainTexture = new THREE.CanvasTexture(canvas)

  curtainTexture.wrapS = THREE.RepeatWrapping
  curtainTexture.wrapT = THREE.RepeatWrapping
  curtainTexture.repeat.set(2.8, 1)

  return curtainTexture
}

function getCurtainMaterial() {
  if (!curtainMaterial) {
    curtainMaterial = new THREE.MeshStandardMaterial({
      color: 0xbc171b,
      map: createCurtainTexture(),
      emissive: 0x230000,
      emissiveIntensity: 0.18,
      roughness: 0.82,
      metalness: 0.02,
      side: THREE.DoubleSide
    })
  }

  return curtainMaterial
}

function getRodMaterial() {
  if (!rodMaterial) {
    rodMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b0505,
      roughness: 0.5
    })
  }

  return rodMaterial
}

function createCurtainPanel(
  width: number,
  height: number,
  folds: number
) {
  const cachedGeometry = curtainGeometryByWidth.get(width)

  if (cachedGeometry) return cachedGeometry

  const geometry = new THREE.PlaneGeometry(width, height, folds * 8, 1)
  const position = geometry.attributes.position

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const normalized = (x / width) + 0.5
    const depth = Math.sin(normalized * Math.PI * folds * 2) * 0.28

    position.setZ(i, depth)
  }

  position.needsUpdate = true
  geometry.computeVertexNormals()

  curtainGeometryByWidth.set(width, geometry)

  return geometry
}

export function addCurtainWall(
  scene: THREE.Scene,
  width: number,
  position: THREE.Vector3,
  rotationY = 0
) {
  const material = getCurtainMaterial()

  const curtain = new THREE.Mesh(
    createCurtainPanel(width, CURTAIN_HEIGHT, Math.max(5, Math.floor(width / 2))),
    material
  )

  curtain.position.copy(position)
  curtain.position.y = CURTAIN_HEIGHT / 2
  curtain.rotation.y = rotationY
  curtain.receiveShadow = true

  scene.add(curtain)

  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, width + 0.8, 24),
    getRodMaterial()
  )

  rod.position.copy(position)
  rod.position.y = CURTAIN_HEIGHT + 0.15
  rod.rotation.z = Math.PI / 2
  rod.rotation.y = rotationY
  scene.add(rod)

  const valance = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.4, 0.45, 0.25),
    material
  )

  valance.position.copy(position)
  valance.position.y = CURTAIN_HEIGHT - 0.25
  valance.rotation.y = rotationY

  scene.add(valance)
}

export function createCurtains(scene: THREE.Scene) {
  addCurtainWall(scene, 34, new THREE.Vector3(0, 4, -12))
  addCurtainWall(scene, 24, new THREE.Vector3(-17, 4, 0), Math.PI / 2)
  addCurtainWall(scene, 24, new THREE.Vector3(17, 4, 0), -Math.PI / 2)
}
