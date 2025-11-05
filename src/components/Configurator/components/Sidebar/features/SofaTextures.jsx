import React, { useContext } from 'react'
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { sideBarContext } from '../context/SideBarContext'
import { appContext } from '../../../contexts/appContext';

function SofaTextures() {
  const { openCategory, setOpenCategory } = useContext(sideBarContext);
  const {  textures, setTextures } = useContext(appContext);

  const textureGroups = {
    backCushions: [
      { name: 'Alfardo', path: '/textures/Fabric2.jpg' },
      { name: 'Mijo', path: '/textures/Fabric4.jpg' },
    ],
    seatCushions: [
      { name: 'Chijo', path: '/textures/Fabric3.jpg' },
      { name: 'Beige', path: '/textures/Fabric0.jpg' },
    ],
    armrest: [
      { name: 'Velvet Gray', path: '/textures/Fabric2.jpg' },
      { name: 'Velvet Blue', path: '/textures/Fabric4.jpg' },
    ],
    backFrame: [
      { name: 'Premium White', path: '/textures/Fabric1.jpg' },
      { name: 'Leather Green', path: '/textures/Fabric2.jpg' },
    ],
  }

  const handleSelect = (group, path) => {
    setTextures((prev) => ({
      ...prev,
      [group]: path,
    }))
  }

  const renderSection = (label, key) => (
    <div key={key}>
      <h3
        className="text-lg font-medium mb-3 w-fit"
      >{label}</h3>
      <div className="grid grid-cols-3 gap-4 px-2">
        {textureGroups[key].map((tex) => (
          <div
            key={tex.name}
            onClick={() => handleSelect(key, tex.path)}
            className={`relative group cursor-pointer w-[60px] h-[60px] rounded-full border-2 transition-all duration-300 ${textures[key] === tex.path
              ? 'border-blue-500 scale-125 shadow-[0_0_10px_rgba(59,130,246,0.6)]'
              : 'border-gray-700 hover:border-gray-400'
              }`}
          >
            <img
              src={tex.path}
              alt={tex.name}
              className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="border-b border-gray-700 pb-4 mb-4">
    <button
      onClick={() =>
        setOpenCategory(openCategory === 'material' ? null : 'material')
      }
      className="flex items-center justify-between w-full text-left text-xl font-medium mb-2 cursor-pointer"
    >
      <span>Materials</span>
      {openCategory === 'material' ? <FaChevronDown /> : <FaChevronRight />}
    </button>

    <div
      className={`overflow-hidden transition-all duration-500 ${openCategory === 'material' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
    >
      <div className="flex flex-col gap-6 mt-2 mb-2">
        {renderSection('Back Cushions', 'backCushions')}
        {renderSection('Seat Cushions', 'seatCushions')}
        {renderSection('Armrest', 'armrest')}
        {renderSection('Back Frame', 'backFrame')}
      </div>
    </div>
  </div>
  )
}

export default SofaTextures