"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getClientsByCompany, Client } from "@/services/client.service";
import { getCompanyById, Company } from "@/services/company.service";
import ClientTable from "@/components/clients/ClientTable";
import ActionButton from "@/components/common/ActionButton";

interface ClientManagementProps {
  params: Promise<{
    companyId: string;
  }>;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  useEffect(() => {
    // Vérification du rôle admin ou manager
    if (!isLoading && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const companyData = await getCompanyById(companyId);
        setCompany(companyData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération de l'entreprise:", err);
        setError("Impossible de charger les détails de l'entreprise.");
      }
    };

    const fetchClients = async () => {
      setIsLoadingClients(true);
      try {
        console.log("Début de la récupération des clients");
        const clientsData = await getClientsByCompany(companyId);
        console.log("Clients récupérés:", clientsData);

        // Vérifier que clientsData est bien un tableau
        if (Array.isArray(clientsData)) {
          setClients(clientsData);
        } else {
          console.error(
            "Les données reçues ne sont pas un tableau:",
            clientsData
          );
          setClients([]); // Initialiser avec un tableau vide
          setError(
            "Format de données incorrect. Veuillez contacter l'administrateur."
          );
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération des clients:", err);
        setError(
          err.message ||
            "Impossible de charger les clients. Veuillez réessayer."
        );
        setClients([]); // Initialiser avec un tableau vide en cas d'erreur
      } finally {
        setIsLoadingClients(false);
      }
    };
    if (user && ["admin", "manager"].includes(user.role)) {
      fetchCompanyDetails();
      fetchClients();
    }
  }, [companyId, user]);

  // Gestionnaire pour le changement de statut d'un client
  const handleStatusChange = (clientId: string, newStatus: boolean) => {
    setClients((prevClients) =>
      prevClients.map((c) =>
        c._id === clientId ? { ...c, isActive: newStatus } : c
      )
    );
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
            Gestion des clients
          </h1>
          {company && (
            <p style={{ color: "#666" }}>
              Entreprise: <strong>{company.name}</strong>
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <ActionButton
            onClick={() =>
              router.push(`/dashboard/${routePrefix}/manage/company`)
            }
            variant="secondary"
            size="medium"
          >
            Retour aux entreprises
          </ActionButton>
          <ActionButton
            onClick={() =>
              router.push(
                `/dashboard/${routePrefix}/manage/company/clients/${companyId}/add`
              )
            }
            variant="primary"
            size="large"
          >
            Ajouter un client
          </ActionButton>
        </div>
      </div>

      <ClientTable
        clients={clients}
        companyId={companyId}
        isLoading={isLoadingClients}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ClientManagement;
