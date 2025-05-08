// /styles/components/form/ContactStyles.ts
import { CSSProperties } from "react";

export const contactStyles: Record<string, CSSProperties> = {
  container: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: {
    fontSize: "18px",
  },
  addButton: {
    padding: "8px 16px",
    backgroundColor: "#4c84ff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  noContactsMessage: {
    color: "#666",
    fontStyle: "italic",
  },
  maxContactsWarning: {
    color: "#ff9800",
    marginBottom: "16px",
  },
  contactItem: {
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
  },
  contactHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  contactTitle: {
    fontSize: "16px",
  },
  deleteButton: {
    padding: "4px 8px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  formGroup: {
    marginBottom: "16px",
  },
  flexRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
  },
  flexColumn: {
    flex: 1,
  },
  label: {
    display: "block",
    marginBottom: "8px",
  },
  requiredField: {
    color: "red",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    marginRight: "8px",
  },
};
