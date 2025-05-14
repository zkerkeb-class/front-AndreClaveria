// src/hooks/useNavigation.ts
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getRoutePrefix } from "@/utils/getRoutePrefix";

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

  // Utiliser getRoutePrefix pour obtenir le préfixe de route
  const routePrefix = getRoutePrefix(role);

  // Routes de base pour chaque type d'utilisateur
  const baseRoutes: Record<string, string> = {
    admin: `/dashboard/admin`,
    manager: `/dashboard/manager`,
    user: `/dashboard/user`,
  };

  // Routes spécifiques basées sur le rôle
  const routes: NavigationRoutes = {
    dashboard: `/dashboard/${routePrefix}`,
    phone: {
      recentCalls: `/dashboard/${routePrefix}/phone/recent`,
      favorites: `/dashboard/${routePrefix}/phone/favorites`,
      schedule: `/dashboard/${routePrefix}/phone/schedule`,
    },
    email: {
      inbox: `/dashboard/${routePrefix}/email/inbox`,
      sent: `/dashboard/${routePrefix}/email/sent`,
      drafts: `/dashboard/${routePrefix}/email/drafts`,
    },
    calendar: {
      agenda: `/dashboard/${routePrefix}/calendar/agenda`,
      appointments: `/dashboard/${routePrefix}/calendar/appointments`,
      events: `/dashboard/${routePrefix}/calendar/events`,
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
    router.push(`/dashboard/${routePrefix}/profile`);
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
    baseRoute: `/dashboard/${routePrefix}`,
    isAdmin: role === "admin",
    isManager: role === "manager" || role === "admin",
    role,
  };
};
