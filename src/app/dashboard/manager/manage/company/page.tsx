"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllCompanies,
  getCompaniesByOwner,
  Company,
} from "@/services/company.service";
import CompanyTable from "@/components/company/CompanyTable";
import ActionButton from "@/components/common/ActionButton";

const CompanyManagement: React.FC = () => {
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  useEffect(() => {
    // Vérification du rôle admin ou manager
    if (!isLoading && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        console.log("Début de la récupération des entreprises");

        // Modification ici: différencier selon le rôle
        let companiesData: Company[] = [];
        if (user && user.role === "manager" && user._id) {
          companiesData = await getCompaniesByOwner(user._id);
        }

        console.log("Entreprises récupérées:", companiesData);
        setCompanies(companiesData);
        setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des entreprises:", err);
        setError(
          err.message ||
            "Impossible de charger les entreprises. Veuillez réessayer."
        );
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    if (
      user &&
      ["admin", "manager"].includes(user.role) &&
      !isLoadingCompanies
    ) {
      fetchCompanies();
    }
  }, [user]);

  // Gestionnaire pour le changement de statut d'une entreprise
  const handleStatusChange = (companyId: string, newStatus: boolean) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((c) =>
        c._id === companyId ? { ...c, isActive: newStatus } : c
      )
    );
  };

  // Ajuster le titre en fonction du rôle
  const pageTitle =
    user?.role === "admin" ? "Gestion des entreprises" : "Mon entreprise";

  // Masquer le bouton d'ajout pour les managers s'ils ont déjà une entreprise
  const showAddButton =
    user?.role === "admin" ||
    (user?.role === "manager" && companies.length === 0);

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
        <h1 style={{ fontSize: "24px" }}>{pageTitle}</h1>
        {showAddButton && (
          <ActionButton
            onClick={() => router.push("/dashboard/manager/manage/company/new")}
            variant="primary"
            size="large"
          >
            {user.role === "manager"
              ? "Créer mon entreprise"
              : "Ajouter une entreprise"}
          </ActionButton>
        )}
      </div>

      <CompanyTable
        companies={companies}
        isLoading={isLoadingCompanies}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default CompanyManagement;
