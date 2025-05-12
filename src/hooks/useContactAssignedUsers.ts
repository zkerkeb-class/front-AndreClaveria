// src/hooks/useContactAssignedUsers.ts
import { useState, useEffect } from "react";
import { Contact } from "@/services/contact.service";
import { getUserById, User } from "@/services/user.service";

interface UseContactAssignedUsersReturn {
  assignedUsers: { [key: string]: User };
  loading: boolean;
  getAssignedUserName: (contact: Contact) => string;
}

/**
 * Hook pour gérer le chargement et l'accès aux utilisateurs assignés aux contacts
 */
export const useContactAssignedUsers = (
  contacts: Contact[]
): UseContactAssignedUsersReturn => {
  const [assignedUsers, setAssignedUsers] = useState<{ [key: string]: User }>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);

  // Chargement des utilisateurs assignés
  useEffect(() => {
    const fetchAssignedUsers = async () => {
      if (!contacts || contacts.length === 0) return;

      setLoading(true);
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
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, [contacts]);

  // Fonction pour obtenir le nom de l'utilisateur assigné
  const getAssignedUserName = (contact: Contact): string => {
    if (!contact.assignedTo) return "Non assigné";

    if (assignedUsers[contact.assignedTo]) {
      return `${assignedUsers[contact.assignedTo].firstName} ${
        assignedUsers[contact.assignedTo].lastName
      }`;
    }

    return "Chargement...";
  };

  return {
    assignedUsers,
    loading,
    getAssignedUserName,
  };
};
