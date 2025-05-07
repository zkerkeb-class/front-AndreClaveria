import React, { useEffect, useState, CSSProperties } from "react";
import { healthStyles } from "@/styles/components/admin/health/healthStyles"; // Importation des styles
import { useServicesHealth } from "@/services/health.service"; // Importation de notre hook personnalisé

const HealthStatus: React.FC = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Utiliser notre hook personnalisé amélioré
  const { services, loading, error, lastUpdated, refreshServices, stats } =
    useServicesHealth(30000); // Rafraîchissement toutes les 30 secondes

  // Ajout de l'animation spin
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getStatusLabel = (status: "up" | "down") => {
    return status === "up" ? "Opérationnel" : "Indisponible";
  };

  const getStatusStyle = (status: "up" | "down"): CSSProperties => {
    return status === "up" ? healthStyles.statusUp : healthStyles.statusDown;
  };

  // Format du temps de réponse
  const formatResponseTime = (time?: number) => {
    if (!time) return "N/A";
    return `${time} ms`;
  };

  return (
    <div style={healthStyles.container as CSSProperties}>
      <div style={healthStyles.header as CSSProperties}>
        <h1 style={healthStyles.title as CSSProperties}>
          État des Services CRM
        </h1>
        <div style={healthStyles.actions as CSSProperties}>
          <button
            style={{
              ...(healthStyles.refreshButton as CSSProperties),
              backgroundColor: isHovered ? "#2563EB" : "#3B82F6",
              opacity: loading ? 0.7 : 1,
            }}
            onClick={refreshServices}
            disabled={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {loading ? "Rafraîchissement..." : "Rafraîchir"}
          </button>
        </div>
      </div>

      {error && (
        <div style={healthStyles.errorPanel as CSSProperties}>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      <div style={healthStyles.statusOverview as CSSProperties}>
        <div style={healthStyles.overviewCard as CSSProperties}>
          <h2
            style={{
              fontSize: "18px",
              fontFamily: '"Lexend-Bold", sans-serif',
              color: "#1F2937",
              marginTop: 0,
              marginBottom: "12px",
            }}
          >
            Vue d'ensemble
          </h2>
          <p
            style={{
              fontSize: "15px",
              fontFamily: '"Lexend-Regular", sans-serif',
              margin: "8px 0",
            }}
          >
            {stats.isAllOperational
              ? "✅ Tous les services sont opérationnels"
              : `⚠️ ${stats.downServicesCount} service(s) indisponible(s)`}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              color: "#6B7280",
              marginTop: "12px",
            }}
          >
            <p style={healthStyles.lastUpdated as CSSProperties}>
              Dernière vérification: {lastUpdated}
            </p>
            <p style={healthStyles.lastUpdated as CSSProperties}>
              Temps de réponse moyen: {formatResponseTime(stats.responseTime)}
            </p>
          </div>
        </div>
      </div>

      <div style={healthStyles.servicesGrid as CSSProperties}>
        {services.map((service) => (
          <div
            key={service.name}
            style={{
              ...(healthStyles.serviceCard as CSSProperties),
              ...getStatusStyle(service.status),
            }}
          >
            <div style={healthStyles.serviceHeader as CSSProperties}>
              <h3
                style={{
                  fontSize: "16px",
                  fontFamily: '"Lexend-SemiBold", sans-serif',
                  color: "#1F2937",
                  margin: 0,
                }}
              >
                {service.name}
              </h3>
              <span
                style={{
                  ...(healthStyles.statusBadge as CSSProperties),
                  ...getStatusStyle(service.status),
                }}
              >
                {getStatusLabel(service.status)}
              </span>
            </div>

            <div style={healthStyles.serviceDetails as CSSProperties}>
              {service.status === "down" && service.details && (
                <div style={healthStyles.errorDetails as CSSProperties}>
                  <p style={{ margin: 0 }}>
                    Erreur: {service.details.error || "Non spécifiée"}
                  </p>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <p style={healthStyles.timestamp as CSSProperties}>
                  Dernière vérification:{" "}
                  {new Date(service.lastChecked).toLocaleString()}
                </p>
                <span
                  style={{
                    fontSize: "11px",
                    backgroundColor: "#F3F4F6",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    color: "#4B5563",
                  }}
                >
                  {formatResponseTime(service.responseTime)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && services.length === 0 && (
        <div style={healthStyles.loadingContainer as CSSProperties}>
          <div style={healthStyles.loadingSpinner as CSSProperties}></div>
          <p
            style={{
              fontSize: "14px",
              fontFamily: '"Lexend-Regular", sans-serif',
              color: "#6B7280",
            }}
          >
            Chargement des statuts des services...
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthStatus;
