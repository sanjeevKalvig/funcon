import { createContext, useEffect, useMemo, useState } from "react";

export const appContext = createContext();

/* ===== Magento config ===== */
const PARENT_SKU = "CUSTOM3DSOFA-PARENT";
const VARIANT_API = "/variant-price.php"; // proxied to rocking.magento.com

// swatch index -> Magento label
const LABEL_BY_INDEX = (i) => `Fabric${i}`; // because your files are Fabric0..4

const toKey = (s) => String(s || "").trim().toLowerCase();

function AppContextProvider({ children }) {
  // UI state
  const [material, setMaterial] = useState(1);
  const swatches = [
    "/textures/Fabric0.jpg",
    "/textures/Fabric1.jpg",
    "/textures/Fabric2.jpg",
    "/textures/Fabric3.jpg",
    "/textures/Fabric4.jpg",
  ];
  const [layout, setLayout] = useState("left");
  const [showMeasurements, setShowMeasurements] = useState(false);

  // Magento state
  const [magento, setMagento] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null); // holds texture_option_id, sku, price, etc.
  const [activeTextureLabel, setActiveTextureLabel] = useState(null);

  // fetch variants once
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${VARIANT_API}?sku=${encodeURIComponent(PARENT_SKU)}&attr=texture`);
        const data = await res.json();
        setMagento(data);

        // init price from current material index
        const initialLabel = LABEL_BY_INDEX(material);
        const first =
          data?.variants?.find(v => toKey(v.texture_label || v.option_label) === toKey(initialLabel)) ||
          data?.variants?.[0];

        if (first) {
          setDisplayPrice(Number(first.price) || 0);
          setSelectedVariant(first);
          setActiveTextureLabel(first.texture_label || first.option_label || null);
        }
      } catch (e) {
        console.error("variant fetch failed:", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fast lookup: label -> variant
  const variantByLabel = useMemo(() => {
    const m = new Map();
    if (magento?.variants) {
      for (const v of magento.variants) {
        m.set(toKey(v.texture_label || v.option_label), v);
      }
    }
    return m;
  }, [magento]);

  // call this when user clicks a swatch
  function setMaterialAndPrice(index) {
    const safe = Math.max(0, Math.min(index, swatches.length - 1));
    setMaterial(safe);

    const label = LABEL_BY_INDEX(safe);
    const v =
      variantByLabel.get(toKey(label)) ||
      (magento?.variants || []).find(x => toKey(x.texture_label || x.option_label) === toKey(label));

    if (v) {
      setDisplayPrice(Number(v.price) || 0);
      setSelectedVariant(v);
      setActiveTextureLabel(v.texture_label || v.option_label || null);
    }
  }

  return (
    <appContext.Provider
      value={{
        // UI
        material, setMaterial, setMaterialAndPrice,
        swatches, layout, setLayout,
        showMeasurements, setShowMeasurements,

        // Magento
        displayPrice,
        selectedVariant,
        activeTextureLabel,
      }}
    >
      {children}
    </appContext.Provider>
  );
}

export default AppContextProvider;
