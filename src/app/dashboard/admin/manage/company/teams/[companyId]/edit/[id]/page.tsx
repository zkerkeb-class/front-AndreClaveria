"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createTeam } from "@/services/team.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, User } from "@/services/user.service";

interface CreateTeamProps {
  params: {
    companyId: string;
  };
}

const CreateTeam: React.FC<CreateTeamProps> = ({ params }) => {
  const companyId = params.companyId;
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Vérification du rôle admin ou manager
    if (!isLoading && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
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
      fetchCompanyDetails();
      fetchUsers();
    }
  }, [companyId, user]);

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
      setLoadingWithMessage(true, "Création de l'équipe...");

      const teamData = {
        name: formData.name,
        description: formData.description,
        company: companyId,
        leader: formData.leader || undefined,
        members: formData.leader ? [formData.leader] : [],
        isActive: formData.isActive,
      };

      const newTeam = await createTeam(teamData);
      setSuccess("Équipe créée avec succès !");

      setTimeout(() => {
        router.push(`/dashboard/admin/manage/company/teams/${companyId}`);
      }, 2000);
    } catch (err: any) {
      console.error("Erreur lors de la création de l'équipe:", err);
      setError(
        err.message || "Une erreur est survenue lors de la création de l'équipe"
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
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
        <div>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
            Ajouter une équipe
          </h1>
          {company && (
            <p style={{ color: "#666" }}>
              Entreprise: <strong>{company.name}</strong>
            </p>
          )}
        </div>
        <button
          onClick={() =>
            router.push(`/dashboard/admin/manage/company/teams/${companyId}`)
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
                Le chef d'équipe sera automatiquement ajouté comme membre de
                l'équipe.
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
                  `/dashboard/admin/manage/company/teams/${companyId}`
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
              Créer l'équipe
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;
