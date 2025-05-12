"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useEditUser } from "@/hooks/useEditUser";

interface EditUserPageProps {
  params: {
    id: string;
  };
}

const EditUser: React.FC<EditUserPageProps> = ({ params }) => {
  const userId = params.id;
  const router = useRouter();
  const { user: currentUser, isLoading } = useAuth();

  // Vérification du rôle admin
  const hasAdminAccess = useRoleCheck({
    isLoading,
    user: currentUser,
    requiredRole: "admin",
    redirectPath: "/dashboard",
  });

  // Utilisation du hook pour gérer l'édition de l'utilisateur
  const {
    formData,
    originalUser,
    error,
    success,
    changePassword,
    isLoadingUsers,
    handleChange,
    handleSubmit,
    setChangePassword,
  } = useEditUser({
    userId,
    redirectPath: "/dashboard/admin/manage/users",
    redirectDelay: 2000,
  });

  if (isLoading || !currentUser) {
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
        <h1 style={{ fontSize: "24px" }}>Modifier l'utilisateur</h1>
        <button
          onClick={() => router.push("/dashboard/admin/manage/users")}
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

      {originalUser ? (
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
                Informations personnelles
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Prénom <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
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

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Nom <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
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
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
                Informations de contact
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
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

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
                Authentification
              </h2>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={changePassword}
                    onChange={() => setChangePassword(!changePassword)}
                    style={{ marginRight: "8px" }}
                  />
                  Modifier le mot de passe
                </label>
              </div>

              {changePassword && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label style={{ display: "block", marginBottom: "8px" }}>
                      Nouveau mot de passe{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={changePassword}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px" }}>
                      Confirmer le mot de passe{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={changePassword}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
                Paramètres du compte
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Rôle <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    <option value="user">Utilisateur</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "28px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    id="activeCheckbox"
                    style={{ marginRight: "8px" }}
                  />
                  <label htmlFor="activeCheckbox">Compte actif</label>
                </div>
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
                onClick={() => router.push("/dashboard/admin/manage/users")}
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
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <p>Chargement des données utilisateur...</p>
        </div>
      )}
    </div>
  );
};

export default EditUser;
