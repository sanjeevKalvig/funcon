import React, { useContext } from 'react'
import { appContext } from '../../../contexts/appContext'
import { Sofa } from "lucide-react";

function Layout() {
    const { layout, setLayout } = useContext(appContext)
    return (
        <section>
            <div className="mb-1 flex items-center gap-1.5 text-[9px] tracking-[0.18em] text-slate-300">
                <Sofa className="h-3 w-3 opacity-80" />
                <span>SEAT</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
                {[
                    { id: "left", label: "left" },
                    { id: "right", label: "right" },
                ].map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setLayout(opt.id)}
                        className={`flex h-7 items-center justify-center gap-1 rounded-lg border px-2 text-[10px] transition ${layout === opt.id
                            ? "border-blue-500/50 bg-blue-400/10 text-blue-100"
                            : "border-white/10 text-slate-300 hover:bg-white/[0.05]"
                            }`}
                    >
                        <Sofa className="h-3 w-3 opacity-90" />
                        <span className="hidden sm:inline">{opt.label}</span>
                    </button>
                ))}
            </div>
        </section>
    )
}

export default Layout