import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleTeamStatus from "@/components/teams/ToggleTeamStatus";
import { Team } from "@/services/team.service";
import { getUserById, User } from "@/services/user.service"; // Ajout de l'import getUserById
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useAuth } from "@/contexts/AuthContext";

interface TeamTableProps {
  teams: Team[];
  companyId: string;
  isLoading: boolean;
  onStatusChange: (teamId: string, newStatus: boolean) => void;
}

const TeamTable: React.FC<TeamTableProps> = ({
  teams,
  companyId,
  isLoading,
  onStatusChange,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [teamLeaders, setTeamLeaders] = useState<{ [key: string]: User }>({});
  const [loadingLeaders, setLoadingLeaders] = useState(false);

  // Détermination du préfixe de route basé sur le rôle
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };

  // Chargement des leaders au montage du composant
  useEffect(() => {
    const fetchLeaderDetails = async () => {
      if (!teams || teams.length === 0) return;

      setLoadingLeaders(true);
      const leaderMap: { [key: string]: User } = {};

      // Création d'un ensemble pour éviter les doublons
      const leaderIds = new Set<string>();

      // Collecte des IDs uniques de leaders
      teams.forEach((team) => {
        if (team.leader) {
          const leaderId =
            typeof team.leader === "object" ? team.leader._id : team.leader;
          if (leaderId) {
            leaderIds.add(leaderId);
          }
        }
      });

      // Récupération des détails pour chaque leader
      try {
        const promises = Array.from(leaderIds).map(async (leaderId) => {
          try {
            const leaderData = await getUserById(leaderId);
            leaderMap[leaderId] = leaderData;
          } catch (error) {
            console.error(
              `Erreur lors de la récupération du leader ${leaderId}:`,
              error
            );
          }
        });

        await Promise.all(promises);
        setTeamLeaders(leaderMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des leaders:", error);
      } finally {
        setLoadingLeaders(false);
      }
    };

    fetchLeaderDetails();
  }, [teams]);

  // Formatage de la date de création
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Fonction pour obtenir le nom du leader
  const getLeaderName = (team: Team) => {
    // Si le leader est déjà un objet User complet
    if (
      team.leader &&
      typeof team.leader === "object" &&
      team.leader.firstName
    ) {
      return `${team.leader.firstName} ${team.leader.lastName}`;
    }

    // Si le leader est un ID et que nous avons récupéré ses détails
    const leaderId =
      typeof team.leader === "string"
        ? team.leader
        : team.leader && "_id" in team.leader
        ? team.leader._id
        : "";

    if (leaderId && teamLeaders[leaderId]) {
      return `${teamLeaders[leaderId].firstName} ${teamLeaders[leaderId].lastName}`;
    }

    return "Non assigné";
  };

  const columns: TableColumn<Team>[] = [
    {
      header: "Nom",
      accessor: "name",
      align: "left",
    },
    {
      header: "Description",
      accessor: (team) => team.description || "Non renseignée",
      align: "left",
    },
    {
      header: "Nombre de membres",
      accessor: (team) => team.members?.length || 0,
      align: "center",
    },
    {
      header: "Leader",
      accessor: getLeaderName,
      align: "left",
    },
    {
      header: "Statut",
      accessor: (team) => <StatusBadge isActive={team.isActive} />,
      align: "center",
    },
    {
      header: "Date de création",
      accessor: (team) => formatDate(team.createdAt),
      align: "left",
    },
    {
      header: "Actions",
      accessor: (team) => {
        const routePrefix = getRoutePrefix();

        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <ActionButton
              onClick={() =>
                router.push(
                  `/dashboard/${routePrefix}/manage/company/teams/${companyId}/edit/${team._id}`
                )
              }
              variant="secondary"
              size="medium"
            >
              Éditer
            </ActionButton>
            <ActionButton
              onClick={() =>
                router.push(
                  `/dashboard/${routePrefix}/manage/company/teams/${companyId}/members/${team._id}`
                )
              }
              size="medium"
            >
              Membres
            </ActionButton>
            <ToggleTeamStatus
              teamId={team._id}
              isActive={team.isActive}
              onStatusChange={(newStatus) =>
                onStatusChange(team._id, newStatus)
              }
            />
          </div>
        );
      },
      align: "center",
      isAction: true,
    },
  ];

  // Utiliser les styles configurés
  const customTableStyles = {
    ...tableStyleProps,
    variant: "striped" as const,
    headerStyle: "light" as const,
    rounded: true,
    maxWidth: "1200px",
  };

  return (
    <Table
      data={teams}
      columns={columns}
      keyField="_id"
      isLoading={isLoading || loadingLeaders}
      emptyMessage="Aucune équipe trouvée pour cette entreprise"
      styleProps={customTableStyles}
    />
  );
};

export default TeamTable;
