"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getOpportunitiesByClient,
  Opportunity,
  updateOpportunity,
} from "@/services/opportunity.service";
import { getClientById, Client } from "@/services/client.service";
import OpportunityBoard from "@/components/opportunity/OpportunityBoard";
import ActionButton from "@/components/common/ActionButton";

interface OpportunityManagementProps {
  params: Promise<{
    clientId: string;
    companyId: string;
  }>;
}

const OpportunityManagement: React.FC<OpportunityManagementProps> = ({
  params,
}) => {
  const unwrappedParams = use(params);
  const clientId = unwrappedParams.clientId;
  const companyId = unwrappedParams.companyId;
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  useEffect(() => {
    // Vérification du rôle admin ou manager
    if (
      !isLoading &&
      user &&
      !["admin", "manager", "user"].includes(user.role)
    ) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

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

    // Modifiez la déclaration de la variable opportunitiesData
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
        // Typage explicite de la variable
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
  // Gestionnaire pour changer le statut d'une opportunité
  // Gestionnaire pour changer le statut d'une opportunité
  // Modifiez la fonction handleStatusChange dans OpportunityManagement.tsx

  const handleStatusChange = async (
    opportunityId: string,
    newStatus: string
  ) => {
    // Vérifier que le statut est valide pour le type Opportunity
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
    const validStatus = newStatus as
      | "lead"
      | "qualified"
      | "proposition"
      | "negotiation"
      | "won"
      | "lost";

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

      // Vous pouvez ajouter un retour visuel du succès si nécessaire
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
  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Déterminer le préfixe de route pour les liens de navigation
  const routePrefix = user?.role === "admin" ? "admin" : "manager";

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <ActionButton
          onClick={() => window.location.reload()}
          variant="secondary"
          size="medium"
        >
          Réessayer
        </ActionButton>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
            Gestion des opportunités
          </h1>
          {client && (
            <p style={{ color: "#666" }}>
              Client: <strong>{client.name}</strong>
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              border: "1px solid #ddd",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setViewMode("kanban")}
              style={{
                padding: "8px 12px",
                background: viewMode === "kanban" ? "#f0f0f0" : "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Vue Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px 12px",
                background: viewMode === "list" ? "#f0f0f0" : "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Vue Liste
            </button>
          </div>
          <ActionButton
            onClick={() =>
              router.push(
                `/dashboard/${routePrefix}/manage/company/clients/${companyId}`
              )
            }
            variant="secondary"
            size="medium"
          >
            Retour aux clients
          </ActionButton>
          <ActionButton
            onClick={() =>
              router.push(
                `/dashboard/${routePrefix}/manage/company/clients/${companyId}/opportunity/${clientId}/add`
              )
            }
            variant="primary"
            size="large"
          >
            Ajouter une opportunité
          </ActionButton>
        </div>
      </div>

      <OpportunityBoard
        opportunities={opportunities}
        clientId={clientId}
        companyId={companyId}
        isLoading={isLoadingOpportunities}
        onStatusChange={handleStatusChange}
        viewMode={viewMode}
      />
    </div>
  );
};

export default OpportunityManagement;
