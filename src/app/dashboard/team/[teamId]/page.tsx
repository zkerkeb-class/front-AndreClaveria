// dashboard/team/[teamId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useTeamDetail } from "@/hooks/useTeamDetail";
import { teamDetailStyles } from "@/styles/pages/dashboard/team/teamDetailStyles";

import {
  FaUsers,
  FaBuilding,
  FaUser,
  FaBriefcase,
  FaArrowLeft,
} from "react-icons/fa";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.teamId as string;

  // Utilisation du hook personnalisé pour gérer la logique de la page de détail d'équipe
  const {
    team,
    clients,
    members,
    loading,
    error,
    formatDate,
    getScoreColor,
    navigateBack,
    navigateToClientDetail,
  } = useTeamDetail({ teamId });

  if (loading) {
    return (
      <div style={teamDetailStyles.loadingSpinner}>
        Chargement des données de l'équipe...
      </div>
    );
  }

  if (error) {
    return <div style={teamDetailStyles.errorMessage}>{error}</div>;
  }

  if (!team) {
    return <div style={teamDetailStyles.errorMessage}>Équipe introuvable</div>;
  }

  return (
    <div style={teamDetailStyles.container}>
      <div style={teamDetailStyles.header}>
        <button style={teamDetailStyles.backButton} onClick={navigateBack}>
          <FaArrowLeft /> Retour
        </button>
      </div>

      <h1 style={teamDetailStyles.title}>{team.name}</h1>
      {team.description && (
        <p style={teamDetailStyles.description}>{team.description}</p>
      )}

      {/* Informations générales */}
      <div style={teamDetailStyles.section}>
        <h2 style={teamDetailStyles.sectionTitle}>
          <FaBuilding style={teamDetailStyles.sectionIcon} />
          Informations générales
        </h2>
        <div style={teamDetailStyles.infoCard}>
          <div style={teamDetailStyles.infoGrid}>
            <div>
              <p>
                <strong>Créée le:</strong> {formatDate(team.createdAt)}
              </p>
              <p>
                <strong>Dernière mise à jour:</strong>{" "}
                {formatDate(team.updatedAt)}
              </p>
            </div>
            <div>
              <p>
                <strong>Statut:</strong> {team.isActive ? "Actif" : "Inactif"}
              </p>
              <p>
                <strong>Nombre de membres:</strong>{" "}
                {Array.isArray(team.members) ? team.members.length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Membres de l'équipe */}
      <div style={teamDetailStyles.section}>
        <h2 style={teamDetailStyles.sectionTitle}>
          <FaUsers style={teamDetailStyles.sectionIcon} />
          Membres de l'équipe
        </h2>
        <div style={teamDetailStyles.membersList}>
          {Array.isArray(team.members) && team.members.length > 0 ? (
            team.members.map((member, index) => {
              const memberId = typeof member === "string" ? member : member._id;
              const isLeader = team.leader === memberId;
              const memberData = members[memberId];

              // Utiliser les données complètes si disponibles, sinon utiliser les données génériques
              const memberName = memberData
                ? `${memberData.firstName} ${memberData.lastName}`
                : `Membre ${index + 1}`;

              const initials = memberData
                ? `${memberData.firstName.charAt(
                    0
                  )}${memberData.lastName.charAt(0)}`
                : `M${index + 1}`;

              const memberRole = memberData ? memberData.role : "Membre";

              return (
                <div
                  key={memberId || index}
                  style={teamDetailStyles.memberItem}
                >
                  <div style={teamDetailStyles.avatar}>{initials}</div>
                  <div style={teamDetailStyles.memberInfo}>
                    <div style={teamDetailStyles.memberName}>{memberName}</div>
                    <div style={teamDetailStyles.memberRole}>{memberRole}</div>
                  </div>
                  {isLeader && (
                    <div style={teamDetailStyles.leaderBadge}>Leader</div>
                  )}
                </div>
              );
            })
          ) : (
            <p>Aucun membre dans cette équipe pour le moment.</p>
          )}
        </div>
      </div>

      {/* Clients associés */}
      <div style={teamDetailStyles.section}>
        <h2 style={teamDetailStyles.sectionTitle}>
          <FaBriefcase style={teamDetailStyles.sectionIcon} />
          Clients associés
        </h2>

        {clients && clients.length > 0 ? (
          <div style={teamDetailStyles.clientsGrid}>
            {clients.map((client) => (
              <div key={client._id} style={teamDetailStyles.clientCard}>
                <div style={teamDetailStyles.clientHeader}>
                  <div style={teamDetailStyles.clientLogo}>
                    <FaBriefcase />
                  </div>
                  <h3 style={teamDetailStyles.clientName}>{client.name}</h3>
                </div>

                {client.description && (
                  <p style={teamDetailStyles.clientDescription}>
                    {client.description}
                  </p>
                )}

                <div style={teamDetailStyles.clientDetails}>
                  {client.sector && (
                    <div style={teamDetailStyles.clientMeta}>
                      <strong>Secteur:</strong> {client.sector}
                    </div>
                  )}

                  {client.email && (
                    <div style={teamDetailStyles.clientMeta}>
                      <strong>Email:</strong> {client.email}
                    </div>
                  )}

                  {client.phone && (
                    <div style={teamDetailStyles.clientMeta}>
                      <strong>Téléphone:</strong> {client.phone}
                    </div>
                  )}

                  <div style={teamDetailStyles.clientMeta}>
                    <strong>Contacts:</strong>{" "}
                    {client.contacts ? client.contacts.length : 0}
                  </div>

                  <div style={teamDetailStyles.clientMeta}>
                    <strong>Opportunités:</strong>{" "}
                    {client.opportunities ? client.opportunities.length : 0}
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <strong>Score client:</strong>{" "}
                      {client.goodForCustomer || 50}/100
                    </div>
                    <div style={teamDetailStyles.goodForCustomerBar}>
                      <div
                        style={{
                          ...teamDetailStyles.goodForCustomerFill,
                          width: `${client.goodForCustomer || 50}%`,
                          backgroundColor: getScoreColor(
                            client.goodForCustomer || 50
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <button
                    style={teamDetailStyles.viewDetailBtn}
                    onClick={() => navigateToClientDetail(client._id)}
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun client associé à cette équipe pour le moment.</p>
        )}
      </div>
    </div>
  );
}
