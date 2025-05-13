"use client";

import React, { useState, use } from "react";
import { useTeamDetails } from "@/hooks/useTeamDetails";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import ActionButton from "@/components/common/ActionButton";
import { teamDetailsStyles as styles } from "@/styles/pages/dashboard/admin/teamDetailsStyles";
import {
  FaBuilding,
  FaUsers,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaUsersCog,
  FaCalendarAlt,
  FaEdit,
  FaArrowLeft,
  FaTrashAlt,
  FaPlus,
  FaExclamationTriangle,
  FaUser,
  FaStar,
  FaChartLine,
  FaBriefcase,
  FaClipboardList,
  FaSyncAlt,
  FaCrown,
} from "react-icons/fa";
import { User } from "@/services/user.service";

interface TeamDetailsProps {
  params: Promise<{
    teamId: string;
  }>;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const { teamId } = unwrappedParams;

  const { user, isLoading: isAuthLoading } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    team,
    company,
    members,
    clients,
    isLoading,
    error,
    updateTeamDetails,
    deleteTeamAndNavigate,
    navigateToCompany,
    navigateToMember,
    navigateToClient,
    navigateToMembersManagement,
    navigateToClientsManagement,
    navigateBack,
  } = useTeamDetails(teamId);

  // Vérification du rôle pour l'accès
  const hasAccess = useRoleCheck({
    isLoading: isAuthLoading,
    user,
    requiredRole: ["admin", "manager"],
    redirectPath: "/dashboard",
  });

  // Fonction pour rafraîchir la page
  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  if (isAuthLoading || !user || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>
          <FaSyncAlt style={{ animation: "spin 1s linear infinite" }} />
        </div>
        <p>Chargement des informations de l'équipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <ActionButton onClick={handleRefresh} variant="secondary" size="medium">
          <FaSyncAlt style={{ marginRight: "8px" }} />
          Réessayer
        </ActionButton>
      </div>
    );
  }

  if (!team) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Équipe non trouvée</h2>
        <ActionButton onClick={navigateBack} variant="secondary" size="medium">
          <FaArrowLeft style={{ marginRight: "8px" }} />
          Retour à la liste des équipes
        </ActionButton>
      </div>
    );
  }

  // Formater la date pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Gérer la suppression de l'équipe
  const handleDeleteTeam = async () => {
    const success = await deleteTeamAndNavigate();
    if (!success) {
      setShowDeleteModal(false);
    }
  };

  // Identifier le leader de l'équipe
  const getTeamLeader = (): User | null => {
    if (!team.leader) return null;

    if (typeof team.leader === "string") {
      // Si le leader est juste un ID, chercher dans les membres
      const leaderMember = members.find((member) => member._id === team.leader);
      return leaderMember || null;
    } else {
      // Si le leader est déjà un objet User
      return team.leader as User;
    }
  };

  const teamLeader = getTeamLeader();
  const teamMembers = members || [];
  const teamClients = clients || [];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>
            <FaArrowLeft
              style={{ cursor: "pointer", marginRight: "0.75rem" }}
              onClick={navigateBack}
            />
            {team.name}
          </h1>
          <div style={styles.pageSubtitle}>
            Gestion et informations de l'équipe
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <ActionButton
            onClick={handleRefresh}
            variant="secondary"
            size="medium"
          >
            <FaSyncAlt style={{ marginRight: "8px" }} />
            Actualiser
          </ActionButton>
          <ActionButton
            onClick={() =>
              (window.location.href = `/dashboard/admin/manage/company/teams/${company?._id}/edit/${teamId}`)
            }
            variant="secondary"
            size="medium"
          >
            <FaEdit style={{ marginRight: "8px" }} />
            Modifier
          </ActionButton>
          <ActionButton
            onClick={() => setShowDeleteModal(true)}
            variant="danger"
            size="medium"
          >
            <FaTrashAlt style={{ marginRight: "8px" }} />
            Supprimer
          </ActionButton>
        </div>
      </div>

      <div style={styles.contentGrid}>
        {/* Panneau gauche - Informations de l'équipe et connexions */}
        <div style={styles.leftPanel}>
          {/* Carte d'information de l'équipe */}
          <div style={styles.card}>
            <div style={styles.teamHeader}>
              <div style={styles.teamAvatar}>
                <FaUsers />
              </div>
              <div style={styles.teamInfo}>
                <h2 style={styles.teamName}>{team.name}</h2>
                <div style={styles.badgeContainer}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: team.isActive ? "#4caf50" : "#f44336",
                    }}
                  >
                    {team.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {team.description && (
              <p style={styles.teamDescription}>{team.description}</p>
            )}

            <div style={styles.divider}></div>

            <div style={styles.detailsGrid}>
              {company && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>
                    <FaBuilding />
                    Entreprise
                  </div>
                  <div
                    style={{
                      ...styles.detailValue,
                      cursor: "pointer",
                      color: "#1976d2",
                    }}
                    onClick={navigateToCompany}
                  >
                    {company.name}
                  </div>
                </div>
              )}

              {teamLeader && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>
                    <FaCrown />
                    Responsable d'équipe
                  </div>
                  <div
                    style={{
                      ...styles.detailValue,
                      cursor: "pointer",
                      color: "#1976d2",
                    }}
                    onClick={() => navigateToMember(teamLeader._id)}
                  >
                    {teamLeader.firstName} {teamLeader.lastName}
                  </div>
                </div>
              )}

              {team.createdAt && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>
                    <FaCalendarAlt />
                    Date de création
                  </div>
                  <div style={styles.detailValue}>
                    {formatDate(team.createdAt)}
                  </div>
                </div>
              )}

              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>
                  <FaUsers />
                  Membres
                </div>
                <div style={styles.detailValue}>
                  {teamMembers.length} membre
                  {teamMembers.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div style={styles.statsContainer}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  <FaUsers />
                </div>
                <div style={styles.statValue}>{teamMembers.length}</div>
                <div style={styles.statLabel}>Membres</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  <FaBriefcase />
                </div>
                <div style={styles.statValue}>{teamClients.length}</div>
                <div style={styles.statLabel}>Clients</div>
              </div>
            </div>
          </div>

          {/* Carte des liens/connexions */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <FaBuilding style={styles.sectionIcon} />
                Connexions
              </h2>
            </div>

            {/* Lien vers l'entreprise */}
            {company && (
              <div style={styles.linkItem} onClick={navigateToCompany}>
                <FaBuilding style={styles.linkIcon} />
                <div style={styles.linkInfo}>
                  <div style={styles.linkTitle}>Entreprise</div>
                  <div style={styles.linkSubtitle}>{company.name}</div>
                </div>
              </div>
            )}

            {/* Lien vers le responsable d'équipe */}
            {teamLeader && (
              <div
                style={styles.linkItem}
                onClick={() => navigateToMember(teamLeader._id)}
              >
                <FaCrown style={{ ...styles.linkIcon, color: "#ffc107" }} />
                <div style={styles.linkInfo}>
                  <div style={styles.linkTitle}>Responsable d'équipe</div>
                  <div style={styles.linkSubtitle}>
                    {teamLeader.firstName} {teamLeader.lastName}
                  </div>
                </div>
              </div>
            )}

            {/* Lien vers la gestion des membres */}
            <div style={styles.linkItem} onClick={navigateToMembersManagement}>
              <FaUsersCog style={styles.linkIcon} />
              <div style={styles.linkInfo}>
                <div style={styles.linkTitle}>Gérer les membres</div>
                <div style={styles.linkSubtitle}>
                  Ajouter ou supprimer des membres
                </div>
              </div>
            </div>

            {/* Lien vers la gestion des clients */}
            <div style={styles.linkItem} onClick={navigateToClientsManagement}>
              <FaBriefcase style={styles.linkIcon} />
              <div style={styles.linkInfo}>
                <div style={styles.linkTitle}>Gérer les clients</div>
                <div style={styles.linkSubtitle}>
                  Assigner ou retirer des clients
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panneau droit - Membres et clients */}
        <div style={styles.rightPanel}>
          {/* Carte des membres */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <FaUserTie style={styles.sectionIcon} />
                Membres
              </h2>
              <ActionButton
                onClick={navigateToMembersManagement}
                variant="primary"
                size="small"
              >
                <FaPlus style={{ marginRight: "8px" }} />
                Ajouter un membre
              </ActionButton>
            </div>

            {teamMembers.length > 0 ? (
              <div style={styles.membersContainer}>
                {teamMembers.map((member) => (
                  <div
                    key={member._id}
                    style={styles.memberCard}
                    onClick={() => navigateToMember(member._id)}
                  >
                    <div style={styles.memberAvatar}>
                      {member.firstName?.charAt(0) || ""}
                      {member.lastName?.charAt(0) || ""}
                    </div>
                    <div style={styles.memberInfo}>
                      <div style={styles.memberName}>
                        {member.firstName} {member.lastName}
                        {teamLeader && member._id === teamLeader._id && (
                          <FaCrown
                            style={{
                              marginLeft: "0.5rem",
                              color: "#ffc107",
                              fontSize: "0.875rem",
                            }}
                            title="Responsable d'équipe"
                          />
                        )}
                      </div>
                      {member.role && (
                        <div style={styles.memberRole}>{member.role}</div>
                      )}
                      {member.email && (
                        <div style={styles.memberEmail}>
                          <FaEnvelope style={styles.memberEmailIcon} />
                          {member.email}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noDataCard}>
                <FaExclamationTriangle style={styles.noDataIcon} />
                <div style={styles.noDataText}>
                  Aucun membre n'a été ajouté à cette équipe.
                </div>
                <ActionButton
                  onClick={navigateToMembersManagement}
                  variant="primary"
                  size="medium"
                >
                  <FaPlus style={{ marginRight: "8px" }} />
                  Ajouter un membre
                </ActionButton>
              </div>
            )}
          </div>

          {/* Carte des clients */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <FaBriefcase style={styles.sectionIcon} />
                Clients
              </h2>
              <ActionButton
                onClick={navigateToClientsManagement}
                variant="primary"
                size="small"
              >
                <FaPlus style={{ marginRight: "8px" }} />
                Ajouter un client
              </ActionButton>
            </div>

            {teamClients.length > 0 ? (
              <div style={styles.clientsContainer}>
                {teamClients.map((client) => (
                  <div
                    key={client._id}
                    style={styles.clientCard}
                    onClick={() => navigateToClient(client._id)}
                  >
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={`Logo ${client.name}`}
                        style={styles.clientLogo}
                      />
                    ) : (
                      <div style={styles.clientLogoPlaceholder}>
                        <FaBuilding />
                      </div>
                    )}
                    <div style={styles.clientInfo}>
                      <div style={styles.clientName}>{client.name}</div>
                      {client.sector && (
                        <div style={styles.clientSector}>{client.sector}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noDataCard}>
                <FaExclamationTriangle style={styles.noDataIcon} />
                <div style={styles.noDataText}>
                  Aucun client n'a été assigné à cette équipe.
                </div>
                <ActionButton
                  onClick={navigateToClientsManagement}
                  variant="primary"
                  size="medium"
                >
                  <FaPlus style={{ marginRight: "8px" }} />
                  Ajouter un client
                </ActionButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Confirmer la suppression</h3>
              <p style={styles.modalText}>
                Êtes-vous sûr de vouloir supprimer l'équipe{" "}
                <strong>{team.name}</strong> ? Cette action ne peut pas être
                annulée.
              </p>
            </div>
            <div style={styles.modalActions}>
              <ActionButton
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                size="medium"
              >
                Annuler
              </ActionButton>
              <ActionButton
                onClick={handleDeleteTeam}
                variant="danger"
                size="medium"
              >
                <FaTrashAlt style={{ marginRight: "8px" }} />
                Supprimer
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {/* Overlay de chargement pour les actions */}
      {refreshing && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner}>
            <FaSyncAlt style={{ animation: "spin 1s linear infinite" }} />
          </div>
          <p>Actualisation des données...</p>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
