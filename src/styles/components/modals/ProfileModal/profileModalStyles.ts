import { CSSProperties } from "react";

export const profileModalStyles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    overflow: "hidden",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "#E5E7EB",
  },

  modalTitle: {
    fontSize: "25px",
    fontFamily: '"Lexend-Bold", sans-serif',
    color: "#1F2937",
    margin: 10,
  },

  closeButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    borderRadius: "50%",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonHover: {
    backgroundColor: "#F3F4F6",
  },

  contentContainer: {
    display: "flex",
    height: "100%",
  },

  tabButton: {
    width: "100%",
    padding: "14px 16px",
    textAlign: "left",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.2s",
  },

  tabButtonActive: {
    backgroundColor: "#EBF5FF",
    borderLeftWidth: "3px",
    borderLeftStyle: "solid",
    borderLeftColor: "#3B82F6",
  },

  mainContent: {
    width: "67%",
    padding: "24px 30px",
    overflowY: "auto",
  },

  inputField: {
    width: "85%",
    padding: "10px 12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D1D5DB",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "border-color 0.2s",
    outline: "none",
  },

  buttonPrimary: {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: "6px",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    minWidth: "140px",
  },

  sidebar: {
    width: "33%",
    borderRightWidth: "1px",
    borderRightStyle: "solid",
    borderRightColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },

  tabIconContainer: {
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
  },

  h3: {
    fontFamily: '"Lexend-Regular", sans-serif',
    fontSize: "15px",
    color: "#374151",
  },

  profileHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
  },

  avatar: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontFamily: '"Lexend-Bold", sans-serif',
    marginRight: "24px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },

  profileInfo: {
    display: "flex",
    flexDirection: "column",
  },

  h2: {
    fontSize: "22px",
    fontFamily: '"Lexend-Bold", sans-serif',
    color: "#1F2937",
    margin: "0 0 6px 0",
  },

  roleBadge: {
    display: "inline-block",
    backgroundColor: "#DBEAFE",
    color: "#2563EB",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: '"Lexend-Bold", sans-serif',
  },

  formField: {
    marginTop: "15px",
    marginBottom: "24px",
  },

  fieldLabel: {
    display: "block",
    fontSize: "13px",
    color: "#6B7280",
    marginBottom: "6px",
    fontFamily: '"Lexend-SemiBold", sans-serif',
  },

  fieldValue: {
    fontSize: "15px",
    color: "#1F2937",
    padding: "4px 0",
    fontFamily: '"Lexend-Regular", sans-serif',
  },

  languageContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "15px",
    marginBottom: "15px",
  },

  select: {
    padding: "10px 12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D1D5DB",
    borderRadius: "6px",
    marginRight: "10px",
    fontSize: "14px",
    minWidth: "150px",
    outline: "none",
  },

  button: {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "14px",
    fontFamily: '"Lexend-Regular", sans-serif',
    cursor: "pointer",
    marginLeft: "8px",
    transition: "background-color 0.2s",
  },

  p: {
    fontSize: "13px",
    color: "#6B7280",
    fontFamily: '"Lexend-Regular", sans-serif',
  },

  info: {
    marginTop: "30px",
    padding: "12px",
    backgroundColor: "#F3F4F6",
    borderRadius: "4px",
  },

  error: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    padding: "10px 12px",
    borderRadius: "4px",
    marginBottom: "16px",
  },

  sucess: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    padding: "10px 12px",
    borderRadius: "4px",
    marginBottom: "16px",
  },

  errorStateModalContainer: {
    maxHeight: "85vh",
    minHeight: "540px",
  },

  errorStateMainContent: {
    minHeight: "450px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  errorStateBox: {
    padding: "20px",
    backgroundColor: "#FEF2F2",
    borderRadius: "8px",
    maxWidth: "400px",
    textAlign: "center",
  },

  errorStateTitle: {
    color: "#B91C1C",
    marginBottom: "12px",
  },

  errorStateText: {
    marginBottom: "16px",
  },

  errorStateButton: {
    backgroundColor: "#3B82F6",
    color: "white",
    borderWidth: 0,
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
