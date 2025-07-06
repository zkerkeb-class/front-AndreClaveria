"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useClient } from "@/hooks/useClient";
import ActionButton from "@/components/common/ActionButton";
import AIAnalysis from "@/components/common/AIAnalysis";
import { Client, updateClient } from "@/services/client.service";

const ClientDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();

  // Récupération du clientId depuis les paramètres d'URL
  const clientId = params.clientId as string;

  // 🔍 DEBUG: Log du clientId
  console.log("🔍 [CLIENT-DETAIL] ClientId reçu:", clientId);

  const [commercialData, setCommercialData] = useState({
    estimatedBudget: "",
    companySize: "",
    hasWorkedWithUs: false,
    knowsUs: false,
    goodForCustomer: 50,
  });

  const [newInteraction, setNewInteraction] = useState({
    type: "call",
    outcome: "neutral",
    notes: "",
  });

  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [interactionSaving, setInteractionSaving] = useState(false);

  const hasAccess = useRoleCheck({
    isLoading: isLoadingAuth,
    user,
    requiredRole: ["user"],
    redirectPath: "/dashboard",
  });

  const {
    client,
    isLoading: isLoadingClient,
    error: clientError,
    updateClientData,
  } = useClient({ clientId });

  // État local pour les interactions pour mise à jour immédiate
  const [localInteractions, setLocalInteractions] = useState<any[]>([]);

  // 🔍 DEBUG: Surveiller les changements du client
  useEffect(() => {
    if (client) {
      console.log("🔍 [CLIENT-DETAIL] Client chargé:", {
        id: client._id,
        name: client.name,
        sector: client.sector,
        estimatedBudget: client.estimatedBudget,
        companySize: client.companySize,
        goodForCustomer: client.goodForCustomer,
        hasWorkedWithUs: client.hasWorkedWithUs,
        knowsUs: client.knowsUs,
        isActive: client.isActive,
        interactionsCount: client.interactions?.length || 0,
        opportunitiesCount: client.opportunities?.length || 0,
        contactsCount: client.contacts?.length || 0,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      });

      // 🔍 DEBUG: Détail des interactions
      if (client.interactions && client.interactions.length > 0) {
        console.log(
          "🔍 [CLIENT-DETAIL] Interactions détaillées:",
          client.interactions.map((int, index) => ({
            index,
            date: int.date,
            type: int.type,
            outcome: int.outcome,
            notes: int.notes?.substring(0, 50) + "..." || "Pas de notes",
            daysSince: Math.floor(
              (new Date().getTime() - new Date(int.date).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          }))
        );
      } else {
        console.log("🔍 [CLIENT-DETAIL] Aucune interaction trouvée");
      }

      // 🔍 DEBUG: Détail des opportunités
      if (client.opportunities && client.opportunities.length > 0) {
        console.log(
          "🔍 [CLIENT-DETAIL] Opportunités détaillées:",
          client.opportunities
        );
      } else {
        console.log("🔍 [CLIENT-DETAIL] Aucune opportunité trouvée");
      }

      setCommercialData({
        estimatedBudget: client.estimatedBudget?.toString() || "",
        companySize: client.companySize || "",
        hasWorkedWithUs: client.hasWorkedWithUs || false,
        knowsUs: client.knowsUs || false,
        goodForCustomer: client.goodForCustomer || 50,
      });

      // 🔍 DEBUG: Données commerciales initialisées
      console.log("🔍 [CLIENT-DETAIL] Données commerciales initialisées:", {
        estimatedBudget: client.estimatedBudget?.toString() || "",
        companySize: client.companySize || "",
        hasWorkedWithUs: client.hasWorkedWithUs || false,
        knowsUs: client.knowsUs || false,
        goodForCustomer: client.goodForCustomer || 50,
      });

      // ✅ Initialiser les interactions locales
      setLocalInteractions(client.interactions || []);
    }
  }, [client]);

  // 🔍 DEBUG: Surveiller les changements des données commerciales
  useEffect(() => {
    console.log(
      "🔍 [CLIENT-DETAIL] Données commerciales mises à jour:",
      commercialData
    );
  }, [commercialData]);

  // 🔍 DEBUG: Surveiller les erreurs
  useEffect(() => {
    if (clientError) {
      console.error("🔍 [CLIENT-DETAIL] Erreur client:", clientError);
    }
  }, [clientError]);

  // Nettoyage des timeouts au démontage du composant
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  // Fonction helper pour valider la taille d'entreprise
  const validateCompanySize = (
    size: string
  ): "1-10" | "11-50" | "51-200" | "200+" | undefined => {
    const validSizes = ["1-10", "11-50", "51-200", "200+"];
    return validSizes.includes(size)
      ? (size as "1-10" | "11-50" | "51-200" | "200+")
      : undefined;
  };

  // Auto-save SIMPLE sans double mise à jour
  const handleCommercialDataChange = (field: string, value: any) => {
    console.log(`🔄 [CLIENT-DETAIL] Changement détecté: ${field} = ${value}`);

    const newData = { ...commercialData, [field]: value };
    setCommercialData(newData); // ✅ SEULEMENT mise à jour de l'état local
    setSaveStatus("saving");

    // 🔍 DEBUG: Nouvelles données avant sauvegarde
    console.log("🔍 [CLIENT-DETAIL] Nouvelles données commerciales:", newData);

    // Annuler le timeout précédent
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Créer un nouveau timeout pour sauvegarder après 1.5 secondes
    const timeout = setTimeout(async () => {
      try {
        console.log(
          `💾 [CLIENT-DETAIL] Début de la sauvegarde pour le client: ${clientId}`
        );

        const updateData: Partial<Client> = {
          estimatedBudget: newData.estimatedBudget
            ? parseInt(newData.estimatedBudget)
            : undefined,
          companySize: validateCompanySize(newData.companySize),
          hasWorkedWithUs: newData.hasWorkedWithUs,
          knowsUs: newData.knowsUs,
          goodForCustomer: newData.goodForCustomer,
        };

        // 🔍 DEBUG: Données formatées pour la sauvegarde
        console.log(
          "🔍 [CLIENT-DETAIL] Données formatées pour sauvegarde:",
          updateData
        );

        // ✅ Utiliser directement le service pour éviter les conflits de state
        const updatedClient = await updateClient(clientId, updateData);

        if (updatedClient) {
          console.log(
            "✅ [CLIENT-DETAIL] Données sauvegardées automatiquement"
          );
          console.log("🔍 [CLIENT-DETAIL] Client après sauvegarde:", {
            id: updatedClient._id,
            name: updatedClient.name,
            estimatedBudget: updatedClient.estimatedBudget,
            companySize: updatedClient.companySize,
            hasWorkedWithUs: updatedClient.hasWorkedWithUs,
            knowsUs: updatedClient.knowsUs,
            goodForCustomer: updatedClient.goodForCustomer,
          });
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          console.error(
            "❌ [CLIENT-DETAIL] Échec de la sauvegarde automatique"
          );
          setSaveStatus("error");
          setTimeout(() => setSaveStatus("idle"), 3000);
        }
      } catch (error) {
        console.error(
          "💥 [CLIENT-DETAIL] Erreur lors de la sauvegarde automatique:",
          error
        );
        setSaveStatus("error");

        // ✅ REVERT EN CAS D'ERREUR - remettre les valeurs d'origine
        if (client) {
          const revertData = {
            estimatedBudget: client.estimatedBudget?.toString() || "",
            companySize: client.companySize || "",
            hasWorkedWithUs: client.hasWorkedWithUs || false,
            knowsUs: client.knowsUs || false,
            goodForCustomer: client.goodForCustomer || 50,
          };
          console.log(
            "🔄 [CLIENT-DETAIL] Revert vers les données originales:",
            revertData
          );
          setCommercialData(revertData);
        }

        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    }, 1500);

    setSaveTimeout(timeout);
  };

  // Composant pour l'indicateur de sauvegarde
  const SaveIndicator = () => {
    const getIndicatorStyle = () => {
      const baseStyle = {
        fontSize: "12px",
        fontWeight: "bold" as const,
        padding: "4px 8px",
        borderRadius: "4px",
        marginLeft: "10px",
        transition: "all 0.3s ease",
      };

      switch (saveStatus) {
        case "saving":
          return {
            ...baseStyle,
            backgroundColor: "#fff3cd",
            color: "#856404",
          };
        case "saved":
          return {
            ...baseStyle,
            backgroundColor: "#d4edda",
            color: "#155724",
          };
        case "error":
          return {
            ...baseStyle,
            backgroundColor: "#f8d7da",
            color: "#721c24",
          };
        default:
          return {
            ...baseStyle,
            opacity: 0,
          };
      }
    };

    const getIndicatorText = () => {
      switch (saveStatus) {
        case "saving":
          return "💾 Sauvegarde...";
        case "saved":
          return "✅ Sauvegardé";
        case "error":
          return "❌ Erreur";
        default:
          return "";
      }
    };

    return <span style={getIndicatorStyle()}>{getIndicatorText()}</span>;
  };

  const handleAddInteraction = async () => {
    if (!newInteraction.notes.trim()) {
      alert("Veuillez ajouter une note pour l'interaction");
      return;
    }

    setInteractionSaving(true);
    console.log("🔍 [CLIENT-DETAIL] Ajout d'interaction:", newInteraction);

    try {
      const newInteractionObj = {
        date: new Date(),
        type: newInteraction.type as
          | "call"
          | "email"
          | "meeting"
          | "demo"
          | "proposal"
          | "follow_up"
          | "other",
        outcome: newInteraction.outcome as
          | "positive"
          | "neutral"
          | "negative"
          | "no_response",
        notes: newInteraction.notes,
      };

      console.log(
        "🔍 [CLIENT-DETAIL] Nouvelle interaction formatée:",
        newInteractionObj
      );

      const updatedInteractions = [
        newInteractionObj,
        ...localInteractions,
      ].slice(0, 5); // Limiter à 5 interactions

      console.log(
        "🔍 [CLIENT-DETAIL] Liste des interactions mise à jour:",
        updatedInteractions
      );

      // ✅ MISE À JOUR IMMÉDIATE DE L'ÉTAT LOCAL
      setLocalInteractions(updatedInteractions);

      // ✅ Sauvegarde en arrière-plan
      const updatedClient = await updateClient(clientId, {
        interactions: updatedInteractions,
      });

      if (updatedClient) {
        console.log("✅ [CLIENT-DETAIL] Interaction ajoutée avec succès!");
        console.log("🔍 [CLIENT-DETAIL] Client après ajout interaction:", {
          interactionsCount: updatedClient.interactions?.length || 0,
          lastInteraction: updatedClient.interactions?.[0],
        });
        setNewInteraction({
          type: "call",
          outcome: "neutral",
          notes: "",
        });
        setShowAddInteraction(false);
      } else {
        // ❌ Revert en cas d'erreur
        console.error("❌ [CLIENT-DETAIL] Échec sauvegarde interaction");
        setLocalInteractions(client?.interactions || []);
        throw new Error("Échec de la sauvegarde");
      }
    } catch (error) {
      console.error(
        "💥 [CLIENT-DETAIL] Erreur lors de l'ajout de l'interaction:",
        error
      );
      alert("Erreur lors de l'ajout de l'interaction");

      // ❌ Revert en cas d'erreur
      setLocalInteractions(client?.interactions || []);
    } finally {
      setInteractionSaving(false);
    }
  };

  // 🔍 DEBUG: Fonction pour analyser les données envoyées à l'IA
  const debugClientDataForAI = () => {
    if (!client) {
      console.log("🔍 [DEBUG-IA] Aucun client disponible pour l'analyse");
      return;
    }

    console.log("🔍 [DEBUG-IA] === DONNÉES CLIENT ENVOYÉES À L'IA ===");

    // Simuler la structure ClientData exacte
    const clientDataForAI = {
      _id: client._id,
      name: client.name,
      description: client.description || undefined,
      sector: client.sector || undefined,
      phone: client.phone || undefined,
      email: client.email || undefined,
      goodForCustomer: client.goodForCustomer || undefined,
      contacts: client.contacts || undefined,
      opportunities: client.opportunities || undefined,
      isActive: client.isActive !== undefined ? client.isActive : undefined,
      createdAt: client.createdAt || undefined,
      updatedAt: client.updatedAt || undefined,
      assignedTo: client.assignedTo || undefined,
      interactions: client.interactions || undefined,
      companySize: client.companySize || undefined,
      hasWorkedWithUs: client.hasWorkedWithUs || undefined,
      knowsUs: client.knowsUs || undefined,
      estimatedBudget: client.estimatedBudget || undefined,
    };

    console.log("🔍 [DEBUG-IA] Structure complète:", clientDataForAI);

    // Analyser chaque champ important
    console.log("🔍 [DEBUG-IA] === ANALYSE PAR CHAMP ===");
    console.log(
      "📊 Budget estimé:",
      clientDataForAI.estimatedBudget,
      typeof clientDataForAI.estimatedBudget
    );
    console.log(
      "🏢 Taille entreprise:",
      clientDataForAI.companySize,
      typeof clientDataForAI.companySize
    );
    console.log(
      "⭐ Score client:",
      clientDataForAI.goodForCustomer,
      typeof clientDataForAI.goodForCustomer
    );
    console.log(
      "🤝 Ancien client:",
      clientDataForAI.hasWorkedWithUs,
      typeof clientDataForAI.hasWorkedWithUs
    );
    console.log(
      "👋 Nous connaît:",
      clientDataForAI.knowsUs,
      typeof clientDataForAI.knowsUs
    );
    console.log(
      "🏢 Secteur:",
      clientDataForAI.sector,
      typeof clientDataForAI.sector
    );
    console.log(
      "✅ Actif:",
      clientDataForAI.isActive,
      typeof clientDataForAI.isActive
    );

    // Analyser les interactions
    if (
      clientDataForAI.interactions &&
      clientDataForAI.interactions.length > 0
    ) {
      console.log("🔍 [DEBUG-IA] === INTERACTIONS ===");
      console.log("📊 Nombre:", clientDataForAI.interactions.length);
      clientDataForAI.interactions.forEach((int, index) => {
        const daysSince = Math.floor(
          (new Date().getTime() - new Date(int.date).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        console.log(`🔹 Interaction ${index + 1}:`, {
          date: int.date,
          type: int.type,
          outcome: int.outcome,
          daysSince: daysSince,
          hasNotes: !!int.notes,
        });
      });
    } else {
      console.log("🔍 [DEBUG-IA] Aucune interaction disponible");
    }

    // Analyser les opportunités
    if (
      clientDataForAI.opportunities &&
      clientDataForAI.opportunities.length > 0
    ) {
      console.log("🔍 [DEBUG-IA] === OPPORTUNITÉS ===");
      console.log("📊 Nombre:", clientDataForAI.opportunities.length);
      console.log("📋 Détail:", clientDataForAI.opportunities);
    } else {
      console.log("🔍 [DEBUG-IA] Aucune opportunité disponible");
    }

    // Validation des champs requis
    console.log("🔍 [DEBUG-IA] === VALIDATION ===");
    const requiredFields = ["_id", "name"];
    const missingRequired = requiredFields.filter(
      (field) => !clientDataForAI[field as keyof typeof clientDataForAI]
    );
    console.log(
      "❗ Champs requis manquants:",
      missingRequired.length > 0 ? missingRequired : "Aucun"
    );

    const recommendedFields = [
      "sector",
      "companySize",
      "estimatedBudget",
      "goodForCustomer",
    ];
    const missingRecommended = recommendedFields.filter(
      (field) => !clientDataForAI[field as keyof typeof clientDataForAI]
    );
    console.log(
      "⚠️ Champs recommandés manquants:",
      missingRecommended.length > 0 ? missingRecommended : "Aucun"
    );

    return clientDataForAI;
  };

  // 🔍 DEBUG: Exécuter l'analyse quand le client change
  useEffect(() => {
    if (client) {
      setTimeout(() => {
        debugClientDataForAI();
      }, 1000); // Délai pour permettre à tous les states de se mettre à jour
    }
  }, [client, localInteractions, commercialData]);

  if (isLoadingAuth || !hasAccess) {
    return null;
  }

  if (!clientId) {
    console.error("🔍 [CLIENT-DETAIL] ID du client manquant");
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>ID du client manquant</p>
        <ActionButton
          onClick={() => router.push("/dashboard/pipeline/clients")}
          variant="secondary"
          size="medium"
        >
          Retour à la liste des clients
        </ActionButton>
      </div>
    );
  }

  if (clientError) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{clientError}</p>
        <ActionButton
          onClick={() => router.push("/dashboard/pipeline/clients")}
          variant="secondary"
          size="medium"
        >
          Retour à la liste des clients
        </ActionButton>
      </div>
    );
  }

  if (isLoadingClient) {
    console.log("🔍 [CLIENT-DETAIL] Chargement du client en cours...");
    return (
      <div style={{ padding: "20px" }}>
        <p>Chargement des données du client...</p>
      </div>
    );
  }

  if (!client) {
    console.error("🔍 [CLIENT-DETAIL] Client non trouvé");
    return (
      <div style={{ padding: "20px" }}>
        <h2>Client non trouvé</h2>
        <p>
          Le client demandé n'existe pas ou vous n'avez pas les permissions pour
          le voir.
        </p>
        <ActionButton
          onClick={() => router.push("/dashboard/pipeline/clients")}
          variant="secondary"
          size="medium"
        >
          Retour à la liste des clients
        </ActionButton>
      </div>
    );
  }

  console.log(
    "🔍 [CLIENT-DETAIL] Rendu du composant avec client:",
    client.name
  );

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <ActionButton
          onClick={() => router.push("/dashboard/pipeline/clients")}
          variant="secondary"
          size="medium"
        >
          ← Retour à la liste
        </ActionButton>

        <h1
          style={{
            fontSize: "40px",
            marginBottom: "8px",
            color: "#333333",
            fontFamily: "var(--font-first)",
          }}
        >
          {client.name}
        </h1>
        <p style={{ color: "#666", fontSize: "16px" }}>ID: {client._id}</p>

        {/* 🔍 DEBUG: Bouton pour forcer l'analyse des données */}
        <button
          onClick={debugClientDataForAI}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          🔍 Debug: Analyser les données IA
        </button>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}
      >
        {/* Informations générales */}
        <div>
          <h3 style={{ marginBottom: "15px", color: "#333" }}>
            Informations générales
          </h3>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Nom:</strong> {client.name}
            </p>
            <p>
              <strong>Secteur:</strong> {client.sector || "Non renseigné"}
            </p>
            <p>
              <strong>Email:</strong> {client.email || "Non renseigné"}
            </p>
            <p>
              <strong>Téléphone:</strong> {client.phone || "Non renseigné"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {client.description || "Aucune description"}
            </p>
          </div>
        </div>

        {/* Informations commerciales - Édition directe */}
        <div>
          <h3
            style={{
              marginBottom: "15px",
              color: "#333",
              display: "flex",
              alignItems: "center",
            }}
          >
            Informations commerciales
            <span
              style={{
                fontSize: "14px",
                color: "#666",
                fontWeight: "normal",
                marginLeft: "10px",
              }}
            >
              (sauvegarde automatique)
            </span>
            <SaveIndicator />
          </h3>

          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Budget estimé (€):{" "}
                {commercialData.estimatedBudget
                  ? `${commercialData.estimatedBudget}€`
                  : "Non défini"}
              </label>
              <input
                type="number"
                value={commercialData.estimatedBudget}
                onChange={(e) =>
                  handleCommercialDataChange("estimatedBudget", e.target.value)
                }
                placeholder="Ex: 50000"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Taille de l'entreprise:{" "}
                {commercialData.companySize || "Non définie"}
              </label>
              <select
                value={commercialData.companySize || ""}
                onChange={(e) =>
                  handleCommercialDataChange(
                    "companySize",
                    e.target.value || null
                  )
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                }}
              >
                <option value="">Sélectionner</option>
                <option value="1-10">1-10 employés</option>
                <option value="11-50">11-50 employés</option>
                <option value="51-200">51-200 employés</option>
                <option value="200+">200+ employés</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Score client: {commercialData.goodForCustomer}/100
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={commercialData.goodForCustomer}
                onChange={(e) =>
                  handleCommercialDataChange(
                    "goodForCustomer",
                    parseInt(e.target.value)
                  )
                }
                style={{ width: "100%" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                <span>Difficile</span>
                <span>Moyen</span>
                <span>Facile</span>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}
              >
                <input
                  type="checkbox"
                  checked={commercialData.hasWorkedWithUs}
                  onChange={(e) =>
                    handleCommercialDataChange(
                      "hasWorkedWithUs",
                      e.target.checked
                    )
                  }
                  style={{ transform: "scale(1.1)" }}
                />
                <span>
                  A déjà travaillé avec nous{" "}
                  {commercialData.hasWorkedWithUs ? "✅" : "❌"}
                </span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}
              >
                <input
                  type="checkbox"
                  checked={commercialData.knowsUs}
                  onChange={(e) =>
                    handleCommercialDataChange("knowsUs", e.target.checked)
                  }
                  style={{ transform: "scale(1.1)" }}
                />
                <span>
                  Nous connaît déjà {commercialData.knowsUs ? "✅" : "❌"}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Adresse */}
      {client.address && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ marginBottom: "15px", color: "#333" }}>Adresse</h3>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <p>{client.address.street}</p>
            <p>
              {client.address.zipCode} {client.address.city}
            </p>
            <p>{client.address.country}</p>
          </div>
        </div>
      )}

      {/* Interactions */}
      <div style={{ marginTop: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h3 style={{ color: "#333", margin: 0 }}>
            Interactions ({localInteractions.length}/5)
          </h3>
          <ActionButton
            onClick={() => setShowAddInteraction(!showAddInteraction)}
            variant="primary"
            size="small"
            customColor="#A3B18A"
          >
            {showAddInteraction ? "Annuler" : "➕ Ajouter interaction"}
          </ActionButton>
        </div>

        {/* Formulaire d'ajout d'interaction */}
        {showAddInteraction && (
          <div
            style={{
              backgroundColor: "#f0f8e8",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "2px solid #A3B18A",
            }}
          >
            <h4
              style={{ marginTop: 0, marginBottom: "15px", color: "#2D5016" }}
            >
              ➕ Nouvelle interaction
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Type d'interaction:
                </label>
                <select
                  value={newInteraction.type}
                  onChange={(e) =>
                    setNewInteraction((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="call">📞 Appel téléphonique</option>
                  <option value="email">📧 Email</option>
                  <option value="meeting">🤝 Réunion</option>
                  <option value="demo">🖥️ Démonstration</option>
                  <option value="proposal">📋 Proposition commerciale</option>
                  <option value="follow_up">🔄 Relance</option>
                  <option value="other">📝 Autre</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Résultat:
                </label>
                <select
                  value={newInteraction.outcome}
                  onChange={(e) =>
                    setNewInteraction((prev) => ({
                      ...prev,
                      outcome: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="positive">✅ Positif</option>
                  <option value="neutral">⚪ Neutre</option>
                  <option value="negative">❌ Négatif</option>
                  <option value="no_response">⏳ Pas de réponse</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Notes détaillées:
              </label>
              <textarea
                value={newInteraction.notes}
                onChange={(e) =>
                  setNewInteraction((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                maxLength={200}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  resize: "vertical",
                  fontSize: "14px",
                }}
                placeholder="Décrivez l'interaction, les points clés abordés, les prochaines étapes..."
              />
              <small style={{ color: "#666", float: "right" }}>
                {newInteraction.notes.length}/200 caractères
              </small>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <ActionButton
                onClick={handleAddInteraction}
                variant="primary"
                size="medium"
                customColor="#4CAF50"
                disabled={interactionSaving}
              >
                {interactionSaving
                  ? "💾 Sauvegarde..."
                  : "✅ Enregistrer l'interaction"}
              </ActionButton>
              <ActionButton
                onClick={() => setShowAddInteraction(false)}
                variant="secondary"
                size="medium"
              >
                Annuler
              </ActionButton>
            </div>
          </div>
        )}

        {/* Liste des interactions */}
        {localInteractions && localInteractions.length > 0 ? (
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {localInteractions.map((interaction, index) => (
              <div
                key={index}
                style={{
                  marginBottom:
                    index < localInteractions.length - 1 ? "20px" : "0",
                  paddingBottom:
                    index < localInteractions.length - 1 ? "20px" : "0",
                  borderBottom:
                    index < localInteractions.length - 1
                      ? "1px solid #ddd"
                      : "none",
                  backgroundColor: "white",
                  padding: "15px",
                  borderRadius: "6px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 5px 0",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {interaction.type === "call"
                        ? "📞"
                        : interaction.type === "email"
                        ? "📧"
                        : interaction.type === "meeting"
                        ? "🤝"
                        : interaction.type === "demo"
                        ? "🖥️"
                        : interaction.type === "proposal"
                        ? "📋"
                        : interaction.type === "follow_up"
                        ? "🔄"
                        : "📝"}{" "}
                      {interaction.type === "call"
                        ? "Appel"
                        : interaction.type === "email"
                        ? "Email"
                        : interaction.type === "meeting"
                        ? "Réunion"
                        : interaction.type === "demo"
                        ? "Démo"
                        : interaction.type === "proposal"
                        ? "Proposition"
                        : interaction.type === "follow_up"
                        ? "Relance"
                        : "Autre"}
                    </p>
                    <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                      {new Date(interaction.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      backgroundColor:
                        interaction.outcome === "positive"
                          ? "#d4edda"
                          : interaction.outcome === "negative"
                          ? "#f8d7da"
                          : interaction.outcome === "no_response"
                          ? "#fff3cd"
                          : "#e2e3e5",
                      color:
                        interaction.outcome === "positive"
                          ? "#155724"
                          : interaction.outcome === "negative"
                          ? "#721c24"
                          : interaction.outcome === "no_response"
                          ? "#856404"
                          : "#383d41",
                    }}
                  >
                    {interaction.outcome === "positive"
                      ? "✅ Positif"
                      : interaction.outcome === "negative"
                      ? "❌ Négatif"
                      : interaction.outcome === "no_response"
                      ? "⏳ Pas de réponse"
                      : "⚪ Neutre"}
                  </span>
                </div>
                {interaction.notes && (
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "10px",
                      borderRadius: "4px",
                      borderLeft: "4px solid #A3B18A",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontStyle: "italic",
                        color: "#555",
                        lineHeight: "1.4",
                      }}
                    >
                      "{interaction.notes}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "30px",
              borderRadius: "8px",
              textAlign: "center",
              color: "#666",
              border: "2px dashed #ddd",
            }}
          >
            <p style={{ margin: 0, fontSize: "16px" }}>
              📝 Aucune interaction enregistrée pour ce client.
            </p>
            <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
              Cliquez sur "Ajouter interaction" pour commencer le suivi.
            </p>
          </div>
        )}
      </div>

      {/* ✅ COMPOSANT ANALYSE IA */}
      <div style={{ marginTop: "30px" }}>
        <h3 style={{ marginBottom: "15px", color: "#333" }}>
          🤖 Analyse IA du Client
        </h3>
        {/* 🔍 DEBUG: Affichage des données transmises */}
        <div
          style={{
            backgroundColor: "#e8f4fd",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "1px solid #bee5eb",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#0c5460" }}>
            🔍 Données Debug pour l'IA:
          </h4>
          <div style={{ fontSize: "12px", fontFamily: "monospace" }}>
            <p>
              <strong>Client ID:</strong> {client._id}
            </p>
            <p>
              <strong>Budget:</strong> {client.estimatedBudget || "❌ Manquant"}
            </p>
            <p>
              <strong>Taille:</strong> {client.companySize || "❌ Manquant"}
            </p>
            <p>
              <strong>Score:</strong> {client.goodForCustomer || "❌ Manquant"}
            </p>
            <p>
              <strong>Ancien client:</strong>{" "}
              {client.hasWorkedWithUs ? "✅ Oui" : "❌ Non"}
            </p>
            <p>
              <strong>Nous connaît:</strong>{" "}
              {client.knowsUs ? "✅ Oui" : "❌ Non"}
            </p>
            <p>
              <strong>Interactions:</strong> {localInteractions.length} (
              {localInteractions.length > 0 ? "✅ OK" : "❌ Aucune"})
            </p>
            <p>
              <strong>Secteur:</strong> {client.sector || "❌ Manquant"}
            </p>
            <p>
              <strong>Actif:</strong>{" "}
              {client.isActive !== false ? "✅ Oui" : "❌ Non"}
            </p>
          </div>
        </div>
        <AIAnalysis clientId={client._id} clientName={client.name} />
      </div>

      {/* Boutons d'action */}
      <div style={{ marginTop: "30px", display: "flex", gap: "12px" }}>
        <ActionButton
          onClick={() =>
            router.push(
              `/dashboard/pipeline/clients/edit/${client.company}/${client._id}`
            )
          }
          variant="primary"
          size="medium"
          customColor="#E9C46A"
        >
          ✏️ Modifier le client
        </ActionButton>
        <ActionButton
          onClick={() =>
            router.push(`/dashboard/pipeline/clients/opportunity/${client._id}`)
          }
          variant="primary"
          size="medium"
          customColor="#A3B18A"
        >
          💼 Voir les opportunités
        </ActionButton>
      </div>
    </div>
  );
};

export default ClientDetail;
