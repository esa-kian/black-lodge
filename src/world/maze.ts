import * as THREE from 'three'
import { addCurtainWall } from './curtains'

const CELL = 8
const HEIGHT = 4

type Direction = 'north' | 'south' | 'east' | 'west'

type MazeCell = {
  x: number
  z: number
  walls: Direction[]
  lamp?: boolean
  portal?: boolean
  room?: boolean
  figure?: boolean
}

const PATH_PLAN = [
  '       X       ',
  ' XXXXXXX XXXXX ',
  ' X     X X   X ',
  ' XXX XXX XXX X ',
  '   X X   X X X ',
  ' XXX X XXX X X ',
  ' X   X X   X X ',
  ' X XXX X XXX X ',
  ' X X   X X   X ',
  ' X X XXX X XXX ',
  ' X X X   X   X ',
  ' XXX X XXXXX X ',
  '   X X     X X ',
  ' XXXXXXX XXX X ',
  '       XXXXXXX ',
]

const LAMP_KEYS = new Set([
  '0:0',
  '-4:-1',
  '4:-1',
  '0:-3',
  '-6:-5',
  '2:-5',
  '-2:-8',
  '6:-9',
  '-4:-11',
  '0:-13',
  '6:-14',
])

const PORTAL_KEYS = new Set([
  '-6:-1',
  '6:-1',
  '-4:-7',
  '4:-7',
  '0:-14',
])

const ROOM_KEYS = new Set([
  '0:-3',
  '-6:-5',
  '6:-9',
  '-2:-12',
  '0:-14',
])

const FIGURE_KEYS = new Set([
  '-6:-7',
  '2:-10',
  '5:-13',
])

function createMazeCells() {
  const center = Math.floor(PATH_PLAN[0].length / 2)
  const paths = new Set<string>()

  PATH_PLAN.forEach((row, rowIndex) => {
    Array.from(row).forEach((tile, colIndex) => {
      if (tile !== ' ') {
        paths.add(`${colIndex - center}:${-rowIndex}`)
      }
    })
  })

  const directions: Record<Direction, [number, number]> = {
    north: [0, -1],
    south: [0, 1],
    east: [1, 0],
    west: [-1, 0]
  }

  return Array.from(paths).map((key) => {
    const [x, z] = key.split(':').map(Number)
    const walls = Object.entries(directions)
      .filter(([, [dx, dz]]) => !paths.has(`${x + dx}:${z + dz}`))
      .map(([direction]) => direction as Direction)

    return {
      x,
      z,
      walls,
      lamp: LAMP_KEYS.has(key),
      portal: PORTAL_KEYS.has(key),
      room: ROOM_KEYS.has(key),
      figure: FIGURE_KEYS.has(key)
    }
  })
}

const MAZE: MazeCell[] = createMazeCells()

function cellToWorld(
  x: number,
  z: number
) {
  return {
    x: x * CELL,
    z: z * CELL - 12
  }
}

function wallPosition(
  cell: MazeCell,
  direction: Direction
) {
  const world = cellToWorld(cell.x, cell.z)

  switch (direction) {
    case 'north':
      return {
        position: new THREE.Vector3(world.x, HEIGHT, world.z - CELL / 2),
        rotation: 0
      }
    case 'south':
      return {
        position: new THREE.Vector3(world.x, HEIGHT, world.z + CELL / 2),
        rotation: 0
      }
    case 'east':
      return {
        position: new THREE.Vector3(world.x + CELL / 2, HEIGHT, world.z),
        rotation: -Math.PI / 2
      }
    case 'west':
      return {
        position: new THREE.Vector3(world.x - CELL / 2, HEIGHT, world.z),
        rotation: Math.PI / 2
      }
  }
}

function addCeilingDrape(
  scene: THREE.Scene,
  x: number,
  z: number,
  rotationY = 0
) {
  const material = new THREE.MeshStandardMaterial({
    color: 0x5b0707,
    roughness: 0.9,
    side: THREE.DoubleSide
  })
  const drape = new THREE.Mesh(
    new THREE.PlaneGeometry(CELL * 0.82, CELL * 0.82, 10, 10),
    material
  )

  drape.position.set(x, 7.75, z)
  drape.rotation.set(Math.PI / 2, rotationY, 0)
  drape.receiveShadow = true

  scene.add(drape)
}

function addMazeLamp(
  scene: THREE.Scene,
  x: number,
  z: number
) {
  const group = new THREE.Group()
  const brass = new THREE.MeshStandardMaterial({
    color: 0xaa752d,
    metalness: 0.45,
    roughness: 0.34
  })
  const shade = new THREE.MeshStandardMaterial({
    color: 0xffc58c,
    emissive: 0xff6a28,
    emissiveIntensity: 0.55,
    roughness: 0.7
  })

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.36, 0.08, 18),
    brass
  )

  base.position.y = 0.04

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 2.2, 12),
    brass
  )

  pole.position.y = 1.1

  const lampShade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.5, 0.55, 24, 1, true),
    shade
  )

  lampShade.position.y = 2.32

  const glow = new THREE.PointLight(0xff9f56, 18, 14)

  glow.position.y = 2.25

  group.add(base, pole, lampShade, glow)
  group.position.set(x, 0, z)

  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true
      obj.receiveShadow = true
    }
  })

  scene.add(group)
}

function addPortal(
  scene: THREE.Scene,
  x: number,
  z: number
) {
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x140404,
    roughness: 0.65
  })
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0x170202,
    emissive: 0xb01212,
    emissiveIntensity: 0.8,
    roughness: 0.8
  })

  const arch = new THREE.Group()

  const left = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 4.4, 0.28),
    ringMaterial
  )
  const right = left.clone()
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.28, 0.28),
    ringMaterial
  )
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 3.6),
    glowMaterial
  )

  left.position.set(-1.25, 2.2, 0)
  right.position.set(1.25, 2.2, 0)
  top.position.set(0, 4.28, 0)
  panel.position.set(0, 2.1, -0.03)

  arch.add(left, right, top, panel)
  arch.position.set(x, 0, z)
  arch.castShadow = true

  scene.add(arch)

  const glow = new THREE.PointLight(0xd01010, 14, 14)

  glow.position.set(x, 2.4, z + 0.8)

  scene.add(glow)
}

function addCoffeeTable(
  scene: THREE.Scene,
  x: number,
  z: number
) {
  const wood = new THREE.MeshStandardMaterial({
    color: 0x190907,
    roughness: 0.42,
    metalness: 0.08
  })
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.16, 1.1),
    wood
  )
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.14, 0.7, 14),
    wood
  )
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.12, 0.7),
    wood
  )

  top.position.set(x, 0.78, z)
  stem.position.set(x, 0.4, z)
  base.position.set(x, 0.08, z)

  for (const mesh of [top, stem, base]) {
    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
  }
}

function addPedestal(
  scene: THREE.Scene,
  x: number,
  z: number
) {
  const material = new THREE.MeshStandardMaterial({
    color: 0xbeb4a6,
    roughness: 0.48
  })
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.48, 1.0, 16),
    material
  )
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 18, 12),
    material
  )

  pedestal.position.set(x, 0.5, z)
  orb.position.set(x, 1.22, z)
  pedestal.castShadow = true
  orb.castShadow = true

  scene.add(pedestal, orb)
}

function addShadowMannequin(
  scene: THREE.Scene,
  x: number,
  z: number
) {
  const material = new THREE.MeshStandardMaterial({
    color: 0x090303,
    roughness: 0.95
  })
  const figure = new THREE.Group()
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.32, 1.6, 12),
    material
  )
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 14, 10),
    material
  )

  body.position.y = 0.95
  head.position.y = 1.9

  figure.add(body, head)
  figure.position.set(x, 0, z)

  figure.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true
    }
  })

  scene.add(figure)
}

export function createMaze(scene: THREE.Scene) {
  for (const cell of MAZE) {
    const world = cellToWorld(cell.x, cell.z)

    addCeilingDrape(scene, world.x, world.z, (cell.x + cell.z) * 0.12)

    for (const wall of cell.walls) {
      const { position, rotation } = wallPosition(cell, wall)

      addCurtainWall(scene, CELL, position, rotation)
    }

    if (cell.lamp) {
      addMazeLamp(scene, world.x + 2.8, world.z + 2.5)
    }

    if (cell.portal) {
      addPortal(scene, world.x, world.z - 3.75)
    }

    if (cell.room) {
      addCoffeeTable(scene, world.x, world.z)
      addPedestal(scene, world.x - 2.5, world.z + 2.2)
      addPedestal(scene, world.x + 2.5, world.z - 2.2)
    }

    if (cell.figure) {
      addShadowMannequin(scene, world.x, world.z)
    }
  }
}
