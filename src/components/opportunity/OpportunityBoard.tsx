import React from "react";
import { useRouter } from "next/navigation";
import { Opportunity } from "@/services/opportunity.service";
import { formatCurrency } from "@/utils/formatters";
import ActionButton from "@/components/common/ActionButton";
import { useAuth } from "@/contexts/AuthContext";

interface OpportunityBoardProps {
  opportunities: Opportunity[];
  clientId: string;
  companyId: string;
  isLoading: boolean;
  onStatusChange: (opportunityId: string, newStatus: string) => void;
  viewMode: "kanban" | "list";
}

// Définition des statuts et leurs propriétés
const statusColumns = [
  { id: "lead", label: "Nouveaux", color: "#4CAF50" },
  { id: "qualified", label: "Qualifié", color: "#FFC107" },
  { id: "proposition", label: "En négociation", color: "#FF9800" },
  { id: "negotiation", label: "En attente de validation", color: "#2196F3" },
  { id: "won", label: "Terminé (Gagné)", color: "#8BC34A" },
  { id: "lost", label: "Terminé (Perdu)", color: "#F44336" },
];

const OpportunityBoard: React.FC<OpportunityBoardProps> = ({
  opportunities,
  clientId,
  companyId,
  isLoading,
  onStatusChange,
  viewMode,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const routePrefix = user?.role === "admin" ? "admin" : "manager";

  // Style pour la carte d'opportunité
  const opportunityCardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "16px",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    hoverTransform: "translateY(-3px)",
    hoverBoxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  };

  const handleOpportunityClick = (opportunityId: string) => {
    router.push(
      `/dashboard/${routePrefix}/manage/company/clients/${companyId}/opportunity/${clientId}/edit/${opportunityId}`
    );
  };

  // Fonction de drag and drop pour le changement de statut
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    opportunityId: string
  ) => {
    e.dataTransfer.setData("opportunityId", opportunityId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Dans OpportunityBoard.tsx
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const opportunityId = e.dataTransfer.getData("opportunityId");
    if (opportunityId) {
      onStatusChange(opportunityId, status);
    }
  };

  if (isLoading) {
    // Indicateur de chargement simple sans composant externe
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Chargement des opportunités...
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
        <p>Aucune opportunité trouvée pour ce client.</p>
        <ActionButton
          onClick={() =>
            router.push(
              `/dashboard/${routePrefix}/manage/company/clients/${companyId}/opportunity/${clientId}/add`
            )
          }
          variant="primary"
          size="medium"
        >
          Ajouter une opportunité
        </ActionButton>
      </div>
    );
  }

  if (viewMode === "list") {
    // Vue Liste - Style Airtable
    return (
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #eee" }}>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Titre</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>
                Statut
              </th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>
                Valeur
              </th>
              <th style={{ padding: "12px 16px", textAlign: "center" }}>
                Probabilité
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>
                Date de clôture
              </th>
              <th style={{ padding: "12px 16px", textAlign: "center" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => {
              const statusInfo = statusColumns.find(
                (status) => status.id === opportunity.status
              ) || { color: "#999", label: "Non défini" };

              return (
                <tr
                  key={opportunity._id}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpportunityClick(opportunity._id)}
                  >
                    {opportunity.title}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: statusInfo.color,
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    {formatCurrency(opportunity.value)}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    {opportunity.probability || 0}%
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {opportunity.expectedClosingDate
                      ? new Date(
                          opportunity.expectedClosingDate
                        ).toLocaleDateString("fr-FR")
                      : "Non définie"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <ActionButton
                      onClick={() => handleOpportunityClick(opportunity._id)}
                      variant="secondary"
                      size="small"
                    >
                      Éditer
                    </ActionButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Vue Kanban - Style Monday
  return (
    <div style={{ display: "flex", overflowX: "auto", padding: "20px 0" }}>
      {statusColumns.map((status) => {
        const filteredOpportunities = opportunities.filter(
          (opportunity) => opportunity.status === status.id
        );

        return (
          <div
            key={status.id}
            style={{
              minWidth: "280px",
              width: "280px",
              marginRight: "16px",
              display: "flex",
              flexDirection: "column",
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <div
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: "8px 8px 0 0",
                padding: "12px 16px",
                borderLeft: `4px solid ${status.color}`,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px" }}>{status.label}</h3>
              <span
                style={{
                  backgroundColor: status.color,
                  color: "white",
                  borderRadius: "100px",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                }}
              >
                {filteredOpportunities.length}
              </span>
            </div>

            <div
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: "0 0 8px 8px",
                padding: "12px",
                flex: 1,
                minHeight: "400px",
              }}
            >
              {filteredOpportunities.map((opportunity) => (
                <div
                  key={opportunity._id}
                  style={opportunityCardStyle}
                  onClick={() => handleOpportunityClick(opportunity._id)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, opportunity._id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform =
                      opportunityCardStyle.hoverTransform;
                    e.currentTarget.style.boxShadow =
                      opportunityCardStyle.hoverBoxShadow;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.1)";
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
                    {opportunity.title}
                  </h4>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#333",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  >
                    {formatCurrency(opportunity.value)}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Prob: {opportunity.probability || 0}%</span>
                    <span>
                      {opportunity.expectedClosingDate
                        ? new Date(
                            opportunity.expectedClosingDate
                          ).toLocaleDateString("fr-FR")
                        : "Date non définie"}
                    </span>
                  </div>
                </div>
              ))}
              {filteredOpportunities.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#999",
                    fontSize: "14px",
                    marginTop: "20px",
                    padding: "40px 0",
                    border: "2px dashed #eee",
                    borderRadius: "8px",
                  }}
                >
                  Aucune opportunité
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OpportunityBoard;
