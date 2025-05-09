// /components/forms/opportunities/OpportunityForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createOpportunity,
  updateOpportunity,
  getOpportunityById,
  Opportunity,
  Product,
} from "@/services/opportunity.service";
import { getClientById, Client } from "@/services/client.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, User } from "@/services/user.service";
import { getContactsByClient, Contact } from "@/services/contact.service";
import { opportunityFormStyles as styles } from "@/styles/components/forms/OpportunityFormStyles";

// Import des sous-composants
import OpportunityInfoSection from "./OpportunityInfoSection";
import OpportunityValueSection from "./OpportunityValueSection";
import OpportunityStatusSection from "./OpportunityStatusSection";
import OpportunityAssignmentSection from "./OpportunityAssignmentSection";
import OpportunityNotesSection from "./OpportunityNotesSection";
import OpportunityProductsSection from "./OpportunityProductsSection";
import OpportunityContactsSection from "./OpportunityContactsSection";

interface OpportunityFormProps {
  mode: "create" | "edit";
  companyId: string;
  clientId: string;
  opportunityId?: string;
}

// Interface pour les produits dans le formulaire
export interface ProductFormData {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  mode,
  companyId,
  clientId,
  opportunityId,
}) => {
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [originalOpportunity, setOriginalOpportunity] =
    useState<Opportunity | null>(null);

  // Données du formulaire
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    value: 0,
    status: "lead" as
      | "lead"
      | "qualified"
      | "proposition"
      | "negotiation"
      | "won"
      | "lost",
    probability: 20,
    expectedClosingDate: "",
    assignedTo: "",
    notes: "",
    isActive: true,
  });

  // État pour les produits
  const [products, setProducts] = useState<ProductFormData[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // État pour la gestion des étapes
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Définition des étapes
  const steps = [
    { number: 1, label: "Informations" },
    { number: 2, label: "Valorisation" },
    { number: 3, label: "Attribution" },
    { number: 4, label: "Produits" },
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

        // Récupération des détails du client
        const clientData = await getClientById(clientId);
        if (isMounted) setClient(clientData);

        // Récupération des utilisateurs
        const usersData = await getAllUsers();
        if (isMounted) setUsers(usersData);

        // Récupération des contacts du client
        const contactsResponse = await getContactsByClient(clientId);
        let clientContacts: Contact[] = [];

        if (Array.isArray(contactsResponse)) {
          clientContacts = contactsResponse;
        } else if (
          contactsResponse &&
          typeof contactsResponse === "object" &&
          "data" in contactsResponse
        ) {
          clientContacts = contactsResponse.data || [];
        }

        if (isMounted) setAvailableContacts(clientContacts);

        if (mode === "edit" && opportunityId) {
          console.log(
            "Mode édition: chargement des données de l'opportunité",
            opportunityId
          );
          try {
            const opportunityData = await getOpportunityById(opportunityId);
            console.log("Données opportunité reçues:", opportunityData);

            if (isMounted) {
              if (!opportunityData) {
                console.error("Aucune donnée d'opportunité reçue");
                setError("Impossible de charger les détails de l'opportunité.");
                return;
              }

              setOriginalOpportunity(opportunityData);

              // Vérifier et extraire correctement les valeurs des propriétés
              // Le problème peut être ici si opportunityData.assignedTo est undefined ou null
              const assignedToId = opportunityData.assignedTo
                ? typeof opportunityData.assignedTo === "object" &&
                  opportunityData.assignedTo
                  ? opportunityData.assignedTo
                  : opportunityData.assignedTo
                : "";

              // Logging pour déboguer
              console.log("ID assigné extrait:", assignedToId);
              console.log("opportunityData.status:", opportunityData.status);
              console.log("opportunityData.value:", opportunityData.value);
              console.log(
                "opportunityData.probability:",
                opportunityData.probability
              );

              // Mise à jour du formulaire avec les données de l'opportunité
              setFormData({
                title: opportunityData.title || "",
                description: opportunityData.description || "",
                value:
                  typeof opportunityData.value === "number"
                    ? opportunityData.value
                    : 0,
                status:
                  opportunityData.status &&
                  [
                    "lead",
                    "qualified",
                    "proposition",
                    "negotiation",
                    "won",
                    "lost",
                  ].includes(opportunityData.status)
                    ? (opportunityData.status as any)
                    : "lead",
                probability:
                  typeof opportunityData.probability === "number"
                    ? opportunityData.probability
                    : 20,
                expectedClosingDate: opportunityData.expectedClosingDate
                  ? new Date(opportunityData.expectedClosingDate)
                      .toISOString()
                      .split("T")[0]
                  : "",
                assignedTo: assignedToId || "",
                notes: opportunityData.notes || "",
                isActive:
                  opportunityData.isActive !== undefined
                    ? opportunityData.isActive
                    : true,
              });

              // Chargement des produits
              if (
                opportunityData.products &&
                Array.isArray(opportunityData.products)
              ) {
                console.log("Produits trouvés:", opportunityData.products);
                setProducts(
                  opportunityData.products.map((product: Product) => ({
                    name: product.name || "",
                    price:
                      typeof product.price === "number" ? product.price : 0,
                    quantity:
                      typeof product.quantity === "number"
                        ? product.quantity
                        : 1,
                  }))
                );
              } else {
                console.log("Aucun produit trouvé dans l'opportunité");
              }

              // Chargement des contacts
              if (
                opportunityData.contacts &&
                Array.isArray(opportunityData.contacts)
              ) {
                console.log("Contacts trouvés:", opportunityData.contacts);
                setSelectedContacts(opportunityData.contacts);
              } else {
                console.log("Aucun contact trouvé dans l'opportunité");
              }
            }
          } catch (err) {
            console.error("Erreur lors du chargement de l'opportunité:", err);
            if (isMounted) {
              setError("Impossible de charger les détails de l'opportunité.");
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
  }, [companyId, clientId, opportunityId, user, mode]);

  // Navigation entre les étapes
  const nextStep = () => {
    // Validation de l'étape actuelle avant de passer à la suivante
    if (currentStep === 1 && !formData.title) {
      setError("Le titre de l'opportunité est obligatoire");
      return;
    }

    if (currentStep === 2 && formData.value <= 0) {
      setError("La valeur de l'opportunité doit être supérieure à 0");
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

  // Gestion des changements des champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gestion des produits
  const addProduct = () => {
    setProducts([
      ...products,
      {
        name: "",
        price: 0,
        quantity: 1,
      },
    ]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleProductChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    const newProducts = [...products];

    if (type === "number") {
      newProducts[index] = {
        ...newProducts[index],
        [name]:
          name === "quantity"
            ? Math.max(1, parseInt(value) || 0)
            : parseFloat(value) || 0,
      };
    } else {
      newProducts[index] = { ...newProducts[index], [name]: value };
    }

    setProducts(newProducts);
  };

  // Gestion des contacts
  const handleContactSelection = (contactId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation finale
    if (!formData.title) {
      setError("Le titre de l'opportunité est obligatoire");
      return;
    }

    if (formData.value <= 0) {
      setError("La valeur de l'opportunité doit être supérieure à 0");
      return;
    }

    try {
      const actionText = mode === "create" ? "Création" : "Mise à jour";
      setLoadingWithMessage(true, `${actionText} de l'opportunité...`);

      // Filtrer les produits valides
      const validProducts = products
        .filter((p) => p.name && p.price > 0 && p.quantity > 0)
        .map((p) => ({
          name: p.name,
          price: p.price,
          quantity: p.quantity,
        }));

      // Préparer les données de l'opportunité
      const opportunityData = {
        title: formData.title,
        description: formData.description || undefined,
        value: formData.value,
        status: formData.status,
        probability: formData.probability,
        expectedClosingDate: formData.expectedClosingDate || undefined,
        company: companyId,
        client: clientId,
        contacts: selectedContacts.length > 0 ? selectedContacts : undefined,
        assignedTo: formData.assignedTo || undefined,
        notes: formData.notes || undefined,
        products: validProducts.length > 0 ? validProducts : undefined,
        isActive: formData.isActive,
      };

      let opportunityResponse;

      if (mode === "create") {
        console.log("Données pour création de l'opportunité:", opportunityData);
        opportunityResponse = await createOpportunity(opportunityData);
        console.log("Opportunité créée avec succès:", opportunityResponse);
        setSuccess(
          `Opportunité "${opportunityResponse.title}" créée avec succès !`
        );
      } else {
        console.log(
          "Données pour mise à jour de l'opportunité:",
          opportunityData
        );
        opportunityResponse = await updateOpportunity(
          opportunityId!,
          opportunityData
        );
        console.log(
          "Opportunité mise à jour avec succès:",
          opportunityResponse
        );
        setSuccess(
          `Opportunité "${opportunityResponse.title}" mise à jour avec succès !`
        );
      }

      // Redirection après 2 secondes
      setTimeout(() => {
        const routePrefix = user?.role === "admin" ? "admin" : "manager";
        router.push(
          `/dashboard/${routePrefix}/manage/company/clients/${companyId}/opportunity/${clientId}`
        );
      }, 2000);
    } catch (err: any) {
      console.error(
        `Erreur lors de la ${
          mode === "create" ? "création" : "mise à jour"
        } de l'opportunité:`,
        err
      );
      setError(
        err.message ||
          `Une erreur est survenue lors de la ${
            mode === "create" ? "création" : "mise à jour"
          } de l'opportunité.`
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

  // Fonctions pour obtenir des informations supplémentaires
  const findUserById = (id: string) => {
    return users.find((u) => u._id === id)?.firstName || "Non assigné";
  };

  // Calculer le total des produits
  const calculateProductsTotal = () => {
    return products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
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

  // Styles pour le récapitulatif
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
            <h2 style={styles.sectionTitle}>Informations de l'opportunité</h2>
            <OpportunityInfoSection
              title={formData.title}
              description={formData.description}
              isActive={formData.isActive}
              handleChange={handleChange}
            />
          </div>
        );

      case 2:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Valorisation</h2>
            <OpportunityValueSection
              value={formData.value}
              handleChange={handleChange}
            />
            <OpportunityStatusSection
              status={formData.status}
              probability={formData.probability}
              expectedClosingDate={formData.expectedClosingDate}
              handleChange={handleChange}
            />
          </div>
        );

      case 3:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Attribution</h2>
            <OpportunityAssignmentSection
              assignedTo={formData.assignedTo}
              users={users}
              handleChange={handleChange}
            />
            <OpportunityNotesSection
              notes={formData.notes}
              handleChange={handleChange}
            />
            <OpportunityContactsSection
              availableContacts={availableContacts}
              selectedContactIds={selectedContacts}
              onContactSelection={handleContactSelection}
            />
          </div>
        );

      case 4:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Produits et services</h2>
            <OpportunityProductsSection
              products={products}
              addProduct={addProduct}
              removeProduct={removeProduct}
              handleProductChange={handleProductChange}
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
                      Informations de l'opportunité
                    </h3>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Titre :</div>
                      <div style={styles.summaryValue}>{formData.title}</div>
                    </div>
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
                    <h3 style={styles.summarySectionTitle}>
                      Valorisation et suivi
                    </h3>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Valeur :</div>
                      <div style={styles.summaryValue}>
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(formData.value)}
                      </div>
                    </div>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Statut :</div>
                      <div style={styles.summaryValue}>
                        {formData.status === "lead" && "Nouveau prospect"}
                        {formData.status === "qualified" && "Qualifié"}
                        {formData.status === "proposition" && "Proposition"}
                        {formData.status === "negotiation" && "En négociation"}
                        {formData.status === "won" && "Gagné"}
                        {formData.status === "lost" && "Perdu"}
                      </div>
                    </div>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Probabilité :</div>
                      <div style={styles.summaryValue}>
                        {formData.probability}%
                      </div>
                    </div>
                    {formData.expectedClosingDate && (
                      <div style={styles.summaryItem}>
                        <div style={styles.summaryLabel}>
                          Date de clôture prévue :
                        </div>
                        <div style={styles.summaryValue}>
                          {formData.expectedClosingDate}
                        </div>
                      </div>
                    )}
                  </div>

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
                    {formData.notes && (
                      <div style={styles.summaryItem}>
                        <div style={styles.summaryLabel}>Notes :</div>
                        <div style={styles.summaryValue}>{formData.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Colonne de droite */}
              <div style={rightColumn}>
                {products.length > 0 && (
                  <div style={styles.summaryContainer}>
                    <div style={styles.summarySection}>
                      <h3 style={styles.summarySectionTitle}>
                        Produits et services ({products.length})
                      </h3>
                      {products.map((product, index) => (
                        <div key={index} style={styles.summaryContactItem}>
                          <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Produit :</div>
                            <div style={styles.summaryValue}>
                              {product.name}
                            </div>
                          </div>
                          <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>
                              Prix unitaire :
                            </div>
                            <div style={styles.summaryValue}>
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(product.price)}
                            </div>
                          </div>
                          <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Quantité :</div>
                            <div style={styles.summaryValue}>
                              {product.quantity}
                            </div>
                          </div>
                          <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Total :</div>
                            <div style={styles.summaryValue}>
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(product.price * product.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div
                        style={{
                          ...styles.summaryContactItem,
                          marginTop: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        <div style={styles.summaryItem}>
                          <div style={styles.summaryLabel}>
                            Total des produits :
                          </div>
                          <div style={styles.summaryValue}>
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(calculateProductsTotal())}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {products.length === 0 && (
                  <div style={styles.summaryContainer}>
                    <div style={styles.summarySection}>
                      <h3 style={styles.summarySectionTitle}>Produits</h3>
                      <p style={{ color: "#666", fontStyle: "italic" }}>
                        Aucun produit ajouté
                      </p>
                    </div>
                  </div>
                )}

                {selectedContacts.length > 0 && (
                  <div
                    style={{ ...styles.summaryContainer, marginTop: "20px" }}
                  >
                    <div style={styles.summarySection}>
                      <h3 style={styles.summarySectionTitle}>
                        Contacts associés ({selectedContacts.length})
                      </h3>
                      <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                        {selectedContacts.map((contactId) => {
                          const contact = availableContacts.find(
                            (c) => c._id === contactId
                          );
                          return (
                            <li key={contactId} style={{ marginBottom: "8px" }}>
                              {contact
                                ? `${contact.firstName} ${contact.lastName}`
                                : contactId}
                            </li>
                          );
                        })}
                      </ul>
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
              `/dashboard/${routePrefix}/manage/company/clients/${companyId}/opportunity/${clientId}`
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
            ? "Créer l'opportunité"
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
            {mode === "create"
              ? "Ajouter une opportunité"
              : "Modifier l'opportunité"}
          </h1>
          {client && (
            <p style={styles.subTitle}>
              Client: <strong>{client.name}</strong>
            </p>
          )}
        </div>
        <button
          onClick={() =>
            router.push(
              `/dashboard/${routePrefix}/manage/company/clients/${companyId}/opportunity/${clientId}`
            )
          }
          style={styles.backButton}
        >
          Retour aux opportunités
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

export default OpportunityForm;
