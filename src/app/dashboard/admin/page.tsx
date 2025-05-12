"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";

const AdminDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Utilisation du hook pour vérifier le rôle admin
  const hasAdminRole = useRoleCheck({
    isLoading,
    user,
    requiredRole: "admin",
    redirectPath: "/dashboard",
  });

  if (isLoading || !user || !hasAdminRole) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Administration du système
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
            Gestion des utilisateurs
          </h2>
          <p>
            Ajoutez, modifiez ou désactivez les comptes utilisateurs du CRM.
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
            Paramètres système
          </h2>
          <p>Configurez les paramètres globaux du CRM.</p>
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
            Logs d'activité
          </h2>
          <p>Consultez les journaux d'activité des utilisateurs.</p>
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
            Configuration CRM
          </h2>
          <p>Gérez les champs personnalisés et les workflows.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
