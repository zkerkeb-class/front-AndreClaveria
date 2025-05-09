"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getContactsByClient, Contact } from "@/services/contact.service";
import { getClientById, Client } from "@/services/client.service";
import ContactTable from "@/components/contacts/ContactTable";
import ActionButton from "@/components/common/ActionButton";

interface ContactManagementProps {
  params: Promise<{
    clientId: string;
  }>;
}

const ContactManagement: React.FC<ContactManagementProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const clientId = unwrappedParams.clientId;
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  useEffect(() => {
    // Vérification du rôle admin ou manager
    if (!isLoading && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const clientData = await getClientById(clientId);
        setClient(clientData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération du client:", err);
        setError("Impossible de charger les détails du client.");
      }
    };

    const fetchContacts = async () => {
      setIsLoadingContacts(true);
      try {
        console.log(
          "Début de la récupération des contacts pour le client:",
          clientId
        );
        const response = await getContactsByClient(clientId);
        console.log("Réponse reçue pour les contacts:", response);

        // Extraction des contacts de la réponse selon sa structure
        let contactsData;
        if (
          response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray(response.data)
        ) {
          contactsData = response.data;
          console.log("Contacts extraits de la structure d'API:", contactsData);
        } else if (Array.isArray(response)) {
          contactsData = response;
          console.log(
            "Contacts directement reçus comme tableau:",
            contactsData
          );
        } else {
          console.error("Format de réponse non reconnu:", response);
          contactsData = [];
        }

        setContacts(contactsData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des contacts:", err);
        setError(
          err.message ||
            "Impossible de charger les contacts. Veuillez réessayer."
        );
        setContacts([]); // Initialiser avec un tableau vide en cas d'erreur
      } finally {
        setIsLoadingContacts(false);
      }
    };

    if (user && ["admin", "manager"].includes(user.role)) {
      fetchClientDetails();
      fetchContacts();
    }
  }, [clientId, user]);

  // Gestionnaire pour le changement de statut d'un contact
  const handleStatusChange = (contactId: string, newStatus: boolean) => {
    setContacts((prevContacts) =>
      prevContacts.map((c) =>
        c._id === contactId ? { ...c, isActive: newStatus } : c
      )
    );
  };

  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Déterminer le préfixe de route pour les liens de navigation
  const routePrefix = user?.role === "admin" ? "admin" : "manager";

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <ActionButton
          onClick={() => window.location.reload()}
          variant="secondary"
          size="medium"
        >
          Réessayer
        </ActionButton>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
            Gestion des contacts
          </h1>
          {client && (
            <p style={{ color: "#666" }}>
              Client: <strong>{client.name}</strong>
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <ActionButton
            onClick={() =>
              router.push(
                `/dashboard/${routePrefix}/manage/company/clients/${client?.company}`
              )
            }
            variant="secondary"
            size="medium"
          >
            Retour aux clients
          </ActionButton>
          <ActionButton
            onClick={() =>
              router.push(
                `/dashboard/${routePrefix}/manage/company/clients/${client?.company}/contacts/${clientId}/add`
              )
            }
            variant="primary"
            size="large"
          >
            Ajouter un contact
          </ActionButton>
        </div>
      </div>

      <ContactTable
        contacts={contacts}
        clientId={clientId}
        isLoading={isLoadingContacts}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ContactManagement;
