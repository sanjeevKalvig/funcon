import React, { useEffect, useState } from 'react'
import { preloadTextures } from '../components/Scene/utils/textureCache'
import { preloadModel } from '../components/Scene/utils/modelCache'

export function useLoader() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadAll() {
            try {
                // Preload all assets
                await Promise.all([
                    preloadTextures(),
                    preloadModel('/models/L_SHAPE_SOFA.obj'),
                ])


                // Delay showing scene slightly (sync with fade)
                setTimeout(() => {
                    setLoading(false)
                }, 800)
            } catch (err) {
                console.error('Preloading failed:', err)
                setLoading(false)
            }
        }

        loadAll()
    }, [])

    return { loading };

}
