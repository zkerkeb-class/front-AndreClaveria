"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/services/client.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, User } from "@/services/user.service";
import { getTeamsByCompany, Team } from "@/services/team.service";

interface CreateClientProps {
  params: Promise<{
    companyId: string;
  }>;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimary?: boolean;
  notes?: string;
}

const CreateClient: React.FC<CreateClientProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [dataLoading, setDataLoading] = useState(true); // État séparé pour le chargement des données
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sector: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      zipCode: "",
      country: "",
    },
    assignedTo: "",
    team: "",
    goodForCustomer: 50, // Valeur par défaut
    isActive: true,
  });
  const [contacts, setContacts] = useState<ContactFormData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Vérification des droits d'accès
  useEffect(() => {
    if (
      !isLoading &&
      user &&
      !["admin", "manager", "user"].includes(user.role)
    ) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Chargement des données initiales - ajout de garde-fous
  useEffect(() => {
    let isMounted = true; // Pour éviter les mises à jour sur un composant démonté

    const fetchData = async () => {
      if (!user || !["admin", "manager", "user"].includes(user.role)) {
        return; // Ne pas charger les données si l'utilisateur n'a pas les droits
      }

      try {
        // Pas besoin d'utiliser setLoadingWithMessage ici pour éviter l'overlay global
        setDataLoading(true);
        console.log("Chargement des données pour la page CreateClient");

        // Récupération des détails de l'entreprise
        const companyData = await getCompanyById(companyId);
        if (isMounted) setCompany(companyData);
        console.log("Entreprise chargée:", companyData?.name);

        // Récupération des utilisateurs
        const usersData = await getAllUsers();
        if (isMounted) setUsers(usersData);
        console.log("Utilisateurs chargés:", usersData?.length);

        // Récupération des équipes de l'entreprise
        const teamsData = await getTeamsByCompany(companyId);
        if (isMounted) setTeams(teamsData);
        console.log("Équipes chargées:", teamsData?.length);

        if (isMounted) setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des données:", err);
        if (isMounted)
          setError("Impossible de charger les données nécessaires.");
      } finally {
        if (isMounted) setDataLoading(false);
        console.log("Chargement des données terminé");
      }
    };

    fetchData();

    // Nettoyage
    return () => {
      isMounted = false;
    };
  }, [companyId, user]); // Ne pas inclure setLoadingWithMessage ici

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (name.includes(".")) {
      // Gestion des champs imbriqués (ex: address.street)
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "range") {
      const numValue = parseInt(value, 10);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        firstName: "",
        lastName: "",
        position: "",
        email: "",
        phone: "",
        mobile: "",
        isPrimary: false,
        notes: "",
      },
    ]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleContactChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newContacts = [...contacts];

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      newContacts[index] = { ...newContacts[index], [name]: checked };
    } else {
      newContacts[index] = { ...newContacts[index], [name]: value };
    }

    setContacts(newContacts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation basique
    if (!formData.name) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoadingWithMessage(true, "Création du client...");

      // Filtrer les contacts valides et ne garder que les champs nécessaires
      const validContacts = contacts
        .filter((c) => c.firstName && c.lastName)
        .map((c) => ({
          firstName: c.firstName,
          lastName: c.lastName,
          position: c.position || undefined,
          email: c.email || undefined,
          phone: c.phone || undefined,
          mobile: c.mobile || undefined,
          isPrimary: c.isPrimary || false,
          notes: c.notes || undefined,
        }));

      // Préparer des données client épurées
      const clientData = {
        name: formData.name,
        description: formData.description || undefined,
        sector: formData.sector || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        // Ne pas inclure l'adresse si tous les champs sont vides
        address:
          formData.address.street ||
          formData.address.city ||
          formData.address.zipCode ||
          formData.address.country
            ? {
                street: formData.address.street || undefined,
                city: formData.address.city || undefined,
                zipCode: formData.address.zipCode || undefined,
                country: formData.address.country || undefined,
              }
            : undefined,
        company: companyId,
        team: formData.team || undefined,
        assignedTo: formData.assignedTo || undefined,
        goodForCustomer: formData.goodForCustomer,
        isActive: formData.isActive,
      };

      // Créer d'abord le client sans les contacts
      console.log("Données du client à envoyer:", clientData);
      const clientResponse = await createClient(clientData as any);

      console.log("Client créé avec succès:", clientResponse);

      // Si des contacts sont fournis, les ajouter dans une deuxième étape
      if (validContacts.length > 0) {
        try {
          console.log(`Ajout de ${validContacts.length} contacts...`);

          // Ajouter les contacts un par un plutôt qu'en bloc
          // Cette approche est plus robuste pour les grands formulaires
          for (const contact of validContacts) {
            const contactWithClientInfo = {
              ...contact,
              client: clientResponse._id,
              company: companyId,
            };

            // Vous devrez peut-être implémenter cette fonction dans votre service
            // await addContactToClient(clientResponse._id, contactWithClientInfo);
            console.log("Contact ajouté:", contactWithClientInfo);
          }
        } catch (contactError) {
          console.error("Erreur lors de l'ajout des contacts:", contactError);
          // Ne pas faire échouer toute l'opération si l'ajout de contacts échoue
          setError("Client créé, mais problème lors de l'ajout des contacts");
        }
      }

      setSuccess(`Client ${clientResponse.name} créé avec succès !`);

      // Redirection après 2 secondes
      setTimeout(() => {
        const routePrefix = user?.role === "admin" ? "admin" : "manager";
        router.push(
          `/dashboard/${routePrefix}/manage/company/clients/${companyId}`
        );
      }, 2000);
    } catch (err: any) {
      console.error("Erreur lors de la création du client:", err);
      setError(
        err.message || "Une erreur est survenue lors de la création du client"
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  // Affichage conditionnel pendant le chargement initial
  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Affichage pendant le chargement des données spécifiques à cette page
  if (dataLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Chargement des données...</p>
        {/* Vous pourriez ajouter un spinner ici */}
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error && !success) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 16px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Déterminer le préfixe de route pour la navigation
  const routePrefix = user?.role === "admin" ? "admin" : "manager";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
            Ajouter un client
          </h1>
          {company && (
            <p style={{ color: "#666" }}>
              Entreprise: <strong>{company.name}</strong>
            </p>
          )}
        </div>
        <button
          onClick={() =>
            router.push(
              `/dashboard/${routePrefix}/manage/company/clients/${companyId}`
            )
          }
          style={{
            padding: "10px 16px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retour à la liste
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#d32f2f",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#e6f7e6",
            color: "#2e7d32",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
              Informations du client
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Nom du client <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Secteur d'activité
              </label>
              <input
                type="text"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
              Coordonnées
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>
                Adresse
              </h3>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Rue
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div
                style={{ display: "flex", gap: "16px", marginBottom: "12px" }}
              >
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Ville
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Pays
                </label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
              Attribution
            </h2>

            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Responsable
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value="">Non assigné</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {`${u.firstName} ${u.lastName} (${u.email})`}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Équipe
                </label>
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value="">Aucune équipe</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
              Évaluation
            </h2>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Indicateur "bonne poire" ({formData.goodForCustomer}/100)
              </label>
              <input
                type="range"
                name="goodForCustomer"
                value={formData.goodForCustomer}
                onChange={handleChange}
                min="0"
                max="100"
                step="5"
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>0 - Difficile</span>
                <span>50 - Moyen</span>
                <span>100 - Facile</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                id="activeCheckbox"
                style={{ marginRight: "8px" }}
              />
              <label htmlFor="activeCheckbox">Client actif</label>
            </div>
          </div>
        </div>

        {/* Section des contacts avec limitation du nombre maximum */}
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ fontSize: "18px" }}>Contacts</h2>
            {contacts.length < 3 && (
              <button
                type="button"
                onClick={addContact}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4c84ff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Ajouter un contact
              </button>
            )}
          </div>

          {contacts.length === 0 && (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              Aucun contact ajouté. Cliquez sur "Ajouter un contact" pour en
              créer.
            </p>
          )}

          {contacts.length >= 3 && (
            <p style={{ color: "#ff9800", marginBottom: "16px" }}>
              Maximum 3 contacts autorisés pour la création initiale. Vous
              pourrez en ajouter d'autres après la création du client.
            </p>
          )}

          {contacts.map((contact, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <h3 style={{ fontSize: "16px" }}>Contact #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </div>

              <div
                style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
              >
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Prénom <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={contact.firstName}
                    onChange={(e) => handleContactChange(index, e)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Nom <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={contact.lastName}
                    onChange={(e) => handleContactChange(index, e)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Fonction
                </label>
                <input
                  type="text"
                  name="position"
                  value={contact.position}
                  onChange={(e) => handleContactChange(index, e)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div
                style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
              >
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={(e) => handleContactChange(index, e)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Téléphone fixe
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contact.phone}
                    onChange={(e) => handleContactChange(index, e)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Mobile
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={contact.mobile}
                  onChange={(e) => handleContactChange(index, e)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    name="isPrimary"
                    checked={contact.isPrimary}
                    onChange={(e) => handleContactChange(index, e)}
                    style={{ marginRight: "8px" }}
                  />
                  Contact principal
                </label>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/${routePrefix}/manage/company/clients/${companyId}`
              )
            }
            style={{
              padding: "10px 20px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Annuler
          </button>

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4c84ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Créer le client
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClient;
