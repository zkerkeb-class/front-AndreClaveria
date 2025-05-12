// src/hooks/useUserDashboard.ts
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

interface UseUserDashboardProps {
  userType?: "user" | "manager"; // Permet de spécifier le type d'utilisateur
}

interface UseUserDashboardReturn {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  navigateToTeam: (teamId: string) => void;
  navigateToCompanyManagement?: () => void; // Optionnel, uniquement pour les managers
}

export const useUserDashboard = ({
  userType = "user",
}: UseUserDashboardProps = {}): UseUserDashboardReturn => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Chargement des données du tableau de bord
  useEffect(() => {
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

    loadDashboard();
  }, []);

  // Navigation vers la page d'une équipe
  const navigateToTeam = (teamId: string) => {
    router.push(`/dashboard/team/${teamId}`);
  };

  // Navigation vers la gestion d'entreprise (uniquement pour les managers)
  const navigateToCompanyManagement = () => {
    if (userType === "manager" && dashboardData?.company) {
      router.push("/dashboard/manager/manage/company");
    } else if (userType === "manager") {
      router.push("/dashboard/manager/manage/company/new");
    }
  };

  // Retourne différentes fonctions selon le type d'utilisateur
  return userType === "manager"
    ? {
        dashboardData,
        loading,
        error,
        navigateToTeam,
        navigateToCompanyManagement,
      }
    : {
        dashboardData,
        loading,
        error,
        navigateToTeam,
      };
};
