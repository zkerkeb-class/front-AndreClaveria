"use client";

import { dashboardStyles } from "@/styles/pages/dashboard/manager/dashboardStyles";
import { useManagerDashboard } from "@/hooks/useManagerDashboard";
import {
  FaBuilding,
  FaUsers,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPlusCircle,
  FaEdit,
  FaCog,
} from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

export default function ManagerDashboard() {
  // Utilisation du hook personnalisé pour gérer la logique du tableau de bord
  const {
    dashboardData,
    loading,
    error,
    handleCompanyAction,
    navigateToTeam,
    handleTeamAction,
  } = useManagerDashboard();

  if (loading) {
    return (
      <div style={dashboardStyles.loadingSpinner}>
        Chargement de vos informations...
      </div>
    );
  }

  if (error) {
    return <div style={dashboardStyles.errorMessage}>{error}</div>;
  }

  if (!dashboardData) {
    return (
      <div style={dashboardStyles.errorMessage}>Aucune donnée disponible</div>
    );
  }

  const { user, teams, company } = dashboardData;

  return (
    <div style={dashboardStyles.container}>
      <div style={dashboardStyles.section}>
        <h2 style={dashboardStyles.sectionTitle}>
          <FaUser style={dashboardStyles.sectionIcon} />
          Profil Utilisateur
        </h2>
        <div style={dashboardStyles.userInfoCard}>
          <div style={dashboardStyles.avatar}>
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>
          <h2 style={dashboardStyles.userName}>
            {user.firstName} {user.lastName}
          </h2>
          <div style={dashboardStyles.infoItem}>
            <FaEnvelope style={dashboardStyles.infoIcon} />
            <span>{user.email}</span>
          </div>
          <div style={dashboardStyles.infoItem}>
            <FaUser style={dashboardStyles.infoIcon} />
            <span>Rôle: {user.role}</span>
          </div>
        </div>
      </div>

      <div style={dashboardStyles.section}>
        <h2 style={dashboardStyles.sectionTitle}>
          <FaBuilding style={dashboardStyles.sectionIcon} />
          {company ? "Votre Entreprise" : "Aucune Entreprise"}
        </h2>

        {company ? (
          <>
            <div style={dashboardStyles.actionsContainer}>
              <button
                onClick={handleCompanyAction}
                style={dashboardStyles.manageCompanyBtn}
              >
                <FaEdit style={dashboardStyles.btnIcon} />
                Gérer l'entreprise
              </button>
            </div>
            <div style={dashboardStyles.companyCard}>
              <h2 style={dashboardStyles.companyTitle}>{company.name}</h2>
              {company.description && (
                <p style={dashboardStyles.companyDescription}>
                  {company.description}
                </p>
              )}

              <div style={dashboardStyles.companyDetails}>
                {company.address && (
                  <div style={dashboardStyles.infoItem}>
                    <strong>Adresse:</strong> {company.address.city}
                  </div>
                )}
                {company.email && (
                  <div style={dashboardStyles.infoItem}>
                    <FaEnvelope style={dashboardStyles.infoIcon} />
                    <span>{company.email}</span>
                  </div>
                )}
                {company.phone && (
                  <div style={dashboardStyles.infoItem}>
                    <FaPhone style={dashboardStyles.infoIcon} />
                    <span>{company.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <p style={dashboardStyles.noCompanyText}>
              Vous n'avez pas encore créé d'entreprise pour votre compte.
            </p>
            <div style={dashboardStyles.actionsContainer}>
              <button
                onClick={handleCompanyAction}
                style={dashboardStyles.createCompanyBtn}
              >
                <FaPlusCircle style={dashboardStyles.btnIcon} />
                Créer une entreprise
              </button>
            </div>
          </>
        )}
      </div>

      <div style={dashboardStyles.section}>
        <h2 style={dashboardStyles.sectionTitle}>
          <FaUsers style={dashboardStyles.sectionIcon} />
          Vos Équipes
        </h2>

        {company && (
          <div style={dashboardStyles.actionsContainer}>
            <button
              onClick={() => handleTeamAction(company._id)}
              style={dashboardStyles.manageTeamsBtn}
            >
              <FaCog style={dashboardStyles.btnIcon} />
              Gérer les équipes
            </button>
          </div>
        )}

        {teams.length > 0 ? (
          <div style={dashboardStyles.teamGrid}>
            {teams.map((team) => (
              <div key={team._id} style={dashboardStyles.teamCard}>
                <h3 style={dashboardStyles.teamTitle}>{team.name}</h3>
                {team.description && (
                  <p style={dashboardStyles.teamDescription}>
                    {team.description}
                  </p>
                )}
                <div style={dashboardStyles.teamMeta}>
                  <div style={dashboardStyles.infoItem}>
                    <strong>Nombre de membres:</strong> {team.members.length}
                  </div>
                  {team.leader === user._id && (
                    <div style={dashboardStyles.leaderBadge}>
                      Vous êtes le leader de cette équipe
                    </div>
                  )}
                </div>
                <ActionButton
                  onClick={() => navigateToTeam(team._id, company?._id)}
                  variant="info"
                  size="medium"
                >
                  Voir les détails
                </ActionButton>
              </div>
            ))}
          </div>
        ) : (
          <p style={dashboardStyles.noTeamsText}>
            {company
              ? "Vous n'avez pas encore créé d'équipes dans votre entreprise."
              : "Vous devez d'abord créer une entreprise avant de pouvoir gérer des équipes."}
          </p>
        )}
      </div>
    </div>
  );
}
