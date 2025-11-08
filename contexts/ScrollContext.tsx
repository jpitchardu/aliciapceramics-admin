import React, { createContext, useContext, useState } from "react";

interface ScrollContextType {
  scrollY: number;
  setScrollY: (y: number) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  manualOverride: boolean;
  setManualOverride: (override: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  return (
    <ScrollContext.Provider
      value={{
        scrollY,
        setScrollY,
        isCollapsed,
        setIsCollapsed,
        manualOverride,
        setManualOverride,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within ScrollProvider");
  }
  return context;
}
