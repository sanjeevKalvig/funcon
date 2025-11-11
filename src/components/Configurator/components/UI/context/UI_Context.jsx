import { createContext, useContext, useState } from "react";
import { appContext } from "../../../contexts/appContext";

export const uiContext = createContext();

function UI_ContextProvider({ children }) {
    const [legs, setLegs] = useState("taper");
    const [lighting, setLighting] = useState("studio");
    const { setLayout, setShowMeasurements, setMaterial,swatches } = useContext(appContext)

    const handleResetAll = () => {
        setMaterial(1);
        setLayout("left");
        setShowMeasurements(false);
        setLighting("studio");
        setLegs("taper");
    };

    const handleRandomize = () => {
        setMaterial(Math.floor(Math.random() * swatches.length));
        const seatOps = ["left", "right"];
        setLayout(seatOps[Math.floor(Math.random() * seatOps.length)]);
        setShowMeasurements(false);
        const lightOps = ["studio", "day", "night"];
        setLighting(lightOps[Math.floor(Math.random() * lightOps.length)]);
        const legOps = ["taper", "flat", "sled", "pin"];
        setLegs(legOps[Math.floor(Math.random() * legOps.length)]);
    };

    const handlePrev = () => setMaterial((m) => (m - 1 + swatches.length) % swatches.length);
    const handleCenter = () => setLighting((l) => (l === "studio" ? "day" : "studio"));

    return (
        <uiContext.Provider value={
            {
                legs,
                setLegs,
                lighting,
                setLighting,
                handleResetAll,
                handleRandomize,
                handlePrev,
                handleCenter
            }
        }>
            {children}
        </uiContext.Provider>
    )
}

export default UI_ContextProvider