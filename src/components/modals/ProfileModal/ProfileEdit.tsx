// components/modals/ProfileModal/ProfileEdit.tsx
import React, { useState, useEffect } from "react";
import { profileModalStyles } from "@/styles/components/modals/ProfileModal/profileModalStyles";
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

    if (!editData.firstName || !editData.lastName || !editData.email) {
      setEditError("Les champs Nom, Prénom et Email sont obligatoires.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      setEditError("Veuillez saisir une adresse email valide.");
      return;
    }

    try {
      setIsEditSubmitting(true);

      const dataToUpdate: UpdateUserRequest = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phoneNumber: editData.phoneNumber || undefined,
      };

      const updatedUser = await updateUserData(userId, dataToUpdate);

      setEditData({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber || "",
      });

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
      <h2 style={profileModalStyles.h2}>Modifier mes informations</h2>
      {editError && <div style={profileModalStyles.error}>{editError}</div>}

      {editSuccess && (
        <div style={profileModalStyles.sucess}>{editSuccess}</div>
      )}

      <form onSubmit={handleEditSubmit}>
        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>Prénom*</label>
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
          <label style={profileModalStyles.fieldLabel}>Nom*</label>
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
          <label style={profileModalStyles.fieldLabel}>Email*</label>
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

        <div>
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
    </div>
  );
};

export default ProfileEdit;
