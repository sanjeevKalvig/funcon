import React, { useContext } from 'react'
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { sideBarContext } from '../context/SideBarContext'
import { appContext } from '../../../contexts/appContext';

function SofaInteractions() {
  const { openCategory, setOpenCategory } = useContext(sideBarContext);
  const {interactiveMeshes}=useContext(appContext)
  const handleFocus = (mesh) => {
    
  };
  
  return (
    <div className="border-b border-gray-700 pb-4 mb-4">
    <button
      onClick={() =>
        setOpenCategory(openCategory === 'interaction' ? null : 'interaction')
      }
      className="flex items-center justify-between w-full text-left text-xl font-medium mb-2 cursor-pointer"
    >
      <span>Interaction Points</span>
      {openCategory === 'interaction' ? <FaChevronDown /> : <FaChevronRight />}
    </button>

    <div
        className={`overflow-hidden transition-all duration-500 ${
          openCategory === "interaction"
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <ul className="mt-2 space-y-2 text-gray-300">
          {interactiveMeshes.length > 0 ? (
            interactiveMeshes.map((mesh, i) => (
              <li
                key={i}
                className="cursor-pointer hover:text-white transition"
                onClick={() => handleFocus(mesh)}
              >
                • {mesh.name || `Mesh ${i + 1}`}
              </li>
            ))
          ) : (
            <li className="text-gray-500">No meshes loaded yet.</li>
          )}
        </ul>
      </div>
  </div>
  )
}

export default SofaInteractions