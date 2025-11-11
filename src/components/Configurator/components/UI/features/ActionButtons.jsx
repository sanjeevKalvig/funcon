import { RefreshCcw, RotateCcw } from 'lucide-react'
import React, { useContext } from 'react'
import { uiContext } from '../context/UI_Context'


function ActionButtons() {
  const { handleResetAll, handleRandomize, handlePrev, handleCenter } = useContext(uiContext)

    return (
        <div className="mt-auto space-y-2.5">
            <div className="flex gap-2">
                <button
                    onClick={handleResetAll}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-2 text-xs text-slate-300 hover:bg-white/[0.06]"
                >
                    <RotateCcw className="h-3 w-3" />
                    Reset All
                </button>
                <button
                    onClick={handleRandomize}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-2 text-xs text-slate-300 hover:bg-white/[0.06]"
                >
                    <RefreshCcw className="h-3 w-3" />
                    Randomize
                </button>
            </div>

            <button className="w-full rounded-lg border border-blue-500/30 bg-blue-500/10 py-2 text-xs text-blue-200 hover:bg-blue-500/20">
                Save Configuration
            </button>
        </div>
    )
}

export default ActionButtons