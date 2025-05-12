"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useClient } from "@/hooks/useClient";
import { useCompany } from "@/hooks/useCompany";
import ClientTable from "@/components/clients/ClientTable";
import ActionButton from "@/components/common/ActionButton";

interface ClientManagementProps {
  params: Promise<{
    companyId: string;
  }>;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ params }) => {
  // Récupération du companyId à partir des paramètres
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;

  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Vérification des droits d'accès (admin ou manager)
  const hasAccess = useRoleCheck({
    isLoading,
    user,
    requiredRole: ["admin", "manager"],
    redirectPath: "/dashboard",
  });

  // Récupération des détails de l'entreprise
  const {
    company,
    isLoading: isLoadingCompany,
    error: companyError,
  } = useCompany({ companyId });

  // Récupération des clients de l'entreprise
  const {
    clients,
    isLoading: isLoadingClients,
    error: clientsError,
    updateClientData,
  } = useClient({ companyId });

  // Gestionnaire pour le changement de statut d'un client
  const handleStatusChange = (clientId: string, newStatus: boolean) => {
    updateClientData(clientId, { isActive: newStatus });
  };

  if (isLoading || isLoadingCompany || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Déterminer le préfixe de route pour les liens de navigation
  const routePrefix = user?.role === "admin" ? "admin" : "manager";

  // Affichage des erreurs
  const error = companyError || clientsError;
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
            Gestion des clients
          </h1>
          {company && (
            <p style={{ color: "#666" }}>
              Entreprise: <strong>{company.name}</strong>
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <ActionButton
            onClick={() =>
              router.push(`/dashboard/${routePrefix}/manage/company`)
            }
            variant="secondary"
            size="medium"
          >
            Retour aux entreprises
          </ActionButton>
          <ActionButton
            onClick={() =>
              router.push(
                `/dashboard/${routePrefix}/manage/company/clients/${companyId}/add`
              )
            }
            variant="primary"
            size="large"
          >
            Ajouter un client
          </ActionButton>
        </div>
      </div>

      <ClientTable
        clients={clients}
        companyId={companyId}
        isLoading={isLoadingClients}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ClientManagement;
