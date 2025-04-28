// components/modals/ProfileModal/ProfileEdit.tsx
import React, { useState, useEffect } from "react";
import { profileModalStyles } from "@/styles/components/profileModalStyles";
import { ProfileEditProps } from "./types";
import { UpdateUserRequest } from "@/services/user.service";

const ProfileEdit: React.FC<ProfileEditProps> = ({
  userData,
  userId,
  updateUserData,
  onUserUpdate,
}) => {
  const [editData, setEditData] = useState<UpdateUserRequest>({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phoneNumber: userData.phoneNumber || userData.phone || "",
  });

  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Mettre à jour les données si userData change
  useEffect(() => {
    setEditData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber || userData.phone || "",
    });
  }, [userData]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setEditError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(null);

    // Validation basique
    if (!editData.firstName || !editData.lastName || !editData.email) {
      setEditError("Les champs Nom, Prénom et Email sont obligatoires.");
      return;
    }

    // Validation de l'email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      setEditError("Veuillez saisir une adresse email valide.");
      return;
    }

    try {
      setIsEditSubmitting(true);

      // Préparer les données à envoyer
      const dataToUpdate: UpdateUserRequest = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phoneNumber: editData.phoneNumber || undefined,
      };

      // Utiliser la fonction pour mettre à jour l'utilisateur
      const updatedUser = await updateUserData(userId, dataToUpdate);

      // Mettre à jour les données locales avec les nouvelles valeurs
      setEditData({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber || "",
      });

      // Appeler le callback onUserUpdate si fourni
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      setEditSuccess("Vos informations ont été mises à jour avec succès.");
    } catch (error: any) {
      setEditError(
        error.message || "Erreur lors de la mise à jour des informations."
      );
    } finally {
      setIsEditSubmitting(false);
    }
  };

  return (
    <div>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 500,
          marginBottom: "20px",
        }}
      >
        Modifier mes informations
      </h3>

      {/* Messages d'erreur et de succès */}
      {editError && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            color: "#B91C1C",
            padding: "10px 12px",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          {editError}
        </div>
      )}

      {editSuccess && (
        <div
          style={{
            backgroundColor: "#DCFCE7",
            color: "#166534",
            padding: "10px 12px",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          {editSuccess}
        </div>
      )}

      <form onSubmit={handleEditSubmit}>
        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>Prénom *</label>
          <input
            type="text"
            name="firstName"
            value={editData.firstName}
            onChange={handleEditChange}
            style={profileModalStyles.inputField}
            required
          />
        </div>

        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>Nom *</label>
          <input
            type="text"
            name="lastName"
            value={editData.lastName}
            onChange={handleEditChange}
            style={profileModalStyles.inputField}
            required
          />
        </div>

        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>Email *</label>
          <input
            type="email"
            name="email"
            value={editData.email}
            onChange={handleEditChange}
            style={profileModalStyles.inputField}
            required
          />
        </div>

        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>Téléphone</label>
          <input
            type="tel"
            name="phoneNumber"
            value={editData.phoneNumber || ""}
            onChange={handleEditChange}
            style={profileModalStyles.inputField}
            placeholder="Ex: 06 12 34 56 78"
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              ...profileModalStyles.buttonPrimary,
              opacity: isEditSubmitting ? 0.7 : 1,
              cursor: isEditSubmitting ? "not-allowed" : "pointer",
            }}
            disabled={isEditSubmitting}
          >
            {isEditSubmitting
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: "30px",
          padding: "12px",
          backgroundColor: "#F3F4F6",
          borderRadius: "4px",
        }}
      >
        <p style={{ fontSize: "13px", color: "#4B5563" }}>
          <strong>Note :</strong> Les champs marqués d'un astérisque (*) sont
          obligatoires.
        </p>
      </div>
    </div>
  );
};

export default ProfileEdit;
