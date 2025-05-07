import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleClientStatus from "@/components/clients/ToogleClientStatus";
import { Client } from "@/services/client.service";
import { getUserById, User } from "@/services/user.service";
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useAuth } from "@/contexts/AuthContext";

interface ClientTableProps {
  clients: Client[];
  companyId: string;
  isLoading: boolean;
  onStatusChange: (clientId: string, newStatus: boolean) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  companyId,
  isLoading,
  onStatusChange,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [assignedUsers, setAssignedUsers] = useState<{ [key: string]: User }>(
    {}
  );
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Détermination du préfixe de route basé sur le rôle
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };

  // Chargement des utilisateurs assignés au montage du composant
  useEffect(() => {
    const fetchAssignedUsers = async () => {
      if (!clients || clients.length === 0) return;

      setLoadingUsers(true);
      const userMap: { [key: string]: User } = {};

      // Création d'un ensemble pour éviter les doublons
      const userIds = new Set<string>();

      // Collecte des IDs uniques des utilisateurs assignés
      clients.forEach((client) => {
        if (client.assignedTo) {
          userIds.add(client.assignedTo);
        }
      });

      // Récupération des détails pour chaque utilisateur
      try {
        const promises = Array.from(userIds).map(async (userId) => {
          try {
            const userData = await getUserById(userId);
            userMap[userId] = userData;
          } catch (error) {
            console.error(
              `Erreur lors de la récupération de l'utilisateur ${userId}:`,
              error
            );
          }
        });

        await Promise.all(promises);
        setAssignedUsers(userMap);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchAssignedUsers();
  }, [clients]);

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

  // Fonction pour obtenir le nom de l'utilisateur assigné
  const getAssignedUserName = (client: Client) => {
    if (!client.assignedTo) return "Non assigné";

    if (assignedUsers[client.assignedTo]) {
      return `${assignedUsers[client.assignedTo].firstName} ${
        assignedUsers[client.assignedTo].lastName
      }`;
    }

    return "Chargement...";
  };

  const columns: TableColumn<Client>[] = [
    {
      header: "Nom",
      accessor: "name",
      align: "left",
    },
    {
      header: "Secteur",
      accessor: (client) => client.sector || "Non renseigné",
      align: "left",
    },
    {
      header: "Email",
      accessor: (client) => client.email || "Non renseigné",
      align: "left",
    },
    {
      header: "Téléphone",
      accessor: (client) => client.phone || "Non renseigné",
      align: "left",
    },
    {
      header: "Score Client",
      accessor: (client) => `${client.goodForCustomer || 50}/100`,
      align: "center",
    },
    {
      header: "Assigné à",
      accessor: getAssignedUserName,
      align: "left",
    },
    {
      header: "Statut",
      accessor: (client) => <StatusBadge isActive={client.isActive} />,
      align: "center",
    },
    {
      header: "Actions",
      accessor: (client) => {
        const routePrefix = getRoutePrefix();

        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <ActionButton
              onClick={() =>
                router.push(
                  `/dashboard/${routePrefix}/manage/company/clients/${companyId}/edit/${client._id}`
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
                  `/dashboard/${routePrefix}/manage/company/clients/${companyId}/contacts/${client._id}`
                )
              }
              size="medium"
            >
              Contacts
            </ActionButton>
            <ActionButton
              onClick={() =>
                router.push(
                  `/dashboard/${routePrefix}/manage/company/clients/${companyId}/opportunities/${client._id}`
                )
              }
              variant="primary"
              size="medium"
            >
              Opportunités
            </ActionButton>
            <ToggleClientStatus
              clientId={client._id}
              isActive={client.isActive}
              onStatusChange={(newStatus) =>
                onStatusChange(client._id, newStatus)
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
      data={clients}
      columns={columns}
      keyField="_id"
      isLoading={isLoading || loadingUsers}
      emptyMessage="Aucun client trouvé pour cette entreprise"
      styleProps={customTableStyles}
    />
  );
};

export default ClientTable;
