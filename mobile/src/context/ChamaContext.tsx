import React, { createContext, useContext, useState } from "react";

export type ChamaType = "merry_go_round" | "investment" | "welfare" | "hybrid" | "group_purchase";

interface ChamaContextType {
  activeChamaId: string;
  activeChamaType: ChamaType;
  setActiveChama: (id: string, type: ChamaType) => void;
  // Keep backward compat
  setActiveChamaType: (type: ChamaType) => void;
}

const ChamaContext = createContext<ChamaContextType | undefined>(undefined);

export function ChamaProvider({ children }: { children: React.ReactNode }) {
  const [activeChamaId, setActiveChamaId] = useState<string>("1");
  const [activeChamaType, setActiveChamaTypeState] = useState<ChamaType>("merry_go_round");

  const setActiveChama = (id: string, type: ChamaType) => {
    setActiveChamaId(id);
    setActiveChamaTypeState(type);
  };

  // Backward compat shim — only updates type (used by old callers)
  const setActiveChamaType = (type: ChamaType) => {
    setActiveChamaTypeState(type);
  };

  return (
    <ChamaContext.Provider value={{ activeChamaId, activeChamaType, setActiveChama, setActiveChamaType }}>
      {children}
    </ChamaContext.Provider>
  );
}

export function useChamaContext() {
  const context = useContext(ChamaContext);
  if (!context) {
    throw new Error("useChamaContext must be used within a ChamaProvider");
  }
  return context;
}
