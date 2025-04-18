"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { dashboardStyles } from "@/styles/dashboardStyles";
import { CSSProperties } from "react";

// Types
interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  active: boolean;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
      router.push("/");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return <div style={dashboardStyles.loadingContainer}>Chargement...</div>;
  }

  // Générer les styles dynamiques pour les navigations
  const getDashboardNavStyle = (): CSSProperties => ({
    ...dashboardStyles.navigation,
    ...(hoveredIcon === 0
      ? dashboardStyles.navigationDashboardVisible
      : dashboardStyles.navigationDashboard),
  });

  const getPhoneNavStyle = (): CSSProperties => ({
    ...dashboardStyles.navigation,
    ...(hoveredIcon === 1
      ? dashboardStyles.navigationPhoneVisible
      : dashboardStyles.navigationPhone),
  });

  const getEmailNavStyle = (): CSSProperties => ({
    ...dashboardStyles.navigation,
    ...(hoveredIcon === 2
      ? dashboardStyles.navigationEmailVisible
      : dashboardStyles.navigationEmail),
  });

  const getCalendarNavStyle = (): CSSProperties => ({
    ...dashboardStyles.navigation,
    ...(hoveredIcon === 3
      ? dashboardStyles.navigationCalendarVisible
      : dashboardStyles.navigationCalendar),
  });

  // Style du contenu principal
  const contentStyle: CSSProperties = {
    ...dashboardStyles.content,
    ...(hoveredIcon !== null
      ? dashboardStyles.contentWithMenu
      : dashboardStyles.contentFullWidth),
  };

  return (
    <div style={dashboardStyles.container}>
      {/* Sidebar avec icônes */}
      <div style={dashboardStyles.sidebar}>
        <div style={dashboardStyles.logoContainer}>
          <Image
            src="/img/logo/logo_crew.png"
            alt="Logo Crew"
            width={60}
            height={60}
            style={dashboardStyles.logo}
          />
        </div>

        {/* Première icône (Dashboard) */}
        <div
          style={{
            ...dashboardStyles.iconButton,
            ...(hoveredIcon === 0 ? dashboardStyles.iconButtonActive : {}),
          }}
          onMouseEnter={() => setHoveredIcon(0)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <rect x="2" y="2" width="8" height="8" rx="1"></rect>
            <rect x="14" y="2" width="8" height="8" rx="1"></rect>
            <rect x="2" y="14" width="8" height="8" rx="1"></rect>
            <rect x="14" y="14" width="8" height="8" rx="1"></rect>
          </svg>
        </div>

        {/* Deuxième icône (Téléphone) */}
        <div
          style={{
            ...dashboardStyles.iconButton,
            ...(hoveredIcon === 1 ? dashboardStyles.iconButtonActive : {}),
          }}
          onMouseEnter={() => setHoveredIcon(1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </div>

        {/* Troisième icône (Email) */}
        <div
          style={{
            ...dashboardStyles.iconButton,
            ...(hoveredIcon === 2 ? dashboardStyles.iconButtonActive : {}),
          }}
          onMouseEnter={() => setHoveredIcon(2)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>

        {/* Quatrième icône (Calendrier) */}
        <div
          style={{
            ...dashboardStyles.iconButton,
            ...(hoveredIcon === 3 ? dashboardStyles.iconButtonActive : {}),
          }}
          onMouseEnter={() => setHoveredIcon(3)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>

        <div style={dashboardStyles.spacer}></div>

        {/* Icône Utilisateur */}
        <div style={dashboardStyles.iconButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>

        {/* Icône Aide */}
        <div style={dashboardStyles.iconButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>

        {/* Icône Profil/Déconnexion */}
        <div style={dashboardStyles.iconButton} onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </div>
      </div>

      {/* Menus de navigation pour chaque icône */}
      {/* Menu Dashboard */}
      <div
        style={getDashboardNavStyle()}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <div
          style={{
            ...dashboardStyles.navItem,
            ...dashboardStyles.navItemActive,
          }}
        >
          Client
        </div>
        <div style={dashboardStyles.navItem}>Contact</div>
        <div style={dashboardStyles.navItem}>Opportunité</div>
        <div style={dashboardStyles.navItem}>Deals</div>
      </div>

      {/* Menu Téléphone */}
      <div style={getPhoneNavStyle()} onMouseLeave={() => setHoveredIcon(null)}>
        <div style={dashboardStyles.navItem}>Appels récents</div>
        <div style={dashboardStyles.navItem}>Contacts favoris</div>
        <div style={dashboardStyles.navItem}>Programmer un appel</div>
      </div>

      {/* Menu Email */}
      <div style={getEmailNavStyle()} onMouseLeave={() => setHoveredIcon(null)}>
        <div style={dashboardStyles.navItem}>Boîte de réception</div>
        <div style={dashboardStyles.navItem}>Envoyés</div>
        <div style={dashboardStyles.navItem}>Brouillons</div>
      </div>

      {/* Menu Calendrier */}
      <div
        style={getCalendarNavStyle()}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <div style={dashboardStyles.navItem}>Agenda</div>
        <div style={dashboardStyles.navItem}>Rendez-vous</div>
        <div style={dashboardStyles.navItem}>Événements</div>
      </div>

      {/* Contenu principal */}
      <div style={contentStyle}>
        <div style={dashboardStyles.welcomeCard}>
          <h1 style={dashboardStyles.welcomeTitle}>
            Bienvenue,{" "}
            {user?.firstName ||
              (user?.email ? user.email.split("@")[0] : "admin")}
            !
          </h1>
          <p style={dashboardStyles.welcomeText}>
            Vous êtes maintenant connecté au CRM Crew. Utilisez la navigation
            pour gérer vos clients, contacts, opportunités et deals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
