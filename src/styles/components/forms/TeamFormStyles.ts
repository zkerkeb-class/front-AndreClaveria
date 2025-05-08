// /styles/components/form/TeamFormStyles.ts

export const teamFormStyles = {
  container: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
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
  formGroup: {
    marginBottom: "16px",
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
  helperText: {
    fontSize: "14px",
    color: "#666",
    marginTop: "4px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    marginRight: "8px",
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
};
