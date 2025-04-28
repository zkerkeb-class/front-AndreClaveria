// components/forms/auth/ProfileSetupForm.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateUser,
  getStoredUser,
  verifyPassword,
} from "@/services/user.service";
import { gettingStartedStyles as styles } from "@/styles/pages/getttingStartedStyles";
import TextInput from "@/components/forms/common/TextInput";
import PasswordInput from "@/components/forms/common/PasswordInput";
import Captcha from "@/components/forms/common/Captcha";

const ProfileSetupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur s'est connecté via Google
    const checkUserSource = () => {
      const userData = getStoredUser();
      console.log("userData", userData);

      if (userData && userData.provider === "google") {
        setPasswordRequired(false);
      }
    };

    checkUserSource();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Vérifications des champs obligatoires
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Le prénom et le nom sont requis");
      return;
    }

    // Vérification du mot de passe actuel (sauf pour les connexions OAuth)
    if (passwordRequired && !formData.currentPassword) {
      setError(
        "Veuillez entrer votre mot de passe actuel pour confirmer votre identité"
      );
      return;
    }

    // Vérification de la correspondance des nouveaux mots de passe
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);

      // Récupérer les données utilisateur
      const userData = getStoredUser();

      if (!userData) {
        // Gérer le cas où l'utilisateur n'est pas dans le localStorage
        if (typeof window !== "undefined") {
          const userStr = localStorage.getItem("user");
          if (!userStr) {
            setError(
              "Session utilisateur non trouvée. Veuillez vous reconnecter."
            );
            router.push("/auth");
            return;
          }

          try {
            const parsedUser = JSON.parse(userStr);

            // Vérifier le mot de passe actuel si requis
            if (passwordRequired) {
              const isPasswordValid = await verifyPassword(
                parsedUser.email,
                formData.currentPassword
              );
              if (!isPasswordValid) {
                setError("Mot de passe actuel incorrect");
                setLoading(false);
                return;
              }
            }

            await updateUserProfile(parsedUser._id);
            return;
          } catch (parseError) {
            console.error(
              "Erreur de parsing des données utilisateur:",
              parseError
            );
            setError(
              "Erreur avec vos données de session. Veuillez vous reconnecter."
            );
            router.push("/auth");
            return;
          }
        } else {
          // Côté serveur, redirection vers la page d'authentification
          setError(
            "Session utilisateur non trouvée. Veuillez vous reconnecter."
          );
          router.push("/auth");
          return;
        }
      }

      // Vérifier le mot de passe actuel si requis
      if (passwordRequired) {
        const isPasswordValid = await verifyPassword(
          userData.email,
          formData.currentPassword
        );
        if (!isPasswordValid) {
          setError("Mot de passe actuel incorrect");
          setLoading(false);
          return;
        }
      }

      await updateUserProfile(userData._id);
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du profil:", err);
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string) => {
    // Préparation des données à mettre à jour
    const updateData: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    await updateUser(userId, updateData);

    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      password: "",
      confirmPassword: "",
    }));

    router.push("/dashboard");
  };
  return (
    <>
      {error && <div style={styles.errorContainer}>{error}</div>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <TextInput
          id="firstName"
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom"
          value={formData.firstName}
          onChange={handleChange}
          required
          styles={styles}
        />

        <TextInput
          id="lastName"
          name="lastName"
          label="Nom"
          placeholder="Votre nom"
          value={formData.lastName}
          onChange={handleChange}
          required
          styles={styles}
        />

        {passwordRequired && (
          <PasswordInput
            id="currentPassword"
            name="currentPassword"
            label="Mot de passe actuel"
            placeholder="Entrez votre mot de passe actuel pour confirmer"
            value={formData.currentPassword}
            onChange={handleChange}
            required={true}
            styles={styles}
          />
        )}

        <Captcha
          onVerify={() => setCaptchaVerified(true)}
          verified={captchaVerified}
          styles={styles}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitButton,
            ...(loading ? styles.submitButtonDisabled : {}),
          }}
        >
          {loading && (
            <span style={styles.spinner}>
              <svg
                className="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          )}
          {loading ? "Chargement..." : "Continuer vers le Dashboard"}
        </button>
      </form>
    </>
  );
};

export default ProfileSetupForm;
