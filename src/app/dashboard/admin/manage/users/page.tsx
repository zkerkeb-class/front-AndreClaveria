"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useUser } from "@/hooks/useUser";
import UserTable from "@/components/admin/users/UserTable";
import ActionButton from "@/components/common/ActionButton";

const UserManagement: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Vérification du rôle admin
  const hasAccess = useRoleCheck({
    isLoading,
    user,
    requiredRole: "admin",
    redirectPath: "/dashboard",
  });

  // Utilisation du hook useUser pour charger tous les utilisateurs
  const {
    users,
    isLoading: isLoadingUsers,
    error,
    updateUserData,
  } = useUser({ loadAll: true });

  // Gestionnaire pour le changement de statut d'un utilisateur
  const handleStatusChange = (userId: string, newStatus: boolean) => {
    updateUserData(userId, { active: newStatus });
  };

  if (isLoading || !hasAccess) {
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
        <h1 style={{ fontSize: "24px" }}>Gestion des utilisateurs</h1>
        <ActionButton
          onClick={() => router.push("/dashboard/admin/manage/users/new")}
          variant="primary"
          size="large"
        >
          Ajouter un utilisateur
        </ActionButton>
      </div>

      <UserTable
        users={users}
        isLoading={isLoadingUsers}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default UserManagement;
