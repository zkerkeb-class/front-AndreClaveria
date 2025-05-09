"use client";
import React, { ReactNode, useState, useEffect } from "react";
import NavBar from "@/components/common/NavBar";
import { NavbarProvider } from "@/contexts/NavBarContext";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardStyles as styles } from "@/styles/pages/dashboard/dashboardStyles";
import { CSSProperties } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Composant interne qui utilise le contexte d'authentification
const DashboardContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  // Force le style HTML/body pour permettre le défilement
  useEffect(() => {
    // Sauvegarde des styles originaux
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    // Application des styles qui permettent le défilement
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.height = "auto";

    // Nettoyage à la désinstallation du composant
    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  if (isLoading) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Style du contenu principal
  const contentStyle: CSSProperties = {
    ...styles.contentArea,
    ...(hoveredIcon !== null ? styles.contentWithMenu : {}),
  };

  return (
    <div style={styles.globalContainer}>
      <div style={styles.fixedSidebar}>
        <NavBar user={user} />
      </div>
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
