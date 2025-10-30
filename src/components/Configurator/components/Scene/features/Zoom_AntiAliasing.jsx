import { useEffect, useRef, useState } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js"
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js"
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js"
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js"

export default function Zoom_AntiAliasing({ modelRef, zoomThreshold = 5 }) {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef()
  const currentMode = useRef("FXAA") // start with FXAA
  const [activePass, setActivePass] = useState("FXAA")

  const createComposer = (mode) => {
    const composerInstance = new EffectComposer(gl)
    const renderPass = new RenderPass(scene, camera)
    composerInstance.addPass(renderPass)

    switch (mode) {
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

      case "TAA": {
        if (gl.capabilities.isWebGL2) {
          const taaPass = new TAARenderPass(scene, camera)
          taaPass.sampleLevel = 2
          taaPass.unbiased = true
          composerInstance.addPass(taaPass)
        } else {
          console.warn("TAA requires WebGL2 — falling back to SMAA")
          const smaaPass = new SMAAPass(size.width, size.height)
          composerInstance.addPass(smaaPass)
        }
        break
      }

      default:
        break
    }

    // Gamma correction at the end
    const gammaPass = new ShaderPass(GammaCorrectionShader)
    composerInstance.addPass(gammaPass)

    composerInstance.renderer.outputColorSpace = THREE.SRGBColorSpace
    composerInstance.renderer.toneMapping = THREE.ACESFilmicToneMapping
    composerInstance.renderer.toneMappingExposure = 1.0

    return composerInstance
  }

  // Initialize with FXAA
  useEffect(() => {
    composer.current = createComposer("FXAA")
    setActivePass("FXAA")

    return () => composer.current?.dispose()
  }, [gl, scene, camera, size])

  // Handle window resize (update FXAA resolution)
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

  // Frame loop: check distance & switch AA dynamically
  useFrame(() => {
    if (!modelRef?.current || !composer.current) return

    const modelPosition = new THREE.Vector3()
    modelRef.current.getWorldPosition(modelPosition)

    const distance = camera.position.distanceTo(modelPosition)
    const threshold = zoomThreshold

    // Switch modes when crossing threshold (with small buffer to prevent flickering)
    if (distance < threshold && currentMode.current !== "TAA") {
      console.log("Switching to TAA (close-up)")
      currentMode.current = "TAA"
      composer.current = createComposer("TAA")
      setActivePass("TAA")
    } else if (distance > threshold + 1 && currentMode.current !== "FXAA") {
      console.log("Switching to FXAA (zoomed out)")
      currentMode.current = "FXAA"
      composer.current = createComposer("FXAA")
      setActivePass("FXAA")
    }

    composer.current.render()
  }, 1)

  return null
}
