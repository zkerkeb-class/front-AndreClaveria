// components/modals/ProfileModal/ProfileInfo.tsx
import React, { useState } from "react";
import { profileModalStyles } from "@/styles/components/profileModalStyles";
import { ProfileInfoProps } from "./types";

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userData }) => {
  const [language, setLanguage] = useState("Français");

  // Générer les initiales pour l'avatar si pas d'image
  const initials = `${userData.firstName?.charAt(0) || ""}${
    userData.lastName?.charAt(0) || ""
  }`;

  return (
    <div>
      {/* Avatar et nom */}
      <div style={profileModalStyles.profileHeader}>
        <div style={profileModalStyles.avatar}>
          {userData.avatar ? (
            <img
              src={userData.avatar}
              alt="Avatar"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
              }}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div style={profileModalStyles.profileInfo}>
          <h3 style={profileModalStyles.profileName}>
            {`${userData.firstName} ${userData.lastName}`}
          </h3>
          <span style={profileModalStyles.roleBadge}>
            {userData.role === "admin"
              ? "Admin"
              : userData.role === "manager"
              ? "Manager"
              : "Utilisateur"}
          </span>
        </div>
      </div>

      {/* Email */}
      <div style={profileModalStyles.formField}>
        <label style={profileModalStyles.fieldLabel}>Email</label>
        <p style={profileModalStyles.fieldValue}>{userData.email}</p>
      </div>

      {/* Téléphone */}
      <div style={profileModalStyles.formField}>
        <label style={profileModalStyles.fieldLabel}>Téléphone</label>
        <p style={profileModalStyles.fieldValue}>
          {userData.phone || userData.phoneNumber || "Non renseigné"}
        </p>
      </div>

      {/* Langue */}
      <div style={{ ...profileModalStyles.formField, marginTop: "30px" }}>
        <label
          style={{
            ...profileModalStyles.fieldLabel,
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          Langue d'affichage
        </label>
        <div style={profileModalStyles.languageContainer}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              ...profileModalStyles.select,
              padding: "8px 12px",
              minWidth: "150px",
            }}
          >
            <option>Français</option>
            <option>English</option>
            <option>Español</option>
            <option>Deutsch</option>
          </select>
          <button style={{ ...profileModalStyles.button, padding: "8px 16px" }}>
            Appliquer
          </button>
        </div>
        <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "8px" }}>
          Cette langue sera utilisée dans toute l'interface du CRM.
        </p>
      </div>
    </div>
  );
};

export default ProfileInfo;
