// /styles/components/forms/OpportunityFormStyles.ts
export const opportunityFormStyles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    fontSize: "16px",
    color: "#666",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  title: {
    fontSize: "24px",
    margin: "0 0 4px 0",
    fontWeight: "600",
  },

  subTitle: {
    fontSize: "16px",
    color: "#666",
    margin: "0",
  },

  backButton: {
    padding: "8px 16px",
    background: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },

  errorMessage: {
    padding: "12px 16px",
    backgroundColor: "#ffebee",
    color: "#d32f2f",
    borderRadius: "4px",
    marginBottom: "20px",
    border: "1px solid #ffcdd2",
  },

  successMessage: {
    padding: "12px 16px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "4px",
    marginBottom: "20px",
    border: "1px solid #c8e6c9",
  },

  // Stepper styles
  stepperContainer: {
    marginBottom: "30px",
  },

  stepperSteps: {
    display: "flex",
    justifyContent: "space-between",
    position: "relative" as "relative",
    marginBottom: "10px",
  },

  stepperLine: {
    position: "absolute" as "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    height: "2px",
    background: "#e0e0e0",
    width: "100%",
    zIndex: 0,
  },

  stepperStep: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    position: "relative" as "relative",
    zIndex: 1,
  },

  stepperCircle: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#fff",
    border: "2px solid #e0e0e0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "8px",
    color: "#666",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
  },

  stepperActiveCircle: {
    border: "2px solid #2196f3",
    color: "#2196f3",
  },

  stepperCompletedCircle: {
    border: "2px solid #4caf50",
    background: "#4caf50",
    color: "#fff",
  },

  stepperLabel: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "400",
    transition: "all 0.2s",
  },

  stepperActiveLabel: {
    color: "#2196f3",
    fontWeight: "600",
  },

  stepperProgressBar: {
    height: "4px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
  },

  stepperProgress: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },

  // Section styles
  container: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },

  sectionContainer: {
    marginBottom: "30px",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginTop: "0",
    marginBottom: "20px",
  },

  subSectionTitle: {
    fontSize: "18px",
    fontWeight: "500",
    marginTop: "0",
    marginBottom: "16px",
    color: "#333",
  },

  formGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#333",
  },

  required: {
    color: "red",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    transition: "border-color 0.2s",
  },

  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundImage:
      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "16px",
  },

  helperText: {
    display: "block",
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
  },

  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },

  checkbox: {
    marginRight: "8px",
  },

  checkboxLabel: {
    fontSize: "14px",
    color: "#333",
  },

  // Slider styles
  sliderContainer: {
    marginTop: "12px",
  },

  slider: {
    width: "100%",
    margin: "0",
  },

  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "4px",
    fontSize: "12px",
    color: "#666",
  },

  // Product section styles
  productListHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  addButton: {
    padding: "8px 16px",
    backgroundColor: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },

  emptyState: {
    padding: "24px",
    textAlign: "center" as "center",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    color: "#666",
  },

  productCard: {
    padding: "16px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    marginBottom: "16px",
    border: "1px solid #eee",
  },

  productCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  productTitle: {
    margin: "0",
    fontSize: "16px",
    fontWeight: "500",
  },

  removeButton: {
    padding: "4px 8px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    transition: "background-color 0.2s",
  },

  productFormGroup: {
    marginBottom: "12px",
  },

  productRow: {
    display: "flex",
    gap: "16px",
  },

  productTotal: {
    padding: "10px 12px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    fontWeight: "600",
  },

  totalSection: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "20px",
    padding: "12px 16px",
    backgroundColor: "#e8f5e9",
    borderRadius: "4px",
  },

  totalLabel: {
    fontWeight: "600",
    marginRight: "12px",
  },

  totalValue: {
    fontWeight: "700",
    fontSize: "18px",
    color: "#2e7d32",
  },

  // Contact section styles
  contactsContainer: {
    marginTop: "16px",
    maxHeight: "300px",
    overflowY: "auto" as "auto",
    padding: "4px",
  },

  contactCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #eee",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  contactCardSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#90caf9",
  },

  contactCheckbox: {
    marginRight: "12px",
  },

  contactInfo: {
    flex: "1",
  },

  contactName: {
    fontWeight: "600",
    marginBottom: "4px",
  },

  contactPosition: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "2px",
  },

  contactEmail: {
    fontSize: "13px",
    color: "#666",
  },

  noResults: {
    padding: "12px",
    textAlign: "center" as "center",
    color: "#666",
    fontStyle: "italic",
  },

  selectedSummary: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#2196f3",
    fontWeight: "500",
  },

  // Navigation buttons
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
  },

  prevButton: {
    padding: "10px 20px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },

  nextButton: {
    padding: "10px 20px",
    backgroundColor: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },

  submitStepperButton: {
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },

  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },

  // Summary styles
  summaryContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
  },

  summarySection: {
    marginBottom: "20px",
  },

  summarySectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "0",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #eee",
  },

  summaryItem: {
    display: "flex",
    marginBottom: "8px",
  },

  summaryLabel: {
    flex: "0 0 150px",
    fontWeight: "500",
    color: "#555",
  },

  summaryValue: {
    flex: "1",
  },

  summaryContactItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    padding: "12px",
    marginBottom: "12px",
  },

  summaryPrimaryContact: {
    display: "inline-block",
    padding: "4px 8px",
    backgroundColor: "#2196f3",
    color: "white",
    borderRadius: "4px",
    fontSize: "12px",
    marginTop: "8px",
  },
};

// Exportation pour permettre à d'autres composants d'y accéder
export const styles = opportunityFormStyles;
