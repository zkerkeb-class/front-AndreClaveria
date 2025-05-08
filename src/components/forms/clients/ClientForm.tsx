// /components/form/client/ClientForm.tsx
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
        console.log("Entreprise chargée:", companyData);

        // Récupération des utilisateurs
        const usersData = await getAllUsers();
        if (isMounted) setUsers(usersData);
        console.log("Utilisateurs chargés:", usersData?.length);

        // Récupération des équipes de l'entreprise
        const teamsData = await getTeamsByCompany(companyId);
        if (isMounted) setTeams(teamsData);
        console.log("Équipes chargées:", teamsData?.length);

        // En mode édition, charger les données du client
        if (mode === "edit" && clientId) {
          console.log("Chargement du client pour édition, ID:", clientId);
          const clientData = await getClientById(clientId);
          console.log("Données client reçues:", clientData);

          if (isMounted) {
            setOriginalClient(clientData);

            // Vérifier et extraire correctement les valeurs des propriétés
            const assignedToId =
              typeof clientData.assignedTo === "object"
                ? clientData.assignedTo
                : clientData.assignedTo;

            const teamId =
              typeof clientData.team === "object"
                ? clientData.team
                : clientData.team;

            console.log("ID assigné:", assignedToId);
            console.log("ID équipe:", teamId);

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
            console.log("Formulaire mis à jour avec les données du client");
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
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation basique
    if (!formData.name) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const actionText = mode === "create" ? "Création" : "Mise à jour";
      setLoadingWithMessage(true, `${actionText} du client...`);

      // Filtrer les contacts valides
      const validContacts = contacts
        .filter((c) => c.firstName && c.lastName)
        .map((c) => ({
          firstName: c.firstName,
          lastName: c.lastName,
          position: c.position || undefined,
          email: c.email || undefined,
          phone: c.phone || undefined,
          mobile: c.mobile || undefined,
          isPrimary: c.isPrimary || false,
          notes: c.notes || undefined,
        }));

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
        // Créer le client
        clientResponse = await createClient(clientData as any);
        console.log("Client créé avec succès:", clientResponse);

        // Si des contacts sont fournis, les ajouter
        if (validContacts.length > 0) {
          try {
            console.log(`Ajout de ${validContacts.length} contacts...`);

            // Ajouter les contacts un par un
            for (const contact of validContacts) {
              const contactWithClientInfo = {
                ...contact,
                client: clientResponse._id,
                company: companyId,
              };

              // Vous devrez peut-être implémenter cette fonction
              // await addContactToClient(clientResponse._id, contactWithClientInfo);
              console.log("Contact à ajouter:", contactWithClientInfo);
            }
          } catch (contactError) {
            console.error("Erreur lors de l'ajout des contacts:", contactError);
            // Ne pas faire échouer toute l'opération si l'ajout de contacts échoue
            setError("Client créé, mais problème lors de l'ajout des contacts");
          }
        }

        setSuccess(`Client ${clientResponse.name} créé avec succès !`);
      } else {
        // Mettre à jour le client
        clientResponse = await updateClient(clientId!, clientData as any);

        // La mise à jour des contacts nécessitera une logique spécifique
        // (créer de nouveaux contacts, mettre à jour les existants, supprimer ceux qui ne sont plus là)
        // Cette partie dépendra de votre API et de votre logique métier

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
      <div
        style={
          styles.loadingContainer || {
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }
        }
      >
        <p>Chargement des données...</p>
      </div>
    );
  }

  // Déterminer le préfixe de route pour la navigation
  const routePrefix = user?.role === "admin" ? "admin" : "manager";

  return (
    <div>
      <div
        style={
          styles.header || {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }
        }
      >
        <div>
          <h1 style={styles.title || { fontSize: "24px", marginBottom: "8px" }}>
            {mode === "create" ? "Ajouter un client" : "Modifier le client"}
          </h1>
          {company && (
            <p style={styles.subTitle || { color: "#666" }}>
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
          style={
            styles.backButton || {
              padding: "10px 16px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }
          }
        >
          Retour à la liste
        </button>
      </div>

      {error && (
        <div
          style={
            styles.errorMessage || {
              padding: "12px",
              backgroundColor: "#ffebee",
              color: "#d32f2f",
              borderRadius: "4px",
              marginBottom: "20px",
            }
          }
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={
            styles.successMessage || {
              padding: "12px",
              backgroundColor: "#e6f7e6",
              color: "#2e7d32",
              borderRadius: "4px",
              marginBottom: "20px",
            }
          }
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Informations principales du client */}
        <div
          style={
            styles.container || {
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              marginBottom: "24px",
            }
          }
        >
          <ClientInfoSection
            name={formData.name}
            sector={formData.sector}
            description={formData.description}
            handleChange={handleChange}
          />

          <ClientContactSection
            email={formData.email}
            phone={formData.phone}
            handleChange={handleChange}
          />

          <ClientAddressSection
            address={formData.address}
            handleChange={handleChange}
          />

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

          <ClientSettingsSection
            isActive={formData.isActive}
            handleChange={handleChange}
          />
        </div>

        {/* Section des contacts */}
        <ContactsSection
          contacts={contacts}
          addContact={addContact}
          removeContact={removeContact}
          handleContactChange={handleContactChange}
        />

        <div
          style={
            styles.buttonContainer || {
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              marginTop: "24px",
            }
          }
        >
          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/${routePrefix}/manage/company/clients/${companyId}`
              )
            }
            style={
              styles.cancelButton || {
                padding: "10px 20px",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
              }
            }
          >
            Annuler
          </button>

          <button
            type="submit"
            style={
              styles.submitButton || {
                padding: "10px 20px",
                backgroundColor: "#4c84ff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 500,
              }
            }
          >
            {mode === "create"
              ? "Créer le client"
              : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
