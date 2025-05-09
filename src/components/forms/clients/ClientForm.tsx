"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createClient,
  updateClient,
  getClientById,
  Client,
} from "@/services/client.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, User } from "@/services/user.service";
import { getTeamsByCompany, Team } from "@/services/team.service";
import { clientFormStyles as styles } from "@/styles/components/forms/ClientFormStyles";

// Import des sous-composants
import ClientInfoSection from "./ClientInfoSection";
import ClientContactSection from "./ClientContactSection";
import ClientAddressSection from "./ClientAddressSection";
import ClientAssignmentSection from "./ClientAssignmentSection";
import ClientEvaluationSection from "./ClientEvaluationSection";
import ClientSettingsSection from "./ClientSettingsSection";
import ContactsSection from "../contact/ContactsSection";
import { ContactFormData } from "../contact/type";
import {
  getContactById,
  Contact,
  getContactsByClient,
} from "@/services/contact.service";

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
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [originalClient, setOriginalClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sector: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      zipCode: "",
      country: "",
    },
    assignedTo: "",
    team: "",
    goodForCustomer: 50,
    isActive: true,
  });
  const [contacts, setContacts] = useState<ContactFormData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // État pour la gestion des étapes
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Définition des étapes
  const steps = [
    { number: 1, label: "Informations" },
    { number: 2, label: "Coordonnées & Adresse" },
    { number: 3, label: "Attribution" },
    { number: 4, label: "Contacts" },
    { number: 5, label: "Récapitulatif" },
  ];

  // Vérification des droits d'accès
  useEffect(() => {
    if (
      !isLoading &&
      user &&
      !["admin", "manager", "user"].includes(user.role)
    ) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Chargement des données initiales
  // Dans la fonction useEffect qui charge les données initiales
  // Dans ClientForm.tsx, modifions le useEffect pour charger correctement les contacts en mode édition
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user || !["admin", "manager", "user"].includes(user.role)) {
        return;
      }

      try {
        setDataLoading(true);

        // Récupération des détails de l'entreprise
        const companyData = await getCompanyById(companyId);
        if (isMounted) setCompany(companyData);

        // Récupération des utilisateurs
        const usersData = await getAllUsers();
        if (isMounted) setUsers(usersData);

        // Récupération des équipes de l'entreprise
        const teamsData = await getTeamsByCompany(companyId);
        if (isMounted) setTeams(teamsData);

        // En mode édition, charger les données du client
        if (mode === "edit" && clientId) {
          console.log(
            "Mode édition: chargement des données du client",
            clientId
          );
          const clientData = await getClientById(clientId);
          console.log("Données client reçues:", clientData);

          if (isMounted) {
            setOriginalClient(clientData);

            // Vérifier et extraire correctement les valeurs des propriétés
            const assignedToId =
              typeof clientData.assignedTo === "object" && clientData.assignedTo
                ? clientData.assignedTo
                : clientData.assignedTo;

            const teamId =
              typeof clientData.team === "object" && clientData.team
                ? clientData.team
                : clientData.team;

            // Mise à jour du formulaire avec les données du client
            setFormData({
              name: clientData.name || "",
              description: clientData.description || "",
              sector: clientData.sector || "",
              email: clientData.email || "",
              phone: clientData.phone || "",
              address: {
                street: clientData.address?.street || "",
                city: clientData.address?.city || "",
                zipCode: clientData.address?.zipCode || "",
                country: clientData.address?.country || "",
              },
              assignedTo: assignedToId || "",
              team: teamId || "",
              goodForCustomer: clientData.goodForCustomer || 50,
              isActive:
                clientData.isActive !== undefined ? clientData.isActive : true,
            });

            // Chargement explicite des contacts du client via appel API séparé
            try {
              console.log("Chargement des contacts pour le client:", clientId);
              const contactsData = await getContactsByClient(clientId);
              console.log("Contacts récupérés:", contactsData);

              // Vérifier que la réponse a le bon format
              if (
                contactsData &&
                typeof contactsData === "object" &&
                "data" in contactsData &&
                Array.isArray(contactsData.data)
              ) {
                // Si la structure est { success, count, data }
                console.log(
                  "Contacts extraits de la structure API:",
                  contactsData.data
                );

                if (isMounted) {
                  setContacts(
                    contactsData.data.map((contact: any) => ({
                      _id: contact._id || "",
                      firstName: contact.firstName || "",
                      lastName: contact.lastName || "",
                      position: contact.position || "",
                      email: contact.email || "",
                      phone: contact.phone || "",
                      mobile: contact.mobile || "",
                      isPrimary: contact.isPrimary || false,
                      notes: contact.notes || "",
                    }))
                  );
                }
              } else if (Array.isArray(contactsData)) {
                // Si la réponse est directement un tableau
                console.log("Contacts reçus au format tableau:", contactsData);

                if (isMounted) {
                  setContacts(
                    contactsData.map((contact: any) => ({
                      _id: contact._id || "",
                      firstName: contact.firstName || "",
                      lastName: contact.lastName || "",
                      position: contact.position || "",
                      email: contact.email || "",
                      phone: contact.phone || "",
                      mobile: contact.mobile || "",
                      isPrimary: contact.isPrimary || false,
                      notes: contact.notes || "",
                    }))
                  );
                }
              } else {
                console.error(
                  "Format de données de contacts inattendu:",
                  contactsData
                );
                if (isMounted) setContacts([]);
              }
            } catch (contactError) {
              console.error(
                "Erreur lors de la récupération des contacts:",
                contactError
              );
              if (isMounted) setContacts([]); // Initialiser avec un tableau vide en cas d'erreur
            }
          }
        }

        if (isMounted) setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des données:", err);
        if (isMounted)
          setError("Impossible de charger les données nécessaires.");
      } finally {
        if (isMounted) setDataLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [companyId, clientId, user, mode]);
  // Navigation entre les étapes
  const nextStep = () => {
    // Validation de l'étape actuelle avant de passer à la suivante
    if (currentStep === 1 && !formData.name) {
      setError("Le nom du client est obligatoire");
      return;
    }

    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Calcul du pourcentage de progression
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Gestion des changements des champs du formulaire client
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name.includes(".")) {
      // Gestion des champs imbriqués (comme address.street)
      const [parent, child] = name.split(".");
      setFormData((prev) => {
        // Utiliser une assertion de type pour indiquer à TypeScript que
        // prev[parent] est un objet Record<string, any>
        const parentObj = prev[parent as keyof typeof prev] as Record<
          string,
          any
        >;

        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value,
          },
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gestion des contacts
  const addContact = () => {
    setContacts([
      ...contacts,
      {
        firstName: "",
        lastName: "",
        position: "",
        email: "",
        phone: "",
        mobile: "",
        isPrimary: false,
        notes: "",
      },
    ]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleContactChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newContacts = [...contacts];

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      newContacts[index] = { ...newContacts[index], [name]: checked };
    } else {
      newContacts[index] = { ...newContacts[index], [name]: value };
    }

    setContacts(newContacts);
  };

  // Soumission du formulaire
  // Mise à jour de la fonction handleSubmit dans ClientForm.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation finale
    if (!formData.name) {
      setError("Le nom du client est obligatoire");
      return;
    }

    try {
      const actionText = mode === "create" ? "Création" : "Mise à jour";
      setLoadingWithMessage(true, `${actionText} du client...`);

      // Filtrer les contacts valides
      const validContacts = contacts
        .filter((c) => c.firstName && c.lastName)
        .map((c) => ({
          _id: c._id, // Conserver l'ID pour les contacts existants
          firstName: c.firstName,
          lastName: c.lastName,
          position: c.position || undefined,
          email: c.email || undefined,
          phone: c.phone || undefined,
          mobile: c.mobile || undefined,
          isPrimary: c.isPrimary || false,
          notes: c.notes || undefined,
        }));

      console.log("Contacts valides préparés:", validContacts);

      // Préparer des données client épurées
      const clientData = {
        name: formData.name,
        description: formData.description || undefined,
        sector: formData.sector || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address:
          formData.address.street ||
          formData.address.city ||
          formData.address.zipCode ||
          formData.address.country
            ? {
                street: formData.address.street || undefined,
                city: formData.address.city || undefined,
                zipCode: formData.address.zipCode || undefined,
                country: formData.address.country || undefined,
              }
            : undefined,
        company: companyId,
        team: formData.team || undefined,
        assignedTo: formData.assignedTo || undefined,
        goodForCustomer: formData.goodForCustomer,
        isActive: formData.isActive,
      };

      let clientResponse;

      if (mode === "create") {
        // Ajouter les contacts au payload pour la création du client
        const clientWithContacts = {
          ...clientData,
          contacts: validContacts.length > 0 ? validContacts : undefined,
        };

        console.log(
          "Données complètes pour création du client:",
          clientWithContacts
        );

        // Créer le client avec les contacts en une seule requête
        clientResponse = await createClient(clientWithContacts as any);
        console.log("Client créé avec succès:", clientResponse);

        setSuccess(`Client ${clientResponse.name} créé avec succès !`);
      } else {
        // Ajouter les contacts au payload pour la mise à jour du client
        const clientWithContacts = {
          ...clientData,
          contacts: validContacts.length > 0 ? validContacts : undefined,
        };

        console.log(
          "Données complètes pour mise à jour du client:",
          clientWithContacts
        );

        // Mettre à jour le client avec les contacts en une seule requête
        clientResponse = await updateClient(
          clientId!,
          clientWithContacts as any
        );
        console.log("Client mis à jour avec succès:", clientResponse);

        setSuccess(`Client ${clientResponse.name} mis à jour avec succès !`);
      }

      // Redirection après 2 secondes
      setTimeout(() => {
        const routePrefix = user?.role === "admin" ? "admin" : "manager";
        router.push(
          `/dashboard/${routePrefix}/manage/company/clients/${companyId}`
        );
      }, 2000);
    } catch (err: any) {
      console.error(
        `Erreur lors de la ${
          mode === "create" ? "création" : "mise à jour"
        } du client:`,
        err
      );
      setError(
        err.message ||
          `Une erreur est survenue lors de la ${
            mode === "create" ? "création" : "mise à jour"
          } du client`
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };
  // Affichage conditionnel pendant le chargement initial
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

  // Déterminer le préfixe de route pour la navigation
  const routePrefix = user?.role === "admin" ? "admin" : "manager";

  // Trouver un utilisateur ou une équipe par ID
  const findUserById = (id: string) => {
    return users.find((u) => u._id === id)?.firstName || "Non assigné";
  };

  const findTeamById = (id: string) => {
    return teams.find((t) => t._id === id)?.name || "Aucune équipe";
  };

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
            <h2 style={styles.sectionTitle}>Informations du client</h2>
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
            <h2 style={styles.sectionTitle}>Coordonnées et adresse</h2>
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
            <h2 style={styles.sectionTitle}>Attribution et évaluation</h2>
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
              `/dashboard/${routePrefix}/manage/company/clients/${companyId}`
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
              `/dashboard/${routePrefix}/manage/company/clients/${companyId}`
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
