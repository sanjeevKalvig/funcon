import { Palette } from "lucide-react";
import { useContext } from "react";
import { appContext } from "../../../contexts/appContext";


function Material() {
    const { material, setMaterial,swatches } = useContext(appContext)
    return (
        <section>
            <div className="mb-1 flex items-center gap-1.5 text-[9px] tracking-[0.18em] text-slate-300">
                <Palette className="h-3 w-3 opacity-80" />
                <span>MATERIAL</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
                {swatches.map((c, i) => (
                    <button
                        key={c}
                        onClick={() => setMaterial(i)}
                        className={`relative h-7 w-7 rounded-md border border-white/10 transition hover:brightness-110 ${material === i ? "ring-1 ring-blue-400/70 shadow-[0_0_10px_rgba(56,189,248,.25)]" : ""
                            }`}
                        style={{
                            backgroundImage: `url(${c})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                        aria-label={`Material ${i + 1}`}
                    >
                        <span className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-white/70 mix-blend-screen" />
                    </button>

                ))}
            </div>
        </section>
    )
}

export default Material