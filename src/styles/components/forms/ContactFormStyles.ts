// /styles/components/form/ContactStyles.ts

export const contactStyles = {
  container: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "var(--spacing-big)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-normal)",
  },
  title: {
    fontSize: "var(--font-size-medium)",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
  },
  noContactsMessage: {
    color: "var(--color-grey-600)",
    fontStyle: "italic",
  },
  maxContactsWarning: {
    color: "var(--color-warning)",
    marginBottom: "var(--spacing-normal)",
  },
  contactItem: {
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-radius)",
    padding: "var(--spacing-normal)",
    marginBottom: "var(--spacing-normal)",
  },
  contactHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "var(--spacing-normal)",
  },
  contactTitle: {
    fontSize: "var(--font-size-normal)",
  },
  deleteButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-red)",
    color: "var(--color-text)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
  },
  formGroup: {
    marginBottom: "var(--spacing-normal)",
  },
  flexRow: {
    display: "flex",
    gap: "var(--spacing-normal)",
    marginBottom: "var(--spacing-normal)",
  },
  flexColumn: {
    flex: 1,
  },
  label: {
    display: "block",
    marginBottom: "var(--spacing-small)",
  },
  requiredField: {
    color: "var(--color-red)",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    marginRight: "var(--spacing-small)",
  },
};
