// services/client.service.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_CLIENT || "http://localhost:3001/api";

export interface Client {
  _id: string;
  name: string;
  description?: string;
  sector?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  logo?: string;
  company: string; // Référence à l'entreprise propriétaire
  team?: string; // Équipe responsable
  assignedTo?: string; // ID utilisateur responsable
  goodForCustomer?: number; // Score de 0 à 100, défaut 50
  contacts?: string[]; // IDs des contacts
  opportunities?: string[]; // IDs des opportunités
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ContactInput {
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimary?: boolean;
  notes?: string;
}

// Type étendu pour inclure les contacts lors de la création
export interface ClientCreateInput {
  name: string;
  description?: string;
  sector?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  logo?: string;
  company: string;
  team?: string;
  assignedTo?: string;
  goodForCustomer?: number;
  isActive?: boolean;
  contacts?: ContactInput[];
}
const headers = {
  "Content-Type": "application/json",
};

/**
 * Récupère tous les clients
 */
export const getAllClients = async (): Promise<Client[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/clients`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des clients"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("getAllClients error:", error);
    throw error;
  }
};

/**
 * Récupère un client par son ID
 */
export const getClientById = async (id: string): Promise<Client> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération du client"
      );
    }

    // Ajouter du debug pour voir la structure de la réponse
    const data = await response.json();
    console.log("Réponse de getClientById:", data);

    // Gérer différentes structures de réponse
    if (data && data.data) {
      return data.data;
    } else if (data && data._id) {
      return data;
    } else {
      console.warn("Structure de réponse inattendue dans getClientById:", data);
      return data;
    }
  } catch (error: any) {
    console.error(`getClientById error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Récupère les clients par entreprise
 */
// Modification de la fonction getClientsByCompany dans client.service.ts
export const getClientsByCompany = async (
  companyId: string
): Promise<Client[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/clients/company/${companyId}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors de la récupération des clients de l'entreprise"
      );
    }

    // Ajouter du debug pour voir la structure de la réponse
    const data = await response.json();
    console.log("Structure de la réponse API:", data);

    // Vérifier si la réponse est directement un tableau ou si les données sont dans une propriété
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && typeof data === "object") {
      // Chercher une propriété qui contient un tableau
      const possibleArrayProps = Object.keys(data).find((key) =>
        Array.isArray(data[key])
      );
      if (possibleArrayProps) {
        return data[possibleArrayProps];
      }
    }

    // Si nous arrivons ici, la structure n'est pas celle attendue
    console.error("Structure de réponse inattendue:", data);
    return []; // Retourner un tableau vide pour éviter les erreurs
  } catch (error: any) {
    console.error(`getClientsByCompany error for company ${companyId}:`, error);
    throw error;
  }
};

/**
 * Récupère les clients par équipe
 */
export const getClientsByTeam = async (teamId: string): Promise<Client[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/clients/team/${teamId}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors de la récupération des clients de l'équipe"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`getClientsByTeam error for team ${teamId}:`, error);
    throw error;
  }
};

/**
 * Crée un nouveau client
 */
export const createClient = async (
  clientData: ClientCreateInput
): Promise<Client> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    // Ajouter un log explicite pour voir les données envoyées
    console.log(
      "Données envoyées à l'API (createClient):",
      JSON.stringify(clientData, null, 2)
    );

    const response = await fetch(`${API_URL}/clients`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la création du client"
      );
    }

    // Analyser la réponse et vérifier sa structure
    const data = await response.json();
    console.log("Réponse API création client:", data);

    // Vérifier si la réponse contient directement le client ou s'il est dans une propriété
    if (data && data.data && data.data.client) {
      return data.data.client;
    } else if (data && data.client) {
      return data.client;
    } else if (data && data._id) {
      // Si c'est directement l'objet client
      return data;
    }

    // Si la structure est différente
    console.warn("Structure de réponse inattendue:", data);
    return data; // Retourner tel quel, mais cela pourrait causer des problèmes plus tard
  } catch (error: any) {
    console.error("createClient error:", error);
    throw error;
  }
};
/**
 * Met à jour un client
 */
export const updateClient = async (
  id: string,
  clientData: Partial<Client>
): Promise<Client> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour du client"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`updateClient error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime un client
 */
export const deleteClient = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression du client"
      );
    }
  } catch (error: any) {
    console.error(`deleteClient error for id ${id}:`, error);
    throw error;
  }
};
