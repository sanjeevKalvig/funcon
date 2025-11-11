import { Circle, Diamond, Grid2x2, MoveHorizontal, Square } from 'lucide-react'
import React, { useContext } from 'react'
import { uiContext } from '../context/UI_Context'

function Legs() {
  const { legs,setLegs } =useContext(uiContext)
  return (
    <section>
    <div className="mb-1 flex items-center gap-1.5 text-[9px] tracking-[0.18em] text-slate-300">
      <Square className="h-3 w-3 opacity-80" />
      <span>LEGS</span>
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      {[
        { id: "taper", icon: <Diamond className="h-3 w-3" />, label: "Taper" },
        { id: "flat", icon: <Grid2x2 className="h-3 w-3" />, label: "Flat" },
        { id: "sled", icon: <MoveHorizontal className="h-3 w-3" />, label: "Sled" },
        { id: "pin", icon: <Circle className="h-3 w-3" />, label: "Pin" },
      ].map((o) => (
        <button
          key={o.id}
          onClick={() => setLegs(o.id)}
          className={`flex h-7 items-center justify-center gap-1 rounded-lg border px-2 text-[10px] transition ${legs === o.id ? "border-blue-500/50 bg-blue-400/10 text-blue-100" : "border-white/10 text-slate-300 hover:bg-white/[0.05]"
            }`}
        >
          {o.icon}
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  </section>
  )
}

export default Legs