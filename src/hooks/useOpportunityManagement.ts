// src/hooks/useOpportunityManagement.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getOpportunitiesByClient,
  Opportunity,
  updateOpportunity,
} from "@/services/opportunity.service";
import { getClientById, Client } from "@/services/client.service";
import { getRoutePrefix } from "@/utils/getRoutePrefix";

// Types de statut valides pour une opportunité
type OpportunityStatus =
  | "lead"
  | "qualified"
  | "proposition"
  | "negotiation"
  | "won"
  | "lost";

interface UseOpportunityManagementProps {
  clientId: string;
  companyId?: string; // Rendu optionnel pour le rôle "user"
}

interface UseOpportunityManagementReturn {
  opportunities: Opportunity[];
  client: Client | null;
  error: string | null;
  isLoadingOpportunities: boolean;
  viewMode: "kanban" | "list";
  setViewMode: (mode: "kanban" | "list") => void;
  handleStatusChange: (
    opportunityId: string,
    newStatus: string
  ) => Promise<void>;
  navigateToClientsList: () => void;
  navigateToAddOpportunity: () => void;
}

export const useOpportunityManagement = ({
  clientId,
  companyId,
}: UseOpportunityManagementProps): UseOpportunityManagementReturn => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Utiliser getRoutePrefix pour déterminer le préfixe de route
  const routePrefix = getRoutePrefix(user?.role);

  // Fonctions de navigation
  const navigateToClientsList = () => {
    // Log pour débogage
    console.log(
      "navigateToClientsList called, user role:",
      user?.role,
      "routePrefix:",
      routePrefix
    );

    if (routePrefix === "user") {
      // Pour les utilisateurs avec rôle "user"
      router.push(`/dashboard/user/clients`);
    } else {
      // Pour les rôles admin et manager
      const effectiveCompanyId = companyId || client?.company;
      if (!effectiveCompanyId) {
        console.error("ID de l'entreprise manquant pour la navigation");
        return;
      }
      router.push(
        `/dashboard/${routePrefix}/manage/company/clients/${effectiveCompanyId}`
      );
    }
  };

  const navigateToAddOpportunity = () => {
    // Log pour débogage
    console.log(
      "navigateToAddOpportunity called, user role:",
      user?.role,
      "routePrefix:",
      routePrefix
    );

    if (routePrefix === "user") {
      // Pour les utilisateurs avec rôle "user"
      router.push(`/dashboard/user/opportunity/${clientId}/add`);
    } else {
      // Pour les rôles admin et manager
      const effectiveCompanyId = companyId || client?.company;
      if (!effectiveCompanyId) {
        console.error("ID de l'entreprise manquant pour la navigation");
        return;
      }
      router.push(
        `/dashboard/${routePrefix}/manage/company/clients/${effectiveCompanyId}/opportunity/${clientId}/add`
      );
    }
  };

  // Vérification de rôle (admin, manager ou user)
  useEffect(() => {
    if (
      !isLoading &&
      user &&
      !["admin", "manager", "user"].includes(user.role)
    ) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Chargement des données du client et des opportunités
  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const clientData = await getClientById(clientId);
        setClient(clientData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération du client:", err);
        setError("Impossible de charger les détails du client.");
      }
    };

    const fetchOpportunities = async () => {
      setIsLoadingOpportunities(true);
      try {
        console.log(
          "Début de la récupération des opportunités pour le client:",
          clientId
        );
        const response = await getOpportunitiesByClient(clientId);
        console.log("Réponse reçue pour les opportunités:", response);

        // Extraction des opportunités de la réponse selon sa structure
        let opportunitiesData: Opportunity[] = [];

        if (
          response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray(response.data)
        ) {
          opportunitiesData = response.data;
          console.log(
            "Opportunités extraites de la structure d'API:",
            opportunitiesData
          );
        } else if (Array.isArray(response)) {
          opportunitiesData = response;
          console.log(
            "Opportunités directement reçues comme tableau:",
            opportunitiesData
          );
        } else {
          console.error("Format de réponse non reconnu:", response);
          // opportunitiesData est déjà initialisé comme un tableau vide
        }

        setOpportunities(opportunitiesData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des opportunités:", err);
        setError(
          err.message ||
            "Impossible de charger les opportunités. Veuillez réessayer."
        );
        setOpportunities([]); // Initialiser avec un tableau vide en cas d'erreur
      } finally {
        setIsLoadingOpportunities(false);
      }
    };

    if (user && ["admin", "manager", "user"].includes(user.role)) {
      fetchClientDetails();
      fetchOpportunities();
    }
  }, [clientId, companyId, user]);

  // Gestionnaire pour changer le statut d'une opportunité
  const handleStatusChange = async (
    opportunityId: string,
    newStatus: string
  ) => {
    // Vérifier que le statut est valide
    if (
      ![
        "lead",
        "qualified",
        "proposition",
        "negotiation",
        "won",
        "lost",
      ].includes(newStatus)
    ) {
      console.error(`Statut invalide: ${newStatus}`);
      return;
    }

    // Convertir le statut en type valide
    const validStatus = newStatus as OpportunityStatus;

    try {
      // Mise à jour optimiste de l'état local
      setOpportunities((prevOpportunities) =>
        prevOpportunities.map((o) =>
          o._id === opportunityId ? { ...o, status: validStatus } : o
        )
      );

      // Appel API pour mettre à jour le statut
      await updateOpportunity(opportunityId, { status: validStatus });
      console.log(
        `Opportunité ${opportunityId} mise à jour avec statut: ${validStatus}`
      );

      // On pourrait ajouter un message de succès ici si nécessaire
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);

      // Afficher un message d'erreur à l'utilisateur
      setError(
        "Échec de la mise à jour du statut. Réessayez ou rafraîchissez la page."
      );

      // Rollback en cas d'erreur
      try {
        const response = await getOpportunitiesByClient(clientId);

        // Utiliser le même traitement que dans fetchOpportunities
        let refreshedOpportunities: Opportunity[] = [];

        if (Array.isArray(response)) {
          refreshedOpportunities = response;
        } else if (
          response &&
          typeof response === "object" &&
          "data" in response
        ) {
          refreshedOpportunities = response.data || [];
        }

        setOpportunities(refreshedOpportunities);
      } catch (refreshError) {
        console.error(
          "Erreur lors du rafraîchissement des opportunités:",
          refreshError
        );
      }
    }
  };

  return {
    opportunities,
    client,
    error,
    isLoadingOpportunities,
    viewMode,
    setViewMode,
    handleStatusChange,
    navigateToClientsList,
    navigateToAddOpportunity,
  };
};
