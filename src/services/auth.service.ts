// services/auth.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    active: boolean;
  };
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Erreur lors de la connexion. Veuillez vérifier vos identifiants."
      );
    }

    // Stocker explicitement les informations d'authentification
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error(
          "Erreur lors de la connexion. Veuillez vérifier vos identifiants."
        );
  }
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  return !!token;
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      console.warn("Token non valide ou non trouvé dans le localStorage");
      return null;
    }

    return token;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
    return null;
  }
};
