"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getTeamById,
  updateTeam,
  addMemberToTeam,
  removeMemberFromTeam,
  Team,
} from "@/services/team.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, User } from "@/services/user.service";
import ActionButton from "@/components/common/ActionButton";

interface TeamMembersManagementProps {
  params: Promise<{
    companyId: string;
    teamsId: string;
  }>;
}

const TeamMembersManagement: React.FC<TeamMembersManagementProps> = ({
  params,
}) => {
  // Utilisation de React.use() pour déballer les paramètres
  const unwrappedParams = use(params);

  const companyId = unwrappedParams.companyId;
  const teamsId = unwrappedParams.teamsId;

  // Logging pour debugger
  console.log("TeamMembersManagement - Params déballés:", {
    companyId,
    teamsId,
  });

  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Vérification des accès et redirection si nécessaire
  useEffect(() => {
    if (!isLoading && user) {
      if (!["admin", "manager"].includes(user.role)) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  // Fonction pour vérifier si les paramètres sont valides
  const areParamsValid = () => {
    if (!companyId) {
      setError("ID de l'entreprise manquant");
      return false;
    }
    if (!teamsId) {
      setError("ID de l'équipe manquant");
      return false;
    }
    return true;
  };

  // Chargement des données initiales
  useEffect(() => {
    // Vérifie que les paramètres sont valides avant de faire les appels API
    if (!areParamsValid()) {
      return;
    }

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        console.log("Début de récupération des données avec IDs:", {
          companyId,
          teamsId,
        });

        // Récupérer les données de l'entreprise
        const companyData = await getCompanyById(companyId);
        setCompany(companyData);
        console.log("Données de l'entreprise récupérées:", companyData);

        // Récupérer les données de l'équipe
        const teamData = await getTeamById(teamsId);
        setTeam(teamData);
        console.log("Données de l'équipe récupérées:", teamData);

        // Récupérer tous les utilisateurs
        const usersData = await getAllUsers();
        console.log("Tous les utilisateurs récupérés:", usersData.length);

        // Si les membres de l'équipe sont des IDs, récupérer les objets User correspondants
        let memberIds: string[] = [];
        if (teamData.members) {
          if (typeof teamData.members[0] === "string") {
            memberIds = teamData.members as string[];
          } else {
            memberIds = (teamData.members as User[]).map(
              (member) => member._id
            );
          }
        }

        console.log("IDs des membres de l'équipe:", memberIds);

        // Filtrer les utilisateurs qui ne sont pas déjà membres
        const teamMembersArray = usersData.filter((user) =>
          memberIds.includes(user._id)
        );
        setTeamMembers(teamMembersArray);
        console.log("Membres de l'équipe filtrés:", teamMembersArray.length);

        const availableUsersArray = usersData.filter(
          (user) => !memberIds.includes(user._id)
        );
        setAvailableUsers(availableUsersArray);
        console.log(
          "Utilisateurs disponibles filtrés:",
          availableUsersArray.length
        );

        setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des données:", err);
        setError(
          `Impossible de charger les données nécessaires: ${err.message}`
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user && ["admin", "manager"].includes(user.role)) {
      fetchData();
    }
  }, [companyId, teamsId, user]);

  // Détermine le préfixe de route en fonction du rôle de l'utilisateur
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      setError("Veuillez sélectionner un utilisateur à ajouter.");
      return;
    }

    if (!teamsId) {
      setError("ID de l'équipe manquant");
      return;
    }

    setLoadingWithMessage(true, "Ajout du membre à l'équipe...");
    try {
      await addMemberToTeam(teamsId, selectedUserId);

      // Mettre à jour les listes d'utilisateurs
      const selectedUser = availableUsers.find((u) => u._id === selectedUserId);
      if (selectedUser) {
        setTeamMembers([...teamMembers, selectedUser]);
        setAvailableUsers(
          availableUsers.filter((u) => u._id !== selectedUserId)
        );
      }

      setSelectedUserId("");
      setSuccess("Membre ajouté avec succès");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Erreur lors de l'ajout du membre:", err);
      setError("Une erreur est survenue lors de l'ajout du membre");
    } finally {
      setLoadingWithMessage(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!teamsId) {
      setError("ID de l'équipe manquant");
      return;
    }

    setLoadingWithMessage(true, "Retrait du membre de l'équipe...");
    try {
      await removeMemberFromTeam(teamsId, userId);

      // Mettre à jour les listes d'utilisateurs
      const removedUser = teamMembers.find((u) => u._id === userId);
      if (removedUser) {
        setAvailableUsers([...availableUsers, removedUser]);
        setTeamMembers(teamMembers.filter((u) => u._id !== userId));
      }

      setSuccess("Membre retiré avec succès");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Erreur lors du retrait du membre:", err);
      setError("Une erreur est survenue lors du retrait du membre");
    } finally {
      setLoadingWithMessage(false);
    }
  };

  // Gestion des cas de chargement ou d'erreur
  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  if (!companyId || !teamsId) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>
          Paramètres manquants. Impossible de charger les détails de l'équipe.
        </p>
        <ActionButton
          onClick={() => router.push("/dashboard")}
          variant="secondary"
          size="medium"
        >
          Retour au tableau de bord
        </ActionButton>
      </div>
    );
  }

  const routePrefix = getRoutePrefix();

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
            Gestion des membres de l'équipe
          </h1>
          {company && team && (
            <p style={{ color: "#666" }}>
              Entreprise: <strong>{company.name}</strong> | Équipe:{" "}
              <strong>{team.name}</strong>
            </p>
          )}
        </div>
        <button
          onClick={() =>
            router.push(
              `/dashboard/${routePrefix}/manage/company/teams/${companyId}`
            )
          }
          style={{
            padding: "10px 16px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retour à la liste
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#d32f2f",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#e6f7e6",
            color: "#2e7d32",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {success}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        {/* Ajout de membres */}
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
            Ajouter un membre
          </h2>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Sélectionner un utilisateur
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  flexGrow: 1,
                }}
              >
                <option value="">Choisir un utilisateur</option>
                {availableUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {`${user.firstName} ${user.lastName} (${user.email})`}
                  </option>
                ))}
              </select>
              <ActionButton
                onClick={handleAddMember}
                variant="primary"
                size="medium"
                disabled={!selectedUserId}
              >
                Ajouter
              </ActionButton>
            </div>
            {availableUsers.length === 0 && (
              <p style={{ marginTop: "8px", color: "#666" }}>
                Tous les utilisateurs sont déjà membres de cette équipe.
              </p>
            )}
          </div>
        </div>

        {/* Liste des membres actuels */}
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
            Membres actuels
          </h2>

          {isLoadingData ? (
            <p>Chargement des membres...</p>
          ) : teamMembers.length === 0 ? (
            <p>Aucun membre dans cette équipe.</p>
          ) : (
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {teamMembers.map((member) => (
                <li
                  key={member._id}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "500" }}>
                      {member.firstName} {member.lastName}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      {member.email}
                    </div>
                    {team &&
                      (team.leader === member._id ||
                        (typeof team.leader === "object" &&
                          team.leader?._id === member._id)) && (
                        <span
                          style={{
                            display: "inline-block",
                            background: "#e3f2fd",
                            color: "#0277bd",
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            marginTop: "4px",
                          }}
                        >
                          Chef d'équipe
                        </span>
                      )}
                  </div>
                  <ActionButton
                    onClick={() => handleRemoveMember(member._id)}
                    variant="warning"
                    size="small"
                  >
                    Retirer
                  </ActionButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMembersManagement;
