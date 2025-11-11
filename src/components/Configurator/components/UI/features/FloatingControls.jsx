import React, { useContext, useEffect, useState,useRef } from 'react'
import {
    Grid3x3,
    RotateCcw,
    RefreshCcw,
    ArrowLeft,
    Dot,
} from "lucide-react";
import { uiContext } from '../context/UI_Context';

function FloatingControls() {
    const { handleResetAll, handleRandomize, handlePrev, handleCenter } = useContext(uiContext)
    const [open, setOpen] = useState(false);
    const btnRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        const onClick = (e) => btnRef.current && !btnRef.current.contains(e.target) && setOpen(false);
        document.addEventListener("keydown", onKey);
        document.addEventListener("mousedown", onClick);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("mousedown", onClick);
        };
    }, []);

    const items = [
        { id: "prev", label: "Previous", icon: <ArrowLeft className="h-4 w-4" />, action: handlePrev },
        { id: "dot", label: "Center View", icon: <Dot className="h-4 w-4" />, action: handleCenter },
        { id: "reset", label: "Reset", icon: <RefreshCcw className="h-4 w-4" />, action: handleResetAll },
    ];

    return (
        <div ref={btnRef} className="pointer-events-auto absolute inset-x-0 bottom-6 flex justify-center">
            <div className="relative flex items-center">
                <div className="relative">
                    {items.map((it, idx) => {
                        const angle = -110 + idx * 55;
                        const radius = open ? 56 : 8;
                        const rad = (angle * Math.PI) / 180;
                        const tx = Math.cos(rad) * radius;
                        const ty = Math.sin(rad) * radius;
                        return (
                            <button
                                key={it.id}
                                onClick={() => {
                                    it.action && it.action();
                                    setOpen(false);
                                }}
                                aria-label={it.label}
                                className="cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-200 shadow-lg border border-white/10 bg-white/[0.04] transition-transform duration-300 ease-out hover:brightness-110 focus:outline-none"
                                style={{
                                    transform: `translate(${tx}px, ${ty}px) scale(${open ? 1 : 0.75})`,
                                    opacity: open ? 1 : 0,
                                    pointerEvents: open ? "auto" : "none",
                                }}
                            >
                                {it.icon}
                            </button>
                        );
                    })}
                </div>

                {/* Main toggle button */}
                <button
                    onClick={() => setOpen((s) => !s)}
                    aria-expanded={open}
                    aria-label={open ? "Close controls" : "Open controls"}
                    className="cursor-pointer z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500/20 to-transparent text-blue-100 shadow-[0_6px_18px_rgba(59,130,246,.12)] focus:outline-none"
                >
                    <Grid3x3 className="h-5 w-5" />
                </button>

                {/* Small quick-action strip */}
                <div className="ml-2 hidden md:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                    <button
                        onClick={handleResetAll}
                        className="cursor-pointer rounded-full p-1.5 text-slate-200 hover:opacity-90"
                        aria-label="Reset"
                        title="Reset"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleRandomize}
                        className="cursor-pointer rounded-full p-1.5 text-slate-200 hover:opacity-90"
                        aria-label="Randomize"
                        title="Randomize"
                    >
                        <RefreshCcw className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FloatingControls