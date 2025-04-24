"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardStyles } from "@/styles/dashboardStyles";

const UserDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Mon espace personnel
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
            Mes clients
          </h2>
          <p>Accédez à la liste de vos clients et gérez leurs informations.</p>
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
            Mes contacts
          </h2>
          <p>Consultez et modifiez vos contacts professionnels.</p>
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
            Mes opportunités
          </h2>
          <p>Suivez l'avancement de vos opportunités commerciales.</p>
        </div>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>Mes tâches</h2>
          <p>Gérez votre liste de tâches à accomplir.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
