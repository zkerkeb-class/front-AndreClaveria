// src/hooks/useRoleCheck.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseRoleCheckProps {
  isLoading: boolean;
  user: {
    role?: string;
  } | null;
  requiredRole: string | string[]; // Peut être un rôle unique ou un tableau de rôles
  redirectPath?: string; // Chemin de redirection si l'utilisateur n'a pas le rôle requis
}

/**
 * Hook personnalisé pour vérifier si l'utilisateur a un rôle requis
 * Redirige l'utilisateur s'il n'a pas le rôle approprié
 */
export const useRoleCheck = ({
  isLoading,
  user,
  requiredRole,
  redirectPath = "/dashboard",
}: UseRoleCheckProps): boolean => {
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Si l'utilisateur n'est pas connecté ou n'a pas de rôle
    if (!user || !user.role) {
      router.push(redirectPath);
      return;
    }

    // Vérification du rôle
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;

    if (!hasRequiredRole) {
      router.push(redirectPath);
    }
  }, [isLoading, user, requiredRole, redirectPath, router]);

  // Retourne true si l'utilisateur a le rôle requis
  if (isLoading || !user || !user.role) return false;

  return Array.isArray(requiredRole)
    ? requiredRole.includes(user.role)
    : user.role === requiredRole;
};
