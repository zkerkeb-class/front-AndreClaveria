"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateUser, getStoredUser } from "@/services/user.service";
import { gettingStartedStyles as styles } from "@/styles/getttingStartedStyles";

const GettingStartedPage = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Vérifications des champs obligatoires
    if (!firstName.trim() || !lastName.trim()) {
      setError("Le prénom et le nom sont requis");
      return;
    }

    // Vérification de la correspondance des mots de passe
    if (password && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Vérification du captcha (à implémenter plus tard)
    if (!captchaVerified) {
      // Pour le moment, on accepte sans vérification (placeholder)
      // setError("Veuillez valider le captcha");
      // return;
    }

    try {
      setLoading(true);

      // Récupérer les données utilisateur
      const userData = getStoredUser();

      if (!userData) {
        // Si l'utilisateur n'est pas dans localStorage, essayons de le récupérer directement
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
            // Préparation des données à mettre à jour
            const updateData: any = { firstName, lastName };

            // Ajouter le mot de passe si fourni
            if (password) {
              updateData.password = password;
            }

            // Appel au service pour mettre à jour l'utilisateur
            await updateUser(parsedUser._id, updateData);
            router.push("/dashboard");
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
          // Côté serveur, redirigeons vers la page d'authentification
          setError(
            "Session utilisateur non trouvée. Veuillez vous reconnecter."
          );
          router.push("/auth");
          return;
        }
      }

      // Préparation des données à mettre à jour
      const updateData: any = { firstName, lastName };

      // Ajouter le mot de passe si fourni
      if (password) {
        updateData.password = password;
      }

      // Appel au service pour mettre à jour l'utilisateur
      await updateUser(userData._id, updateData);

      // Rediriger vers le dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du profil:", err);
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Simuler la vérification du captcha
  const handleCaptchaVerification = () => {
    // À implémenter plus tard avec un vrai captcha
    setCaptchaVerified(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.logoContainer}>
          <Image
            src="/img/logo/logo_crew.png"
            alt="Logo Crew"
            width={100}
            height={100}
            style={styles.logo}
          />
        </div>

        <h2 style={styles.title}>Bienvenue chez CREW CRM</h2>

        <p style={styles.subtitle}>
          Veuillez compléter votre profil pour continuer
        </p>

        {error && <div style={styles.errorContainer}>{error}</div>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="firstName">
              Prénom
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              style={styles.input}
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="lastName">
              Nom
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              style={styles.input}
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Mot de passe (optionnel)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              style={styles.input}
              placeholder="Laissez vide pour conserver l'actuel"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              style={{
                ...styles.input,
                opacity: !password ? 0.5 : 1,
              }}
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!password}
            />
          </div>

          {/* Placeholder pour le captcha */}
          <div style={styles.captchaContainer}>
            <div style={styles.captchaHeader}>
              <label style={styles.captchaTitle}>Vérification CAPTCHA</label>
              <button
                type="button"
                onClick={handleCaptchaVerification}
                style={styles.captchaButton}
              >
                Valider
              </button>
            </div>
            <div style={styles.captchaPlaceholder}>
              [Emplacement pour CAPTCHA]
            </div>
            <p style={styles.captchaInfo}>
              Cliquez sur "Valider" pour simuler la vérification du CAPTCHA
            </p>
          </div>

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
      </div>
    </div>
  );
};

export default GettingStartedPage;
