import { createContext, useState } from "react";

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

    return (
        <appContext.Provider value={{textures,setTextures,layout,setLayout,aaMode,setAaMode,interactiveMeshes, setInteractiveMeshes}}>
            {children}
        </appContext.Provider>
    )
}

export default AppContextProvider