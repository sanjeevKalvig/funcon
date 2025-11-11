import { createContext, useState } from "react";

export const appContext = createContext();


function AppContextProvider({ children }) {
    const [material, setMaterial] = useState(1);
    const swatches = [
        '/textures/Fabric0.jpg',
        '/textures/Fabric1.jpg',
        '/textures/Fabric2.jpg',
        '/textures/Fabric3.jpg',
        '/textures/Fabric4.jpg',
    ];
    const [layout, setLayout] = useState('left')
    const [showMeasurements, setShowMeasurements] = useState(false);

    return (
        <appContext.Provider value={{ material, setMaterial, swatches, layout, setLayout, showMeasurements, setShowMeasurements }}>
            {children}
        </appContext.Provider>
    )
}

export default AppContextProvider