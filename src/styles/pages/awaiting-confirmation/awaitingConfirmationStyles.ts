export const awaitingConfirmationStyles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  card: {
    maxWidth: "450px",
    width: "100%",
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    textAlign: "center" as const, // Ajout de "as const"
    marginBottom: "1.5rem",
  },
  logo: {
    width: "80px",
    height: "auto",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#f59e0b",
    textAlign: "center" as const, // Ajout de "as const"
  },
  subtitle: {
    color: "#4b5563",
    textAlign: "center" as const, // Ajout de "as const"
    marginBottom: "1.5rem",
  },
  alertSuccess: {
    padding: "0.75rem",
    borderRadius: "0.25rem",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    marginBottom: "1rem",
  },
  alertError: {
    padding: "0.75rem",
    borderRadius: "0.25rem",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    marginBottom: "1rem",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column" as const, // Ajout de "as const"
    gap: "0.75rem",
  },
  primaryButton: {
    width: "100%",
    padding: "0.5rem 1rem",
    backgroundColor: "#3b82f6",
    color: "white",
    borderRadius: "0.25rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  primaryButtonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  },
  secondaryButton: {
    width: "100%",
    padding: "0.5rem 1rem",
    backgroundColor: "#e5e7eb",
    color: "#1f2937",
    borderRadius: "0.25rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  footnote: {
    marginTop: "1.5rem",
    fontSize: "0.875rem",
    color: "#6b7280",
    textAlign: "center" as const, // Ajout de "as const"
  },
};
