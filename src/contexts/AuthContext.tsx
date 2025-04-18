"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as loginService,
  logout as logoutService,
} from "@/services/auth.service";
import { updateUser, getStoredUser } from "@/services/user.service";

// Définition des types
interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (firstName: string, lastName: string) => Promise<void>;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};

// Provider du contexte
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Vérifie si le profil de l'utilisateur est complet
  const isProfileComplete = user?.firstName && user?.lastName ? true : false;

  // Vérifie si l'utilisateur est authentifié
  const isAuthenticated = !!token;

  // Charge l'utilisateur et le token depuis le localStorage au démarrage
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = getStoredUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error
        );
        // En cas d'erreur, on réinitialise tout
        logoutService();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Redirige l'utilisateur en fonction de son état d'authentification
  useEffect(() => {
    if (!isLoading) {
      const currentPath = window.location.pathname;

      if (!isAuthenticated && currentPath !== "/auth") {
        router.push("/auth");
      } else if (
        isAuthenticated &&
        !isProfileComplete &&
        currentPath !== "/getting-started"
      ) {
        router.push("/getting-started");
      } else if (
        isAuthenticated &&
        isProfileComplete &&
        (currentPath === "/auth" || currentPath === "/getting-started")
      ) {
        // Authentifié et profil complet mais sur une page d'auth -> redirection vers le dashboard
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isProfileComplete, isLoading, router]);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Utilisation du service d'authentification
      const data = await loginService({ email, password });

      setToken(data.token);
      setUser(data.user);

      // La redirection est gérée par useEffect en fonction de isAuthenticated et isProfileComplete
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    logoutService();
    setToken(null);
    setUser(null);
    router.push("/auth");
  };

  // Fonction de mise à jour du profil
  const updateUserProfile = async (firstName: string, lastName: string) => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      // Utilisation du service utilisateur
      const updatedUser = await updateUser(user._id, { firstName, lastName });
      setUser(updatedUser);

      // La redirection est gérée par useEffect
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Valeur du contexte
  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isProfileComplete,
    login,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
