// components/forms/client/ClientForm.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useClientForm } from "@/hooks/useClientForm";
import { clientFormStyles as styles } from "@/styles/components/forms/ClientFormStyles";

// Import des sous-composants
import ClientInfoSection from "./ClientInfoSection";
import ClientContactSection from "./ClientContactSection";
import ClientAddressSection from "./ClientAddressSection";
import ClientAssignmentSection from "./ClientAssignmentSection";
import ClientEvaluationSection from "./ClientEvaluationSection";
import ClientSettingsSection from "./ClientSettingsSection";
import ContactsSection from "../contact/ContactsSection";

interface ClientFormProps {
  mode: "create" | "edit";
  companyId: string;
  clientId?: string;
}

const ClientForm: React.FC<ClientFormProps> = ({
  mode,
  companyId,
  clientId,
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Utilisation du hook personnalisé
  const {
    formData,
    contacts,
    company,
    users,
    teams,
    error,
    success,
    dataLoading,
    currentStep,
    totalSteps,
    steps,
    progressPercentage,
    nextStep,
    prevStep,
    handleChange,
    addContact,
    removeContact,
    handleContactChange,
    handleSubmit,
    findUserById,
    findTeamById,
    getRoutePrefix,
  } = useClientForm({
    mode,
    companyId,
    clientId,
  });

  // Affichage conditionnel pendant le chargement
  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Affichage pendant le chargement des données spécifiques à cette page
  if (dataLoading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Chargement des données...</p>
      </div>
    );
  }

  // Rendu du stepper (indicateur d'étapes)
  const renderStepper = () => (
    <div style={styles.stepperContainer}>
      <div style={styles.stepperSteps}>
        <div style={styles.stepperLine}></div>
        {steps.map((step) => (
          <div key={step.number} style={styles.stepperStep}>
            <div
              style={{
                ...styles.stepperCircle,
                ...(currentStep === step.number
                  ? styles.stepperActiveCircle
                  : {}),
                ...(currentStep > step.number
                  ? styles.stepperCompletedCircle
                  : {}),
              }}
            >
              {currentStep > step.number ? "✓" : step.number}
            </div>
            <div
              style={{
                ...styles.stepperLabel,
                ...(currentStep === step.number
                  ? styles.stepperActiveLabel
                  : {}),
              }}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.stepperProgressBar}>
        <div
          style={{
            ...styles.stepperProgress,
            width: `${progressPercentage}%`,
          }}
        ></div>
      </div>
    </div>
  );

  // Styles additionnels pour le récapitulatif en colonnes
  const twoColumnLayout = {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "20px",
  };

  const leftColumn = {
    flex: "1 1 400px",
  };

  const rightColumn = {
    flex: "1 1 300px",
  };

  // Rendu du contenu de l'étape actuelle
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={styles.container}>
            <ClientInfoSection
              name={formData.name}
              sector={formData.sector}
              description={formData.description}
              handleChange={handleChange}
            />
            <ClientSettingsSection
              isActive={formData.isActive}
              handleChange={handleChange}
            />
          </div>
        );

      case 2:
        return (
          <div style={styles.container}>
            <ClientContactSection
              email={formData.email}
              phone={formData.phone}
              handleChange={handleChange}
            />
            <ClientAddressSection
              address={formData.address}
              handleChange={handleChange}
            />
          </div>
        );

      case 3:
        return (
          <div style={styles.container}>
            <ClientAssignmentSection
              assignedTo={formData.assignedTo}
              team={formData.team}
              users={users}
              teams={teams}
              handleChange={handleChange}
            />
            <ClientEvaluationSection
              goodForCustomer={formData.goodForCustomer}
              handleChange={handleChange}
            />
          </div>
        );

      case 4:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Contacts du client</h2>
            <ContactsSection
              contacts={contacts}
              addContact={addContact}
              removeContact={removeContact}
              handleContactChange={handleContactChange}
            />
          </div>
        );

      case 5:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Récapitulatif</h2>
            <div style={twoColumnLayout}>
              {/* Colonne de gauche */}
              <div style={leftColumn}>
                <div style={styles.summaryContainer}>
                  <div style={styles.summarySection}>
                    <h3 style={styles.summarySectionTitle}>
                      Informations client
                    </h3>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Nom :</div>
                      <div style={styles.summaryValue}>{formData.name}</div>
                    </div>
                    {formData.sector && (
                      <div style={styles.summaryItem}>
                        <div style={styles.summaryLabel}>Secteur :</div>
                        <div style={styles.summaryValue}>{formData.sector}</div>
                      </div>
                    )}
                    {formData.description && (
                      <div style={styles.summaryItem}>
                        <div style={styles.summaryLabel}>Description :</div>
                        <div style={styles.summaryValue}>
                          {formData.description}
                        </div>
                      </div>
                    )}
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Statut :</div>
                      <div style={styles.summaryValue}>
                        {formData.isActive ? "Actif" : "Inactif"}
                      </div>
                    </div>
                  </div>

                  <div style={styles.summarySection}>
                    <h3 style={styles.summarySectionTitle}>Coordonnées</h3>
                    {formData.email && (
                      <div style={styles.summaryItem}>
                        <div style={styles.summaryLabel}>Email :</div>
                        <div style={styles.summaryValue}>{formData.email}</div>
                      </div>
                    )}
                    {formData.phone && (
                      <div style={styles.summaryItem}>
                        <div style={styles.summaryLabel}>Téléphone :</div>
                        <div style={styles.summaryValue}>{formData.phone}</div>
                      </div>
                    )}
                  </div>

                  {/* Adresse si renseignée */}
                  {(formData.address.street ||
                    formData.address.city ||
                    formData.address.zipCode ||
                    formData.address.country) && (
                    <div style={styles.summarySection}>
                      <h3 style={styles.summarySectionTitle}>Adresse</h3>
                      {formData.address.street && (
                        <div style={styles.summaryItem}>
                          <div style={styles.summaryLabel}>Rue :</div>
                          <div style={styles.summaryValue}>
                            {formData.address.street}
                          </div>
                        </div>
                      )}
                      {formData.address.city && (
                        <div style={styles.summaryItem}>
                          <div style={styles.summaryLabel}>Ville :</div>
                          <div style={styles.summaryValue}>
                            {formData.address.city}
                          </div>
                        </div>
                      )}
                      {formData.address.zipCode && (
                        <div style={styles.summaryItem}>
                          <div style={styles.summaryLabel}>Code postal :</div>
                          <div style={styles.summaryValue}>
                            {formData.address.zipCode}
                          </div>
                        </div>
                      )}
                      {formData.address.country && (
                        <div style={styles.summaryItem}>
                          <div style={styles.summaryLabel}>Pays :</div>
                          <div style={styles.summaryValue}>
                            {formData.address.country}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={styles.summarySection}>
                    <h3 style={styles.summarySectionTitle}>Attribution</h3>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Responsable :</div>
                      <div style={styles.summaryValue}>
                        {formData.assignedTo
                          ? findUserById(formData.assignedTo)
                          : "Non assigné"}
                      </div>
                    </div>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Équipe :</div>
                      <div style={styles.summaryValue}>
                        {formData.team
                          ? findTeamById(formData.team)
                          : "Aucune équipe"}
                      </div>
                    </div>
                  </div>

                  <div style={styles.summarySection}>
                    <h3 style={styles.summarySectionTitle}>Évaluation</h3>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>
                        Indice "bonne poire" :
                      </div>
                      <div style={styles.summaryValue}>
                        {formData.goodForCustomer}/100
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne de droite */}
              <div style={rightColumn}>
                {contacts.length > 0 && (
                  <div style={styles.summaryContainer}>
                    <div style={styles.summarySection}>
                      <h3 style={styles.summarySectionTitle}>
                        Contacts ({contacts.length})
                      </h3>
                      {contacts.map((contact, index) => (
                        <div key={index} style={styles.summaryContactItem}>
                          <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Nom :</div>
                            <div style={styles.summaryValue}>
                              {contact.firstName} {contact.lastName}
                            </div>
                          </div>
                          {contact.position && (
                            <div style={styles.summaryItem}>
                              <div style={styles.summaryLabel}>Poste :</div>
                              <div style={styles.summaryValue}>
                                {contact.position}
                              </div>
                            </div>
                          )}
                          {contact.email && (
                            <div style={styles.summaryItem}>
                              <div style={styles.summaryLabel}>Email :</div>
                              <div style={styles.summaryValue}>
                                {contact.email}
                              </div>
                            </div>
                          )}
                          {contact.phone && (
                            <div style={styles.summaryItem}>
                              <div style={styles.summaryLabel}>Téléphone :</div>
                              <div style={styles.summaryValue}>
                                {contact.phone}
                              </div>
                            </div>
                          )}
                          {contact.isPrimary && (
                            <div style={styles.summaryPrimaryContact}>
                              Contact principal
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {contacts.length === 0 && (
                  <div style={styles.summaryContainer}>
                    <div style={styles.summarySection}>
                      <h3 style={styles.summarySectionTitle}>Contacts</h3>
                      <p style={{ color: "#666", fontStyle: "italic" }}>
                        Aucun contact ajouté
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Rendu des boutons de navigation
  const renderNavigationButtons = () => (
    <div style={styles.buttonContainer}>
      {currentStep > 1 ? (
        <button type="button" onClick={prevStep} style={styles.prevButton}>
          ← Précédent
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            router.push(
              `/dashboard/${getRoutePrefix()}/manage/company/clients/${companyId}`
            );
          }}
          style={styles.cancelButton}
        >
          Annuler
        </button>
      )}

      {currentStep < totalSteps ? (
        <button type="button" onClick={nextStep} style={styles.nextButton}>
          Suivant →
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          style={styles.submitStepperButton}
        >
          {mode === "create"
            ? "Créer le client"
            : "Enregistrer les modifications"}
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            {mode === "create" ? "Ajouter un client" : "Modifier le client"}
          </h1>
          {company && (
            <p style={styles.subTitle}>
              Entreprise: <strong>{company.name}</strong>
            </p>
          )}
        </div>
        <button
          onClick={() =>
            router.push(
              `/dashboard/${getRoutePrefix()}/manage/company/clients/${companyId}`
            )
          }
          style={styles.backButton}
        >
          Retour à la liste
        </button>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}

      {success && <div style={styles.successMessage}>{success}</div>}

      {/* Stepper */}
      {renderStepper()}

      {/* Contenu de l'étape actuelle */}
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}
        {renderNavigationButtons()}
      </form>
    </div>
  );
};

export default ClientForm;
