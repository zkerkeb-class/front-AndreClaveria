"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface NavbarContextType {
  hoveredIcon: number | null;
  setHoveredIcon: (index: number | null) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  return (
    <NavbarContext.Provider value={{ hoveredIcon, setHoveredIcon }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};
