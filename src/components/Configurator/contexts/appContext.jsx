import { createContext, useContext, useEffect, useState } from "react";

export const appContext = createContext();


function AppContextProvider({ children }) {
    const [textures, setTextures] = useState({
        backCushions: null,
        seatCushions: null,
        armrest: null,
        backSofa: null,
      });

    const [layout, setLayout] = useState('left')
    const [aaMode, setAaMode] = useState("None")
    const [interactiveMeshes, setInteractiveMeshes] = useState([]);
    const [showMeasurements, setShowMeasurements] = useState(false);

    return (
        <appContext.Provider value={{textures,setTextures,layout,setLayout,aaMode,setAaMode,interactiveMeshes, setInteractiveMeshes,showMeasurements, setShowMeasurements}}>
            {children}
        </appContext.Provider>
    )
}

export default AppContextProvider