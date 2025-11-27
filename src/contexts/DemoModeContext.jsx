import { createContext, useContext, useMemo, useState, useEffect } from "react";

const DemoModeContext = createContext(null);

// Helper to get demo mode from localStorage or URL
const getInitialDemoMode = () => {
  if (typeof window === "undefined") return true;
  
  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const urlDemo = urlParams.get("demo");
  if (urlDemo !== null) {
    const isDemo = urlDemo === "true" || urlDemo === "1";
    localStorage.setItem("cogniclaim.demoMode", String(isDemo));
    return isDemo;
  }
  
  // Check localStorage
  const stored = localStorage.getItem("cogniclaim.demoMode");
  if (stored !== null) {
    return stored === "true";
  }
  
  // Default to demo mode
  return true;
};

export function DemoModeProvider({ children }) {
  const [isDemoMode, setIsDemoMode] = useState(getInitialDemoMode);

  // Sync to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cogniclaim.demoMode", String(isDemoMode));
  }, [isDemoMode]);

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("cogniclaim.demoMode", String(newValue));
      return newValue;
    });
  };

  const value = useMemo(
    () => ({
      isDemoMode,
      toggleDemoMode,
    }),
    [isDemoMode]
  );

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) {
    throw new Error("useDemoMode must be used inside DemoModeProvider");
  }
  return ctx;
}

