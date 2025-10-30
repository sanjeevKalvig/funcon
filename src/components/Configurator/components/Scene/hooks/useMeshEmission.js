import { useContext, useEffect } from 'react'
import { appContext } from '../../../contexts/appContext'

function useMeshEmission(sceneClone) {
    const { hoveredGroup } = useContext(appContext)

 // Mesh Emission When hovering over material
    useEffect(() => {
      if (!sceneClone) return

      const highlightMap = {
        cushions: ['cushion1', 'cushion2', 'cushion3', 'cushion4'],
        backCushions: ['back_cushion1', 'back_cushion2', 'back_cushion3'],
        decorativeCushions: ['cushiondecor1', 'cushiondecor2'],
        armrest: ['left_armrest', 'right_armrest'],
        backSofa: ['back_sofa'],
      }

      sceneClone.traverse((child) => {
        if (!child.isMesh) return
        const groupKeys = Object.entries(highlightMap)
        const belongsTo = groupKeys.find(([_, names]) => names.includes(child.name))
        if (!belongsTo) return

        // Reset first
        child.material.emissive?.set(0x000000)

        // Apply glow if hovered
        if (belongsTo[0] === hoveredGroup) {
          child.material.emissive?.set(0x002288)
          child.material.emissiveIntensity = 0.6
        }
      })
    }, [hoveredGroup, sceneClone])

}

export default useMeshEmission