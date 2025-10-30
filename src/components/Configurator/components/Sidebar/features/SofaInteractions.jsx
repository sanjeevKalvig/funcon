import React, { useContext } from 'react'
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { sideBarContext } from '../context/SideBarContext'

function SofaInteractions() {
  const { openCategory, setOpenCategory } = useContext(sideBarContext);
  
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
      className={`overflow-hidden transition-all duration-500 ${openCategory === 'interaction' ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
    >
      <ul className="mt-2 space-y-2 text-gray-300">
        <li>• Cushion Lift</li>
        <li>• Recliner Trigger</li>
        <li>• Headrest Adjustment</li>
        <li>• Storage Compartment</li>
      </ul>
    </div>
  </div>
  )
}

export default SofaInteractions