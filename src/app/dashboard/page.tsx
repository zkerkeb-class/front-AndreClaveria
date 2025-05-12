"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Configuration de la redirection basée sur le rôle
  useRoleRedirect({
    isLoading,
    user,
    roleRedirects: {
      admin: "/dashboard/admin",
      manager: "/dashboard/manager",
      default: "/dashboard/user",
    },
    defaultRedirect: "/dashboard/user",
  });

  if (isLoading) {
    return null;
  }

  return (
    <div style={dashboardStyles.welcomeCard}>
      <h1 style={dashboardStyles.welcomeTitle}>
        Bienvenue,{" "}
        {user?.firstName ||
          (user?.email ? user.email.split("@")[0] : "utilisateur")}
        !
      </h1>
      <p style={dashboardStyles.welcomeText}>
        Vous êtes maintenant connecté au CRM Crew. Redirection en cours...
      </p>
    </div>
  );
};

export default Dashboard;
