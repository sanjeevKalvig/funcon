// We have 2 gsap animation to change the layout

import { useContext, useEffect } from 'react'
import { appContext } from '../../../contexts/appContext'
import gsap from 'gsap'

function useLayoutUpdate(sceneClone) {
    const { layout } = useContext(appContext)

    // 1. Animate layout transition smoothly (with position change only)
    useEffect(() => {
        if (!sceneClone) return

        const cushion4 = sceneClone.getObjectByName('cushion4')
        const base3 = sceneClone.getObjectByName('sofa_base3')
        if (!cushion4 || !base3) return

        const leftPositions = {
            cushion4: { z: -1.425 },
            base3: { z: -0.925 },
        }

        const rightPositions = {
            cushion4: { z: 0.5 },
            base3: { z: 1 },
        }

        const target = layout === 'left' ? leftPositions : rightPositions

        gsap.to(cushion4.position, {
            z: target.cushion4.z,
            duration: 1,
            ease: 'power2.inOut',
        })

        gsap.to(base3.position, {
            z: target.base3.z,
            duration: 1,
            ease: 'power2.inOut',
        })
    }, [layout, sceneClone])

    // 2. Animate layout transition smoothly (with bounce & rotation)
    // useEffect(() => {
    //   if (!sceneClone) return

    //   const cushion4 = sceneClone.getObjectByName('cushion4')
    //   const base3 = sceneClone.getObjectByName('sofa_base3')
    //   if (!cushion4 || !base3) return

    //   const left = {
    //     cushion4: { z: -1.425, rotationY: 0.03 },
    //     base3: { z: -0.925, rotationY: 0.03 },
    //   }

    //   const right = {
    //     cushion4: { z: 0.5, rotationY: -0.03 },
    //     base3: { z: 1, rotationY: -0.03 },
    //   }

    //   const target = layout === 'left' ? left : right

    //   // Animate both position + rotation with bounce effect
    //   gsap.to(cushion4.position, {
    //     z: target.cushion4.z,
    //     duration: 1.2,
    //     ease: 'elastic.out(1, 0.6)',
    //   })
    //   gsap.to(cushion4.rotation, {
    //     y: target.cushion4.rotationY,
    //     duration: 1.2,
    //     ease: 'power2.inOut',
    //   })

    //   gsap.to(base3.position, {
    //     z: target.base3.z,
    //     duration: 1.2,
    //     ease: 'elastic.out(1, 0.6)',
    //   })
    //   gsap.to(base3.rotation, {
    //     y: target.base3.rotationY,
    //     duration: 1.2,
    //     ease: 'power2.inOut',
    //   })
    // }, [layout, sceneClone])

}

export default useLayoutUpdate