import React, { useContext } from 'react'
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { sideBarContext } from '../context/SideBarContext'
import styles from '../styleSheet/ToggleSwtich.module.css';
import { appContext } from '../../../contexts/appContext';


function SofaMeasurements() {
    const { openCategory, setOpenCategory } = useContext(sideBarContext);
    const { showMeasurements,setShowMeasurements } = useContext(appContext)

    return (
        <div className="border-b border-gray-700 pb-4 mb-4">
            <button
                onClick={() =>
                    setOpenCategory(openCategory === 'measurements' ? null : 'measurements')
                }
                className="flex items-center justify-between w-full text-left text-xl font-medium mb-2 cursor-pointer"
            >
                <span>Sofa Measurements</span>
                {openCategory === 'measurements' ? <FaChevronDown /> : <FaChevronRight />}
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ${openCategory === "measurements"
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                    }`}
            >
                <label
                    className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={showMeasurements}
                        onChange={(e) => setShowMeasurements(e.target.checked)}
                    />
                    <span className={`${styles.slider} ${styles.round}`}></span>
                </label>
            </div>

        </div>
    )
}

export default SofaMeasurements