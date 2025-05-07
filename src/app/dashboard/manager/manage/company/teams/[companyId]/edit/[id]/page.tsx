"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getTeamById, updateTeam, Team } from "@/services/team.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, getUserById, User } from "@/services/user.service";

interface EditTeamProps {
  params: Promise<{
    companyId: string;
    id: string; // ID de l'équipe
  }>;
}

// Fonction d'aide pour extraire l'ID du leader, peu importe le format
const extractLeaderId = (leader: string | User | undefined): string => {
  if (!leader) return "";
  if (typeof leader === "string") return leader;
  return leader._id || "";
};

const EditTeam: React.FC<EditTeamProps> = ({ params }) => {
  // Utilisation de React.use() pour déballer les paramètres
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;
  const teamId = unwrappedParams.id;

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
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [currentLeaderDetails, setCurrentLeaderDetails] = useState<User | null>(
    null
  );

  // Vérification de l'accès
  useEffect(() => {
    if (!isLoading && user) {
      if (!["admin", "manager"].includes(user.role)) {
        router.push("/dashboard");
      } else if (user.role === "manager") {
        // Pour les managers, vérifier si la compagnie leur appartient
        const checkCompanyOwnership = async () => {
          try {
            const companyData = await getCompanyById(companyId);
            if (companyData.owner !== user._id) {
              console.warn(
                "Le manager tente d'accéder à une entreprise qui ne lui appartient pas"
              );
              router.push("/dashboard/manager");
            }
          } catch (err) {
            console.error(
              "Erreur lors de la vérification de la propriété de l'entreprise:",
              err
            );
            router.push("/dashboard/manager");
          }
        };

        checkCompanyOwnership();
      }
    }
  }, [user, isLoading, router, companyId]);

  // Chargement des données
  useEffect(() => {
    const fetchTeamDetails = async () => {
      setIsLoadingTeam(true);
      try {
        const teamData = await getTeamById(teamId);
        setOriginalTeam(teamData);

        // Extraction sécurisée de l'ID du leader
        const leaderId = extractLeaderId(teamData.leader);

        // Initialisation du formulaire
        setFormData({
          name: teamData.name || "",
          description: teamData.description || "",
          leader: leaderId,
          isActive: teamData.isActive,
        });

        // Si un leader existe, récupérer ses détails complets
        if (leaderId) {
          try {
            const leaderDetails = await getUserById(leaderId);
            setCurrentLeaderDetails(leaderDetails);
          } catch (leaderErr) {
            console.error(
              "Erreur lors de la récupération des détails du leader:",
              leaderErr
            );
          }
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération de l'équipe:", err);
        setError("Impossible de charger les détails de l'équipe.");
      } finally {
        setIsLoadingTeam(false);
      }
    };

    const fetchCompanyDetails = async () => {
      try {
        const companyData = await getCompanyById(companyId);
        setCompany(companyData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération de l'entreprise:", err);
        setError("Impossible de charger les détails de l'entreprise.");
      }
    };

    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
      }
    };

    if (user && ["admin", "manager"].includes(user.role)) {
      fetchTeamDetails();
      fetchCompanyDetails();
      fetchUsers();
    }
  }, [companyId, teamId, user]);

  // Gestionnaire de changements des champs du formulaire
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

      // Si le leader change, mettre à jour les détails du leader actuel
      if (name === "leader" && value) {
        const selectedUser = users.find((u) => u._id === value);
        if (selectedUser) {
          setCurrentLeaderDetails(selectedUser);
        } else {
          setCurrentLeaderDetails(null);
        }
      } else if (name === "leader" && !value) {
        setCurrentLeaderDetails(null);
      }
    }
  };

  // Soumission du formulaire
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
      setLoadingWithMessage(true, "Mise à jour de l'équipe...");

      const teamData = {
        name: formData.name,
        description: formData.description,
        leader: formData.leader || undefined,
        isActive: formData.isActive,
      };

      const updatedTeam = await updateTeam(teamId, teamData);
      setSuccess("Équipe mise à jour avec succès !");

      // Mettre à jour les données locales
      setOriginalTeam(updatedTeam);

      // Redirection différée pour permettre à l'utilisateur de voir le message de succès
      setTimeout(() => {
        // Déterminer le préfixe de route basé sur le rôle
        const routePrefix = user?.role === "admin" ? "admin" : "manager";
        router.push(
          `/dashboard/${routePrefix}/manage/company/teams/${companyId}`
        );
      }, 2000);
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour de l'équipe:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors de la mise à jour de l'équipe"
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  // Annuler et revenir à la liste
  const handleCancel = () => {
    const routePrefix = user?.role === "admin" ? "admin" : "manager";
    router.push(`/dashboard/${routePrefix}/manage/company/teams/${companyId}`);
  };

  if (isLoading || !user || isLoadingTeam) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Déterminer le préfixe de route pour les liens de navigation
  const routePrefix = user?.role === "admin" ? "admin" : "manager";

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
            Modifier l'équipe
          </h1>
          {company && (
            <p style={{ color: "#666" }}>
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

      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
              Informations de l'équipe
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Nom de l'équipe <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
              Chef d'équipe
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Sélectionner un chef d'équipe
              </label>
              <select
                name="leader"
                value={formData.leader}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <option value="">Aucun chef d'équipe</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {`${user.firstName} ${user.lastName} (${user.email})`}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
                Le chef d'équipe est automatiquement membre de l'équipe.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
              Paramètres
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                id="activeCheckbox"
                style={{ marginRight: "8px" }}
              />
              <label htmlFor="activeCheckbox">Équipe active</label>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/${routePrefix}/manage/company/teams/${companyId}`
                )
              }
              style={{
                padding: "10px 20px",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4c84ff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Mettre à jour
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTeam;
