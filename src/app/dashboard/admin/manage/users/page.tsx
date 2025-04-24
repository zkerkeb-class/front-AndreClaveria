"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUsers, User } from "@/services/user.service";
import UserTable from "@/components/admin/users/UserTable";
import ActionButton from "@/components/common/ActionButton";

const UserManagement: React.FC = () => {
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    // Vérification du rôle admin
    if (!isLoading && user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        // Vous pouvez réactiver cette ligne si elle fonctionne
        // setLoadingWithMessage(true, "Chargement des utilisateurs...");

        console.log("Début de la récupération des utilisateurs");
        const usersData = await getAllUsers();
        console.log("Utilisateurs récupérés:", usersData);
        setUsers(usersData);
        setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        setError(
          err.message ||
            "Impossible de charger les utilisateurs. Veuillez réessayer."
        );
      } finally {
        setIsLoadingUsers(false);
        // setLoadingWithMessage(false);
      }
    };

    if (user && user.role === "admin" && !isLoadingUsers) {
      fetchUsers();
    }
  }, [user]);

  // Gestionnaire pour le changement de statut d'un utilisateur
  const handleStatusChange = (userId: string, newStatus: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u._id === userId ? { ...u, active: newStatus } : u))
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
