"use client";
import React, { ReactNode, useState } from "react";
import NavBar from "@/components/common/NavBar";
import { NavbarProvider } from "@/contexts/NavBarContext";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardStyles } from "@/styles/dashboardStyles";
import { CSSProperties } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Composant interne qui utilise le contexte d'authentification
const DashboardContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  if (isLoading) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Style du contenu principal
  const contentStyle: CSSProperties = {
    ...dashboardStyles.content,
    ...(hoveredIcon !== null
      ? dashboardStyles.contentWithMenu
      : dashboardStyles.contentFullWidth),
  };

  return (
    <div style={dashboardStyles.container}>
      <NavBar user={user} />
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

// Layout principal qui fournit les contextes
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <NavbarProvider>
      <DashboardContent>{children}</DashboardContent>
    </NavbarProvider>
  );
};

export default DashboardLayout;
