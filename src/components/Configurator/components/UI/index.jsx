import { ShoppingCart } from "lucide-react";
import Material from "./features/Material";
import Layout from "./features/Layout";
import Legs from "./features/Legs";
import Lighting from "./features/Lighting";
import Measurements from "./features/Measurements";
import ProductDetails from "./features/ProductDetails";
import UI_ContextProvider from "./context/UI_Context";
import Scene from "../Scene";
import { useLoader } from "../../hooks/useLoader";
import FloatingControls from "./features/FloatingControls";
import ActionButtons from "./features/ActionButtons";


const UI = () => {
  const { loading } = useLoader()

  return (
    <UI_ContextProvider>
      <div
        className={`grid h-[92vh] grid-rows-[1fr_auto] lg:grid-rows-1
        lg:grid-cols-[1fr_220px] xl:grid-cols-[1fr_240px] 2xl:grid-cols-[1fr_260px]
        gap-4 rounded-[24px] border border-white/10 bg-white/[0.02]
        p-4 md:p-5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] ${loading ? "loading-block" : ""} `}
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


            <FloatingControls />
          </main>

          {/* BOTTOM CONTROLS */}
          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 md:p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* MATERIAL */}
              <Material />

              {/* SEAT CONFIG */}
              <Layout />

              {/* LEGS */}
              <Legs />

              {/* LIGHTING */}
              <Lighting />
            </div>
          </aside>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-3 xl:p-4">
          {/* PRICE AND CTA */}
          <div className="mb-5">
            <p className="text-2xl font-semibold text-slate-100">₹ 2,499</p>
            <p className="text-sm text-slate-400 mt-1">Customizable Sofa</p>
            <button className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-400/20">
              <ShoppingCart className="h-4 w-4" />
              ADD TO CART
            </button>
          </div>

          {/* Measurments */}
          <Measurements />

          {/* PRODUCT DETAILS */}
          <ProductDetails />

          {/* ACTION BUTTONS */}
          <ActionButtons />
        </aside>
      </div>
    </UI_ContextProvider>
  );
};

export default UI;
