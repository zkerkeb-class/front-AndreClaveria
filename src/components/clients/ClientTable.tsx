import React from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleClientStatus from "@/components/clients/ToogleClientStatus";
import { Client } from "@/services/client.service";
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useAssignedUsers } from "@/hooks/useAssignedUsers";
import { useRoutePrefix } from "@/hooks/useRoutePrefix";
import { useDateFormatterFr } from "@/hooks/useDateFormatter";
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

  // Utilisation des hooks personnalisés
  const routePrefix = useRoutePrefix();
  const formatDate = useDateFormatterFr();
  const {
    assignedUsers,
    loading: loadingUsers,
    getAssignedUserName,
  } = useAssignedUsers({ clients });

  // Fonction pour générer les chemins de navigation en fonction du rôle
  const generatePath = (action: string, clientId: string, step?: number) => {
    // Si l'utilisateur a le rôle "user"
    if (user?.role === "user") {
      switch (action) {
        case "edit":
          return `/dashboard/user/clients/edit/${companyId}/${clientId}${
            step ? `?step=${step}` : ""
          }`;
        case "contacts":
          return `/dashboard/user/clients/${clientId}/contacts`;
        case "opportunity":
          return `/dashboard/user/opportunity/${clientId}`;
        default:
          return `/dashboard/user/clients/${clientId}`;
      }
    }
    // Pour les rôles admin et manager
    else {
      switch (action) {
        case "edit":
          return `/dashboard/${routePrefix}/manage/company/clients/${companyId}/edit/${clientId}${
            step ? `?step=${step}` : ""
          }`;
        case "contacts":
          return `/dashboard/${routePrefix}/manage/company/clients/${companyId}/contacts/${clientId}`;
        case "opportunity":
          return `/dashboard/${routePrefix}/manage/company/clients/${companyId}/opportunity/${clientId}`;
        default:
          return `/dashboard/${routePrefix}/manage/company/clients/${companyId}/${clientId}`;
      }
    }
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
      header: "Assigné à",
      accessor: getAssignedUserName,
      align: "left",
    },
    {
      header: "Actions",
      accessor: (client) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <ActionButton
              onClick={() => router.push(generatePath("edit", client._id))}
              variant="secondary"
              size="medium"
            >
              Éditer
            </ActionButton>
            <ActionButton
              onClick={() => router.push(generatePath("contacts", client._id))}
              size="medium"
            >
              Contacts
            </ActionButton>
            <ActionButton
              onClick={() =>
                router.push(generatePath("opportunity", client._id))
              }
              variant="primary"
              size="medium"
            >
              Opportunités
            </ActionButton>
            <ActionButton
              onClick={() => router.push(generatePath("edit", client._id, 3))}
              variant="primary"
              size="medium"
            >
              Attribuer
            </ActionButton>
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
      pagination={true}
      defaultItemsPerPage={10}
    />
  );
};

export default ClientTable;
