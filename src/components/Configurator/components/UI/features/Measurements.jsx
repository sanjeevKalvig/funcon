import { Grid3x3 } from 'lucide-react'
import styles from '../stylesheet/ToggleSwitch.module.css';
import { useContext } from 'react';
import { appContext } from '../../../contexts/appContext'


function Measurements() {
    const { showMeasurements, setShowMeasurements } = useContext(appContext)
    return (
        <div className="mb-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white text-[10px]">
                <Grid3x3 className="h-3 w-3 opacity-80" />
                <span>MEASUREMENTS</span>
            </div>
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
    )
}

export default Measurements