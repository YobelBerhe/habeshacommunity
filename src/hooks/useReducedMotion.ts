import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [pref, setPref] = useState(false);
  
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPref(mq.matches);
    
    const fn = () => setPref(mq.matches);
    mq.addEventListener?.("change", fn);
    
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  
  return pref;
}