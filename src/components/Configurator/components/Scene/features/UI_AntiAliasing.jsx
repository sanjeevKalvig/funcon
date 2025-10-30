// import { useEffect, useRef } from "react"
import { useContext, useEffect, useRef } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Passes
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js"
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js"
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass.js"
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js"
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js"
import { appContext } from "../../../contexts/appContext"


export default function UI_AntiAliasing() {
    const { gl, scene, camera, size } = useThree()
    const composer = useRef()
    const { aaMode }=useContext(appContext)

    useEffect(() => {
        if (!gl || !scene || !camera) return

        let renderTarget = null
        let composerInstance = new EffectComposer(gl)


        // Always add a RenderPass first
        const renderPass = new RenderPass(scene, camera)
        composerInstance.addPass(renderPass)

        // Choose AA aaMode
        switch (aaMode) {
            case "FXAA": {
                const fxaaPass = new ShaderPass(FXAAShader)
                const pixelRatio = gl.getPixelRatio()
                fxaaPass.material.uniforms["resolution"].value.set(
                    1 / (size.width * pixelRatio),
                    1 / (size.height * pixelRatio)
                )
                composerInstance.addPass(fxaaPass)
                break
            }

            case "SMAA": {
                const smaaPass = new SMAAPass(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio())
                composerInstance.addPass(smaaPass)
                break
            }

            case "SSAA": {
                const ssaaPass = new SSAARenderPass(scene, camera)
                ssaaPass.unbiased = true
                ssaaPass.sampleLevel = 4 // 0–5; higher = smoother
                composerInstance.addPass(ssaaPass)
                break
            }

            case "TAA": {
                if (gl.capabilities.isWebGL2) {
                    const taaPass = new TAARenderPass(scene, camera)
                    taaPass.sampleLevel = 2 // tweak for smoothness/performance
                    composerInstance.addPass(taaPass)
                } else {
                    console.warn("TAA requires WebGL2 — falling back to SMAA")
                    const smaaPass = new SMAAPass(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio())
                    composerInstance.addPass(smaaPass)
                }
                break
            }


            default:
                break
        }

        // ✅ Add gamma correction pass here (fixes darkening)
        const gammaPass = new ShaderPass(GammaCorrectionShader)
        composerInstance.addPass(gammaPass)

        // Tone mapping and color space
        composerInstance.renderer.outputColorSpace = THREE.SRGBColorSpace
        composerInstance.renderer.toneMapping = THREE.ACESFilmicToneMapping
        composerInstance.renderer.toneMappingExposure = 1.0

        composer.current = composerInstance

        return () => {
            composerInstance.dispose()
            composer.current = null
            renderTarget?.dispose()
        }
    }, [aaMode, gl, scene, camera, size])

    // Handle resize
    useEffect(() => {
        if (!composer.current) return
        const pixelRatio = gl.getPixelRatio()
        composer.current.setSize(size.width, size.height)

        const fxaaPass = composer.current.passes.find(p => p.material?.uniforms?.resolution)
        if (fxaaPass) {
            fxaaPass.material.uniforms.resolution.value.set(
                1 / (size.width * pixelRatio),
                1 / (size.height * pixelRatio)
            )
        }
    }, [size, gl])

    // Render each frame
    useFrame(() => {
        if (aaMode === "None") gl.render(scene, camera)
        else composer.current?.render()
    }, 1)

    return null
}
