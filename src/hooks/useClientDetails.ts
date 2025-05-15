// src/hooks/useClientDetails.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getClientById,
  updateClient,
  deleteClient,
  Client,
} from "@/services/client.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getTeamById, Team } from "@/services/team.service";
import { getUserById, User } from "@/services/user.service";
import { Contact, getContactsByClient } from "@/services/contact.service";
import {
  Opportunity,
  getOpportunitiesByClient,
} from "@/services/opportunity.service";
import { useAuth } from "@/contexts/AuthContext";
import { getRoutePrefix } from "@/utils/getRoutePrefix";

interface UseClientDetailsReturn {
  client: Client | null;
  company: Company | null;
  team: Team | null;
  assignedUser: User | null;
  contacts: Contact[];
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  updateClientDetails: (clientData: Partial<Client>) => Promise<boolean>;
  deleteClientAndNavigate: () => Promise<boolean>;
  navigateToCompany: () => void;
  navigateToTeam: () => void;
  navigateToAssignedUser: () => void;
  navigateToContact: (contactId: string) => void;
  navigateToOpportunity: (opportunityId: string) => void;
  navigateToContactsManagement: () => void;
  navigateToOpportunitiesManagement: () => void;
  navigateToMailPage: () => void;
}

export const useClientDetails = (clientId: string): UseClientDetailsReturn => {
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [assignedUser, setAssignedUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  // Utiliser getRoutePrefix pour déterminer le préfixe de route
  const routePrefix = getRoutePrefix(user?.role);

  // Déterminer la structure de route selon le rôle
  const getBaseRoute = () => {
    if (routePrefix === "user") {
      return `/dashboard/user/clients`;
    } else {
      return `/dashboard/${routePrefix}/manage`;
    }
  };

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les détails du client
        const clientData = await getClientById(clientId);
        if (!clientData) {
          throw new Error("Client non trouvé");
        }
        setClient(clientData);

        // Récupérer les détails de l'entreprise associée
        if (clientData.company) {
          try {
            const companyData = await getCompanyById(clientData.company);
            setCompany(companyData);
          } catch (err) {
            console.error(
              "Erreur lors de la récupération de l'entreprise:",
              err
            );
          }
        }

        // Récupérer les détails de l'équipe associée (si elle existe)
        if (clientData.team) {
          try {
            const teamData = await getTeamById(clientData.team);
            setTeam(teamData);
          } catch (err) {
            console.error("Erreur lors de la récupération de l'équipe:", err);
          }
        }

        // Récupérer les détails de l'utilisateur assigné (si applicable)
        if (clientData.assignedTo) {
          try {
            const userData = await getUserById(clientData.assignedTo);
            setAssignedUser(userData);
          } catch (err) {
            console.error(
              "Erreur lors de la récupération de l'utilisateur assigné:",
              err
            );
          }
        }

        // Récupérer les contacts associés
        try {
          const contactsResponse = await getContactsByClient(clientId);

          // Traitement normalisé de la réponse des contacts
          let normalizedContacts: Contact[] = [];

          if (contactsResponse && typeof contactsResponse === "object") {
            if (
              "data" in contactsResponse &&
              Array.isArray(contactsResponse.data)
            ) {
              // Format { success, data }
              normalizedContacts = contactsResponse.data;
            } else if (Array.isArray(contactsResponse)) {
              // Format tableau direct
              normalizedContacts = contactsResponse;
            }
          }

          setContacts(normalizedContacts);
        } catch (err) {
          console.error("Erreur lors de la récupération des contacts:", err);
          setContacts([]);
        }

        // Récupérer les opportunités associées
        try {
          const opportunitiesData = await getOpportunitiesByClient(clientId);

          // Normalisation de la réponse pour les opportunités (même logique que pour les contacts)
          let normalizedOpportunities = Array.isArray(opportunitiesData)
            ? opportunitiesData
            : opportunitiesData &&
              typeof opportunitiesData === "object" &&
              "data" in opportunitiesData &&
              Array.isArray(opportunitiesData.data)
            ? opportunitiesData.data
            : [];

          setOpportunities(normalizedOpportunities);
        } catch (err) {
          console.error(
            "Erreur lors de la récupération des opportunités:",
            err
          );
          setOpportunities([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des détails du client:", err);
        setError("Impossible de charger les détails du client");
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchClientDetails();
    }
  }, [clientId]);

  const updateClientDetails = async (
    clientData: Partial<Client>
  ): Promise<boolean> => {
    if (!client) return false;

    try {
      setIsLoading(true);
      const updatedClient = await updateClient(clientId, clientData);

      if (updatedClient) {
        setClient(updatedClient);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du client:", err);
      setError("Impossible de mettre à jour le client");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClientAndNavigate = async (): Promise<boolean> => {
    if (!client || !company) return false;

    try {
      setIsLoading(true);
      await deleteClient(clientId);

      const baseRoute = getBaseRoute();
      router.push(`${baseRoute}/company/${company._id}`);
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression du client:", err);
      setError("Impossible de supprimer le client");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToCompany = () => {
    if (company) {
      const baseRoute = getBaseRoute();
      router.push(`${baseRoute}/company/${company._id}`);
    }
  };

  const navigateToTeam = () => {
    if (team) {
      const baseRoute = getBaseRoute();
      router.push(`${baseRoute}/team/${team._id}`);
    }
  };

  const navigateToAssignedUser = () => {
    if (assignedUser) {
      const baseRoute = getBaseRoute();
      router.push(`${baseRoute}/users/${assignedUser._id}`);
    }
  };

  const navigateToContact = (contactId: string) => {
    const baseRoute = getBaseRoute();
    router.push(`${baseRoute}/contact/${contactId}`);
  };

  const navigateToOpportunity = (opportunityId: string) => {
    const baseRoute = getBaseRoute();
    if (routePrefix === "user") {
      router.push(`/dashboard/user/opportunity/${clientId}`);
    } else {
      router.push(
        `${baseRoute}/company/clients/${company?._id}/opportunity/${clientId}`
      );
    }
  };

  const navigateToContactsManagement = () => {
    const baseRoute = getBaseRoute();
    if (routePrefix === "user") {
      router.push(`${baseRoute}/${company?._id}/edit/${clientId}?step=4`);
    } else {
      router.push(
        `${baseRoute}/company/clients/${company?._id}/edit/${clientId}?step=4`
      );
    }
  };

  const navigateToOpportunitiesManagement = () => {
    const baseRoute = getBaseRoute();
    if (routePrefix === "user") {
      router.push(`/dashboard/user/opportunity/${clientId}`);
    } else {
      router.push(
        `${baseRoute}/company/clients/${company?._id}/opportunity/${clientId}`
      );
    }
  };

  const navigateToMailPage = () => {
    const baseRoute = getBaseRoute();
    if (company) {
      if (routePrefix === "user") {
        router.push(`${baseRoute}/${company._id}/mail/${clientId}`);
      } else {
        router.push(
          `${baseRoute}/company/clients/${company._id}/mail/${clientId}`
        );
      }
    } else {
      if (routePrefix === "user") {
        router.push(`${baseRoute}/${clientId}/mail`);
      } else {
        router.push(`${baseRoute}/clients/${clientId}/mail`);
      }
    }
  };

  return {
    client,
    company,
    team,
    assignedUser,
    contacts,
    opportunities,
    isLoading,
    error,
    updateClientDetails,
    deleteClientAndNavigate,
    navigateToMailPage,
    navigateToCompany,
    navigateToTeam,
    navigateToAssignedUser,
    navigateToContact,
    navigateToOpportunity,
    navigateToContactsManagement,
    navigateToOpportunitiesManagement,
  };
};
