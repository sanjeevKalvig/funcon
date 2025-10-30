import { createContext, useState } from "react";

export const appContext = createContext();


function AppContextProvider({ children }) {
    const [textures, setTextures] = useState({
        cushions: null,
        backCushions: null,
        decorativeCushions: null,
        armrest: null,
        backSofa: null,
    })

    const [layout, setLayout] = useState('left')
    const [hoveredGroup, setHoveredGroup] = useState(null);
    const [aaMode, setAaMode] = useState("None")

    return (
        <appContext.Provider value={{textures,setTextures,layout,setLayout,hoveredGroup,setHoveredGroup,aaMode,setAaMode}}>
            {children}
        </appContext.Provider>
    )
}

export default AppContextProvider