"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardStyles } from "@/styles/dashboardStyles";

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Vérification du rôle admin
    if (!isLoading && user && user.role !== "admin") {
      // Redirection si l'utilisateur n'est pas admin
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
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
