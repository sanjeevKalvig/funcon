import { createContext, useState } from "react";

export const sideBarContext = createContext();

function SideBarContextProvider({ children }) {
    const [openCategory, setOpenCategory] = useState('material') // 'material' or 'interaction' or null

    return (
        <sideBarContext.Provider value={{openCategory, setOpenCategory}}>
            {children}
        </sideBarContext.Provider>
    )
}

export default SideBarContextProvider