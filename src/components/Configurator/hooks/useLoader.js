import React, { useEffect, useState } from 'react'
import { preloadTextures } from '../components/Scene/utils/textureCache'
import { preloadModel } from '../components/Scene/utils/modelCache'

export function useLoader() {
    const [loading, setLoading] = useState(true)
    const [fadeOut, setFadeOut] = useState(false)
    const [showScene, setShowScene] = useState(false)

    useEffect(() => {
        async function loadAll() {
            try {
                // Preload all assets
                await Promise.all([
                    preloadTextures(),
                    preloadModel('/models/L_SHAPE_SOFA.obj'),
                ])

                // Trigger fade out
                setFadeOut(true)

                // Delay showing scene slightly (sync with fade)
                setTimeout(() => {
                    setShowScene(true)
                    setLoading(false)
                }, 800)
            } catch (err) {
                console.error('Preloading failed:', err)
                setLoading(false)
                setShowScene(true)
            }
        }

        loadAll()
    }, [])

    return { loading,fadeOut,showScene };

}
