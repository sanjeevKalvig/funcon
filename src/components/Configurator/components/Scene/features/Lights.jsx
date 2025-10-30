import React from 'react'

function Lights() {
    return (
        <>
            {/* Global soft light */}
            <ambientLight intensity={0.5} />

            {/* Main front-right key light */}
            <directionalLight
                position={[4, 6, 5]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            {/* Back-left fill light (brings up the dark side) */}
            <directionalLight
                position={[-5, 3, -4]}
                intensity={0.8}
            />

            {/* Overhead top light for even exposure */}
            <directionalLight
                position={[0, 8, 0]}
                intensity={0.6}
            />

            {/* Subtle environment tint */}
            <hemisphereLight
                skyColor={'#ffffff'}
                groundColor={'#b0b0b0'}
                intensity={0.6}
            />

        </>
    )
}

export default Lights