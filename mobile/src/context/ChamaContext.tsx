import React, { createContext, useContext, useState, useEffect } from "react";
import { chamaApi } from "../lib/api";

export type ChamaType =
  | "merry_go_round"
  | "investment"
  | "welfare"
  | "hybrid"
  | "group_purchase";

export interface ChamaUI {
  id: string;
  name: string;
  role: string;
  userRole: "chairperson" | "treasurer" | "secretary" | "member";
  members: number;
  chamaType: ChamaType;
  heroColor: string;
  typeLabel: string;
  initials: string;
  balanceLabel: string;
  balance: string;
  cycleInfo?: string;
  statusPill?: { paid: number; pending: number; late: number };
  hybridSplit?: string;
  investReturns?: string;
  loanStatus?: string;
  borrowPower?: string;
  productName?: string;
  deliveryStatus?: string;
}

interface ChamaContextType {
  chamas: ChamaUI[];
  isLoadingChamas: boolean;
  activeChamaId: string | null;
  activeChamaType: ChamaType;
  activeChamaColor: string;
  setActiveChama: (id: string, type: ChamaType) => void;
  setActiveChamaType: (type: ChamaType) => void;
  refreshChamas: () => Promise<void>;
}

const ChamaContext = createContext<ChamaContextType | undefined>(undefined);

export function ChamaProvider({ children }: { children: React.ReactNode }) {
  const [chamas, setChamas] = useState<ChamaUI[]>([]);
  const [isLoadingChamas, setIsLoadingChamas] = useState(true);
  const [activeChamaId, setActiveChamaId] = useState<string | null>(null);
  const [activeChamaType, setActiveChamaTypeState] =
    useState<ChamaType>("merry_go_round");
  const [activeChamaColor, setActiveChamaColor] = useState<string>("#0B2A22");

  const refreshChamas = async () => {
    try {
      setIsLoadingChamas(true);
      const rawChamas = await chamaApi.getMyChamas();

      const mapped: ChamaUI[] = rawChamas.map((c: any) => {
        // Map raw info to UI needs
        const colorMap: Record<string, string> = {
          merry_go_round: "#0B2A22",
          investment: "#0B2A22",
          welfare: "#0B2A22",
          hybrid: "#0B2A22",
          group_purchase: "#0B2A22",
        };
        const typeMap: Record<string, string> = {
          merry_go_round: "Merry-Go-Round",
          investment: "Investment",
          welfare: "Welfare / Savings",
          hybrid: "Hybrid",
          group_purchase: "Group Purchase",
        };
        const initials =
          c.name
            .split(" ")
            .map((w: string) => w[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() || "CH";

        return {
          id: c.id,
          name: c.name,
          role: c.userRole.toUpperCase(),
          userRole: c.userRole,
          members: c.memberCount || 1,
          chamaType: c.chamaType,
          heroColor: colorMap[c.chamaType as string] || "#0B2A22",
          typeLabel: typeMap[c.chamaType as string] || c.chamaType,
          initials,
          balanceLabel: "TOTAL BALANCE",
          balance: "Ksh 0", // Can be updated if backend calculation expands
        };
      });

      setChamas(mapped);

      if (mapped.length > 0 && !activeChamaId) {
        setActiveChama(mapped[0].id, mapped[0].chamaType);
      }
    } catch (e: any) {
      if (e.response?.status !== 401) {
        console.warn("Failed to fetch chamas", e.message);
      }
    } finally {
      setIsLoadingChamas(false);
    }
  };

  useEffect(() => {
    refreshChamas();
  }, []);

  const setActiveChama = (id: string, type: ChamaType) => {
    setActiveChamaId(id);
    setActiveChamaTypeState(type);
    const chama = chamas.find((c) => c.id === id);
    if (chama) {
      setActiveChamaColor(chama.heroColor);
    }
  };

  const setActiveChamaType = (type: ChamaType) => {
    setActiveChamaTypeState(type);
  };

  return (
    <ChamaContext.Provider
      value={{
        chamas,
        isLoadingChamas,
        activeChamaId,
        activeChamaType,
        activeChamaColor,
        setActiveChama,
        setActiveChamaType,
        refreshChamas,
      }}
    >
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
