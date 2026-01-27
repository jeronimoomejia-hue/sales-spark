import { createContext, useContext, useState, ReactNode } from "react";

export interface DemoUser {
  id: string;
  name: string;
  avatar: string;
  level: 1 | 2 | 3 | 4;
  levelName: string;
  commissionPerTicket: number;
  teamSize?: number;
}

const demoUsers: Record<number, DemoUser> = {
  1: {
    id: "PROMO-12345",
    name: "Juan Pérez",
    avatar: "JP",
    level: 1,
    levelName: "Promotor Común",
    commissionPerTicket: 7500,
  },
  2: {
    id: "PROMO-12340",
    name: "Carolina Martínez",
    avatar: "CM",
    level: 2,
    levelName: "Promotor Cabeza",
    commissionPerTicket: 10000,
    teamSize: 6,
  },
  3: {
    id: "PROMO-12330",
    name: "Roberto Sánchez",
    avatar: "RS",
    level: 3,
    levelName: "Sub Socio",
    commissionPerTicket: 12000,
    teamSize: 15,
  },
  4: {
    id: "ADMIN-001",
    name: "NeonEvents Admin",
    avatar: "NA",
    level: 4,
    levelName: "Socio/Admin",
    commissionPerTicket: 15000,
    teamSize: 89,
  },
};

interface DemoUserContextType {
  user: DemoUser;
  setUserLevel: (level: 1 | 2 | 3 | 4) => void;
}

const DemoUserContext = createContext<DemoUserContextType | undefined>(undefined);

export function DemoUserProvider({ children }: { children: ReactNode }) {
  const [userLevel, setUserLevelState] = useState<1 | 2 | 3 | 4>(1);

  const setUserLevel = (level: 1 | 2 | 3 | 4) => {
    setUserLevelState(level);
    // Store in sessionStorage for persistence during demo
    sessionStorage.setItem("demoUserLevel", level.toString());
  };

  // Check sessionStorage on initial load
  const storedLevel = sessionStorage.getItem("demoUserLevel");
  const effectiveLevel = storedLevel ? (parseInt(storedLevel) as 1 | 2 | 3 | 4) : userLevel;

  return (
    <DemoUserContext.Provider value={{ user: demoUsers[effectiveLevel], setUserLevel }}>
      {children}
    </DemoUserContext.Provider>
  );
}

export function useDemoUser() {
  const context = useContext(DemoUserContext);
  if (context === undefined) {
    throw new Error("useDemoUser must be used within a DemoUserProvider");
  }
  return context;
}

export { demoUsers };
