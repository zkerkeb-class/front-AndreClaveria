import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleContactStatus from "@/components/contacts/ToggleContactStatus";
import { Contact } from "@/services/contact.service";
import { getUserById, User } from "@/services/user.service";
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useAuth } from "@/contexts/AuthContext";
import { getClientById, Client } from "@/services/client.service";

interface ContactTableProps {
  contacts: Contact[];
  clientId: string;
  isLoading: boolean;
  onStatusChange: (contactId: string, newStatus: boolean) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  clientId,
  isLoading,
  onStatusChange,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [assignedUsers, setAssignedUsers] = useState<{ [key: string]: User }>(
    {}
  );
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [loadingClients, setLoadingClients] = useState(false);

  // Détermination du préfixe de route basé sur le rôle
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };

  // Chargement des utilisateurs assignés et des clients au montage du composant
  useEffect(() => {
    const fetchAssignedUsers = async () => {
      if (!contacts || contacts.length === 0) return;

      setLoadingUsers(true);
      const userMap: { [key: string]: User } = {};

      // Création d'un ensemble pour éviter les doublons
      const userIds = new Set<string>();

      // Collecte des IDs uniques des utilisateurs assignés
      contacts.forEach((contact) => {
        if (contact.assignedTo) {
          userIds.add(contact.assignedTo);
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

    const fetchClients = async () => {
      if (!contacts || contacts.length === 0) return;

      setLoadingClients(true);
      const clientMap: { [key: string]: Client } = {};

      // Création d'un ensemble pour éviter les doublons
      const clientIds = new Set<string>();

      // Collecte des IDs uniques des clients
      contacts.forEach((contact) => {
        if (contact.client) {
          clientIds.add(contact.client);
        }
      });

      // Récupération des détails pour chaque client
      try {
        const promises = Array.from(clientIds).map(async (clientId) => {
          try {
            const clientData = await getClientById(clientId);
            clientMap[clientId] = clientData;
          } catch (error) {
            console.error(
              `Erreur lors de la récupération du client ${clientId}:`,
              error
            );
          }
        });

        await Promise.all(promises);
        setClients(clientMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchAssignedUsers();
    fetchClients();
  }, [contacts]);

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
  const getAssignedUserName = (contact: Contact) => {
    if (!contact.assignedTo) return "Non assigné";

    if (assignedUsers[contact.assignedTo]) {
      return `${assignedUsers[contact.assignedTo].firstName} ${
        assignedUsers[contact.assignedTo].lastName
      }`;
    }

    return "Chargement...";
  };

  // Fonction pour obtenir le nom du client
  const getClientName = (contact: Contact) => {
    if (!contact.client) return "Non associé";

    if (clients[contact.client]) {
      return clients[contact.client].name;
    }

    return "Chargement...";
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
                  `/dashboard/${routePrefix}/manage/company/contacts/${clientId}/edit/${contact._id}`
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
