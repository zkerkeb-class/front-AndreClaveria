"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useCompany } from "@/hooks/useCompany";
import CompaniesTable from "@/components/admin/company/CompaniesTable"; // Importation du composant factorisé
import ActionButton from "@/components/common/ActionButton";
import { getRoutePrefix } from "@/utils/getRoutePrefix";

const CompanyManagement: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Vérifie si l'utilisateur a le rôle admin ou manager
  const hasAccess = useRoleCheck({
    isLoading,
    user,
    requiredRole: ["admin", "manager"],
    redirectPath: "/dashboard",
  });

  // Utilise le hook useCompany pour récupérer les entreprises
  const {
    companies,
    isLoading: isLoadingCompanies,
    error,
    updateCompanyData,
  } = useCompany();

  // Utiliser getRoutePrefix pour déterminer le préfixe de route en fonction du rôle
  const routePrefix = getRoutePrefix(user?.role);

  // Fonction de navigation vers les détails d'une entreprise
  const navigateToCompanyDetails = (companyId: string) => {
    router.push(`/dashboard/${routePrefix}/manage/company/${companyId}`);
  };

  // Fonction de navigation vers la gestion des entreprises (peut être utilisée pour les filtres ou le rafraîchissement)
  const navigateToCompanyManagement = () => {
    router.refresh();
  };

  // Gestionnaire pour le changement de statut d'une entreprise
  const handleStatusChange = (companyId: string, newStatus: boolean) => {
    updateCompanyData(companyId, { isActive: newStatus });
  };

  // Ajuster le titre en fonction du rôle
  const pageTitle =
    user?.role === "admin" ? "Gestion des entreprises" : "Mon entreprise";

  // Masquer le bouton d'ajout pour les managers s'ils ont déjà une entreprise
  const showAddButton =
    user?.role === "admin" ||
    (user?.role === "manager" && companies.length === 0);

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
        <h1 style={{ fontSize: "24px" }}>{pageTitle}</h1>
        {showAddButton && (
          <ActionButton
            onClick={() =>
              router.push(`/dashboard/${routePrefix}/manage/company/new`)
            }
            variant="primary"
            size="large"
          >
            {user.role === "manager"
              ? "Créer mon entreprise"
              : "Ajouter une entreprise"}
          </ActionButton>
        )}
      </div>

      <div>
        <CompaniesTable
          companies={companies}
          navigateToCompanyDetails={navigateToCompanyDetails}
          navigateToCompanyManagement={navigateToCompanyManagement}
          showViewMore={false} // Désactivé car nous affichons toutes les entreprises
          searchEnabled={true} // Activer la recherche
          maxDisplayed={Infinity} // Afficher toutes les entreprises
        />
      </div>
    </div>
  );
};

export default CompanyManagement;
