import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const modelLoader = new GLTFLoader()
const modelCache = {}

export function preloadModel(path) {
  return new Promise((resolve, reject) => {
    if (modelCache[path]) {
      resolve(modelCache[path])
    } else {
      modelLoader.load(
        path,
        (gltf) => {
          modelCache[path] = gltf
          resolve(gltf)
        },
        undefined,
        (err) => reject(err)
      )
    }
  })
}

export function getModel(path) {
  return modelCache[path] || null
}