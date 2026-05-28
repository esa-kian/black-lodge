import * as THREE from 'three'

function createArmchair(x: number, z: number, rotationY: number) {
  const chair = new THREE.Group()

  const upholstery = new THREE.MeshStandardMaterial({
    color: 0x7e0909,
    roughness: 0.78
  })

  const darkWood = new THREE.MeshStandardMaterial({
    color: 0x160807,
    roughness: 0.55
  })

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.45, 1.55),
    upholstery
  )

  seat.position.y = 0.72

  const back = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 1.45, 0.35),
    upholstery
  )

  back.position.set(0, 1.28, -0.6)

  const leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.9, 1.6),
    upholstery
  )

  leftArm.position.set(-1.05, 0.98, 0)

  const rightArm = leftArm.clone()

  rightArm.position.x = 1.05

  const cushion = new THREE.Mesh(
    new THREE.BoxGeometry(1.42, 0.22, 1.18),
    upholstery
  )

  cushion.position.set(0, 1.0, 0.08)

  const legGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.65, 10)

  for (const legX of [-0.72, 0.72]) {
    for (const legZ of [-0.42, 0.48]) {
      const leg = new THREE.Mesh(legGeometry, darkWood)

      leg.position.set(legX, 0.32, legZ)
      chair.add(leg)
    }
  }

  chair.add(seat, back, leftArm, rightArm, cushion)
  chair.position.set(x, 0, z)
  chair.rotation.y = rotationY

  chair.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true
      obj.receiveShadow = true
    }
  })

  return chair
}

function createSideTable(x: number, z: number) {
  const table = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({
    color: 0x1d0c06,
    roughness: 0.38,
    metalness: 0.12
  })

  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.16, 32),
    material
  )

  top.position.y = 0.9

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, 0.8, 16),
    material
  )

  stem.position.y = 0.48

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.5, 0.12, 32),
    material
  )

  base.position.y = 0.08

  table.add(top, stem, base)
  table.position.set(x, 0, z)

  table.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true
      obj.receiveShadow = true
    }
  })

  return table
}

function createFloorLamp(x: number, z: number) {
  const lamp = new THREE.Group()
  const brass = new THREE.MeshStandardMaterial({
    color: 0xb27a31,
    metalness: 0.5,
    roughness: 0.28
  })
  const shadeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd3a0,
    emissive: 0xff8a32,
    emissiveIntensity: 0.45,
    roughness: 0.62,
    transparent: true,
    opacity: 0.92
  })

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.055, 2.65, 16),
    brass
  )

  pole.position.y = 1.35

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.42, 0.08, 28),
    brass
  )

  base.position.y = 0.04

  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.68, 0.72, 32, 1, true),
    shadeMaterial
  )

  shade.position.y = 2.78

  const bulb = new THREE.PointLight(0xffba76, 22, 12)

  bulb.position.y = 2.7

  lamp.add(base, pole, shade, bulb)
  lamp.position.set(x, 0, z)

  lamp.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true
      obj.receiveShadow = true
    }
  })

  return lamp
}

function createPedestalStatue(x: number, z: number) {
  const statue = new THREE.Group()
  const stone = new THREE.MeshStandardMaterial({
    color: 0xc7beb2,
    roughness: 0.45,
    metalness: 0.05
  })

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.58, 1.1, 16),
    stone
  )

  pedestal.position.y = 0.55

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.34, 1.0, 12),
    stone
  )

  torso.position.y = 1.55

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 12),
    stone
  )

  head.position.y = 2.18

  statue.add(pedestal, torso, head)
  statue.position.set(x, 0, z)

  statue.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true
      obj.receiveShadow = true
    }
  })

  return statue
}

export function createFurniture(scene: THREE.Scene) {
  scene.add(createArmchair(-2.2, -5.8, Math.PI * 0.1))
  scene.add(createArmchair(2.2, -5.8, -Math.PI * 0.1))
  scene.add(createSideTable(0, -5.15))
  scene.add(createFloorLamp(-4.6, -5.8))
  scene.add(createFloorLamp(4.6, -5.8))
  scene.add(createPedestalStatue(-7.2, -8.3))
  scene.add(createPedestalStatue(7.2, -8.3))
}
