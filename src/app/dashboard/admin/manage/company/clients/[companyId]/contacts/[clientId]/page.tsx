"use client";
import React, { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useContactManagement } from "@/hooks/useContactManagement";
import ContactTable from "@/components/contacts/ContactTable";
import ActionButton from "@/components/common/ActionButton";

interface ContactManagementProps {
  params: Promise<{
    clientId: string;
    companyId: string;
  }>;
}

const ContactManagement: React.FC<ContactManagementProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const clientId = unwrappedParams.clientId;
  const companyId = unwrappedParams.companyId;

  const { user, isLoading } = useAuth();

  // Vérification du rôle admin ou manager
  const hasAccess = useRoleCheck({
    isLoading,
    user,
    requiredRole: ["admin", "manager"],
    redirectPath: "/dashboard",
  });

  // Utilisation du hook personnalisé pour gérer la logique des contacts
  const {
    contacts,
    client,
    error,
    isLoadingContacts,
    handleStatusChange,
    navigateToClientsList,
    navigateToAddContact,
  } = useContactManagement({ clientId });

  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

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
            onClick={() => navigateToClientsList()}
            variant="secondary"
            size="medium"
          >
            Retour aux clients
          </ActionButton>
          <ActionButton
            onClick={() => navigateToAddContact()}
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
        companyId={companyId}
        isLoading={isLoadingContacts}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ContactManagement;
