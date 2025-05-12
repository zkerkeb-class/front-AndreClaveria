"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyManagement } from "@/hooks/useCompanyManagement";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import ActionButton from "@/components/common/ActionButton";
import { companyStyles } from "@/styles/pages/dashboard/manager/manage/company/companyManageStyles";
import {
  FaBuilding,
  FaUsers,
  FaUserTie,
  FaPencilAlt,
  FaPlusCircle,
  FaEllipsisH,
} from "react-icons/fa";

const CompanyManagement: React.FC = () => {
  const { user, isLoading: isLoadingAuth } = useAuth();

  // Vérification du rôle admin ou manager
  const hasAccess = useRoleCheck({
    isLoading: isLoadingAuth,
    user,
    requiredRole: ["admin", "manager"],
    redirectPath: "/dashboard",
  });

  // Utilisation du hook personnalisé pour gérer la logique de l'entreprise
  const {
    company,
    teams,
    clients,
    error,
    isLoadingData,
    navigateToEditCompany,
    navigateToCreateCompany,
    navigateToTeamDetails,
    navigateToClientDetails,
    navigateToTeamsManagement,
    navigateToClientsManagement,
  } = useCompanyManagement();

  if (isLoadingAuth || !user) {
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

  if (!company) {
    return (
      <div style={companyStyles.noCompanyContainer}>
        <div style={companyStyles.noCompanyCard}>
          <FaBuilding style={companyStyles.noCompanyIcon} />
          <h2 style={companyStyles.noCompanyTitle}>
            Vous n'avez pas encore d'entreprise
          </h2>
          <p style={companyStyles.noCompanyText}>
            Créez votre entreprise pour commencer à gérer vos équipes et
            clients.
          </p>
          <ActionButton
            onClick={navigateToCreateCompany}
            variant="primary"
            size="large"
          >
            <FaPlusCircle style={{ marginRight: "10px" }} />
            Créer mon entreprise
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div style={companyStyles.container}>
      <h1 style={companyStyles.pageTitle}>Gestion de mon entreprise</h1>

      <div style={companyStyles.contentGrid}>
        {/* Panneau d'informations de l'entreprise */}
        <div style={companyStyles.companyPanel}>
          <div style={companyStyles.companyHeader}>
            <div style={companyStyles.companyTitle}>
              <FaBuilding style={companyStyles.sectionIcon} />
              <h2>{company.name}</h2>
            </div>
            <ActionButton
              onClick={() => navigateToEditCompany(company._id)}
              variant="secondary"
              size="medium"
            >
              <FaPencilAlt style={{ marginRight: "8px" }} />
              Modifier
            </ActionButton>
          </div>

          <div style={companyStyles.companyInfoCard}>
            {company.logo ? (
              <img
                src={company.logo}
                alt={`Logo ${company.name}`}
                style={companyStyles.companyLogo}
              />
            ) : (
              <div style={companyStyles.companyLogoPlaceholder}>
                <FaBuilding size={40} />
              </div>
            )}

            <div style={companyStyles.companyDetailsGrid}>
              <div style={companyStyles.detailItem}>
                <span style={companyStyles.detailLabel}>Secteur:</span>
                <span style={companyStyles.detailValue}>
                  {company.industry || "Non renseigné"}
                </span>
              </div>
              <div style={companyStyles.detailItem}>
                <span style={companyStyles.detailLabel}>Email:</span>
                <span style={companyStyles.detailValue}>
                  {company.email || "Non renseigné"}
                </span>
              </div>
              <div style={companyStyles.detailItem}>
                <span style={companyStyles.detailLabel}>Téléphone:</span>
                <span style={companyStyles.detailValue}>
                  {company.phone || "Non renseigné"}
                </span>
              </div>
              <div style={companyStyles.detailItem}>
                <span style={companyStyles.detailLabel}>Adresse:</span>
                <span style={companyStyles.detailValue}>
                  {company.address?.city || "Non renseignée"}
                </span>
              </div>
              <div style={companyStyles.detailItem}>
                <span style={companyStyles.detailLabel}>Statut:</span>
                <span
                  style={{
                    ...companyStyles.statusBadge,
                    backgroundColor: company.isActive ? "#4caf50" : "#f44336",
                  }}
                >
                  {company.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
              <div style={companyStyles.detailItem}>
                <span style={companyStyles.detailLabel}>Date de création:</span>
                <span style={companyStyles.detailValue}>
                  {company.createdAt
                    ? new Date(company.createdAt).toLocaleDateString("fr-FR")
                    : "Non disponible"}
                </span>
              </div>
            </div>

            {company.description && (
              <div style={companyStyles.descriptionSection}>
                <h3 style={companyStyles.descriptionTitle}>Description</h3>
                <p style={companyStyles.descriptionText}>
                  {company.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panneau des équipes et clients */}
        <div style={companyStyles.dataPanel}>
          {/* Section Équipes */}
          <div style={companyStyles.sectionHeader}>
            <div style={companyStyles.sectionTitle}>
              <FaUsers style={companyStyles.sectionIcon} />
              <h2>Équipes</h2>
            </div>
            <ActionButton
              onClick={() => navigateToTeamsManagement(company._id)}
              variant="primary"
              size="small"
            >
              Gérer les équipes
            </ActionButton>
          </div>

          <div style={companyStyles.dataCard}>
            {teams.length === 0 ? (
              <div style={companyStyles.emptyState}>
                <p>
                  Aucune équipe créée. Commencez par créer votre première
                  équipe.
                </p>
                <ActionButton
                  onClick={() => navigateToTeamsManagement(company._id)}
                  variant="secondary"
                  size="medium"
                >
                  <FaPlusCircle style={{ marginRight: "8px" }} />
                  Créer une équipe
                </ActionButton>
              </div>
            ) : (
              <div style={companyStyles.teamsList}>
                {teams.slice(0, 3).map((team) => (
                  <div key={team._id} style={companyStyles.teamCard}>
                    <div style={companyStyles.teamCardHeader}>
                      <h3 style={companyStyles.teamName}>{team.name}</h3>
                      <span style={companyStyles.memberCount}>
                        {Array.isArray(team.members) ? team.members.length : 0}{" "}
                        membre(s)
                      </span>
                    </div>
                    {team.description && (
                      <p style={companyStyles.teamDescription}>
                        {team.description}
                      </p>
                    )}
                    <ActionButton
                      onClick={() => navigateToTeamDetails(team._id)}
                      variant="secondary"
                      size="small"
                    >
                      Détails
                    </ActionButton>
                  </div>
                ))}

                {teams.length > 3 && (
                  <div style={companyStyles.viewMoreCard}>
                    <FaEllipsisH style={companyStyles.ellipsisIcon} />
                    <p>Voir les {teams.length - 3} autres équipes</p>
                    <ActionButton
                      onClick={() => navigateToTeamsManagement(company._id)}
                      variant="secondary"
                      size="small"
                    >
                      Voir tout
                    </ActionButton>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section Clients */}
          <div style={companyStyles.sectionHeader}>
            <div style={companyStyles.sectionTitle}>
              <FaUserTie style={companyStyles.sectionIcon} />
              <h2>Clients</h2>
            </div>
            <ActionButton
              onClick={() => navigateToClientsManagement(company._id)}
              variant="primary"
              size="small"
            >
              Gérer les clients
            </ActionButton>
          </div>

          <div style={companyStyles.dataCard}>
            {clients.length === 0 ? (
              <div style={companyStyles.emptyState}>
                <p>Aucun client enregistré. Ajoutez votre premier client.</p>
                <ActionButton
                  onClick={() => navigateToClientsManagement(company._id)}
                  variant="secondary"
                  size="medium"
                >
                  <FaPlusCircle style={{ marginRight: "8px" }} />
                  Ajouter un client
                </ActionButton>
              </div>
            ) : (
              <table style={companyStyles.clientsTable}>
                <thead>
                  <tr>
                    <th style={companyStyles.tableHeader}>Nom</th>
                    <th style={companyStyles.tableHeader}>Email</th>
                    <th style={companyStyles.tableHeader}>Téléphone</th>
                    <th style={companyStyles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.slice(0, 3).map((client) => (
                    <tr key={client._id} style={companyStyles.tableRow}>
                      <td style={companyStyles.tableCell}>{client.name}</td>
                      <td style={companyStyles.tableCell}>
                        {client.email || "-"}
                      </td>
                      <td style={companyStyles.tableCell}>
                        {client.phone || "-"}
                      </td>
                      <td style={companyStyles.tableCellActions}>
                        <ActionButton
                          onClick={() => navigateToClientDetails(client._id)}
                          variant="secondary"
                          size="small"
                        >
                          Détails
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
                  {clients.length > 3 && (
                    <tr style={companyStyles.viewMoreRow}>
                      <td colSpan={4} style={companyStyles.viewMoreCell}>
                        <div style={companyStyles.viewMoreContent}>
                          <span>Voir {clients.length - 3} autres clients</span>
                          <ActionButton
                            onClick={() =>
                              navigateToClientsManagement(company._id)
                            }
                            variant="secondary"
                            size="small"
                          >
                            Voir tout
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;
