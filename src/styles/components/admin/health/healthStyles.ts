import { CSSProperties } from "react";

export const healthStyles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #E5E7EB",
  },

  title: {
    fontSize: "28px",
    fontFamily: '"Lexend-Bold", sans-serif',
    color: "#1F2937",
    margin: 0,
  },

  actions: {
    display: "flex",
    gap: "8px",
  },

  refreshButton: {
    padding: "10px 16px",
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: '"Lexend-Regular", sans-serif',
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  statusOverview: {
    marginBottom: "24px",
  },

  overviewCard: {
    padding: "20px",
    backgroundColor: "#F9FAFB",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #E5E7EB",
  },

  lastUpdated: {
    fontSize: "13px",
    color: "#6B7280",
    marginTop: "8px",
    fontFamily: '"Lexend-Regular", sans-serif',
  },

  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },

  serviceCard: {
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #E5E7EB",
    transition: "all 0.2s ease",
  },

  serviceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #E5E7EB",
  },

  statusBadge: {
    fontSize: "12px",
    fontFamily: '"Lexend-Bold", sans-serif',
    padding: "4px 8px",
    borderRadius: "4px",
    display: "inline-block",
  },

  statusUp: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    border: "1px solid #BBF7D0",
  },

  statusDown: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    border: "1px solid #FECACA",
  },

  serviceDetails: {
    fontSize: "14px",
    fontFamily: '"Lexend-Regular", sans-serif',
  },

  errorDetails: {
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "#FEF2F2",
    borderRadius: "4px",
    color: "#B91C1C",
  },

  timestamp: {
    fontSize: "12px",
    color: "#6B7280",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },

  loadingSpinner: {
    width: "32px",
    height: "32px",
    border: "4px solid #E5E7EB",
    borderTop: "4px solid #3B82F6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },

  errorPanel: {
    padding: "16px",
    marginBottom: "24px",
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    borderRadius: "6px",
    border: "1px solid #FECACA",
  },
};

// Vous devrez ajouter cette animation à votre CSS global
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
