// /styles/components/form/ClientFormStyles.ts
import { CSSProperties } from "react";

export const clientFormStyles: Record<string, CSSProperties> = {
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
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "8px",
  },
  subTitle: {
    color: "#666",
  },
  backButton: {
    padding: "10px 16px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
  },
  errorMessage: {
    padding: "12px",
    backgroundColor: "#ffebee",
    color: "#d32f2f",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  successMessage: {
    padding: "12px",
    backgroundColor: "#e6f7e6",
    color: "#2e7d32",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    marginBottom: "16px",
  },
  subsectionTitle: {
    fontSize: "16px",
    marginBottom: "12px",
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
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    resize: "vertical" as const,
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  rangeInput: {
    width: "100%",
  },
  rangeLegend: {
    display: "flex",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    marginRight: "8px",
  },
  contactsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  addContactButton: {
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
  contactItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  contactItemTitle: {
    fontSize: "16px",
  },
  deleteContactButton: {
    padding: "4px 8px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginTop: "24px",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#4c84ff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 500,
  },
  loadingContainer: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  errorContainer: {
    padding: "20px",
    color: "#d32f2f",
  },
};
