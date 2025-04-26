"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCompanyById,
  updateCompany,
  Company,
} from "@/services/company.service";

interface EditCompanyPageProps {
  params: {
    id: string;
  };
}

const EditCompany: React.FC<EditCompanyPageProps> = ({ params }) => {
  const companyId = params.id;
  const router = useRouter();
  const { user: currentUser, isLoading, setLoadingWithMessage } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    street: "",
    city: "",
    zipCode: "",
    country: "France",
    phone: "",
    email: "",
    website: "",
    industry: "",
    isActive: true,
  });
  const [originalCompany, setOriginalCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);

  useEffect(() => {
    // Vérification du rôle admin ou manager
    if (
      !isLoading &&
      currentUser &&
      !["admin", "manager"].includes(currentUser.role)
    ) {
      router.push("/dashboard");
    }
  }, [currentUser, isLoading, router]);

  // Charger les données de l'entreprise
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;
      setIsLoadingCompany(true);
      try {
        const companyData = await getCompanyById(companyId);
        setOriginalCompany(companyData);

        // Extraire l'adresse
        const address = companyData.address || {};

        setFormData({
          name: companyData.name || "",
          description: companyData.description || "",
          street: address.street || "",
          city: address.city || "",
          zipCode: address.zipCode || "",
          country: address.country || "France",
          phone: companyData.phone || "",
          email: companyData.email || "",
          website: companyData.website || "",
          industry: companyData.industry || "",
          isActive:
            companyData.isActive !== undefined ? companyData.isActive : true,
        });
      } catch (err: any) {
        console.error(
          "Erreur lors de la récupération des données de l'entreprise:",
          err
        );
        setError(
          err.message ||
            "Impossible de charger les informations de l'entreprise"
        );
      } finally {
        setIsLoadingCompany(false);
      }
    };

    if (currentUser && ["admin", "manager"].includes(currentUser.role)) {
      fetchCompanyData();
    }
  }, [companyId, currentUser]);

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
    if (!formData.name || !formData.email) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoadingWithMessage(true, "Mise à jour de l'entreprise...");

      // Création de l'objet à envoyer à l'API
      const updateData = {
        name: formData.name,
        description: formData.description,
        address: {
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        industry: formData.industry,
        isActive: formData.isActive,
      };

      await updateCompany(companyId, updateData);
      setSuccess("Entreprise mise à jour avec succès");

      // Redirection après un court délai
      setTimeout(() => {
        router.push("/dashboard/admin/manage/company");
      }, 2000);
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour de l'entreprise:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors de la mise à jour de l'entreprise"
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

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
        <h1 style={{ fontSize: "24px" }}>Modifier l'entreprise</h1>
        <button
          onClick={() => router.push("/dashboard/admin/manage/company")}
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

      {originalCompany ? (
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
                Informations générales
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
                    Nom de l'entreprise <span style={{ color: "red" }}>*</span>
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

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Secteur d'activité
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
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

              <div style={{ marginTop: "16px" }}>
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
                Adresse
              </h2>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Rue
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
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
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
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
                    Pays
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
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
                    name="phone"
                    value={formData.phone}
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

              <div style={{ marginTop: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Site web
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
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
                <label htmlFor="activeCheckbox">Entreprise active</label>
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
                onClick={() => router.push("/dashboard/admin/manage/company")}
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
          <p>Chargement des données de l'entreprise...</p>
        </div>
      )}
    </div>
  );
};

export default EditCompany;
