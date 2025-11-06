// import { useEffect, useMemo } from "react"
// import * as THREE from "three"
// import { Html } from "@react-three/drei"

// export default function MeasurementLabels({ scene, enabled }) {
//   const measurements = useMemo(() => {
//     if (!scene || !enabled) return []

//     const meshes = []
//     scene.traverse((child) => {
//       if (
//         child.isMesh &&
//         child.visible &&
//         (
//           // child.name === "pCube4" 
//           // ||
//            child.name === "pCube33"
//           //  || 
//           //  child.name === "pCube2"
//           )
//       ) {
//         meshes.push(child)
//       }
//     })

//     const box = new THREE.Box3()
//     const entries = []

//     meshes.forEach((mesh) => {
//       box.setFromObject(mesh)
//       const size = new THREE.Vector3()
//       const center = new THREE.Vector3()
//       box.getSize(size)
//       box.getCenter(center)

//       entries.push({ mesh, size, center, id: mesh.uuid })
//     })

//     return entries
//   }, [scene, enabled])

//   useEffect(() => {
//     if (!scene || !enabled) return
//     const group = new THREE.Group()
//     scene.add(group)

//     measurements.forEach(({ size, center }) => {
//       const boxMin = center.clone().sub(size.clone().multiplyScalar(0.5))
//       const boxMax = center.clone().add(size.clone().multiplyScalar(0.5))

//       // --- WIDTH (X-axis, Red) ---
//       const widthStart = new THREE.Vector3(boxMin.x, center.y, center.z)
//       const widthEnd = new THREE.Vector3(boxMax.x, center.y, center.z)
//       const widthDir = new THREE.Vector3(1, 0, 0)
//       const widthArrow1 = new THREE.ArrowHelper(widthDir, widthStart, size.x, 0xff4444, 3, 2)
//       const widthArrow2 = new THREE.ArrowHelper(widthDir.clone().negate(), widthEnd, size.x, 0xff4444, 3, 2)
//       group.add(widthArrow1, widthArrow2)


//       // --- HEIGHT (Y-axis, Green) ---
//       const heightStart = new THREE.Vector3(center.x, boxMin.y, center.z)
//       const heightEnd = new THREE.Vector3(center.x, boxMax.y, center.z)
//       const heightDir = new THREE.Vector3(0, 1, 0)
//       const heightArrow1 = new THREE.ArrowHelper(heightDir, heightStart, size.y, 0x44ff44, 3, 2)
//       const heightArrow2 = new THREE.ArrowHelper(heightDir.clone().negate(), heightEnd, size.y, 0x44ff44, 3, 2)
//       group.add(heightArrow1, heightArrow2)


//       // --- DEPTH (Z-axis, Blue) ---
//       const depthStart = new THREE.Vector3(center.x, center.y, boxMin.z)
//       const depthEnd = new THREE.Vector3(center.x, center.y, boxMax.z)
//       const depthDir = new THREE.Vector3(0, 0, 1)
//       const depthArrow1 = new THREE.ArrowHelper(depthDir, depthStart, size.z, 0x4444ff, 3, 2)
//       const depthArrow2 = new THREE.ArrowHelper(depthDir.clone().negate(), depthEnd, size.z, 0x4444ff, 3, 2)
//       group.add(depthArrow1, depthArrow2)

//     })

//     return () => {
//       scene.remove(group)
//       group.clear()
//     }
//   }, [scene, enabled, measurements])

//   // --- HTML Labels (always face camera & move with orbit) ---
//   if (!enabled) return null

//   return (

//     <>
//       {measurements.map(({ id, center, size }) => (
//         <group key={id}>
//           {/* WIDTH */}
//           <Html
//             transform
//             position={[center.x, center.y + size.y / 2 + 10, center.z]}
//             distanceFactor={100}
//             style={{
//               color: "red",
//               fontSize: "32px",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {`W: ${size.x.toFixed(1)} cm`}
//           </Html>

//           {/* HEIGHT */}
//           <Html
//             transform
//             position={[center.x + size.x / 2 + 10, center.y, center.z]}
//             distanceFactor={100}
//             style={{
//               color: "green",
//               fontSize: "32px",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {`H: ${size.y.toFixed(1)} cm`}
//           </Html>

//           {/* DEPTH */}
//           <Html
//             transform
//             position={[center.x, center.y, center.z + size.z / 2 + 10]}
//             distanceFactor={100}
//             style={{
//               color: "blue",
//               fontSize: "32px",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {`D: ${size.z.toFixed(1)} cm`}
//           </Html>
//         </group>
//       ))}
//     </>
//   )
// }
















// import { useEffect, useMemo } from "react"
// import * as THREE from "three"
// import { Html } from "@react-three/drei"

// export default function MeasurementLabels({ scene, enabled }) {
//   const measurements = useMemo(() => {
//     if (!scene || !enabled) return []

//     const meshes = []
//     scene.traverse((child) => {
//       if (
//         child.isMesh &&
//         child.visible &&
//         (
//           // child.name === "pCube4" 
//           // ||
//           child.name === "pCube33"
//           //  || 
//           //  child.name === "pCube2"
//         )
//       ) {
//         meshes.push(child)
//       }
//     })

//     const box = new THREE.Box3()
//     const entries = []

//     meshes.forEach((mesh) => {
//       box.setFromObject(mesh)
//       const size = new THREE.Vector3()
//       const center = new THREE.Vector3()
//       box.getSize(size)
//       box.getCenter(center)

//       entries.push({ mesh, size, center, id: mesh.uuid })
//     })

//     return entries
//   }, [scene, enabled])

//   useEffect(() => {
//     if (!scene || !enabled) return
//     const group = new THREE.Group()
//     scene.add(group)

//     measurements.forEach(({ size, center }) => {
//       const boxMin = center.clone().sub(size.clone().multiplyScalar(0.5))
//       const boxMax = center.clone().add(size.clone().multiplyScalar(0.5))

//       // --- WIDTH (X-axis, Red) ---
//       const widthStart = new THREE.Vector3(boxMin.x, center.y, center.z)
//       const widthEnd = new THREE.Vector3(boxMax.x, center.y, center.z)
//       group.add(createArrow(widthStart, widthEnd, 0xff4444, 0.7))
//       group.add(createArrow(widthEnd, widthStart, 0xff4444, 0.7))

//       // --- HEIGHT (Y-axis, Green) ---
//       const heightStart = new THREE.Vector3(center.x, boxMin.y, center.z)
//       const heightEnd = new THREE.Vector3(center.x, boxMax.y, center.z)
//       group.add(createArrow(heightStart, heightEnd, 0x44ff44, 0.3))
//       group.add(createArrow(heightEnd, heightStart, 0x44ff44, 0.3))

//       // --- DEPTH (Z-axis, Blue) ---
//       const depthStart = new THREE.Vector3(center.x, center.y, boxMin.z)
//       const depthEnd = new THREE.Vector3(center.x, center.y, boxMax.z)
//       group.add(createArrow(depthStart, depthEnd, 0x4444ff, 0.3))
//       group.add(createArrow(depthEnd, depthStart, 0x4444ff, 0.3))
//     })

//     return () => {
//       scene.remove(group)
//       group.clear()
//     }
//   }, [scene, enabled, measurements])

//   // --- HTML Labels (always face camera & move with orbit) ---
//   if (!enabled) return null

//   return (

//     <>
//       {measurements.map(({ id, center, size }) => (
//         <group key={id}>
//           {/* WIDTH */}
//           <Html
//             transform
//             position={[center.x, center.y + size.y / 2 + 10, center.z]}
//             distanceFactor={100}
//             style={{
//               color: "red",
//               fontSize: "32px",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {`W: ${size.x.toFixed(1)} cm`}
//           </Html>

//           {/* HEIGHT */}
//           <Html
//             transform
//             position={[center.x + size.x / 2 + 10, center.y, center.z]}
//             distanceFactor={100}
//             style={{
//               color: "green",
//               fontSize: "32px",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {`H: ${size.y.toFixed(1)} cm`}
//           </Html>

//           {/* DEPTH */}
//           <Html
//             transform
//             position={[center.x, center.y, center.z + size.z / 2 + 10]}
//             distanceFactor={100}
//             style={{
//               color: "blue",
//               fontSize: "32px",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {`D: ${size.z.toFixed(1)} cm`}
//           </Html>
//         </group>
//       ))}
//     </>
//   )
// }

// function createArrow(start, end, color = 0xff0000, radius = 0.5) {
//   const dir = new THREE.Vector3().subVectors(end, start);
//   const length = dir.length();
//   const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

//   // Normalize direction
//   const arrowDir = dir.clone().normalize();

//   // Cylinder (shaft)
//   const shaftGeometry = new THREE.CylinderGeometry(radius, radius, length - 6, 12);
//   const shaftMaterial = new THREE.MeshBasicMaterial({ color });
//   const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

//   // Arrowhead (cone)
//   const headGeometry = new THREE.ConeGeometry(radius * 3, 6, 12);
//   const headMaterial = new THREE.MeshBasicMaterial({ color });
//   const head = new THREE.Mesh(headGeometry, headMaterial);


//   // Group together
//   const arrowGroup = new THREE.Group();
//   arrowGroup.add(shaft, head);

//   // Orient along direction
//   const axis = new THREE.Vector3(0, 1, 0);
//   shaft.quaternion.setFromUnitVectors(axis, arrowDir);
//   head.quaternion.copy(shaft.quaternion);

//   // Position them
//   shaft.position.copy(mid);
//   head.position.copy(end);

//   return arrowGroup;
// }













import { useEffect, useMemo } from "react"
import * as THREE from "three"
import { Html } from "@react-three/drei"
import { measurementConfig } from "../config/measurementConfig"

export default function MeasurementLabels({ scene, enabled }) {
  const measurements = useMemo(() => {
    if (!scene || !enabled) return []

    const meshes = []
    scene.traverse((child) => {
      if (child.isMesh && child.visible && measurementConfig[child.name]) {
        meshes.push(child)
      }
    })

    const box = new THREE.Box3()
    const entries = []

    meshes.forEach((mesh) => {
      box.setFromObject(mesh)
      const size = new THREE.Vector3()
      const center = new THREE.Vector3()
      box.getSize(size)
      box.getCenter(center)

      const config = measurementConfig[mesh.name]
      entries.push({ mesh, size, center, id: mesh.uuid, config })
    })

    return entries
  }, [scene, enabled])


  useEffect(() => {
    if (!scene || !enabled) return
    const group = new THREE.Group()
    scene.add(group)

    measurements.forEach(({ size, center, config }) => {
      const { offset = {}, show = [], gap = {} } = config
      const boxMin = center.clone().sub(size.clone().multiplyScalar(0.5))
      const boxMax = center.clone().add(size.clone().multiplyScalar(0.5))

      // === WIDTH ===
      if (show.includes("width")) {
        const o = offset.width || { x: 0, y: 0, z: 0 }
        const g = gap.width ?? 15
        const offsetVec = new THREE.Vector3(o.x, o.y, o.z)

        if (g > 0) {
          // Split into two arrows with gap
          const widthStartLeft = new THREE.Vector3(boxMin.x, center.y, center.z).add(offsetVec)
          const widthEndLeft = new THREE.Vector3(center.x - g / 2, center.y, center.z).add(offsetVec)
          const widthStartRight = new THREE.Vector3(center.x + g / 2, center.y, center.z).add(offsetVec)
          const widthEndRight = new THREE.Vector3(boxMax.x, center.y, center.z).add(offsetVec)
          group.add(createArrow(widthStartLeft, widthEndLeft, 0x000000, 0.7))
          group.add(createArrow(widthEndRight, widthStartRight, 0x000000, 0.7))
        } else {
          // Continuous line
          const start = new THREE.Vector3(boxMin.x, center.y, center.z).add(offsetVec)
          const end = new THREE.Vector3(boxMax.x, center.y, center.z).add(offsetVec)
          group.add(createArrow(start, end, 0x000000, 0.7))
        }
      }

      // === HEIGHT ===
      if (show.includes("height")) {
        const o = offset.height || { x: 0, y: 0, z: 0 }
        const g = gap.height ?? 15
        const offsetVec = new THREE.Vector3(o.x, o.y, o.z)

        if (g > 0) {
          const heightStartBottom = new THREE.Vector3(center.x, boxMin.y, center.z).add(offsetVec)
          const heightEndBottom = new THREE.Vector3(center.x, center.y - g / 2, center.z).add(offsetVec)
          const heightStartTop = new THREE.Vector3(center.x, center.y + g / 2, center.z).add(offsetVec)
          const heightEndTop = new THREE.Vector3(center.x, boxMax.y, center.z).add(offsetVec)
          group.add(createArrow(heightStartBottom, heightEndBottom, 0x000000, 0.8))
          group.add(createArrow(heightEndTop, heightStartTop, 0x000000, 0.8))
        } else {
          const start = new THREE.Vector3(center.x, boxMin.y, center.z).add(offsetVec)
          const end = new THREE.Vector3(center.x, boxMax.y, center.z).add(offsetVec)
          group.add(createArrow(start, end, 0x000000, 0.8))
        }
      }

      // === DEPTH ===
      if (show.includes("depth")) {
        const o = offset.depth || { x: 0, y: 0, z: 0 }
        const g = gap.depth ?? 15
        const offsetVec = new THREE.Vector3(o.x, o.y, o.z)

        if (g > 0) {
          const depthStartFront = new THREE.Vector3(center.x, center.y, boxMin.z).add(offsetVec)
          const depthEndFront = new THREE.Vector3(center.x, center.y, center.z - g / 2).add(offsetVec)
          const depthStartBack = new THREE.Vector3(center.x, center.y, center.z + g / 2).add(offsetVec)
          const depthEndBack = new THREE.Vector3(center.x, center.y, boxMax.z).add(offsetVec)
          group.add(createArrow(depthStartFront, depthEndFront, 0x000000, 0.6))
          group.add(createArrow(depthEndBack, depthStartBack, 0x000000, 0.6))
        } else {
          const start = new THREE.Vector3(center.x, center.y, boxMin.z).add(offsetVec)
          const end = new THREE.Vector3(center.x, center.y, boxMax.z).add(offsetVec)
          group.add(createArrow(start, end, 0x000000, 0.6))
        }
      }
    })

    return () => {
      scene.remove(group)
      group.clear()
    }
  }, [scene, enabled, measurements])


  if (!enabled) return null

  return (
    <>
      {measurements.map(({ id, center, size, config }) => {
        const { offset = {}, show = [], extraOffsetLabel = {} } = config
        const totalOffset = {
          width: {
            x: (offset.width?.x ?? 0) + (extraOffsetLabel.width?.x ?? 0),
            y: (offset.width?.y ?? 0) + (extraOffsetLabel.width?.y ?? 0),
            z: (offset.width?.z ?? 0) + (extraOffsetLabel.width?.z ?? 0),
          },
          height: {
            x: (offset.height?.x ?? 0) + (extraOffsetLabel.height?.x ?? 0),
            y: (offset.height?.y ?? 0) + (extraOffsetLabel.height?.y ?? 0),
            z: (offset.height?.z ?? 0) + (extraOffsetLabel.height?.z ?? 0),
          },
          depth: {
            x: (offset.depth?.x ?? 0) + (extraOffsetLabel.depth?.x ?? 0),
            y: (offset.depth?.y ?? 0) + (extraOffsetLabel.depth?.y ?? 0),
            z: (offset.depth?.z ?? 0) + (extraOffsetLabel.depth?.z ?? 0),
          },
        }

        
        return (
          <group key={id}>
            {show.includes("width") && (
              <Html
                transform
                position={[ (totalOffset.width?.x || 0) + center.x, (totalOffset.width?.y || 0) + center.y , center.z + (totalOffset.width?.z || 0)]}
                // distanceFactor={90}
                style={{
                  color: "black",
                  fontSize: "152px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {`${size.x.toFixed(1)} cm`}
              </Html>
            )}

            {show.includes("height") && (
              <Html
                transform
                position={[center.x + (totalOffset.height?.x || 0), center.y + (totalOffset.height?.y || 0) , center.z + (totalOffset.height?.z || 0)]}
                // distanceFactor={30}
                style={{
                  color: "black",
                  fontSize: "152px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {`${size.y.toFixed(1)} cm`}
              </Html>
            )}

            {show.includes("depth") && (
              <Html
                transform
                position={[center.x + (totalOffset.depth?.x || 0), center.y + (totalOffset.depth?.y || 0), center.z + (totalOffset.depth?.z || 0)]}
                rotation={[0, Math.PI / 2, 0]}
                // distanceFactor={30}
                style={{
                  color: "black",
                  fontSize: "152px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {`${size.z.toFixed(1)} cm`}
              </Html>
            )}
          </group>
        )
      })}
    </>
  )
}

function createArrow(start, end, color = 0xff0000, radius = 0.5) {
  const dir = new THREE.Vector3().subVectors(end, start)
  const length = dir.length()
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

  const arrowDir = dir.clone().normalize()
  const shaftGeometry = new THREE.CylinderGeometry(radius, radius, length - 2, 12)
  const shaftMaterial = new THREE.MeshBasicMaterial({ color })
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial)

  const arrowGroup = new THREE.Group()
  arrowGroup.add(shaft)

  const axis = new THREE.Vector3(0, 1, 0)
  shaft.quaternion.setFromUnitVectors(axis, arrowDir)
  shaft.position.copy(mid)

  return arrowGroup
}
