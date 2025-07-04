// components/ai/AIAnalysis.tsx
import React, { useState } from "react";
import { useClientAI } from "@/hooks/useAi";
import {
  formatAIScore,
  formatPriority,
  formatTimeframe,
  getScoreColor,
  getPriorityColor,
} from "@/services/ai.service";
import ActionButton from "@/components/common/ActionButton";

interface AIAnalysisProps {
  clientId: string;
  clientName: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ clientId, clientName }) => {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const {
    analysis,
    isAnalyzing,
    error,
    runAnalysis,
    clearError,
    lastAnalysisDate,
  } = useClientAI(clientId, false); // Pas d'auto-analyse

  const handleAnalyze = async () => {
    clearError();
    await runAnalysis(clientId);
  };

  const isAnalysisRecent =
    lastAnalysisDate &&
    Date.now() - lastAnalysisDate.getTime() < 24 * 60 * 60 * 1000; // 24h

  return (
    <div style={{ marginTop: "30px" }}>
      {/* Header avec bouton d'analyse */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            color: "#333",
            margin: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          🤖 Analyse IA
          {isAnalysisRecent && (
            <span
              style={{
                fontSize: "12px",
                backgroundColor: "#e8f5e8",
                color: "#2e7d2e",
                padding: "2px 6px",
                borderRadius: "4px",
                marginLeft: "10px",
              }}
            >
              Récente
            </span>
          )}
        </h3>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {lastAnalysisDate && (
            <span style={{ fontSize: "12px", color: "#666" }}>
              Dernière analyse: {lastAnalysisDate.toLocaleDateString()} à{" "}
              {lastAnalysisDate.toLocaleTimeString()}
            </span>
          )}

          <ActionButton
            onClick={handleAnalyze}
            variant="primary"
            size="medium"
            customColor="#8B5CF6"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span style={{ marginRight: "8px" }}>🔄</span>
                Analyse en cours...
              </>
            ) : (
              <>
                <span style={{ marginRight: "8px" }}>🤖</span>
                {analysis ? "Ré-analyser" : "Analyser avec IA"}
              </>
            )}
          </ActionButton>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "20px", marginRight: "10px" }}>❌</span>
            <strong style={{ color: "#d32f2f" }}>Erreur d'analyse IA</strong>
          </div>
          <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>{error}</p>
          <ActionButton onClick={clearError} variant="secondary" size="small">
            Masquer
          </ActionButton>
        </div>
      )}

      {/* Chargement */}
      {isAnalyzing && (
        <div
          style={{
            backgroundColor: "#f3e5f5",
            border: "2px solid #8B5CF6",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontSize: "40px" }}>🤖</span>
          </div>
          <h4 style={{ color: "#8B5CF6", margin: "0 0 10px 0" }}>
            Analyse IA en cours...
          </h4>
          <p style={{ color: "#666", margin: 0 }}>
            L'IA analyse les données de <strong>{clientName}</strong>
          </p>
          <div
            style={{
              marginTop: "15px",
              height: "4px",
              backgroundColor: "#e0e0e0",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor: "#8B5CF6",
                borderRadius: "2px",
                animation: "loading 2s ease-in-out infinite",
              }}
            />
          </div>
          <style>
            {`
              @keyframes loading {
                0% { width: 0%; margin-left: 0%; }
                50% { width: 50%; margin-left: 25%; }
                100% { width: 0%; margin-left: 100%; }
              }
            `}
          </style>
        </div>
      )}

      {/* Résultats de l'analyse */}
      {analysis && !isAnalyzing && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            border: "2px solid #8B5CF6",
            borderRadius: "12px",
            padding: "25px",
          }}
        >
          {/* Score principal */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <div>
              <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>Score IA</h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                {formatAIScore(analysis.score)}
              </p>
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: getScoreColor(analysis.score),
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {analysis.score}/100
              <span style={{ fontSize: "24px" }}>
                {analysis.score >= 80
                  ? "🎯"
                  : analysis.score >= 60
                  ? "👍"
                  : analysis.score >= 40
                  ? "⚠️"
                  : "⚠️"}
              </span>
            </div>
          </div>

          {/* Informations clés */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <h5
                style={{ margin: "0 0 8px 0", color: "#333", fontSize: "14px" }}
              >
                🎯 Priorité
              </h5>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  backgroundColor: getPriorityColor(analysis.priority) + "20",
                  color: getPriorityColor(analysis.priority),
                }}
              >
                {formatPriority(analysis.priority)}
              </span>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <h5
                style={{ margin: "0 0 8px 0", color: "#333", fontSize: "14px" }}
              >
                ⏰ Délai recommandé
              </h5>
              <span style={{ fontSize: "14px", color: "#666" }}>
                {formatTimeframe(analysis.timeframe)}
              </span>
            </div>
          </div>

          {/* Prochaine action */}
          <div
            style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              marginBottom: "15px",
            }}
          >
            <h5
              style={{ margin: "0 0 8px 0", color: "#333", fontSize: "14px" }}
            >
              🎯 Prochaine action recommandée
            </h5>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#444",
                fontWeight: "500",
              }}
            >
              {analysis.nextAction}
            </p>
          </div>

          {/* Recommandation */}
          <div
            style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              marginBottom: "15px",
            }}
          >
            <h5
              style={{ margin: "0 0 8px 0", color: "#333", fontSize: "14px" }}
            >
              💡 Recommandation
            </h5>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.5",
              }}
            >
              {analysis.recommendation}
            </p>
          </div>

          {/* Bouton pour afficher le raisonnement complet */}
          <div style={{ textAlign: "center" }}>
            <ActionButton
              onClick={() => setShowFullAnalysis(!showFullAnalysis)}
              variant="secondary"
              size="small"
            >
              {showFullAnalysis
                ? "Masquer le détail"
                : "Voir le raisonnement IA"}
              <span style={{ marginLeft: "5px" }}>
                {showFullAnalysis ? "🔼" : "🔽"}
              </span>
            </ActionButton>
          </div>

          {/* Raisonnement détaillé */}
          {showFullAnalysis && (
            <div
              style={{
                marginTop: "15px",
                backgroundColor: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <h5
                style={{
                  margin: "0 0 10px 0",
                  color: "#333",
                  fontSize: "14px",
                }}
              >
                🧠 Raisonnement IA détaillé
              </h5>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#555",
                  lineHeight: "1.6",
                  fontStyle: "italic",
                }}
              >
                {analysis.reasoning}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Message si pas encore d'analyse */}
      {!analysis && !isAnalyzing && !error && (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontSize: "48px" }}>🤖</span>
          </div>
          <h4 style={{ color: "#666", margin: "0 0 10px 0" }}>
            Aucune analyse IA disponible
          </h4>
          <p style={{ color: "#888", margin: "0 0 20px 0", fontSize: "14px" }}>
            Cliquez sur "Analyser avec IA" pour obtenir une analyse intelligente
            de ce client
          </p>
          <p style={{ color: "#aaa", margin: 0, fontSize: "12px" }}>
            L'IA analysera les données du client et fournira des recommandations
            personnalisées
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
