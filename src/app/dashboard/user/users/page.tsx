"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useUser } from "@/hooks/useUser";
import UsersTable from "@/components/admin/users/UserTable"; // Changé pour utiliser le composant factoriséÛ
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

  // Fonction de navigation vers les détails de l'utilisateur
  const navigateToUserDetails = (userId: string) => {
    router.push(`/dashboard/admin/manage/users/${userId}`);
  };

  // Fonction de navigation vers la gestion des utilisateurs (peut être utilisée pour la pagination ou les filtres)
  const navigateToUserManagement = () => {
    // Cette fonction peut être utilisée pour rafraîchir la page ou appliquer des filtres
    // Pour l'instant, c'est un placeholder
    router.refresh();
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

      {/* Utilisation du composant UsersTable factorisé */}
      <div>
        <UsersTable
          users={users}
          navigateToUserDetails={navigateToUserDetails}
          navigateToUserManagement={navigateToUserManagement}
          showViewMore={false} // Désactivé car nous montrons tous les utilisateurs
          searchEnabled={true} // Activer la recherche
          maxDisplayed={Infinity} // Afficher tous les utilisateurs
        />
      </div>
    </div>
  );
};

export default UserManagement;
