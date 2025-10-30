import { useEffect, useMemo } from 'react'
import React, { forwardRef } from "react"
import { getModel } from '../utils/modelCache'
import useLayoutUpdate from '../hooks/useLayoutUpdate'
import useTextureUpdate from '../hooks/useTextureUpdate'
import useMeshEmission from '../hooks/useMeshEmission'


export const Model = forwardRef(({ }, ref) => {

    const cachedModel = getModel('/models/sofa.glb')

    const sceneClone = useMemo(() => {
        if (!cachedModel?.scene) return null
        return cachedModel.scene.clone(true)
    }, [cachedModel])

    // Clone materials once
    useEffect(() => {
        if (!sceneClone) return
        sceneClone.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone()
            }
        })
    }, [sceneClone])

    useLayoutUpdate(sceneClone)
    useTextureUpdate(sceneClone)
    useMeshEmission(sceneClone)

    return sceneClone ? (
        <primitive ref={ref} object={sceneClone} scale={1.2} position={[0, -0.9, 0]} />
    ) : null
})