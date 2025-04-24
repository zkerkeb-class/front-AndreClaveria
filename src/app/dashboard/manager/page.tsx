"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardStyles } from "@/styles/dashboardStyles";

const ManagerDashboard: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Vérification du rôle manager ou admin
    if (
      !isLoading &&
      user &&
      user.role !== "manager" &&
      user.role !== "admin"
    ) {
      // Redirection si l'utilisateur n'est ni manager ni admin
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Tableau de bord Manager
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>
            Performance commerciale
          </h2>
          <p>
            Visualisez les indicateurs de performance de votre équipe
            commerciale.
          </p>
        </div>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>
            Analyse des ventes
          </h2>
          <p>
            Consultez les rapports détaillés sur les ventes et les tendances.
          </p>
        </div>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>
            Statistiques d'équipe
          </h2>
          <p>
            Suivez les performances individuelles et collectives de votre
            équipe.
          </p>
        </div>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>
            Objectifs et prévisions
          </h2>
          <p>
            Définissez et suivez les objectifs commerciaux et les prévisions de
            vente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
