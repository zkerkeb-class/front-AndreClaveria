// src/hooks/useCompanyDetails.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCompanyById,
  updateCompany,
  Company,
} from "@/services/company.service";
import { getTeamsByCompany, Team } from "@/services/team.service";
import { getUserById, User } from "@/services/user.service";
import { getClientsByCompany, Client } from "@/services/client.service";
import { useAuth } from "@/contexts/AuthContext";
import { getRoutePrefix } from "@/utils/getRoutePrefix";

interface UseCompanyDetailsReturn {
  company: Company | null;
  manager: User | null;
  teams: Team[];
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  paginatedClients: Client[];
  updateCompanyDetails: (companyData: Partial<Company>) => Promise<boolean>;
  navigateToTeam: (teamId: string) => void;
  navigateToClient: (clientId: string) => void;
  navigateToManager: (managerId: string) => void;
  navigateToTeamsManagement: () => void;
  navigateToClientsManagement: () => void;
}

export const useCompanyDetails = (
  companyId: string
): UseCompanyDetailsReturn => {
  const [company, setCompany] = useState<Company | null>(null);
  const [manager, setManager] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const router = useRouter();
  const { user } = useAuth();

  // Utiliser getRoutePrefix pour déterminer le préfixe de route
  const routePrefix = getRoutePrefix(user?.role);

  // Déterminer la structure de route selon le rôle
  const getBaseRoute = () => {
    if (routePrefix === "user") {
      return `/dashboard/user/company`;
    } else {
      return `/dashboard/${routePrefix}/manage`;
    }
  };

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les détails de l'entreprise
        const companyData = await getCompanyById(companyId);
        if (!companyData) {
          throw new Error("Entreprise non trouvée");
        }
        setCompany(companyData);

        // Récupérer les informations du manager
        if (companyData.owner) {
          try {
            const managerData = await getUserById(companyData.owner);
            setManager(managerData || null);
          } catch (managerError) {
            console.error(
              "Erreur lors de la récupération du manager:",
              managerError
            );
            // Ne pas échouer complètement si la récupération du manager échoue
          }
        }

        // Récupérer les équipes de l'entreprise
        try {
          const companyTeams = await getTeamsByCompany(companyId);
          setTeams(Array.isArray(companyTeams) ? companyTeams : []);
        } catch (teamsError) {
          console.error(
            "Erreur lors de la récupération des équipes:",
            teamsError
          );
          setTeams([]); // Définir un tableau vide en cas d'erreur
        }

        // Récupérer les clients de l'entreprise
        try {
          let companyClients: Client[] = [];

          try {
            companyClients = await getClientsByCompany(companyId);

            // Vérification supplémentaire que nous avons bien reçu un tableau
            if (!Array.isArray(companyClients)) {
              console.warn(
                "getClientsByCompany n'a pas retourné un tableau, conversion:",
                companyClients
              );

              // Si c'est un objet, essayer de trouver un tableau dedans
              if (companyClients && typeof companyClients === "object") {
                const possibleArrayProps = Object.keys(companyClients).find(
                  (key) => Array.isArray((companyClients as any)[key])
                );

                if (possibleArrayProps) {
                  companyClients = (companyClients as any)[possibleArrayProps];
                } else {
                  // Si pas de tableau trouvé, convertir en tableau vide
                  companyClients = [];
                }
              } else {
                // Si ce n'est pas un objet, initialiser à un tableau vide
                companyClients = [];
              }
            }
          } catch (err) {
            console.error("Erreur lors de la récupération des clients:", err);
            companyClients = [];
          }

          setClients(companyClients);
        } catch (clientsError) {
          console.error(
            "Erreur lors de la récupération des clients:",
            clientsError
          );
          setClients([]); // Définir un tableau vide en cas d'erreur
        }
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError("Impossible de charger les détails de l'entreprise");
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  // Calculer les clients paginés - s'assurer que clients est bien un tableau
  const safeClients = Array.isArray(clients) ? clients : [];
  const paginatedClients = safeClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculer le nombre total de pages
  const totalPages = Math.max(1, Math.ceil(safeClients.length / itemsPerPage));

  const updateCompanyDetails = async (
    companyData: Partial<Company>
  ): Promise<boolean> => {
    if (!company) return false;

    try {
      setIsLoading(true);
      const updatedCompany = await updateCompany(companyId, companyData);

      if (updatedCompany) {
        setCompany(updatedCompany);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating company:", err);
      setError("Impossible de mettre à jour l'entreprise");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToTeam = (teamId: string) => {
    const baseRoute = getBaseRoute();
    if (routePrefix === "user") {
      router.push(`/dashboard/user/teams/${teamId}`);
    } else {
      router.push(`${baseRoute}/company/teams/${companyId}/${teamId}`);
    }
  };

  const navigateToClient = (clientId: string) => {
    const baseRoute = getBaseRoute();
    if (routePrefix === "user") {
      router.push(`/dashboard/user/clients/${clientId}`);
    } else {
      router.push(`${baseRoute}/company/clients/${companyId}/${clientId}`);
    }
  };

  const navigateToManager = (managerId: string) => {
    const baseRoute = getBaseRoute();
    if (routePrefix === "user") {
      router.push(`/dashboard/user/users/${managerId}`);
    } else {
      router.push(`${baseRoute}/users/${managerId}`);
    }
  };

  const navigateToTeamsManagement = () => {
    const baseRoute = getBaseRoute();
    if (routePrefix === "user") {
      router.push(`/dashboard/user/teams?company=${companyId}`);
    } else {
      router.push(`${baseRoute}/company/teams/${companyId}`);
    }
  };

  const navigateToClientsManagement = () => {
    const baseRoute = getBaseRoute();
    if (routePrefix === "user") {
      router.push(`/dashboard/user/clients?company=${companyId}`);
    } else {
      router.push(`${baseRoute}/company/clients/${companyId}`);
    }
  };

  return {
    company,
    manager,
    teams,
    clients: safeClients, // S'assurer que nous retournons toujours un tableau
    isLoading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    paginatedClients,
    updateCompanyDetails,
    navigateToTeam,
    navigateToClient,
    navigateToManager,
    navigateToTeamsManagement,
    navigateToClientsManagement,
  };
};
