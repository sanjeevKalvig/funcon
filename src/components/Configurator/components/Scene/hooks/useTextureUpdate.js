import  { useContext, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { appContext } from '../../../contexts/appContext'
import { getTexture } from '../utils/textureCache'


function useTextureUpdate(sceneClone) {
    const { textures } = useContext(appContext)
 
        // Apply textures dynamically but smotthly
        useEffect(() => {
            if (!sceneClone) return
    
            const applyTextureSmoothly = (mesh, newTexture) => {
                if (!newTexture) return
    
                const mat = mesh.material
    
                // If no texture yet → apply instantly
                if (!mat.map) {
                    mat.map = newTexture
                    mat.needsUpdate = true
                    return
                }
    
                // Keep reference to old texture
                const oldTexture = mat.map
                const newMap = newTexture
    
                // Create a blend uniform using mix of both
                const oldOpacity = { value: 1 }
    
                // Fade out old texture
                gsap.to(oldOpacity, {
                    value: 0,
                    duration: 0.6,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        const mixCanvas = document.createElement('canvas')
                        const ctx = mixCanvas.getContext('2d')
                        const size = 512
                        mixCanvas.width = size
                        mixCanvas.height = size
    
                        // Draw both textures blended based on opacity
                        const oldImg = oldTexture.image
                        const newImg = newMap.image
    
                        if (oldImg && newImg) {
                            ctx.globalAlpha = oldOpacity.value
                            ctx.drawImage(oldImg, 0, 0, size, size)
                            ctx.globalAlpha = 1 - oldOpacity.value
                            ctx.drawImage(newImg, 0, 0, size, size)
    
                            const blendedTex = new THREE.CanvasTexture(mixCanvas)
                            mat.map = blendedTex
                            mat.needsUpdate = true
                        }
                    },
                    onComplete: () => {
                        mat.map = newMap
                        mat.needsUpdate = true
                    },
                })
            }
    
            sceneClone.traverse((child) => {
                if (!child.isMesh) return
                const name = child.name.toLowerCase()
    
                // 🟩 Cushion Group
                if (['cushion1', 'cushion2', 'cushion3', 'cushion4'].includes(name) && textures.cushions)
                    applyTextureSmoothly(child, getTexture(textures.cushions));
    
                // 🟨 Back Cushions
                else if (['back_cushion1', 'back_cushion2', 'back_cushion3'].includes(name) && textures.backCushions)
                    applyTextureSmoothly(child, getTexture(textures.backCushions));
    
                // 🟧 Decorative Cushions
                else if (['cushiondecor1', 'cushiondecor2'].includes(name) && textures.decorativeCushions)
                    applyTextureSmoothly(child, getTexture(textures.decorativeCushions));
    
                // 🟦 Armrests
                else if (['left_armrest', 'right_armrest'].includes(name) && textures.armrest)
                    applyTextureSmoothly(child, getTexture(textures.armrest));
    
                // 🟥 Back Sofa
                else if (['back_sofa'].includes(name) && textures.backSofa)
                    applyTextureSmoothly(child, getTexture(textures.backSofa));
    
            })
        }, [textures, sceneClone])

}

export default useTextureUpdate