import * as THREE from 'three'
import armVoice from '../assets/arm.mp3'
import cooperVoice from '../assets/cooper.mp3'
import giantVoice from '../assets/giant.mp3'
import lauraVoice from '../assets/laura.mp3'
import oneArmedManVoice from '../assets/one_armed_man.mp3'

type CharacterConfig = {
  name: string
  bodyColor: number
  hairColor?: number
  skinColor: number
  style: 'laura' | 'oneArmedMan' | 'giant' | 'arm' | 'cooper'
  scale?: number
  missingLeftArm?: boolean
  path: THREE.Vector3[]
  speed: number
  phase?: number
  glow?: number
  audioSrc?: string
}

type CharacterActor = {
  group: THREE.Group
  leftLeg: THREE.Group
  rightLeg: THREE.Group
  leftArm?: THREE.Group
  rightArm: THREE.Group
  path: THREE.Vector3[]
  speed: number
  phase: number
  audio?: HTMLAudioElement
  audioRadius: number
  stopRadius: number
  wasNearAudio: boolean
}

function makeMaterial(
  color: number,
  roughness = 0.7,
  emissive = 0x000000,
  emissiveIntensity = 0
) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity,
    roughness,
    flatShading: true
  })
}

function lodgePoint(
  x: number,
  z: number
) {
  return new THREE.Vector3(x * 8, 0, z * 8 - 12)
}

function addLimb(
  parent: THREE.Group,
  material: THREE.Material,
  x: number,
  y: number,
  z: number,
  length: number,
  radius: number
) {
  const pivot = new THREE.Group()
  const limb = new THREE.Mesh(
    new THREE.BoxGeometry(radius * 2.4, length, radius * 1.8),
    material
  )

  limb.position.y = -length / 2
  limb.castShadow = true
  limb.receiveShadow = true

  pivot.position.set(x, y, z)
  pivot.add(limb)
  parent.add(pivot)

  return pivot
}

function addPixel(
  group: THREE.Group,
  color: number,
  position: [number, number, number],
  size: [number, number, number],
  roughness = 0.7
) {
  const pixel = new THREE.Mesh(
    new THREE.BoxGeometry(size[0], size[1], size[2]),
    makeMaterial(color, roughness)
  )

  pixel.position.set(position[0], position[1], position[2])
  pixel.castShadow = true
  pixel.receiveShadow = true
  group.add(pixel)

  return pixel
}

function addFace(
  group: THREE.Group,
  style: CharacterConfig['style']
) {
  const eye = makeMaterial(0x080504, 0.45)
  const brow = makeMaterial(style === 'laura' ? 0xb57a38 : 0x1b100b, 0.8)
  const mouth = makeMaterial(style === 'arm' ? 0x5c0305 : 0x7a2d25, 0.8)
  const nose = makeMaterial(0xd39b79, 0.62)

  for (const x of [-0.095, 0.095]) {
    const eyeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.055, 0.018),
      eye
    )

    eyeMesh.position.set(x, 2.33, 0.291)
    group.add(eyeMesh)

    const browMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.018, 0.012),
      brow
    )

    browMesh.position.set(x, 2.41, 0.3)
    group.add(browMesh)
  }

  const noseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.08, 0.025),
    nose
  )

  noseMesh.position.set(0, 2.26, 0.3)
  group.add(noseMesh)

  const mouthMesh = new THREE.Mesh(
    new THREE.BoxGeometry(style === 'giant' ? 0.12 : 0.15, 0.018, 0.014),
    mouth
  )

  mouthMesh.position.set(0, 2.14, 0.304)
  group.add(mouthMesh)

  addPixel(group, 0xeaa58c, [-0.17, 2.23, 0.303], [0.055, 0.035, 0.012], 0.72)
  addPixel(group, 0xeaa58c, [0.17, 2.23, 0.303], [0.055, 0.035, 0.012], 0.72)
  addPixel(group, 0xc48368, [-0.31, 2.27, 0], [0.04, 0.14, 0.12], 0.68)
  addPixel(group, 0xc48368, [0.31, 2.27, 0], [0.04, 0.14, 0.12], 0.68)

  if (style === 'cooper' || style === 'oneArmedMan') {
    addPixel(group, 0x2a1710, [0.2, 2.36, 0.305], [0.05, 0.028, 0.012], 0.8)
  }
}

function addHairDetails(
  group: THREE.Group,
  style: CharacterConfig['style'],
  hairColor?: number
) {
  if (hairColor === undefined) return

  const hairMaterial = makeMaterial(hairColor, 0.88)

  if (style === 'laura') {
    for (const x of [-0.32, -0.18, 0.18, 0.32]) {
      const strand = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 1.55, 0.12),
        hairMaterial
      )

      strand.position.set(x, 1.62, x < 0 ? 0.05 : -0.02)
      strand.castShadow = true
      group.add(strand)
    }

    const backHair = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 1.55, 0.12),
      hairMaterial
    )

    backHair.position.set(0, 1.68, -0.31)
    backHair.castShadow = true
    group.add(backHair)

    const fringe = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.09, 0.08),
      hairMaterial
    )

    fringe.position.set(0, 2.49, 0.18)
    fringe.rotation.x = -0.25
    group.add(fringe)

    for (const x of [-0.18, 0, 0.18]) {
      addPixel(group, hairColor, [x, 2.38, 0.285], [0.12, 0.16, 0.08], 0.88)
    }
  }

  if (style === 'oneArmedMan') {
    const darkHair = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.18, 0.5),
      hairMaterial
    )

    darkHair.position.set(0, 2.48, -0.02)
    group.add(darkHair)
  }

  if (style === 'cooper') {
    const slickTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.16, 0.58),
      hairMaterial
    )

    slickTop.position.set(0, 2.53, -0.02)
    group.add(slickTop)

    const sidePart = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.08, 0.6),
      hairMaterial
    )

    sidePart.position.set(-0.22, 2.48, 0.02)
    group.add(sidePart)

    addPixel(group, 0x2a2724, [0.23, 2.5, 0.18], [0.16, 0.08, 0.22], 0.8)
  }
}

function addOutfitDetails(
  group: THREE.Group,
  style: CharacterConfig['style']
) {
  if (style === 'laura') {
    const dress = makeMaterial(0x050506, 0.76)
    const dressHighlight = makeMaterial(0x19171d, 0.82)

    const neckline = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.08, 0.05),
      makeMaterial(0xffd1b5, 0.58)
    )

    neckline.position.set(0, 1.98, 0.34)

    const skirt = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.18, 0.62),
      dress
    )

    skirt.position.y = 0.7

    const bodice = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.7, 0.05),
      dressHighlight
    )

    bodice.position.set(0, 1.57, 0.36)

    group.add(neckline, skirt, bodice)

    addPixel(group, 0x2b2730, [-0.18, 1.35, 0.4], [0.07, 0.8, 0.035], 0.82)
    addPixel(group, 0x2b2730, [0.18, 1.35, 0.4], [0.07, 0.8, 0.035], 0.82)
    addPixel(group, 0x050506, [-0.22, 0.16, 0.08], [0.24, 0.16, 0.34], 0.72)
    addPixel(group, 0x050506, [0.22, 0.16, 0.08], [0.24, 0.16, 0.34], 0.72)
  }

  if (style === 'oneArmedMan' || style === 'cooper') {
    const shirt = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.82, 0.045),
      makeMaterial(0xe9ded0, 0.5)
    )

    shirt.position.set(0, 1.55, 0.35)

    const tie = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.72, 0.055),
      makeMaterial(style === 'oneArmedMan' ? 0x5a1111 : 0x080808, 0.65)
    )

    tie.position.set(0, 1.46, 0.39)

    group.add(shirt, tie)

    for (const y of [1.78, 1.58, 1.38]) {
      addPixel(group, 0xf6f0e6, [0, y, 0.42], [0.04, 0.04, 0.025], 0.45)
    }
  }

  if (style === 'giant') {
    const shirtPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.92, 0.055),
      makeMaterial(0x8d8a84, 0.62)
    )

    shirtPanel.position.set(0, 1.54, 0.36)

    const collarLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.08, 0.05),
      makeMaterial(0xc8c3ba, 0.55)
    )
    const collarRight = collarLeft.clone()

    collarLeft.position.set(-0.1, 1.99, 0.4)
    collarLeft.rotation.z = -0.18
    collarRight.position.set(0.1, 1.99, 0.4)
    collarRight.rotation.z = 0.18

    const bowLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.1, 0.055),
      makeMaterial(0x11100f, 0.64)
    )
    const bowRight = bowLeft.clone()
    const knot = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.08, 0.06),
      makeMaterial(0x050505, 0.55)
    )

    bowLeft.position.set(-0.08, 1.9, 0.42)
    bowLeft.rotation.z = 0.18
    bowRight.position.set(0.08, 1.9, 0.42)
    bowRight.rotation.z = -0.18
    knot.position.set(0, 1.9, 0.43)

    group.add(shirtPanel, collarLeft, collarRight, bowLeft, bowRight, knot)

    for (const y of [1.72, 1.5, 1.28]) {
      addPixel(group, 0x2f2d2a, [0, y, 0.43], [0.05, 0.05, 0.025], 0.5)
    }
  }

  if (style === 'cooper') {
    const lapelMaterial = makeMaterial(0x080808, 0.75)
    const cupMaterial = makeMaterial(0xf3efe4, 0.35)
    const coffeeMaterial = makeMaterial(0x150806, 0.5)

    for (const x of [-0.16, 0.16]) {
      const lapel = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.72, 0.05),
        lapelMaterial
      )

      lapel.position.set(x, 1.58, 0.39)
      lapel.rotation.z = x < 0 ? -0.18 : 0.18
      group.add(lapel)
    }

    const cup = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.18, 0.14),
      cupMaterial
    )

    cup.position.set(0.62, 1.36, 0.15)

    const coffee = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.025, 0.11),
      coffeeMaterial
    )

    coffee.position.set(0.62, 1.47, 0.15)

    group.add(cup, coffee)

    addPixel(group, 0xf8d048, [-0.28, 1.72, 0.43], [0.09, 0.09, 0.03], 0.35)
    addPixel(group, 0x050505, [0, 1.98, 0.43], [0.16, 0.04, 0.03], 0.55)
    addPixel(group, 0xf3efe4, [0.73, 1.38, 0.15], [0.035, 0.11, 0.035], 0.35)
  }

  if (style === 'arm') {
    const lapels = makeMaterial(0x5a0304, 0.75)
    const bowtie = makeMaterial(0x080303, 0.6)

    for (const x of [-0.12, 0.12]) {
      const lapel = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.58, 0.045),
        lapels
      )

      lapel.position.set(x, 1.58, 0.35)
      lapel.rotation.z = x < 0 ? -0.16 : 0.16
      group.add(lapel)
    }

    const tie = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.08, 0.055),
      bowtie
    )

    tie.position.set(0, 1.98, 0.39)
    group.add(tie)

    addPixel(group, 0xff1d1d, [0, 1.26, 0.42], [0.08, 0.08, 0.03], 0.65)
    addPixel(group, 0x2a0303, [-0.22, 1.45, 0.41], [0.05, 0.32, 0.03], 0.8)
    addPixel(group, 0x2a0303, [0.22, 1.45, 0.41], [0.05, 0.32, 0.03], 0.8)
  }
}

function addHandsAndShoes(
  group: THREE.Group,
  config: CharacterConfig
) {
  const skin = config.skinColor
  const shoe = config.style === 'laura' ? 0x1a1a22 : 0x050505

  addPixel(group, skin, [0.46, 1.08, 0.02], [0.18, 0.16, 0.14], 0.62)

  if (!config.missingLeftArm) {
    addPixel(group, skin, [-0.46, 1.08, 0.02], [0.18, 0.16, 0.14], 0.62)
  }

  addPixel(group, shoe, [-0.18, 0.08, 0.12], [0.22, 0.12, 0.36], 0.52)
  addPixel(group, shoe, [0.18, 0.08, 0.12], [0.22, 0.12, 0.36], 0.52)

  if (config.style === 'giant') {
    addPixel(group, 0xe8d0b8, [0, 2.03, 0.31], [0.2, 0.04, 0.018], 0.6)
  }

  if (config.style === 'oneArmedMan') {
    addPixel(group, 0x1b1714, [-0.44, 1.52, 0.04], [0.12, 0.34, 0.12], 0.78)
  }
}

function createCharacter(config: CharacterConfig) {
  const scale = config.scale ?? 1
  const group = new THREE.Group()
  const skin = makeMaterial(config.skinColor, 0.62)
  const clothing = makeMaterial(config.bodyColor, 0.78)
  const dark = makeMaterial(0x120807, 0.7)

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 1.25, 0.56),
    clothing
  )

  torso.position.y = 1.45
  torso.castShadow = true
  torso.receiveShadow = true

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.56, 0.56),
    skin
  )

  head.position.y = 2.28
  head.castShadow = true

  group.add(torso, head)

  if (config.hairColor !== undefined) {
    const hair = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.18, 0.58),
      makeMaterial(config.hairColor, 0.88)
    )

    hair.position.set(0, 2.53, -0.02)
    hair.castShadow = true
    group.add(hair)
  }

  addFace(group, config.style)
  addHairDetails(group, config.style, config.hairColor)
  addOutfitDetails(group, config.style)

  const leftLeg = addLimb(group, dark, -0.18, 0.86, 0, 0.78, 0.075)
  const rightLeg = addLimb(group, dark, 0.18, 0.86, 0, 0.78, 0.075)
  const rightArm = addLimb(group, clothing, 0.46, 1.9, 0, 0.82, 0.065)
  const leftArm = config.missingLeftArm
    ? undefined
    : addLimb(group, clothing, -0.46, 1.9, 0, 0.82, 0.065)

  if (config.missingLeftArm) {
    const emptySleeve = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.28, 0.12),
      clothing
    )

    emptySleeve.position.set(-0.44, 1.72, 0)
    emptySleeve.rotation.z = -0.18
    emptySleeve.castShadow = true
    group.add(emptySleeve)
  }

  addHandsAndShoes(group, config)

  if (config.glow !== undefined) {
    const glow = new THREE.PointLight(config.glow, 3.5, 5)

    glow.position.y = 2
    group.add(glow)
  }

  group.scale.setScalar(scale)
  group.position.copy(config.path[0])

  const audio = config.audioSrc === undefined
    ? undefined
    : new Audio(config.audioSrc)

  if (audio) {
    audio.preload = 'auto'
    audio.volume = 0.85
  }

  return {
    group,
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
    path: config.path,
    speed: config.speed,
    phase: config.phase ?? 0,
    audio,
    audioRadius: 7,
    stopRadius: 5.5,
    wasNearAudio: false
  }
}

function getPathLength(path: THREE.Vector3[]) {
  let total = 0

  for (let i = 0; i < path.length; i++) {
    total += path[i].distanceTo(path[(i + 1) % path.length])
  }

  return total
}

function moveAlongPath(
  actor: CharacterActor,
  time: number
) {
  const path = actor.path
  const totalLength = getPathLength(path)
  let distance = (time * actor.speed + actor.phase) % totalLength

  for (let i = 0; i < path.length; i++) {
    const start = path[i]
    const end = path[(i + 1) % path.length]
    const segmentLength = start.distanceTo(end)

    if (distance > segmentLength) {
      distance -= segmentLength
      continue
    }

    const alpha = distance / segmentLength

    actor.group.position.lerpVectors(start, end, alpha)

    const direction = end.clone().sub(start)

    actor.group.rotation.y = Math.atan2(direction.x, direction.z)

    break
  }

  const stride = Math.sin(time * actor.speed * 4 + actor.phase) * 0.55

  actor.leftLeg.rotation.x = stride
  actor.rightLeg.rotation.x = -stride
  actor.rightArm.rotation.x = -stride * 0.72

  if (actor.leftArm) {
    actor.leftArm.rotation.x = stride * 0.72
  }

  actor.group.position.y = Math.abs(Math.sin(time * actor.speed * 4 + actor.phase)) * 0.04
}

function faceListener(
  actor: CharacterActor,
  listenerPosition: THREE.Vector3
) {
  const direction = listenerPosition.clone().sub(actor.group.position)

  actor.group.rotation.y = Math.atan2(direction.x, direction.z)
  actor.leftLeg.rotation.x = 0
  actor.rightLeg.rotation.x = 0
  actor.rightArm.rotation.x = 0

  if (actor.leftArm) {
    actor.leftArm.rotation.x = 0
  }
}

function updateProximityAudio(
  actor: CharacterActor,
  listenerPosition: THREE.Vector3
) {
  if (!actor.audio) return

  const distance = actor.group.position.distanceTo(listenerPosition)
  const isNear = distance < actor.audioRadius

  if (isNear && !actor.wasNearAudio) {
    actor.audio.currentTime = 0
    actor.audio.play().catch(() => {
      actor.wasNearAudio = false
    })
  }

  if (!isNear) {
    actor.audio.pause()
    actor.audio.currentTime = 0
    actor.wasNearAudio = false
    return
  }

  actor.wasNearAudio = actor.wasNearAudio || isNear
}

export function createCharacters(scene: THREE.Scene) {
  const actors = [
    createCharacter({
      name: 'Laura',
      bodyColor: 0x050506,
      hairColor: 0xf2d18a,
      skinColor: 0xffd1b5,
      style: 'laura',
      path: [
        lodgePoint(0, -1),
        lodgePoint(0, -3),
        lodgePoint(2, -3),
        lodgePoint(2, -5),
        lodgePoint(0, -5),
        lodgePoint(-1, -3)
      ],
      speed: 1.2,
      phase: 2,
      glow: 0xffdfb0,
      audioSrc: lauraVoice
    }),
    createCharacter({
      name: 'One Armed Man',
      bodyColor: 0x2f2b24,
      hairColor: 0x21110b,
      skinColor: 0xd6aa84,
      style: 'oneArmedMan',
      missingLeftArm: true,
      path: [
        lodgePoint(-6, -1),
        lodgePoint(-6, -5),
        lodgePoint(-4, -7),
        lodgePoint(-2, -8),
        lodgePoint(-4, -11),
        lodgePoint(-6, -7)
      ],
      speed: 0.95,
      phase: 9,
      audioSrc: oneArmedManVoice
    }),
    createCharacter({
      name: 'Giant',
      bodyColor: 0x77736c,
      skinColor: 0xe2c4a8,
      style: 'giant',
      scale: 1.85,
      path: [
        lodgePoint(6, -1),
        lodgePoint(6, -5),
        lodgePoint(4, -7),
        lodgePoint(6, -9),
        lodgePoint(4, -11),
        lodgePoint(2, -10)
      ],
      speed: 0.62,
      phase: 4,
      glow: 0xe8cfae,
      audioSrc: giantVoice
    }),
    createCharacter({
      name: 'The Arm',
      bodyColor: 0xb90e12,
      skinColor: 0xf0bf9c,
      style: 'arm',
      scale: 0.5,
      path: [
        lodgePoint(0, -13),
        lodgePoint(3, -13),
        lodgePoint(6, -14),
        lodgePoint(3, -14),
        lodgePoint(0, -14),
        lodgePoint(-2, -12)
      ],
      speed: 1.65,
      phase: 13,
      glow: 0xff2c20,
      audioSrc: armVoice
    }),
    createCharacter({
      name: 'Dale Cooper',
      bodyColor: 0x0a0a0c,
      hairColor: 0x12100f,
      skinColor: 0xe8b890,
      style: 'cooper',
      path: [
        lodgePoint(0, 0),
        lodgePoint(0, -2),
        lodgePoint(-2, -3),
        lodgePoint(-4, -5),
        lodgePoint(-2, -8),
        lodgePoint(0, -6),
        lodgePoint(2, -5),
        lodgePoint(2, -2)
      ],
      speed: 1.05,
      phase: 6,
      glow: 0xffd6a4,
      audioSrc: cooperVoice
    })
  ]

  for (const actor of actors) {
    scene.add(actor.group)
  }

  return (
    time: number,
    listenerPosition: THREE.Vector3
  ) => {
    for (const actor of actors) {
      const distance = actor.group.position.distanceTo(listenerPosition)

      if (distance < actor.stopRadius) {
        faceListener(actor, listenerPosition)
      } else {
        moveAlongPath(actor, time)
      }

      updateProximityAudio(actor, listenerPosition)
    }
  }
}
