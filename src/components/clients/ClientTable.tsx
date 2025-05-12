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

  // Utilisation des hooks personnalisés
  const routePrefix = useRoutePrefix();
  const formatDate = useDateFormatterFr();
  const {
    assignedUsers,
    loading: loadingUsers,
    getAssignedUserName,
  } = useAssignedUsers({ clients });

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
                  `/dashboard/${routePrefix}/manage/company/clients/${companyId}/opportunity/${client._id}`
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
