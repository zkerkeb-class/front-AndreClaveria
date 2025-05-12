"use client";
import React, { ReactNode, useState, useEffect } from "react";
import NavBar from "@/components/common/NavBar";
import { NavbarProvider } from "@/contexts/NavBarContext";
import { useAuth } from "@/contexts/AuthContext";
import { useScrollableBody } from "@/hooks/useScrollableBody";
import { dashboardStyles as styles } from "@/styles/pages/dashboard/dashboardStyles";
import { CSSProperties } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Contexte pour le thème
const ThemeContext = React.createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => React.useContext(ThemeContext);

// Fournisseur de thème
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialiser le thème en fonction des préférences stockées
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier le thème sauvegardé dans localStorage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Composant interne qui utilise le contexte d'authentification
const DashboardContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);
  const { isDarkMode } = useTheme();

  // Utilisation du hook personnalisé pour rendre le body scrollable
  useScrollableBody();

  if (isLoading) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Style du contenu principal
  const contentStyle: CSSProperties = {
    ...styles.contentArea,
    ...(hoveredIcon !== null ? styles.contentWithMenu : {}),
    // Ajoutez des styles spécifiques au thème sombre si nécessaire
    ...(isDarkMode
      ? { backgroundColor: "var(--color-white)", color: "var(--color-text)" }
      : {}),
  };

  // Style fixe pour la barre latérale (ne change pas en mode sombre)
  const sidebarStyle: CSSProperties = {
    ...styles.fixedSidebar,
    backgroundColor: "#1F2937", // Couleur fixe, ne changera pas avec le thème
  };

  return (
    <div style={styles.globalContainer}>
      <div style={sidebarStyle}>
        <NavBar user={user} />
      </div>
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

// Layout principal qui fournit les contextes
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <NavbarProvider>
        <DashboardContent>{children}</DashboardContent>
      </NavbarProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;
