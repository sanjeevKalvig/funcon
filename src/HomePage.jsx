import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Palette,
  Sofa,
  Grid2x2,
  Grid3x3,
  Square,
  Circle,
  MoveHorizontal,
  Sun,
  Moon,
  Diamond,
  RotateCcw,
  ArrowLeft,
  RefreshCcw,
  Dot,
  ShoppingCart,
} from "lucide-react";
import Scene from "./components/Configurator/components/Scene";
import styles from "./components/Configurator/components/UI/styleSheet/ToggleSwtich.module.css";
import { appContext } from "./components/Configurator/contexts/appContext";
import { useLoader } from "./components/Configurator/hooks/useLoader";

/* FloatingControls stays unchanged */
const FloatingControls = ({ onReset, onRandomize, onPrev, onCenter }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) =>
      btnRef.current && !btnRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const items = [
    { id: "prev", label: "Previous", icon: <ArrowLeft className="h-4 w-4" />, action: onPrev },
    { id: "dot", label: "Center View", icon: <Dot className="h-4 w-4" />, action: onCenter },
    { id: "reset", label: "Reset", icon: <RefreshCcw className="h-4 w-4" />, action: onReset },
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

        <button
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-label={open ? "Close controls" : "Open controls"}
          className="cursor-pointer z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500/20 to-transparent text-blue-100 shadow-[0_6px_18px_rgba(59,130,246,.12)] focus:outline-none"
        >
          <Grid3x3 className="h-5 w-5" />
        </button>

        <div className="ml-2 hidden md:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <button
            onClick={onReset}
            className="cursor-pointer rounded-full p-1.5 text-slate-200 hover:opacity-90"
            aria-label="Reset"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onRandomize}
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
};

const HomePage = () => {
  const [legs, setLegs] = useState("taper");
  const [lighting, setLighting] = useState("studio");

  // 🔧 Pull EVERYTHING you use from context
  const {
    material,
    setMaterialAndPrice,
    swatches,
    layout,
    setLayout,
    showMeasurements,
    setShowMeasurements,
    displayPrice,
  } = useContext(appContext);

  const { loading } = useLoader();

  // ✅ Use setMaterialAndPrice so price stays in sync
  const handleResetAll = () => {
    setMaterialAndPrice(1); // default to Fabric1 (index 1) — change if you want
    setLayout("left");
    setLegs("taper");
    setShowMeasurements(false);
    setLighting("studio");
  };

  const handleRandomize = () => {
    const randIdx = Math.floor(Math.random() * swatches.length);
    setMaterialAndPrice(randIdx);

    const seatOps = ["left", "right"];
    setLayout(seatOps[Math.floor(Math.random() * seatOps.length)]);

    const legOps = ["taper", "flat", "sled", "pin"];
    setLegs(legOps[Math.floor(Math.random() * legOps.length)]);

    setShowMeasurements(false);

    const lightOps = ["studio", "day", "night"];
    setLighting(lightOps[Math.floor(Math.random() * lightOps.length)]);
  };

  const handlePrev = () => {
    const next = (material - 1 + swatches.length) % swatches.length;
    setMaterialAndPrice(next);
  };

  const handleCenter = () => setLighting((l) => (l === "studio" ? "day" : "studio"));

  return (
    <div
      className={`min-h-screen w-full bg-[#090e18]
      bg-[radial-gradient(80rem_80rem_at_65%_0%,rgba(59,130,246,.18),transparent),radial-gradient(40rem_40rem_at_10%_100%,rgba(251,146,60,.12),transparent)]
      pt-8 px-4 md:px-3 ${loading ? "loading-block" : ""}`}
    >
      <div
        className="grid h-[92vh] grid-rows-[1fr_auto] lg:grid-rows-1
        lg:grid-cols-[1fr_220px] xl:grid-cols-[1fr_240px] 2xl:grid-cols-[1fr_260px]
        gap-4 rounded-[24px] border border-white/10 bg-white/[0.02]
        p-4 md:p-5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
      >
        {/* MAIN AREA */}
        <div className="flex flex-col">
          <main className="flex-1 relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent mb-4">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-lg border border-white/10 bg-black/40 px-6 py-4 text-center text-slate-400">
                  <p className="text-xs">Loading...</p>
                </div>
              </div>
            ) : (
              <Scene />
            )}

            {/* <FloatingControls
              onReset={handleResetAll}
              onRandomize={handleRandomize}
              onPrev={handlePrev}
              onCenter={handleCenter}
            /> */}
          </main>

          {/* BOTTOM CONTROLS */}
          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 md:p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* MATERIAL */}
              <section>
                <div className="mb-1 flex items-center gap-1.5 text-[9px] tracking-[0.18em] text-slate-300">
                  <Palette className="h-3 w-3 opacity-80" />
                  <span>MATERIAL</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {swatches.map((c, i) => (
                    <button
                      key={c}
                      onClick={() => setMaterialAndPrice(i)}
                      className={`relative h-7 w-7 rounded-md border border-white/10 transition hover:brightness-110 ${
                        material === i ? "ring-1 ring-blue-400/70 shadow-[0_0_10px_rgba(56,189,248,.25)]" : ""
                      }`}
                      style={{
                        backgroundImage: `url(${c})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      aria-label={`Texture ${i + 1}`}
                    >
                      <span className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-white/70 mix-blend-screen" />
                    </button>
                  ))}
                </div>
              </section>

              {/* SEAT CONFIG */}
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
                      className={`flex h-7 items-center justify-center gap-1 rounded-lg border px-2 text-[10px] transition ${
                        layout === opt.id ? "border-blue-500/50 bg-blue-400/10 text-blue-100" : "border-white/10 text-slate-300 hover:bg-white/[0.05]"
                      }`}
                    >
                      <Sofa className="h-3 w-3 opacity-90" />
                      <span className="hidden sm:inline">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* LEGS */}
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
                      className={`flex h-7 items-center justify-center gap-1 rounded-lg border px-2 text-[10px] transition ${
                        legs === o.id ? "border-blue-500/50 bg-blue-400/10 text-blue-100" : "border-white/10 text-slate-300 hover:bg-white/[0.05]"
                      }`}
                    >
                      {o.icon}
                      <span className="hidden sm:inline">{o.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* LIGHTING */}
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
                      className={`flex h-7 items-center justify-center rounded-lg border transition ${
                        lighting === o.id ? "border-blue-500/50 bg-blue-400/10 text-blue-100" : "border-white/10 text-slate-300 hover:bg-white/[0.05]"
                      }`}
                    >
                      {o.icon}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-3 xl:p-4">
          {/* PRICE AND CTA */}
          <div className="mb-5">
            <p className="text-2xl font-semibold text-slate-100">
              ₹ {Number(displayPrice).toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-slate-400 mt-1">Customizable Sofa</p>
            <button className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-400/20">
              <ShoppingCart className="h-4 w-4" />
              ADD TO CART
            </button>
          </div>

          {/* Measurements */}
          <div className="mb-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white text-[10px]">
              <Grid3x3 className="h-3 w-3 opacity-80" />
              <span>MEASUREMENTS</span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={showMeasurements}
                onChange={(e) => setShowMeasurements(e.target.checked)}
              />
              <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="mb-5">
            <h3 className="mb-2 text-sm font-medium text-slate-200">Product Details</h3>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li className="flex justify-between">
                <span>Material:</span>
                <span className="text-slate-300">Premium Fabric</span>
              </li>
              <li className="flex justify-between">
                <span>Configuration:</span>
                <span className="text-slate-300">3-Seater</span>
              </li>
              <li className="flex justify-between">
                <span>Leg Style:</span>
                <span className="text-slate-300">Tapered</span>
              </li>
              <li className="flex justify-between">
                <span>Warranty:</span>
                <span className="text-slate-300">2 Years</span>
              </li>
            </ul>
          </div>

          {/* ACTION BUTTONS */}
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
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
