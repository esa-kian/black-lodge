import * as THREE from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'

export function createPostProcessing(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
) {
    const composer = new EffectComposer(renderer)

    const renderPass = new RenderPass(scene, camera)

    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        ),
        0.4,
        0.8,
        0.2
    )

    composer.addPass(bloomPass)

    const filmPass = new FilmPass(
        0.35,
        false)

    composer.addPass(filmPass)

    return composer
}
