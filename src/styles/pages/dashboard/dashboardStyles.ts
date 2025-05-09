import { CSSProperties } from "react";

export const dashboardStyles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    width: "100%",
    margin: 0,
    padding: 0,
    position: "relative",
    minHeight: "100vh", // Utiliser minHeight au lieu de height fixe
    overflowY: "visible", // Permettre le défilement vertical
  },
  sidebar: {
    width: "80px",
    backgroundColor: "#1F2937",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    color: "#FFFFFF",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    position: "fixed", // Modifié en fixed pour rester visible pendant le défilement
    zIndex: 10,
    height: "100vh",
    top: 0,
    left: 0,
  },
  navigation: {
    width: "180px",
    backgroundColor: "#F6F7FB",
    padding: "1rem 0",
    paddingTop: "8rem", // Espace pour aligner avec l'icône
    margin: 0,
    transition: "all 0.3s ease",
    position: "fixed", // Modifié en fixed pour rester visible pendant le défilement
    left: "80px",
    top: 0,
    height: "100vh",
    zIndex: 5,
    boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
    overflowY: "auto", // Permettre le défilement de la navigation
  },
  navigationHidden: {
    display: "none",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: 500,
    color: "#4B5563",
    transition: "all 0.2s",
    borderLeft: "3px solid transparent",
  },
  navItemActive: {
    borderLeft: "3px solid #3B82F6",
    color: "#1F2937",
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
  content: {
    flex: 1,
    padding: "2rem",
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    margin: 0,
    transition: "margin-left 0.3s ease",
    marginLeft: "80px",
    width: "calc(100% - 80px)",
    minHeight: "100vh",
    height: "auto",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  contentWithMenu: {
    marginLeft: "260px", // 80px (sidebar) + 180px (navigation)
    width: "calc(100% - 260px)",
  },
  contentFullWidth: {
    marginLeft: "80px",
    width: "calc(100% - 80px)",
  },
  welcomeCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: "0.5rem",
    padding: "2rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
    width: "100%",
  },
  welcomeTitle: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#111827",
  },
  welcomeText: {
    color: "#4B5563",
    marginBottom: "1.5rem",
    fontSize: "1.1rem",
  },
  logoContainer: {
    marginBottom: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "60px",
    height: "60px",
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "contain",
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "60px",
    height: "60px",
    marginBottom: "1rem",
    borderRadius: "0.25rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  iconButtonActive: {
    backgroundColor: "#374151",
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    backgroundColor: "#EF4444",
    color: "#FFFFFF",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.25rem",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "1rem",
    fontWeight: 500,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100%",
    backgroundColor: "#F9FAFB",
    fontSize: "1.25rem",
    color: "#4B5563",
  },
  svgIcon: {
    width: "28px",
    height: "28px",
  },
  menuToggle: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  // Styles pour les menus spécifiques aux icônes
  navigationDashboard: {
    display: "none", // Caché par défaut, sera affiché au survol
  },
  navigationPhone: {
    display: "none",
  },
  navigationEmail: {
    display: "none",
  },
  navigationCalendar: {
    display: "none",
  },
  // Styles pour quand les menus sont visibles
  navigationDashboardVisible: {
    display: "block",
  },
  navigationPhoneVisible: {
    display: "block",
  },
  navigationEmailVisible: {
    display: "block",
  },
  navigationCalendarVisible: {
    display: "block",
  },
  // Styles additionnels pour la solution de défilement
  globalContainer: {
    display: "flex",
    width: "100%",
    position: "relative",
    margin: 0,
    padding: 0,
    minHeight: "100vh",
  },
  fixedSidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "80px",
    height: "100vh",
    zIndex: 10,
    backgroundColor: "#1F2937",
    overflow: "visible",
  },
  contentArea: {
    marginLeft: "80px",
    width: "calc(100% - 80px)",
    padding: "2rem",
    overflowY: "auto",
    height: "auto",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
};
