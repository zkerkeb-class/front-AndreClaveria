// src/hooks/useManagerDashboard.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserDashboard } from "@/services/dashboard.service";
import { Team } from "@/services/team.service";
import { User } from "@/services/user.service";
import { Company } from "@/services/company.service";

export interface DashboardData {
  user: User;
  teams: Team[];
  company: Company | null;
}

interface UseManagerDashboardReturn {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  handleCompanyAction: () => void;
  navigateToTeam: (teamId: string) => void;
  handleTeamAction: (companyId: string) => void;
  refreshDashboard: () => Promise<void>;
}

export const useManagerDashboard = (): UseManagerDashboardReturn => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchUserDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Impossible de charger les données du tableau de bord");
    } finally {
      setLoading(false);
    }
  };

  // Chargement des données du tableau de bord
  useEffect(() => {
    loadDashboard();
  }, []);

  // Fonction pour rafraîchir manuellement les données du dashboard
  const refreshDashboard = async () => {
    await loadDashboard();
  };

  // Gestion de l'action sur l'entreprise (créer ou gérer)
  const handleCompanyAction = () => {
    if (dashboardData?.company) {
      router.push("/dashboard/manager/manage/company");
    } else {
      router.push("/dashboard/manager/manage/company/new");
    }
  };

  // Navigation vers la page d'une équipe
  const navigateToTeam = (teamId: string) => {
    router.push(`/dashboard/team/${teamId}`);
  };

  const handleTeamAction = (companyId: string) => {
    router.push(`/dashboard/manager/manage/company/teams/${companyId}`);
  };

  return {
    dashboardData,
    loading,
    error,
    handleCompanyAction,
    handleTeamAction,
    navigateToTeam,
    refreshDashboard,
  };
};
