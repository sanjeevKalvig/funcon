import { Diamond, Moon, Sun } from 'lucide-react'
import React, { useContext } from 'react'
import { uiContext } from '../context/UI_Context'

function Lighting() {
  const { lighting,setLighting } =useContext(uiContext)

  return (
    <section>
    <div className="mb-1 flex items-center gap-1.5 text-[9px] tracking-[0.18em] text-slate-300">
      <Sun className="h-3 w-3 opacity-80" />
      <span>LIGHT</span>
    </div>
    <div className="grid grid-cols-3 gap-1.5">
      {[
        { id: "studio", icon: <Diamond className="h-3 w-3" /> },
        { id: "day", icon: <Sun className="h-3 w-3" /> },
        { id: "night", icon: <Moon className="h-3 w-3" /> },
      ].map((o) => (
        <button
          key={o.id}
          onClick={() => setLighting(o.id)}
          className={`flex h-7 items-center justify-center rounded-lg border transition ${lighting === o.id ? "border-blue-500/50 bg-blue-400/10 text-blue-100" : "border-white/10 text-slate-300 hover:bg-white/[0.05]"
            }`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  </section>
  )
}

export default Lighting