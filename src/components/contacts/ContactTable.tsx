import React from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleContactStatus from "@/components/contacts/ToggleContactStatus";
import { Contact } from "@/services/contact.service";
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useAuth } from "@/contexts/AuthContext";
import { useDateFormatterFr } from "@/hooks/useDateFormatter";
import { useContactAssignedUsers } from "@/hooks/useContactAssignedUsers";
import { useContactClients } from "@/hooks/useContactClients";

interface ContactTableProps {
  contacts: Contact[];
  clientId: string;
  companyId: string;
  isLoading: boolean;
  onStatusChange: (contactId: string, newStatus: boolean) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  clientId,
  companyId,
  isLoading,
  onStatusChange,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const formatDate = useDateFormatterFr();

  // Utilisation des hooks personnalisés
  const { getAssignedUserName, loading: loadingUsers } =
    useContactAssignedUsers(contacts);
  const { getClientName, loading: loadingClients } =
    useContactClients(contacts);

  // Détermination du préfixe de route basé sur le rôle
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };

  const columns: TableColumn<Contact>[] = [
    {
      header: "Nom",
      accessor: (contact) => `${contact.firstName} ${contact.lastName}`,
      align: "left",
    },
    {
      header: "Client",
      accessor: getClientName,
      align: "left",
    },
    {
      header: "Poste",
      accessor: (contact) => contact.position || "Non renseigné",
      align: "left",
    },
    {
      header: "Email",
      accessor: (contact) => contact.email || "Non renseigné",
      align: "left",
    },
    {
      header: "Téléphone",
      accessor: (contact) => contact.phone || "Non renseigné",
      align: "left",
    },
    {
      header: "Mobile",
      accessor: (contact) => contact.mobile || "Non renseigné",
      align: "left",
    },
    {
      header: "Contact principal",
      accessor: (contact) => (contact.isPrimary ? "Oui" : "Non"),
      align: "center",
    },
    {
      header: "Assigné à",
      accessor: getAssignedUserName,
      align: "left",
    },
    {
      header: "Dernier contact",
      accessor: (contact) => formatDate(contact.lastContactDate),
      align: "center",
    },
    {
      header: "Statut",
      accessor: (contact) => <StatusBadge isActive={contact.isActive} />,
      align: "center",
    },
    {
      header: "Actions",
      accessor: (contact) => {
        const routePrefix = getRoutePrefix();

        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <ActionButton
              onClick={() =>
                router.push(
                  `/dashboard/${routePrefix}/manage/company/clients/${companyId}/edit/${clientId}?step=4`
                )
              }
              variant="secondary"
              size="medium"
            >
              Éditer
            </ActionButton>
            <ToggleContactStatus
              contactId={contact._id}
              isActive={contact.isActive}
              onStatusChange={(newStatus) =>
                onStatusChange(contact._id, newStatus)
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
      data={contacts}
      columns={columns}
      keyField="_id"
      isLoading={isLoading || loadingUsers || loadingClients}
      emptyMessage="Aucun contact trouvé pour cette entreprise"
      styleProps={customTableStyles}
    />
  );
};

export default ContactTable;
