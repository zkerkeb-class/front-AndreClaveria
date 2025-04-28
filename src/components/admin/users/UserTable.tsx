"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleUserStatus from "@/components/admin/users/ToggleUserStatus";
import { User } from "@/services/user.service";
import { tableStyleProps } from "@/styles/components/tableStyles";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onStatusChange: (userId: string, newStatus: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onStatusChange,
}) => {
  const router = useRouter();

  // Formatage de la date de dernière connexion
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Jamais";
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: TableColumn<User>[] = [
    {
      header: "Nom",
      accessor: (user) => `${user.firstName} ${user.lastName}`,
      align: "left",
    },
    {
      header: "Email",
      accessor: "email",
      align: "left",
    },
    {
      header: "Rôle",
      accessor: (user) => (
        <span style={{ textTransform: "capitalize" }}>{user.role}</span>
      ),
      align: "left",
    },
    {
      header: "Téléphone",
      accessor: (user) => user.phoneNumber || "Non renseigné",
      align: "left",
    },
    {
      header: "Statut",
      accessor: (user) => <StatusBadge isActive={user.active} />,
      align: "center",
    },
    {
      header: "Dernière connexion",
      accessor: (user) => formatDate(user.lastLogin),
      align: "left",
    },
    {
      header: "Actions",
      accessor: (user) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <ActionButton
            onClick={() =>
              router.push(`/dashboard/admin/manage/users/edit/${user._id}`)
            }
            variant="secondary"
            size="medium"
          >
            Éditer
          </ActionButton>
          <ToggleUserStatus
            userId={user._id}
            isActive={user.active}
            onStatusChange={(newStatus) => onStatusChange(user._id, newStatus)}
          />
        </div>
      ),
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
      data={users}
      columns={columns}
      keyField="_id"
      isLoading={isLoading}
      emptyMessage="Aucun utilisateur trouvé"
      styleProps={customTableStyles}
    />
  );
};

export default UserTable;
