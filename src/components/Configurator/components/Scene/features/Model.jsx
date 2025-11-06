import { useMemo, forwardRef, useContext } from "react";
import { getModel } from "../utils/modelCache";
import useTextureUpdate from "../hooks/useTextureUpdate";
import useLayoutUpdate from "../hooks/useLayoutUpdate";
import { appContext } from "../../../contexts/appContext";
import MeasurementLabels from "./MeasurementLabels";

export const Model = forwardRef(({ controlsRef }, modelRef) => {
  const {showMeasurements}=useContext(appContext)
  const cachedModel = getModel("/models/L_SHAPE_SOFA.obj");

  // ✅ OBJLoader returns a Group directly — not { scene: ... }
  const sceneClone = useMemo(() => {
    if (!cachedModel) return null;
    return cachedModel.clone(true);
  }, [cachedModel]);


  useLayoutUpdate(sceneClone);
  useTextureUpdate(sceneClone);


  // ✅ Important: scale down OBJ models (they're usually in centimeters)
  return sceneClone ? (
    <>
     <primitive
      ref={modelRef}
      object={sceneClone}
      // scale={0.01} 
    />
    <MeasurementLabels scene={sceneClone} enabled={showMeasurements} />
    </>
   
  ) : null;
});
