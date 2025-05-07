export const confirmEmailStyles = {
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
  iconContainer: {
    marginBottom: "1rem",
    textAlign: "center" as const, // Ajout de "as const"
  },
  loadingIcon: {
    height: "3rem",
    width: "3rem",
    borderRadius: "50%",
    border: "2px solid #e5e7eb",
    borderTopColor: "#3b82f6",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  successIcon: {
    height: "3rem",
    width: "3rem",
    margin: "0 auto",
    color: "#10b981",
  },
  errorIcon: {
    height: "3rem",
    width: "3rem",
    margin: "0 auto",
    color: "#ef4444",
  },
  headingSuccess: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#10b981",
    textAlign: "center" as const, // Ajout de "as const"
  },
  headingError: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#ef4444",
    textAlign: "center" as const, // Ajout de "as const"
  },
  headingLoading: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#3b82f6",
    textAlign: "center" as const, // Ajout de "as const"
  },
  message: {
    color: "#4b5563",
    textAlign: "center" as const, // Ajout de "as const"
  },
  redirectMessage: {
    marginTop: "1rem",
    fontSize: "0.875rem",
    color: "#6b7280",
    textAlign: "center" as const, // Ajout de "as const"
  },
  button: {
    width: "100%",
    marginTop: "1.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#3b82f6",
    color: "white",
    borderRadius: "0.25rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};
