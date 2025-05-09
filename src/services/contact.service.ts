// services/contact.service.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_CLIENT || "http://localhost:3001/api";

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company: string; // Référence à l'entreprise propriétaire
  client?: string; // ID du client associé
  team?: string; // Équipe responsable
  assignedTo?: string; // ID utilisateur responsable
  isPrimary?: boolean;
  notes?: string;
  lastContactDate?: string;
  opportunities?: string[]; // IDs des opportunités liées
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
const headers = {
  "Content-Type": "application/json",
};

/**
 * Récupère tous les contacts
 */
export const getAllContacts = async (): Promise<Contact[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des contacts"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("getAllContacts error:", error);
    throw error;
  }
};

/**
 * Récupère un contact par son ID
 */
export const getContactById = async (id: string): Promise<Contact> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération du contact"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`getContactById error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Récupère les contacts par client
 */
// Dans contact.service.ts, assurons-nous que getContactsByClient gère correctement tous les formats de réponse
export const getContactsByClient = async (
  clientId: string
): Promise<Contact[] | any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    console.log(`Appel API pour récupérer les contacts du client ${clientId}`);
    const response = await fetch(`${API_URL}/contacts/client/${clientId}`, {
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
          "Erreur lors de la récupération des contacts du client"
      );
    }

    // Récupérer la réponse et l'examiner
    const responseData = await response.json();
    console.log("Réponse brute de l'API pour les contacts:", responseData);

    // Vérifier le format de la réponse et extraire les contacts
    if (
      responseData &&
      typeof responseData === "object" &&
      "data" in responseData &&
      Array.isArray(responseData.data)
    ) {
      console.log("Format de réponse avec structure { success, data }");
      return responseData; // Retourner toute la structure
    } else if (Array.isArray(responseData)) {
      console.log("Format de réponse: tableau direct");
      return responseData; // Retourner directement le tableau
    } else {
      console.warn("Format de réponse inattendu:", responseData);
      return []; // Retourner un tableau vide par défaut
    }
  } catch (error: any) {
    console.error(`getContactsByClient error for client ${clientId}:`, error);
    throw error;
  }
};
/**
 * Récupère les contacts par entreprise
 */
export const getContactsByCompany = async (
  companyId: string
): Promise<Contact[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts/company/${companyId}`, {
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
          "Erreur lors de la récupération des contacts de l'entreprise"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `getContactsByCompany error for company ${companyId}:`,
      error
    );
    throw error;
  }
};

/**
 * Crée un nouveau contact
 */
export const createContact = async (
  contactData: Partial<Contact>
): Promise<Contact> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la création du contact"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("createContact error:", error);
    throw error;
  }
};

/**
 * Met à jour un contact
 */
export const updateContact = async (
  id: string,
  contactData: Partial<Contact>
): Promise<Contact> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour du contact"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`updateContact error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime un contact
 */
export const deleteContact = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression du contact"
      );
    }
  } catch (error: any) {
    console.error(`deleteContact error for id ${id}:`, error);
    throw error;
  }
};
