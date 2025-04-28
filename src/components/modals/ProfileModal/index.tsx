"use client";
import React, { useState, MouseEvent, CSSProperties, useEffect } from "react";
import { profileModalStyles } from "@/styles/components/profileModalStyles";
import { useAuth } from "@/contexts/AuthContext";
import { changePassword } from "@/services/user.service";
import { ProfileModalProps } from "./types";

// Import des sous-composants
import ProfileTabs from "./ProfileTabs";
import ProfileInfo from "./ProfileInfo";
import ProfileEdit from "./ProfileEdit";
import ProfilePassword from "./ProfilePassword";
import ProfileErrorState from "./ProfileErrorState";

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  onUserUpdate,
}) => {
  const { user: authUser, updateUserData } = useAuth();

  const [activeTab, setActiveTab] = useState<"info" | "password" | "edit">(
    "info"
  );
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  const userId = authUser?._id || userData._id;

  // Ne rien rendre si la modale n'est pas ouverte
  if (!isOpen) return null;

  // Style pour les onglets actifs et inactifs
  const getTabStyle = (tab: "info" | "password" | "edit"): CSSProperties => ({
    ...profileModalStyles.tabButton,
    ...(activeTab === tab ? profileModalStyles.tabButtonActive : {}),
  });

  // Style pour le bouton de fermeture
  const getCloseButtonStyle = (): CSSProperties => ({
    ...profileModalStyles.closeButton,
    ...(isCloseHovered ? profileModalStyles.closeButtonHover : {}),
  });

  // Empêcher la propagation des clics dans la modale
  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  // Styles mis à jour pour la modale plus grande
  const updatedModalContainer: CSSProperties = {
    ...profileModalStyles.modalContainer,
    maxHeight: "85vh",
    minHeight: "540px",
  };

  const updatedMainContent: CSSProperties = {
    ...profileModalStyles.mainContent,
    minHeight: "450px",
  };

  // Si l'ID de l'utilisateur n'est pas disponible, afficher l'état d'erreur
  if (!userId) {
    return (
      <ProfileErrorState
        onClose={onClose}
        getCloseButtonStyle={getCloseButtonStyle}
        isCloseHovered={isCloseHovered}
        setIsCloseHovered={setIsCloseHovered}
        handleModalClick={handleModalClick}
      />
    );
  }

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

        <div style={profileModalStyles.contentContainer}>
          {/* Barre d'onglets latérale */}
          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabStyle={getTabStyle}
          />

          {/* Contenu principal qui change selon l'onglet actif */}
          <div style={updatedMainContent}>
            {activeTab === "info" && <ProfileInfo userData={userData} />}

            {activeTab === "edit" && (
              <ProfileEdit
                userData={userData}
                userId={userId}
                updateUserData={updateUserData}
                onUserUpdate={onUserUpdate}
              />
            )}

            {activeTab === "password" && (
              <ProfilePassword
                userId={userId}
                changePassword={changePassword}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
