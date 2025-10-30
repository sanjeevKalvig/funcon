import Scene from "./components/Configurator/components/Scene"
import Sidebar from "./components/Configurator/components/Sidebar"
import AppContextProvider from "./components/Configurator/contexts/appContext"
import LoadingScreen from "./components/Configurator/features/LoadingScreen"
import { useLoader } from "./components/Configurator/hooks/useLoader"

export default function App() {
  const { loading,fadeOut,showScene } =useLoader()

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Loader Overlay */}
      { loading && <LoadingScreen fadeOut={fadeOut} /> }

      <AppContextProvider>
        
        {/* 3D Scene + UI with fade-in */}
        <div
          className={`flex h-screen w-screen transition-opacity duration-700 ${showScene ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="w-[75%] h-full"><Scene /></div>
          <div className="w-[25%] h-full"><Sidebar /></div>
        </div>

      </AppContextProvider >
    </div>
  )
}
