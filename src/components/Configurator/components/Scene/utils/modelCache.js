import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

const modelLoader = new OBJLoader()
const modelCache = {}

export function preloadModel(path) {
  return new Promise((resolve, reject) => {
    if (modelCache[path]) {
      resolve(modelCache[path])
    } else {
      modelLoader.load(
        path,
        (obj) => {
          modelCache[path] = obj
          resolve(obj)
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
