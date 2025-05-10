// dashboard/team/[teamId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTeamById, Team } from "@/services/team.service";
import { getClientsByTeam, Client } from "@/services/client.service";
import { getUserById, User } from "@/services/user.service";

import {
  FaUsers,
  FaBuilding,
  FaUser,
  FaBriefcase,
  FaArrowLeft,
} from "react-icons/fa";

const teamDetailStyles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  backButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f0f0f0",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "0.5rem",
  },
  description: {
    color: "#666",
    marginBottom: "2rem",
  },
  section: {
    marginBottom: "2.5rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "1.2rem",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #eaeaea",
    paddingBottom: "0.75rem",
  },
  sectionIcon: {
    marginRight: "0.75rem",
    color: "#4361ee",
  },
  infoCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "1.5rem",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  membersList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  memberItem: {
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#4361ee",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    marginRight: "1rem",
  },
  memberInfo: {
    flexGrow: 1,
  },
  memberName: {
    fontWeight: "bold",
    color: "#333",
  },
  memberRole: {
    fontSize: "0.875rem",
    color: "#666",
  },
  leaderBadge: {
    backgroundColor: "#4361ee",
    color: "white",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    marginLeft: "auto",
  },
  clientsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  clientCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
  },
  clientHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  clientLogo: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "1rem",
  },
  clientName: {
    fontWeight: "bold",
    fontSize: "1.25rem",
    color: "#333",
  },
  clientDescription: {
    color: "#666",
    marginBottom: "1rem",
    flexGrow: 1,
  },
  clientDetails: {
    marginTop: "auto",
  },
  clientMeta: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    color: "#666",
    fontSize: "0.875rem",
  },
  goodForCustomerBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    marginTop: "0.5rem",
    overflow: "hidden",
  },
  goodForCustomerFill: {
    height: "100%",
    backgroundColor: "#4361ee",
    borderRadius: "4px",
  },
  viewDetailBtn: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#4361ee",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "1rem",
    fontWeight: "medium",
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    fontSize: "1.2rem",
    color: "#4361ee",
  },
  errorMessage: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "1rem",
    borderRadius: "5px",
    margin: "2rem auto",
    maxWidth: "800px",
    textAlign: "center" as const,
  },
};

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [members, setMembers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teamId = params.teamId as string;

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setLoading(true);
        console.log("Chargement des données pour l'équipe:", teamId);

        // Charger les données de l'équipe
        const teamData = await getTeamById(teamId);
        console.log("Données de l'équipe reçues:", teamData);
        setTeam(teamData);

        // Charger les informations des membres
        if (teamData.members && Array.isArray(teamData.members)) {
          const memberMap: { [key: string]: User } = {};
          const memberPromises = teamData.members.map(async (memberId) => {
            const id = typeof memberId === "string" ? memberId : memberId._id;
            try {
              const userData = await getUserById(id);
              memberMap[id] = userData;
            } catch (error) {
              console.error(
                `Erreur lors de la récupération de l'utilisateur ${id}:`,
                error
              );
            }
          });

          // Ajouter un appel supplémentaire pour le leader si nécessaire
          if (
            teamData.leader &&
            typeof teamData.leader === "string" &&
            !memberMap[teamData.leader]
          ) {
            memberPromises.push(
              (async () => {
                try {
                  const leaderData = await getUserById(
                    teamData.leader as string
                  );
                  memberMap[teamData.leader as string] = leaderData;
                } catch (error) {
                  console.error(
                    `Erreur lors de la récupération du leader ${teamData.leader}:`,
                    error
                  );
                }
              })()
            );
          }

          // Attendre que tous les appels API soient terminés
          await Promise.all(memberPromises);
          setMembers(memberMap);
        }

        // Récupérer les clients associés à cette équipe
        const clientsData = await getClientsByTeam(teamId);
        console.log("Clients associés reçus:", clientsData);

        // Extraire les données selon le format de réponse
        if (
          clientsData &&
          clientsData.success &&
          Array.isArray(clientsData.data)
        ) {
          setClients(clientsData.data);
        } else if (Array.isArray(clientsData)) {
          setClients(clientsData);
        } else if (clientsData && typeof clientsData === "object") {
          // Chercher une propriété qui contient un tableau
          const possibleArrayProps = Object.keys(clientsData).find((key) =>
            Array.isArray(clientsData[key])
          );
          if (possibleArrayProps) {
            setClients(clientsData[possibleArrayProps]);
          } else {
            setClients([]);
          }
        } else {
          setClients([]);
        }
      } catch (err: any) {
        console.error("Error loading team data:", err);
        setError(
          `Impossible de charger les données de l'équipe: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      loadTeamData();
    }
  }, [teamId]);

  // Formater une date en français
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return dateString;
    }
  };

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
        <button
          style={teamDetailStyles.backButton}
          onClick={() => router.back()}
        >
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
                    onClick={() =>
                      router.push(`/dashboard/client/${client._id}`)
                    }
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

// Fonction pour déterminer la couleur du score client
function getScoreColor(score: number): string {
  if (score < 30) return "#ef4444"; // Rouge
  if (score < 50) return "#f97316"; // Orange
  if (score < 70) return "#facc15"; // Jaune
  if (score < 90) return "#84cc16"; // Vert clair
  return "#22c55e"; // Vert
}
