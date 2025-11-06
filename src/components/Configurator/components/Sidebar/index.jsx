import SofaLayout from './features/SofaLayout';
import SofaTextures from './features/SofaTextures';
import SofaInteractions from './features/SofaInteractions';
import SofaAntialiasing from './features/SofaAntialiasing';
import SideBarContextProvider from './context/SideBarContext';
import SofaMeasurements from './features/SofaMeasurements';

export default function Sidebar() {

  return (
    <div className="h-full w-full bg-gray-900 text-white p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6">Sofa Configuration</h2>

      <SideBarContextProvider>
        {/* Layout Category */}
        <SofaLayout />

        {/* Textures Category */}
        <SofaTextures />

        {/* Interaction Points Category */}
        <SofaInteractions />

        <SofaMeasurements />

        {/* Antialiasing */}
        {/* <SofaAntialiasing /> */}
      </SideBarContextProvider>

    </div>
  )
}

