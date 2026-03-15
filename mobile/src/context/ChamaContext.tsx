import React, { createContext, useContext, useState } from "react";

export type ChamaType = "merry_go_round" | "investment" | "welfare" | "hybrid" | "group_purchase";

interface ChamaContextType {
  activeChamaType: ChamaType;
  setActiveChamaType: (type: ChamaType) => void;
}

const ChamaContext = createContext<ChamaContextType | undefined>(undefined);

export function ChamaProvider({ children }: { children: React.ReactNode }) {
  // Default to MGR for the initial launch
  const [activeChamaType, setActiveChamaType] = useState<ChamaType>("merry_go_round");

  return (
    <ChamaContext.Provider value={{ activeChamaType, setActiveChamaType }}>
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
