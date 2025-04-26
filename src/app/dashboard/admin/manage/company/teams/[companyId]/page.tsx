"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getTeamsByCompany, Team } from "@/services/team.service";
import { getCompanyById, Company } from "@/services/company.service";
import TeamTable from "@/components/teams/TeamTable";
import ActionButton from "@/components/common/ActionButton";

interface TeamManagementProps {
  params: {
    companyId: string;
  };
}

const TeamManagement: React.FC<TeamManagementProps> = ({ params }) => {
  const companyId = params.companyId;
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

  useEffect(() => {
    // Vérification du rôle admin ou manager
    if (!isLoading && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const companyData = await getCompanyById(companyId);
        setCompany(companyData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération de l'entreprise:", err);
        setError("Impossible de charger les détails de l'entreprise.");
      }
    };

    const fetchTeams = async () => {
      setIsLoadingTeams(true);
      try {
        console.log("Début de la récupération des équipes");
        const teamsData = await getTeamsByCompany(companyId);
        console.log("Équipes récupérées:", teamsData);
        setTeams(teamsData);
        setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des équipes:", err);
        setError(
          err.message ||
            "Impossible de charger les équipes. Veuillez réessayer."
        );
      } finally {
        setIsLoadingTeams(false);
      }
    };

    if (user && ["admin", "manager"].includes(user.role)) {
      fetchCompanyDetails();
      fetchTeams();
    }
  }, [companyId, user]);

  // Gestionnaire pour le changement de statut d'une équipe
  const handleStatusChange = (teamId: string, newStatus: boolean) => {
    setTeams((prevTeams) =>
      prevTeams.map((t) =>
        t._id === teamId ? { ...t, isActive: newStatus } : t
      )
    );
  };

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
            onClick={() => router.push("/dashboard/admin/manage/company")}
            variant="secondary"
            size="medium"
          >
            Retour aux entreprises
          </ActionButton>
          <ActionButton
            onClick={() =>
              router.push(
                `/dashboard/admin/manage/company/teams/${companyId}/new`
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
