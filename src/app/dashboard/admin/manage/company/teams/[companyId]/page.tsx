"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useTeam } from "@/hooks/useTeam";
import { useCompany } from "@/hooks/useCompany";
import TeamTable from "@/components/teams/TeamTable";
import ActionButton from "@/components/common/ActionButton";

interface TeamManagementProps {
  params: Promise<{
    companyId: string;
  }>;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ params }) => {
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

  // Récupération des équipes de l'entreprise
  const {
    teams,
    isLoading: isLoadingTeams,
    error: teamsError,
    updateTeamData,
  } = useTeam({ companyId });

  // Déterminer le préfixe de route pour les liens de navigation
  const routePrefix = user?.role === "admin" ? "admin" : "manager";

  // Gestionnaire pour le changement de statut d'une équipe
  const handleStatusChange = (teamId: string, newStatus: boolean) => {
    updateTeamData(teamId, { isActive: newStatus });
  };

  if (isLoading || isLoadingCompany || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Affichage des erreurs
  const error = companyError || teamsError;
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
            Gestion des équipes
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
              router.push(`/dashboard/${routePrefix}/manage/company/`)
            }
            variant="secondary"
            size="medium"
          >
            Retour aux entreprises
          </ActionButton>
          <ActionButton
            onClick={() =>
              router.push(
                `/dashboard/${routePrefix}/manage/company/teams/${companyId}/new`
              )
            }
            variant="primary"
            size="large"
          >
            Ajouter une équipe
          </ActionButton>
        </div>
      </div>

      <TeamTable
        teams={teams}
        companyId={companyId}
        isLoading={isLoadingTeams}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default TeamManagement;
