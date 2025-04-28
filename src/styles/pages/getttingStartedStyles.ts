// styles/gettingStartedStyles.ts

export const gettingStartedStyles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    padding: "3rem 1rem",
    backgroundColor: "#f9fafb",
  },

  formWrapper: {
    width: "100%",
    maxWidth: "28rem",
    margin: "0 auto",
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },

  logo: {
    borderRadius: "9999px",
    objectFit: "cover" as const,
  },

  title: {
    fontSize: "1.875rem",
    fontWeight: "800",
    color: "#111827",
    textAlign: "center" as const,
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
  },

  subtitle: {
    fontSize: "0.875rem",
    color: "#6b7280",
    textAlign: "center" as const,
    marginBottom: "2rem",
  },

  form: {
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.5rem",
  },

  inputGroup: {
    marginBottom: "1rem",
  },

  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.5rem",
  },

  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
  },

  inputFocus: {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  },

  errorContainer: {
    backgroundColor: "rgba(255, 77, 79, 0.1)",
    color: "#ff4d4f",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    marginBottom: "1rem",
    fontSize: "0.875rem",
    textAlign: "center" as const,
  },

  captchaContainer: {
    padding: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    backgroundColor: "#f3f4f6",
    marginBottom: "1rem",
  },

  captchaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },

  captchaTitle: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
  },

  captchaButton: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.75rem",
    borderRadius: "0.25rem",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    fontSize: "0.75rem",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.15s ease-in-out",
  },

  captchaButtonHover: {
    backgroundColor: "#2563eb",
  },

  captchaPlaceholder: {
    height: "4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb",
    color: "#6b7280",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },

  captchaInfo: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.25rem",
  },

  submitButton: {
    position: "relative" as const,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    fontWeight: "500",
    fontSize: "0.875rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.15s ease-in-out",
  },

  submitButtonHover: {
    backgroundColor: "#2563eb",
  },

  submitButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  spinner: {
    position: "absolute" as const,
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    width: "1.25rem",
    height: "1.25rem",
  },
};
