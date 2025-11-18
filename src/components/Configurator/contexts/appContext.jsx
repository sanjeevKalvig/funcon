import { createContext, useEffect, useMemo, useState } from "react";

export const appContext = createContext();

const PARENT_SKU = "CUSTOM3DSOFA-PARENT";

// This is always correct in production (Vercel) and dev fallback
const VARIANT_API_PATH = "/api/magento/variant-price.php";

const LABEL_BY_INDEX = (i) => `Fabric${i}`;
const toKey = (s) => String(s || "").trim().toLowerCase();

function AppContextProvider({ children }) {
  const [material, setMaterial] = useState(0);
  const [layout, setLayout] = useState("left");
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [magento, setMagento] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTextureLabel, setActiveTextureLabel] = useState(null);
  const [attrId, setAttrId] = useState(null);

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
      const ENV_BASE = import.meta.env.VITE_MAGENTO_BASE ?? "";

      // dev path and proxy prefix
      const devPath = "/variant-price.php"; // Vite proxy expects this
      const proxyPrefix = "/api/magento";   // Vercel serverless

      // Decide base and path:
      // - Local DEV and no ENV_BASE -> call devPath directly: "/variant-price.php?...".
      // - If ENV_BASE set -> call absolute ENV_BASE + devPath (useful for local dev against real host)
      // - Production (not DEV) and ENV_BASE empty -> call proxyPrefix + "/variant-price.php"
      // - Production and ENV_BASE set -> call ENV_BASE + "/variant-price.php"
      let url;
      if (import.meta.env.DEV) {
        if (ENV_BASE) {
          // call absolute magento host directly in dev
          url = `${ENV_BASE.replace(/\/+$/, "")}${devPath}?sku=${encodeURIComponent(PARENT_SKU)}&attr=texture`;
        } else {
          // local dev via Vite proxy
          url = `${devPath}?sku=${encodeURIComponent(PARENT_SKU)}&attr=texture`;
        }
      } else {
        if (ENV_BASE) {
          url = `${ENV_BASE.replace(/\/+$/, "")}${devPath}?sku=${encodeURIComponent(PARENT_SKU)}&attr=texture`;
        } else {
          // production using serverless proxy
          url = `${proxyPrefix}${devPath}?sku=${encodeURIComponent(PARENT_SKU)}&attr=texture`;
        }
      }

      const res = await fetch(url, { credentials: "omit" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Variant fetch failed (${res.status}): ${txt}`);
      }

      const data = await res.json();
      setMagento(data);
      setAttrId(data?.configurable_attribute_id ?? null);

      const initialLabel = LABEL_BY_INDEX(material);
      const first =
        data?.variants?.find((v) => toKey(v.texture_label) === toKey(initialLabel)) ||
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
        attrId,
      }}
    >
      {children}
    </appContext.Provider>
  );
}

export default AppContextProvider;
