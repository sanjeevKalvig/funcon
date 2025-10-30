import React, { useContext } from 'react'
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { sideBarContext } from '../context/SideBarContext'
import { appContext } from '../../../contexts/appContext';

function SofaLayout() {
    const { openCategory, setOpenCategory } = useContext(sideBarContext);
    const { layout, setLayout } = useContext(appContext)


    return (
        <div className="border-b border-gray-700 pb-4 mb-4">
            <button
                onClick={() => setOpenCategory(openCategory === 'layout' ? null : 'layout')}
                className="flex items-center justify-between w-full text-left text-xl font-medium mb-2 cursor-pointer"
            >
                <span>Layout</span>
                {openCategory === 'layout' ? <FaChevronDown /> : <FaChevronRight />}
            </button>

            <div
                className={`overflow-hidden transition-all duration-500 ${openCategory === 'layout' ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="flex gap-4 mt-2">
                    {['left', 'right'].map((side) => (
                        <button
                            key={side}
                            onClick={() => setLayout(side)}
                            className={`px-4 py-2 cursor-pointer rounded-md border-2 transition-all duration-300 ${layout === side
                                ? 'border-blue-500 bg-blue-500/20 text-white'
                                : 'border-gray-600 hover:border-gray-400 text-gray-300'
                                }`}
                        >
                            {side === 'left' ? (
                                <img src="images/LeftLayout.png" alt="" />
                            ) : (
                                <img src="images/RightLayout.png" alt="" />
                            )
                            }

                            {side === 'left' ? 'Left Side' : 'Right Side'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SofaLayout