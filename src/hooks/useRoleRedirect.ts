// src/hooks/useRoleRedirect.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseRoleRedirectProps {
  isLoading: boolean;
  user: {
    role?: string;
  } | null;
  roleRedirects: Record<string, string>;
  defaultRedirect: string;
}

/**
 * Hook personnalisé pour rediriger l'utilisateur en fonction de son rôle
 */
export const useRoleRedirect = ({
  isLoading,
  user,
  roleRedirects,
  defaultRedirect,
}: UseRoleRedirectProps): void => {
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;

    const userRole = user.role || "default";
    const redirectPath = roleRedirects[userRole] || defaultRedirect;

    router.push(redirectPath);
  }, [isLoading, user, roleRedirects, defaultRedirect, router]);
};
