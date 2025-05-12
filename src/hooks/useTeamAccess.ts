// hooks/useTeamAccess.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface UseTeamAccessProps {
  companyId: string;
  teamId: string;
}

export const useTeamAccess = ({ companyId, teamId }: UseTeamAccessProps) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Vérification des accès et redirection si nécessaire
  useEffect(() => {
    if (!isLoading && user) {
      if (!["admin", "manager"].includes(user.role)) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  // Détermine le préfixe de route en fonction du rôle de l'utilisateur
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };

  const routePrefix = getRoutePrefix();

  const navigateToTeamsList = () => {
    router.push(`/dashboard/${routePrefix}/manage/company/teams/${companyId}`);
  };

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  const hasValidAccess =
    !isLoading && user && ["admin", "manager"].includes(user.role);
  const hasValidParams = Boolean(companyId && teamId);

  return {
    user,
    isLoading,
    hasValidAccess,
    hasValidParams,
    routePrefix,
    navigateToTeamsList,
    navigateToDashboard,
  };
};
