"use client";
import React, { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useOpportunityManagement } from "@/hooks/useOpportunityManagement";
import OpportunityBoard from "@/components/opportunity/OpportunityBoard";
import ActionButton from "@/components/common/ActionButton";

interface OpportunityManagementProps {
  params: Promise<{
    clientId: string;
    companyId: string;
  }>;
}

const OpportunityManagement: React.FC<OpportunityManagementProps> = ({
  params,
}) => {
  const unwrappedParams = use(params);
  const clientId = unwrappedParams.clientId;
  const companyId = unwrappedParams.companyId;

  const { user, isLoading } = useAuth();

  // Vérification du rôle admin, manager ou user
  const hasAccess = useRoleCheck({
    isLoading,
    user,
    requiredRole: ["admin", "manager", "user"],
    redirectPath: "/dashboard",
  });

  // Utilisation du hook personnalisé pour gérer la logique des opportunités
  const {
    opportunities,
    client,
    error,
    isLoadingOpportunities,
    viewMode,
    setViewMode,
    handleStatusChange,
    navigateToClientsList,
    navigateToAddOpportunity,
  } = useOpportunityManagement({ clientId, companyId });

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
            Gestion des opportunités
          </h1>
          {client && (
            <p style={{ color: "#666" }}>
              Client: <strong>{client.name}</strong>
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              border: "1px solid #ddd",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setViewMode("kanban")}
              style={{
                padding: "8px 12px",
                background: viewMode === "kanban" ? "#f0f0f0" : "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Vue Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px 12px",
                background: viewMode === "list" ? "#f0f0f0" : "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Vue Liste
            </button>
          </div>
          <ActionButton
            onClick={navigateToClientsList}
            variant="secondary"
            size="medium"
          >
            Retour aux clients
          </ActionButton>
          <ActionButton
            onClick={navigateToAddOpportunity}
            variant="primary"
            size="large"
          >
            Ajouter une opportunité
          </ActionButton>
        </div>
      </div>

      <OpportunityBoard
        opportunities={opportunities}
        clientId={clientId}
        companyId={companyId}
        isLoading={isLoadingOpportunities}
        onStatusChange={handleStatusChange}
        viewMode={viewMode}
      />
    </div>
  );
};

export default OpportunityManagement;
