// /components/form/company/CompanyForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createCompany,
  updateCompany,
  getCompanyById,
  Company,
} from "@/services/company.service";
import { companyFormStyles as styles } from "@/styles/components/forms/CompanyFormStyles";

// Import des sous-composants
import CompanyGeneralInfo from "./CompanyGeneralInfo";
import CompanyAddressInfo from "./CompanyAddressInfo";
import CompanyContactInfo from "./CompanyContactInfo";
import CompanySettings from "./CompanySettings";

interface CompanyFormProps {
  mode: "create" | "edit";
  companyId?: string;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ mode, companyId }) => {
  const router = useRouter();

  const { user, isLoading, setLoadingWithMessage } = useAuth();
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
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };

  useEffect(() => {
    // Vérification du rôle admin ou manager
    if (!isLoading && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Charger les données de l'entreprise en mode édition
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (mode !== "edit" || !companyId) return;

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

    if (user && ["admin", "manager"].includes(user.role)) {
      fetchCompanyData();
    }
  }, [companyId, user, mode]);

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
    const routePrefix = getRoutePrefix();

    try {
      const actionText = mode === "create" ? "Création" : "Mise à jour";
      setLoadingWithMessage(true, `${actionText} de l'entreprise...`);

      const companyData = {
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

      if (mode === "create") {
        // Ajouter l'owner uniquement en mode création
        const createData = {
          ...companyData,
          owner: user?._id || "",
        };
        await createCompany(createData);
        setSuccess("Entreprise créée avec succès !");
      } else {
        await updateCompany(companyId!, companyData);
        setSuccess("Entreprise mise à jour avec succès !");
      }

      setTimeout(() => {
        router.push(`/dashboard/${routePrefix}/manage/company`);
      }, 2000);
    } catch (err: any) {
      console.error(
        `Erreur lors de la ${
          mode === "create" ? "création" : "mise à jour"
        } de l'entreprise:`,
        err
      );
      setError(
        err.message ||
          `Une erreur est survenue lors de la ${
            mode === "create" ? "création" : "mise à jour"
          } de l'entreprise`
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }
  const routePrefix = getRoutePrefix();
  // Si mode édition et chargement des données, afficher un message de chargement
  if (mode === "edit" && !originalCompany && isLoadingCompany) {
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
        <p>Chargement des données de l'entreprise...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {mode === "create"
            ? "Ajouter une entreprise"
            : "Modifier l'entreprise"}
        </h1>
        <button
          onClick={() => router.push("/dashboard/admin/manage/company")}
          style={styles.backButton}
        >
          Retour à la liste
        </button>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.container}>
          <CompanyGeneralInfo
            name={formData.name}
            industry={formData.industry}
            description={formData.description}
            handleChange={handleChange}
          />

          <CompanyAddressInfo
            street={formData.street}
            city={formData.city}
            zipCode={formData.zipCode}
            country={formData.country}
            handleChange={handleChange}
          />

          <CompanyContactInfo
            email={formData.email}
            phone={formData.phone}
            website={formData.website}
            handleChange={handleChange}
          />

          <CompanySettings
            isActive={formData.isActive}
            handleChange={handleChange}
          />

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={() =>
                router.push(`/dashboard/${routePrefix}/manage/company`)
              }
              style={styles.cancelButton}
            >
              Annuler
            </button>

            <button type="submit" style={styles.submitButton}>
              {mode === "create"
                ? "Créer l'entreprise"
                : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
