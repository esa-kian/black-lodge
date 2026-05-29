import * as THREE from 'three'
import bobVoice from '../assets/bob.mp3'
import gordonVoice from '../assets/gordon.mp3'
import treeVoice from '../assets/tree.mp3'

type CharacterPosition = {
  id: string
  position: THREE.Vector3
}

type AdventureOptions = {
  getCharacters: () => CharacterPosition[]
}

const REQUIRED_CHARACTER_IDS = [
  'laura',
  'oneArmedMan',
  'giant',
  'arm',
  'cooper'
]

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

function createHud() {
  const hud = document.createElement('div')

  hud.className = 'quest-hud'
  document.body.appendChild(hud)

  return {
    setText(text: string) {
      hud.textContent = text
    }
  }
}

function createForest() {
  const group = new THREE.Group()

  group.position.set(108, 0, -84)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(95, 95),
    makeMaterial(0x17210f, 0.9)
  )

  floor.rotation.x = -Math.PI / 2
  group.add(floor)

  const trunkMaterial = makeMaterial(0x221109, 0.85)
  const leavesMaterial = makeMaterial(0x123817, 0.9)

  for (let i = 0; i < 34; i++) {
    const angle = i * 1.91
    const radius = 18 + (i % 6) * 5
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const trunk = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 6 + (i % 3), 0.8),
      trunkMaterial
    )
    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 5.5, 4.5),
      leavesMaterial
    )

    trunk.position.set(x, 3, z)
    crown.position.set(x, 8, z)
    group.add(trunk, crown)
  }

  const portal = new THREE.Mesh(
    new THREE.BoxGeometry(6, 5, 0.3),
    makeMaterial(0x0b1809, 0.8, 0x1f6b1a, 0.45)
  )

  portal.position.set(-38, 2.5, 18)
  group.add(portal)

  group.visible = false

  return group
}

function createBob() {
  const group = new THREE.Group()
  const denim = makeMaterial(0x1a3556, 0.72)
  const skin = makeMaterial(0xc8916c, 0.65)
  const hair = makeMaterial(0x2a170d, 0.9)

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.25, 0.55),
    denim
  )
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.58, 0.58),
    skin
  )
  const hairBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 1.1, 0.18),
    hair
  )

  body.position.y = 1.3
  head.position.y = 2.22
  hairBack.position.set(0, 1.94, -0.34)
  group.add(body, head, hairBack)

  for (const x of [-0.12, 0.12]) {
    const eye = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.06, 0.02),
      makeMaterial(0x070303, 0.5)
    )

    eye.position.set(x, 2.28, 0.31)
    group.add(eye)
  }

  const mouth = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.04, 0.02),
    makeMaterial(0x4d0505, 0.7)
  )

  mouth.position.set(0, 2.08, 0.31)
  group.add(mouth)

  group.position.set(126, 0, -98)

  return group
}

function createGordon() {
  const group = new THREE.Group()
  const suit = makeMaterial(0x5e5a50, 0.72)
  const skin = makeMaterial(0xe1b08a, 0.62)
  const white = makeMaterial(0xf0eee5, 0.55)

  const chair = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.7, 1.2),
    makeMaterial(0x3f170f, 0.82)
  )
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.05, 0.55),
    suit
  )
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.58, 0.58),
    skin
  )
  const hair = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.18, 0.58),
    white
  )
  const cup = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.2, 0.16),
    white
  )

  chair.position.y = 0.45
  body.position.y = 1.25
  head.position.y = 2.02
  hair.position.y = 2.35
  cup.position.set(0.55, 1.35, 0.2)
  group.add(chair, body, head, hair, cup)
  group.position.set(112, 0, -95)

  return group
}

function createSpeakingTree() {
  const group = new THREE.Group()
  const wood = makeMaterial(0x5a2a16, 0.86, 0x260708, 0.12)
  const darkWood = makeMaterial(0x311108, 0.9)
  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 5.2, 0.7),
    wood
  )
  const upperSplit = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 2.3, 0.55),
    wood
  )
  const leftBranch = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 3.4, 0.42),
    wood
  )
  const rightBranch = leftBranch.clone()
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 1.1, 0.85),
    makeMaterial(0x7a3a21, 0.82, 0x340a08, 0.18)
  )
  const facePlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.58, 0.08),
    makeMaterial(0x2b0a08, 0.86)
  )
  const mouth = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.11, 0.06),
    makeMaterial(0x080202, 0.7)
  )

  trunk.position.y = 2.6
  upperSplit.position.set(0, 5.1, 0)
  upperSplit.rotation.z = 0.18
  leftBranch.position.set(-1.15, 5.7, 0)
  leftBranch.rotation.z = -0.72
  rightBranch.position.set(1.15, 5.8, 0)
  rightBranch.rotation.z = 0.68
  head.position.set(0, 6.6, 0.12)
  facePlate.position.set(0, 6.52, 0.58)
  mouth.position.set(0, 6.28, 0.65)

  for (const x of [-0.24, 0.24]) {
    const eye = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.14, 0.06),
      darkWood
    )

    eye.position.set(x, 6.62, 0.66)
    group.add(eye)
  }

  group.add(trunk, upperSplit, leftBranch, rightBranch, head, facePlate, mouth)
  group.position.set(98, 0, -114)
  group.visible = false

  return group
}

function createRR() {
  const group = new THREE.Group()
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(12, 5, 8),
    makeMaterial(0xb8d5d9, 0.72)
  )
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(13, 1, 9),
    makeMaterial(0xd64b3e, 0.68)
  )
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(4, 1.2, 0.3),
    makeMaterial(0xfff0d0, 0.42, 0xffaa55, 0.3)
  )
  const shelly = new THREE.Group()
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 1.2, 0.5),
    makeMaterial(0xf4d7d2, 0.65)
  )
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    makeMaterial(0xffc39c, 0.62)
  )
  const hair = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.24, 0.52),
    makeMaterial(0x5b2d13, 0.86)
  )
  const coffee = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.22, 0.18),
    makeMaterial(0xf7f3e8, 0.4)
  )

  building.position.y = 2.5
  roof.position.y = 5.45
  sign.position.set(0, 4.4, 4.15)
  body.position.y = 1.1
  head.position.y = 1.95
  hair.position.y = 2.24
  coffee.position.set(0.55, 1.25, 0.15)
  shelly.add(body, head, hair, coffee)
  shelly.position.set(0, 0, 5.5)
  group.add(building, roof, sign, shelly)
  group.position.set(142, 0, -105)
  group.visible = false

  return {
    group,
    shelly
  }
}

function createRingTable() {
  const group = new THREE.Group()
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.18, 1.0),
    makeMaterial(0x190907, 0.5)
  )
  const stem = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.7, 0.18),
    makeMaterial(0x190907, 0.5)
  )
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.045, 8, 18),
    makeMaterial(0xd6b14f, 0.3, 0x6b4f09, 0.2)
  )

  table.position.y = 0.8
  stem.position.y = 0.4
  ring.position.set(0, 0.95, 0)
  ring.rotation.x = Math.PI / 2
  group.add(table, stem, ring)
  group.position.set(0, 0, -5.15)
  group.visible = false

  return group
}

function playFromStart(audio: HTMLAudioElement) {
  audio.currentTime = 0
  audio.play().catch(() => {})
}

export function createAdventure(
  scene: THREE.Scene,
  options: AdventureOptions
) {
  const hud = createHud()
  const heardCharacters = new Set<string>()
  const deliveredCoffee = new Set<string>()
  const forest = createForest()
  const bob = createBob()
  const gordon = createGordon()
  const tree = createSpeakingTree()
  const rr = createRR()
  const ringTable = createRingTable()
  const bobAudio = new Audio(bobVoice)
  const gordonAudio = new Audio(gordonVoice)
  const treeAudio = new Audio(treeVoice)

  bobAudio.volume = 0.95
  gordonAudio.volume = 0.9
  treeAudio.volume = 0.9

  bobAudio.addEventListener('ended', () => {
    lost = true
    setObjective()
  })

  gordonAudio.addEventListener('ended', () => {
    if (gordonHeard) return

    gordonHeard = true
    tree.visible = true
    setObjective()
  })

  treeAudio.addEventListener('ended', () => {
    if (treeHeard) return

    treeHeard = true
    rrUnlocked = true
    rr.group.visible = true
    setObjective()
  })

  bob.visible = false
  gordon.visible = false
  scene.add(forest, bob, gordon, tree, rr.group, ringTable)

  let forestUnlocked = false
  let gordonHeard = false
  let treeHeard = false
  let rrUnlocked = false
  let hasCoffee = false
  let lost = false
  let won = false

  function setObjective() {
    if (lost) {
      hud.setText('You heard Bob to the end. You are lost.')
      return
    }

    if (won) {
      hud.setText('The ring is found. The story closes.')
      return
    }

    if (!forestUnlocked) {
      hud.setText(`Listen to everyone: ${heardCharacters.size}/${REQUIRED_CHARACTER_IDS.length}`)
      return
    }

    if (!gordonHeard) {
      hud.setText('Forest unlocked. Find Gordon.')
      return
    }

    if (!treeHeard) {
      hud.setText('A tree is speaking somewhere in the forest.')
      return
    }

    if (!rrUnlocked) {
      hud.setText('Listen to the tree.')
      return
    }

    if (!hasCoffee && deliveredCoffee.size < REQUIRED_CHARACTER_IDS.length) {
      hud.setText('Find the RR cafe and get coffee from Shelly.')
      return
    }

    if (deliveredCoffee.size < REQUIRED_CHARACTER_IDS.length) {
      hud.setText(`Deliver coffee: ${deliveredCoffee.size}/${REQUIRED_CHARACTER_IDS.length}`)
      return
    }

    hud.setText('Return to the beginning room and find the ring.')
  }

  function unlockForest() {
    forestUnlocked = true
    forest.visible = true
    bob.visible = true
    gordon.visible = true
  }

  function markCharacterHeard(id: string) {
    if (!REQUIRED_CHARACTER_IDS.includes(id) || heardCharacters.has(id)) {
      return
    }

    heardCharacters.add(id)

    if (heardCharacters.size === REQUIRED_CHARACTER_IDS.length) {
      unlockForest()
    }

    setObjective()
  }

  function updateBob(
    delta: number,
    playerPosition: THREE.Vector3
  ) {
    if (!forestUnlocked || lost || won) return
    if (!gordonAudio.paused && !gordonHeard) {
      if (!bobAudio.paused) {
        bobAudio.pause()
        bobAudio.currentTime = 0
      }

      return
    }

    const direction = playerPosition.clone().sub(bob.position)
    direction.y = 0

    if (direction.length() > 0.1) {
      direction.normalize()
      bob.position.addScaledVector(direction, 10.2 * delta)
      bob.rotation.y = Math.atan2(direction.x, direction.z)
    }

    const distance = bob.position.distanceTo(playerPosition)

    if (distance < 8 && bobAudio.paused) {
      playFromStart(bobAudio)
    }

    if (distance >= 8 && !bobAudio.paused) {
      bobAudio.pause()
      bobAudio.currentTime = 0
    }

  }

  function updateStoryAudio(
    playerPosition: THREE.Vector3
  ) {
    if (!forestUnlocked || lost || won) return

    if (!gordonHeard && gordon.position.distanceTo(playerPosition) < 7) {
      if (gordonAudio.paused) {
        playFromStart(gordonAudio)
      }

    }

    if (gordonHeard && !treeHeard && tree.position.distanceTo(playerPosition) < 8) {
      if (treeAudio.paused) {
        playFromStart(treeAudio)
      }
    }

    if (rrUnlocked && !hasCoffee && rr.shelly.getWorldPosition(new THREE.Vector3()).distanceTo(playerPosition) < 7) {
      hasCoffee = true
      setObjective()
    }
  }

  function updateCoffeeDeliveries(playerPosition: THREE.Vector3) {
    if (!hasCoffee || lost || won) return

    for (const character of options.getCharacters()) {
      if (
        REQUIRED_CHARACTER_IDS.includes(character.id) &&
        !deliveredCoffee.has(character.id) &&
        character.position.distanceTo(playerPosition) < 5.5
      ) {
        deliveredCoffee.add(character.id)
        hasCoffee = false

        if (deliveredCoffee.size === REQUIRED_CHARACTER_IDS.length) {
          ringTable.visible = true
        }

        setObjective()
        return
      }
    }
  }

  function updateRing(playerPosition: THREE.Vector3) {
    if (
      ringTable.visible &&
      !won &&
      ringTable.position.distanceTo(playerPosition) < 4
    ) {
      won = true
      setObjective()
    }
  }

  setObjective()

  return {
    markCharacterHeard,
    update(
      time: number,
      playerPosition: THREE.Vector3,
      delta: number
    ) {
      if (!lost && !won) {
        updateBob(delta, playerPosition)
        updateStoryAudio(playerPosition)
        updateCoffeeDeliveries(playerPosition)
        updateRing(playerPosition)

        ringTable.rotation.y = time * 0.6
      }
    }
  }
}
