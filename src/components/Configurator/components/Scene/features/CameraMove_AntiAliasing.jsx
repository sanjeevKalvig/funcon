import { useEffect, useRef, useState } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js"
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js"
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js"
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js"

export default function AntiAliasing({ modelRef, controlsRef }) {
    const { gl, scene, camera, size } = useThree()
    const composer = useRef()
    const [mode, setMode] = useState("TAA")

    const lastCamPos = useRef(new THREE.Vector3())
    const lastCamTarget = useRef(new THREE.Vector3())
    const stillTimeout = useRef(null)

    useEffect(() => {
        if (!gl || !scene || !camera) return

        const composerInstance = new EffectComposer(gl)
        composerInstance.addPass(new RenderPass(scene, camera))

          // --- Ambient Occlusion Pass ---
          const ssaoPass = new SSAOPass(scene, camera, size.width, size.height)
          ssaoPass.kernelRadius = 32 // overall AO strength
          ssaoPass.minDistance = 0.005
          ssaoPass.maxDistance = 0.5
          ssaoPass.output = 0.5 // 0 = apply AO directly, 1 = visualize AO only
        //   composerInstance.addPass(ssaoPass)

           // --- Anti-aliasing Pass ---
        let aaPass
        if (mode === "FXAA") {
            aaPass = new ShaderPass(FXAAShader)
            const pixelRatio = gl.getPixelRatio()
            aaPass.material.uniforms["resolution"].value.set(
                1 / (size.width * pixelRatio),
                1 / (size.height * pixelRatio)
            )
        } else if (mode === "TAA") {
            aaPass = new TAARenderPass(scene, camera)
            aaPass.sampleLevel = 2
        }

        if (aaPass) composerInstance.addPass(aaPass)

        const gammaPass = new ShaderPass(GammaCorrectionShader)
        composerInstance.addPass(gammaPass)

        composerInstance.renderer.outputColorSpace = THREE.SRGBColorSpace
        composerInstance.renderer.toneMapping = THREE.ACESFilmicToneMapping
        composerInstance.renderer.toneMappingExposure = 1.0

        composer.current = composerInstance

        return () => {
            composerInstance.dispose()
            composer.current = null
        }
    }, [mode, gl, scene, camera, size])

     // Handle resize for SSAO
     useEffect(() => {
        if (composer.current) {
            composer.current.setSize(size.width, size.height)
        }
    }, [size])

    // Detect camera movement
    useFrame(() => {
        if (!controlsRef?.current) return

        const camMoved =
            camera.position.distanceTo(lastCamPos.current) > 0.0005 ||
            controlsRef.current.target.distanceTo(lastCamTarget.current) > 0.0005

        if (camMoved) {
            if (mode !== "FXAA") setMode("FXAA")

            clearTimeout(stillTimeout.current)
            stillTimeout.current = setTimeout(() => {
                setMode("TAA")
            }, 400) // ✅ Faster recovery (400ms)

            // Save the new camera state for next frame
            lastCamPos.current.copy(camera.position)
            lastCamTarget.current.copy(controlsRef.current.target)
        }

        if (mode === "None") gl.render(scene, camera)
        else composer.current?.render()
    }, 1)


    return null
}
