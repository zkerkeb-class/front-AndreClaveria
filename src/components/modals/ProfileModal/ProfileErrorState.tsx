// components/modals/ProfileModal/ProfileErrorState.tsx
import React from "react";
import { profileModalStyles } from "@/styles/profileModalStyles";
import { ProfileErrorStateProps } from "./types";

const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({
  onClose,
  getCloseButtonStyle,
  isCloseHovered,
  setIsCloseHovered,
  handleModalClick,
}) => {
  // Styles pour le contenu principal
  const updatedModalContainer = {
    ...profileModalStyles.modalContainer,
    maxHeight: "85vh",
    minHeight: "540px",
  };

  const updatedMainContent = {
    ...profileModalStyles.mainContent,
    minHeight: "450px",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };

  return (
    <div style={profileModalStyles.overlay} onClick={onClose}>
      <div style={updatedModalContainer} onClick={handleModalClick}>
        <div style={profileModalStyles.modalHeader}>
          <h2 style={profileModalStyles.modalTitle}>Profil</h2>
          <button
            style={getCloseButtonStyle()}
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div style={updatedMainContent}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#FEF2F2",
              borderRadius: "8px",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#B91C1C", marginBottom: "12px" }}>
              Erreur d'identification
            </h3>
            <p style={{ marginBottom: "16px" }}>
              Impossible de charger les informations de votre profil. Votre
              session a peut-être expiré.
            </p>
            <button
              onClick={() => (window.location.href = "/auth")}
              style={{
                backgroundColor: "#3B82F6",
                color: "white",
                borderWidth: 0,
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Se reconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileErrorState;
