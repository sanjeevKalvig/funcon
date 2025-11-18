import { createContext, useEffect, useMemo, useState } from "react";

export const appContext = createContext();

const PARENT_SKU = "CUSTOM3DSOFA-PARENT";
const VARIANT_API = "/variant-price.php";
const LABEL_BY_INDEX = (i) => `Fabric${i}`;
const toKey = (s) => String(s || "").trim().toLowerCase();
const VARIANT_API_PATH = "/variant-price.php"; 

function AppContextProvider({ children }) {
  const [material, setMaterial] = useState(0);
  const [layout, setLayout] = useState("left");
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [magento, setMagento] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTextureLabel, setActiveTextureLabel] = useState(null);
  const [attrId, setAttrId] = useState(null); // ✅ new

  const swatches = [
    "/textures/Fabric0.jpg",
    "/textures/Fabric1.jpg",
    "/textures/Fabric2.jpg",
    "/textures/Fabric3.jpg",
    "/textures/Fabric4.jpg",
  ];

 useEffect(() => {
  (async () => {
    try {
      // build URL depending on env:
      // - local dev: import.meta.env.VITE_MAGENTO_BASE is empty -> relative path (works with Vite proxy)
      // - production: VITE_MAGENTO_BASE is set -> absolute URL to Magento host
      const magentoBase = import.meta.env.VITE_MAGENTO_BASE ?? "";
      const url = magentoBase
        ? `${magentoBase.replace(/\/+$/, "")}${VARIANT_API_PATH}?sku=${encodeURIComponent(PARENT_SKU)}&attr=texture`
        : `${VARIANT_API_PATH}?sku=${encodeURIComponent(PARENT_SKU)}&attr=texture`;

      const res = await fetch(url, { credentials: "omit" }); // guest endpoints don't need cookies
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Variant fetch failed (${res.status}): ${txt}`);
      }

      const data = await res.json();
      setMagento(data);
      setAttrId(data?.configurable_attribute_id ?? null);

      const initialLabel = LABEL_BY_INDEX(material);
      const first =
        data?.variants?.find(v => toKey(v.texture_label) === toKey(initialLabel)) ||
        data?.variants?.[0];

      if (first) {
        setDisplayPrice(Number(first.price) || 0);
        setSelectedVariant(first);
        setActiveTextureLabel(first.texture_label || null);
      }
    } catch (e) {
      console.error("variant fetch failed:", e);
    }
  })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const variantByLabel = useMemo(() => {
    const map = new Map();
    if (magento?.variants) {
      for (const v of magento.variants) {
        map.set(toKey(v.texture_label || v.option_label), v);
      }
    }
    return map;
  }, [magento]);

  function setMaterialAndPrice(index) {
    const safe = Math.max(0, Math.min(index, swatches.length - 1));
    setMaterial(safe);

    const label = LABEL_BY_INDEX(safe);
    const v = variantByLabel.get(toKey(label));
    if (v) {
      setDisplayPrice(Number(v.price) || 0);
      setSelectedVariant(v);
      setActiveTextureLabel(v.texture_label || null);
    }
  }

  return (
    <appContext.Provider
      value={{
        material,
        setMaterial,
        setMaterialAndPrice,
        swatches,
        layout,
        setLayout,
        showMeasurements,
        setShowMeasurements,
        displayPrice,
        selectedVariant,
        activeTextureLabel,
        attrId, // ✅ exposed to HomePage
      }}
    >
      {children}
    </appContext.Provider>
  );
}

export default AppContextProvider;
