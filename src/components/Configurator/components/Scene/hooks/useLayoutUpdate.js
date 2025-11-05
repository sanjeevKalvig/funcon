import { useContext, useEffect, useRef } from "react"
import { appContext } from "../../../contexts/appContext"
import gsap from "gsap"

function useLayoutUpdate(sceneClone) {
    const { layout } = useContext(appContext)
    const hasMounted = useRef(false)

    useEffect(() => {
        if (!sceneClone) return

        // Skip the first render
        if (!hasMounted.current) {
            hasMounted.current = true
            return
        }

        const sleeperSection = [
            "mx:Plane008 polySurface25",
            "pCube37",
            "pCylinder7",
            "pCylinder5",
            "pCylinder8",
            "pCylinder6",
            "polySurface3 polySurface1 polySurface36",
        ]

        const consoleSection = [
            "polySurface26 mx:Plane008 polySurface28",
            "polySurface27 polySurface26 mx:Plane008",
            "polySurface27 polySurface26 mx:Plane008 pasted__polySurface29",
            "pasted__polySurface27 pasted__polySurface26 mx3:Plane008 group1",
            "polySurface29",
            "pCube34",
            "pCylinder11",
            "pCylinder12",
            "pCylinder9",
            "pCylinder10",
            "polySurface3 polySurface1 polySurface31",
            "pCube51",
            "pCube49",
            "pCube50",
            "pCube52",
            "pCube53",
            "pCube54",
            "pCube56",
            "pCube55",
            "pCube63",
            "pCube66",
        ]

        // Helper: get valid meshes by name (support duplicates)
        const getMeshes = (names) => {
            const found = []
            sceneClone.traverse((child) => {
                if (child.isMesh && names.includes(child.name)) {
                    found.push(child)
                }
            })
            return found
        }

        const sleeperMeshes = getMeshes(sleeperSection)
        const consoleMeshes = getMeshes(consoleSection)
        const hiddenMesh = sceneClone.getObjectByName("pCube4");


        if (sleeperMeshes.length === 0 && consoleMeshes.length === 0) return

        const offset = 187

        // Create timelines
        const tlSleeper = gsap.timeline()
        const tlConsole = gsap.timeline()
        // 🔹 Hide and show mesh during animation
        if (hiddenMesh) {
            tlSleeper.eventCallback("onStart", () => {
                hiddenMesh.visible = false
            })
            tlSleeper.eventCallback("onComplete", () => {
                hiddenMesh.visible = true
            })
        }

        // Define animations based on layout
        if (layout === "left") {
            // SLEEPER: front → right → back (final)
            tlSleeper
                .to(sleeperMeshes.map((m) => m.position), {
                    x: -offset,
                    z: -100,
                    duration: 0.4,
                    ease: "power2.inOut",
                })
                .to(sleeperMeshes.map((m) => m.position), {
                    x: 0,
                    z: -100,
                    duration: 0.5,
                    ease: "power2.inOut",
                })
                .to(sleeperMeshes.map((m) => m.position), {
                    x: 0,
                    z: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                })

            // CONSOLE: back → left → front (final)
            tlConsole
                .to(consoleMeshes.map((m) => m.position), {
                    x: offset,
                    z: 100,
                    duration: 0.4,
                    ease: "power2.inOut",
                })
                .to(consoleMeshes.map((m) => m.position), {
                    x: 0,
                    z: 100,
                    duration: 0.5,
                    ease: "power2.inOut",
                })
                .to(consoleMeshes.map((m) => m.position), {
                    x: 0,
                    z: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                })
        } else if (layout === "right") {
            // Reverse order when layout is right
            tlSleeper
                .to(sleeperMeshes.map((m) => m.position), {
                    z: 100,
                    duration: 0.4,
                    ease: "power2.inOut",
                })
                .to(sleeperMeshes.map((m) => m.position), {
                    x: -offset,
                    z: 100,
                    duration: 0.5,
                    ease: "power2.inOut",
                })
                .to(sleeperMeshes.map((m) => m.position), {
                    x: -offset,
                    z: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                })

            tlConsole
                .to(consoleMeshes.map((m) => m.position), {
                    z: -100,
                    duration: 0.4,
                    ease: "power2.inOut",
                })
                .to(consoleMeshes.map((m) => m.position), {
                    x: offset,
                    z: -100,
                    duration: 0.5,
                    ease: "power2.inOut",
                })
                .to(consoleMeshes.map((m) => m.position), {
                    x: offset,
                    z: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                })
        }
    }, [layout, sceneClone])
}

export default useLayoutUpdate