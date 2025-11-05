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
                const name = child.name
                // 🟨 Back Cushions
                if (['polySurface3 polySurface1 polySurface31', 'polySurface33 polySurface3 polySurface1', 'polySurface3 polySurface1 polySurface36'].includes(name) && textures.backCushions)
                    applyTextureSmoothly(child, getTexture(textures.backCushions));
    
                // 🟧 Decorative Cushions
                else if (['polySurface26 mx:Plane008 polySurface28', 'mx:Plane008 polySurface24','mx:Plane008 polySurface25','pasted__polySurface27 pasted__polySurface26 mx3:Plane008 group1'].includes(name) && textures.seatCushions)
                    applyTextureSmoothly(child, getTexture(textures.seatCushions));
    
                // 🟦 Armrests
                else if (['pCube2', 'pCube33'].includes(name) && textures.armrest)
                    applyTextureSmoothly(child, getTexture(textures.armrest));
    
                // 🟥 Back Sofa
                else if (['pCube4'].includes(name) && textures.backFrame)
                    applyTextureSmoothly(child, getTexture(textures.backFrame));
    
            })
        }, [textures, sceneClone])

}

export default useTextureUpdate