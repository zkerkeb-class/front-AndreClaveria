// /components/form/team/TeamForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createTeam,
  updateTeam,
  getTeamById,
  Team,
} from "@/services/team.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, User } from "@/services/user.service";
import { teamFormStyles as styles } from "@/styles/components/forms/TeamFormStyles";

// Import des sous-composants
import TeamInfoSection from "./TeamInfoSection";
import TeamLeaderSection from "./TeamLeaderSection";
import TeamSettingsSection from "./TeamSettingsSection";

interface TeamFormProps {
  mode: "create" | "edit";
  companyId: string;
  teamId?: string;
}

const TeamForm: React.FC<TeamFormProps> = ({ mode, companyId, teamId }) => {
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leader: "",
    isActive: true,
  });
  const [originalTeam, setOriginalTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    // Vérification du rôle admin ou manager
    if (!isLoading && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };
  const routePrefix = getRoutePrefix();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        // Chargement des données de l'entreprise
        const companyData = await getCompanyById(companyId);
        setCompany(companyData);

        // Chargement des utilisateurs
        const usersData = await getAllUsers();
        setUsers(usersData);

        // En mode édition, charger les données de l'équipe
        if (mode === "edit" && teamId) {
          const teamData = await getTeamById(teamId);
          setOriginalTeam(teamData);

          setFormData({
            name: teamData.name || "",
            description: teamData.description || "",
            leader: formData.leader || "",
            isActive:
              teamData.isActive !== undefined ? teamData.isActive : true,
          });
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger toutes les données nécessaires.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user && ["admin", "manager"].includes(user.role)) {
      fetchData();
    }
  }, [companyId, teamId, user, mode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation basique
    if (!formData.name) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const actionText = mode === "create" ? "Création" : "Mise à jour";
      setLoadingWithMessage(true, `${actionText} de l'équipe...`);

      const teamData = {
        name: formData.name,
        description: formData.description,
        company: companyId,
        leader: formData.leader || undefined,
        isActive: formData.isActive,
      };

      if (mode === "create") {
        // Ajouter les membres uniquement en mode création
        const createData = {
          ...teamData,
          members: formData.leader ? [formData.leader] : [],
        };
        await createTeam(createData);
        setSuccess("Équipe créée avec succès !");
      } else {
        await updateTeam(teamId!, teamData);
        setSuccess("Équipe mise à jour avec succès !");
      }

      // Redirection après un délai
      setTimeout(() => {
        router.push(
          `/dashboard/${routePrefix}/manage/company/teams/${companyId}`
        );
      }, 2000);
    } catch (err: any) {
      console.error(
        `Erreur lors de la ${
          mode === "create" ? "création" : "mise à jour"
        } de l'équipe:`,
        err
      );
      setError(
        err.message ||
          `Une erreur est survenue lors de la ${
            mode === "create" ? "création" : "mise à jour"
          } de l'équipe`
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Si chargement des données, afficher un loader
  if (isLoadingData || (mode === "edit" && !originalTeam)) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            {mode === "create" ? "Ajouter une équipe" : "Modifier l'équipe"}
          </h1>
          {company && (
            <p style={styles.subTitle}>
              Entreprise: <strong>{company.name}</strong>
            </p>
          )}
        </div>
        <button
          onClick={() =>
            router.push(
              `/dashboard/${routePrefix}/manage/company/teams/${companyId}`
            )
          }
          style={styles.backButton}
        >
          Retour à la liste
        </button>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.container}>
          <TeamInfoSection
            name={formData.name}
            description={formData.description}
            handleChange={handleChange}
          />

          <TeamLeaderSection
            leader={formData.leader}
            users={users}
            handleChange={handleChange}
          />

          <TeamSettingsSection
            isActive={formData.isActive}
            handleChange={handleChange}
          />

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/${routePrefix}/manage/company/teams/${companyId}`
                )
              }
              style={styles.cancelButton}
            >
              Annuler
            </button>

            <button type="submit" style={styles.submitButton}>
              {mode === "create"
                ? "Créer l'équipe"
                : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;
