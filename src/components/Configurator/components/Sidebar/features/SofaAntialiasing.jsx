import React, { useContext } from 'react'
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { sideBarContext } from '../context/SideBarContext'
import { appContext } from '../../../contexts/appContext';

function SofaAntialiasing() {
  const { openCategory, setOpenCategory } = useContext(sideBarContext);
  const { aaMode, setAaMode } = useContext(appContext)

  return (
    <div className="border-b border-gray-700 pb-4 mb-4">
    <button
      onClick={() =>
        setOpenCategory(openCategory === 'antialiasing' ? null : 'antialiasing')
      }
      className="flex items-center justify-between w-full text-left text-xl font-medium mb-2 cursor-pointer"
    >
      <span>Antialiasing</span>
      {openCategory === 'antialiasing' ? <FaChevronDown /> : <FaChevronRight />}
    </button>

    <div
      className={`overflow-hidden transition-all duration-500 ${openCategory === 'antialiasing' ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
    >

      <div className="flex flex-col gap-3 mt-2">
        {['None', 'FXAA', 'SMAA', "SSAA", "TAA"].map((mode) => (
          <label
            key={mode}
            className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md border-2 transition-all duration-300 ${aaMode === mode
              ? 'border-blue-500 bg-blue-500/20 text-white'
              : 'border-gray-600 hover:border-gray-400 text-gray-300'
              }`}
          >
            <input
              type="radio"
              name="antialiasing"
              value={mode}
              checked={aaMode === mode}
              onChange={() => setAaMode(mode)}
              className="accent-blue-500 w-4 h-4"
            />
            <span>{mode}</span>
          </label>
        ))}
      </div>


    </div>
  </div>
  )
}

export default SofaAntialiasing