import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()
const textureCache = {}

const texturePaths = [
  '/textures/Fabric0.jpg',
  '/textures/Fabric1.jpg',
  '/textures/Fabric2.jpg',
  '/textures/Fabric3.jpg',
  '/textures/Fabric4.jpg',
]

// ✅ Preload and return a Promise
export function preloadTextures() {
  return Promise.all(
    texturePaths.map(
      (path) =>
        new Promise((resolve, reject) => {
          if (textureCache[path]) {
            resolve(textureCache[path])
          } else {
            textureLoader.load(
              path,
              (tex) => {
                textureCache[path] = tex
                resolve(tex)
              },
              undefined,
              (err) => reject(err)
            )
          }
        })
    )
  )
}

export function getTexture(path) {
  return textureCache[path] || null
}
