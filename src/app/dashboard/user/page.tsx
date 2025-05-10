// /dashboard/user/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserDashboard } from "@/services/dashboard.service";
import { Team } from "@/services/team.service";
import { User } from "@/services/user.service";
import { Company } from "@/services/company.service";

import {
  FaBuilding,
  FaUsers,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

interface DashboardData {
  user: User;
  teams: Team[];
  company: Company | null;
}

const dashboardStyles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
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
  userInfoCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "#4361ee",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  userName: {
    margin: "1rem 0",
    color: "#2b2d42",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    margin: "0.5rem 0",
  },
  infoIcon: {
    marginRight: "0.5rem",
    color: "#4361ee",
  },
  companyCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  companyTitle: {
    color: "#2b2d42",
    marginBottom: "1rem",
  },
  companyDescription: {
    color: "#666",
    marginBottom: "1.5rem",
  },
  companyDetails: {
    marginTop: "1rem",
    borderTop: "1px solid #eaeaea",
    paddingTop: "1rem",
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  teamCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column" as const,
  },
  teamTitle: {
    color: "#2b2d42",
    marginBottom: "0.75rem",
  },
  teamDescription: {
    color: "#666",
    marginBottom: "1rem",
    flexGrow: 1,
  },
  teamMeta: {
    margin: "1rem 0",
  },
  leaderBadge: {
    background: "#4361ee",
    color: "white",
    padding: "0.5rem",
    borderRadius: "5px",
    marginTop: "0.75rem",
    fontSize: "0.9rem",
    textAlign: "center" as const,
  },
  viewDetailsBtn: {
    background: "#4361ee",
    color: "white",
    border: "none",
    padding: "0.75rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: 500,
    marginTop: "auto",
    transition: "background 0.2s",
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

export default function UserDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await fetchUserDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Impossible de charger les données du tableau de bord");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

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

      {company && (
        <div style={dashboardStyles.section}>
          <h2 style={dashboardStyles.sectionTitle}>
            <FaBuilding style={dashboardStyles.sectionIcon} />
            Votre Entreprise
          </h2>
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
        </div>
      )}

      {teams.length > 0 && (
        <div style={dashboardStyles.section}>
          <h2 style={dashboardStyles.sectionTitle}>
            <FaUsers style={dashboardStyles.sectionIcon} />
            Vos Équipes
          </h2>
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
                <button
                  onClick={() => router.push(`/dashboard/team/${team._id}`)}
                  style={dashboardStyles.viewDetailsBtn}
                >
                  Voir les détails
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
