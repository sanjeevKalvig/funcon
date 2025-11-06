import React, { useRef } from "react"
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import Lights from './features/Lights'
import { Model } from './features/Model'
// import UI_AntiAliasing from './features/UI_AntiAliasing'
// import Zoom_AntiAliasing from './features/Zoom_AntiAliasing'
import CameraMove_AntiAliasing from './features/CameraMove_AntiAliasing'

export default function Scene() {
  const modelRef = useRef()
  const controlsRef = useRef()
  return (
    <Canvas
      shadows
      gl={{
        antialias: false,
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ background: 'linear-gradient(to bottom, #dcdcdc, #f5f5f5)' }}
    >
      <PerspectiveCamera makeDefault position={[-190.0, 20.9, 380.0]} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        // minDistance={100}
        maxDistance={500}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />

      <Lights />
      <Model ref={modelRef} />
      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={10} blur={2.5} />
      {/* <UI_AntiAliasing /> */}
      {/* <Zoom_AntiAliasing modelRef={modelRef}/> */}
      <CameraMove_AntiAliasing modelRef={modelRef} controlsRef={controlsRef} />
    </Canvas>
  )
}