// src/hooks/useNavigation.ts
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationRoutes {
  dashboard: string;
  phone: {
    recentCalls: string;
    favorites: string;
    schedule: string;
  };
  email: {
    inbox: string;
    sent: string;
    drafts: string;
  };
  calendar: {
    agenda: string;
    appointments: string;
    events: string;
  };
  admin: {
    userManagement: string;
    systemSettings: string;
    activityLogs: string;
    crmConfiguration: string;
  };
  manager: {
    dashboard: string;
    salesPerformance: string;
    salesAnalysis: string;
    teamStats: string;
  };
}

export const useNavigation = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Déterminer le rôle de l'utilisateur pour la navigation
  const role = user?.role || "user";

  // Routes de base pour chaque type d'utilisateur
  const baseRoutes: Record<string, string> = {
    admin: "/dashboard/admin",
    manager: "/dashboard/manager",
    user: "/dashboard/user",
  };

  // Routes spécifiques basées sur le rôle
  const routes: NavigationRoutes = {
    dashboard: baseRoutes[role] || "/dashboard/user",
    phone: {
      recentCalls: `${baseRoutes[role]}/phone/recent`,
      favorites: `${baseRoutes[role]}/phone/favorites`,
      schedule: `${baseRoutes[role]}/phone/schedule`,
    },
    email: {
      inbox: `${baseRoutes[role]}/email/inbox`,
      sent: `${baseRoutes[role]}/email/sent`,
      drafts: `${baseRoutes[role]}/email/drafts`,
    },
    calendar: {
      agenda: `${baseRoutes[role]}/calendar/agenda`,
      appointments: `${baseRoutes[role]}/calendar/appointments`,
      events: `${baseRoutes[role]}/calendar/events`,
    },
    admin: {
      userManagement: "/dashboard/admin/users",
      systemSettings: "/dashboard/admin/settings",
      activityLogs: "/dashboard/admin/logs",
      crmConfiguration: "/dashboard/admin/config",
    },
    manager: {
      dashboard: "/dashboard/manager",
      salesPerformance: "/dashboard/manager/performance",
      salesAnalysis: "/dashboard/manager/analysis",
      teamStats: "/dashboard/manager/team-stats",
    },
  };

  // Fonctions de navigation
  const navigateToDashboard = () => {
    router.push(routes.dashboard);
  };

  const navigateToPhone = (
    section: keyof typeof routes.phone = "recentCalls"
  ) => {
    router.push(routes.phone[section]);
  };

  const navigateToEmail = (section: keyof typeof routes.email = "inbox") => {
    router.push(routes.email[section]);
  };

  const navigateToCalendar = (
    section: keyof typeof routes.calendar = "agenda"
  ) => {
    router.push(routes.calendar[section]);
  };

  const navigateToAdminSection = (section: keyof typeof routes.admin) => {
    if (role === "admin") {
      router.push(routes.admin[section]);
    } else {
      console.warn("Permission denied: Admin access required");
    }
  };

  const navigateToManagerSection = (section: keyof typeof routes.manager) => {
    if (role === "manager" || role === "admin") {
      router.push(routes.manager[section]);
    } else {
      console.warn("Permission denied: Manager access required");
    }
  };

  const navigateToTeam = (teamId: string) => {
    router.push(`/dashboard/team/${teamId}`);
  };

  const navigateToCompany = (companyId: string) => {
    router.push(`/dashboard/company/${companyId}`);
  };

  const navigateToProfile = () => {
    router.push(`${baseRoutes[role]}/profile`);
  };

  const goBack = () => {
    router.back();
  };

  // Fonction pour naviguer vers n'importe quelle route
  const navigateTo = (route: string) => {
    router.push(route);
  };

  return {
    routes,
    navigateToDashboard,
    navigateToPhone,
    navigateToEmail,
    navigateToCalendar,
    navigateToAdminSection,
    navigateToManagerSection,
    navigateToTeam,
    navigateToCompany,
    navigateToProfile,
    navigateTo,
    goBack,
    baseRoute: baseRoutes[role] || "/dashboard/user",
    isAdmin: role === "admin",
    isManager: role === "manager" || role === "admin",
    role,
  };
};
