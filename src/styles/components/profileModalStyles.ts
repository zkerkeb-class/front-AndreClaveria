// styles/profileModalStyles.ts
import { CSSProperties } from "react";

export const profileModalStyles = {
 
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
  } as CSSProperties,

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflow: "hidden",
  } as CSSProperties,

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "#E5E7EB",
  } as CSSProperties,

  modalTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1F2937",
    margin: 0,
  } as CSSProperties,

  closeButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    borderRadius: "50%",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as CSSProperties,

  closeButtonHover: {
    backgroundColor: "#F3F4F6",
  } as CSSProperties,

  // Main content layout
  contentContainer: {
    display: "flex",
    height: "100%",
  } as CSSProperties,

  // Sidebar/Tabs
  sidebar: {
    width: "33%",
    borderRightWidth: "1px",
    borderRightStyle: "solid",
    borderRightColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  } as CSSProperties,

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
  } as CSSProperties,

  tabButtonActive: {
    backgroundColor: "#EBF5FF",
    borderLeftWidth: "3px",
    borderLeftStyle: "solid",
    borderLeftColor: "#3B82F6",
  } as CSSProperties,

  tabIconContainer: {
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
  } as CSSProperties,

  tabText: {
    fontSize: "14px",
    color: "#374151",
  } as CSSProperties,

  // Main content area
  mainContent: {
    width: "67%",
    padding: "24px 30px",
    overflowY: "auto",
  } as CSSProperties,

  // Profile section
  profileSection: {
    marginBottom: "30px",
  } as CSSProperties,

  profileHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
  } as CSSProperties,

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
    fontWeight: "bold",
    marginRight: "24px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  } as CSSProperties,

  profileInfo: {
    display: "flex",
    flexDirection: "column",
  } as CSSProperties,

  profileName: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#1F2937",
    margin: "0 0 6px 0",
  } as CSSProperties,

  profileRole: {
    fontSize: "15px",
    color: "#6B7280",
    margin: "0 0 10px 0",
  } as CSSProperties,

  roleBadge: {
    display: "inline-block",
    backgroundColor: "#DBEAFE",
    color: "#2563EB",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
  } as CSSProperties,

  // Form fields
  formField: {
    marginBottom: "24px",
  } as CSSProperties,

  fieldLabel: {
    display: "block",
    fontSize: "13px",
    color: "#6B7280",
    marginBottom: "6px",
    fontWeight: 500,
  } as CSSProperties,

  fieldValue: {
    fontSize: "15px",
    color: "#1F2937",
    padding: "4px 0",
  } as CSSProperties,

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
  } as CSSProperties,

  // Buttons
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
    cursor: "pointer",
    marginLeft: "8px",
    transition: "background-color 0.2s",
  } as CSSProperties,

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
  } as CSSProperties,

  // Language selector
  languageContainer: {
    display: "flex",
    alignItems: "center",
  } as CSSProperties,

  select: {
    padding: "10px 12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D1D5DB",
    borderRadius: "6px",
    marginRight: "10px",
    fontSize: "14px",
    minWidth: "180px",
    outline: "none",
  } as CSSProperties,

  // Error and success messages
  errorMessage: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    padding: "12px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "20px",
  } as CSSProperties,

  successMessage: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    padding: "12px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "20px",
  } as CSSProperties,

  // Security tip section
  securityTip: {
    marginTop: "32px",
    padding: "16px",
    backgroundColor: "#F3F4F6",
    borderRadius: "6px",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: "4px",
    borderLeftStyle: "solid",
    borderLeftColor: "#9CA3AF",
  } as CSSProperties,

  securityTipText: {
    fontSize: "13px",
    color: "#4B5563",
    margin: 0,
  } as CSSProperties,
};
