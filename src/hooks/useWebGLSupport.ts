import { useState, useEffect } from "react";

export const useWebGLSupport = (): boolean => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const hasWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setIsSupported(hasWebGL);
    } catch (e) {
      setIsSupported(false);
    }
  }, []);

  return isSupported;
};
