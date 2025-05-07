"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userDashboardStyles } from "@/styles/pages/dashboard/user/userStyles";

const UserDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return null;
  }

  return (
    <div>
      <h1 style={userDashboardStyles.title}>Mon espace personnel</h1>

      <div style={userDashboardStyles.container}>
        <div style={userDashboardStyles.card}>
          <h2 style={userDashboardStyles.cardTitle}>Mes clients</h2>
          <p>Accédez à la liste de vos clients et gérez leurs informations.</p>
        </div>

        <div style={userDashboardStyles.card}>
          <h2 style={userDashboardStyles.cardTitle}>Mes contacts</h2>
          <p>Consultez et modifiez vos contacts professionnels.</p>
        </div>

        <div style={userDashboardStyles.card}>
          <h2 style={userDashboardStyles.cardTitle}>Mes opportunités</h2>
          <p>Suivez l'avancement de vos opportunités commerciales.</p>
        </div>

        <div style={userDashboardStyles.card}>
          <h2 style={userDashboardStyles.cardTitle}>Mes tâches</h2>
          <p>Gérez votre liste de tâches à accomplir.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
