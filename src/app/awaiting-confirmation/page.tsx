"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { awaitingConfirmationStyles as styles } from "@/styles/pages/awaiting-confirmation/awaitingConfirmationStyles";

const API_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:3002/api/auth";

const AwaitingConfirmationPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  useEffect(() => {
    // Récupérer l'email depuis le localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setEmail(userData.email || "");
    } else {
      router.push("/auth");
    }
  }, [router]);

  const handleResendEmail = async () => {
    if (!email) return;

    setLoading(true);
    setMessage("");
    setMessageType(null);

    try {
      // Récupérer un nouveau token de confirmation
      const response = await fetch(`${API_URL}/resend-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(
          "Un nouvel email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception."
        );
        setMessageType("success");
      } else {
        setMessage(
          "Erreur: " + (data.message || "Impossible d'envoyer l'email.")
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Une erreur s'est produite. Veuillez réessayer.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <Image
            src="/img/logo/logo_crew.png"
            alt="Logo Crew"
            width={100}
            height={100}
            style={styles.logo}
          />
        </div>

        <h2 style={styles.title}>Vérifiez votre email</h2>

        <p style={styles.subtitle}>
          Un email de confirmation a été envoyé à <strong>{email}</strong>.
          Veuillez cliquer sur le lien dans cet email pour activer votre compte
          et continuer.
        </p>

        {message && messageType && (
          <div
            style={
              messageType === "success"
                ? styles.alertSuccess
                : styles.alertError
            }
          >
            {message}
          </div>
        )}

        <div style={styles.buttonContainer}>
          <button
            onClick={handleResendEmail}
            disabled={loading}
            style={
              loading
                ? { ...styles.primaryButton, ...styles.primaryButtonDisabled }
                : styles.primaryButton
            }
          >
            {loading ? "Envoi en cours..." : "Renvoyer l'email de confirmation"}
          </button>

          <button
            onClick={() => router.push("/auth")}
            style={styles.secondaryButton}
          >
            Retour à l'authentification
          </button>
        </div>

        <p style={styles.footnote}>
          Si vous ne trouvez pas notre email, vérifiez votre dossier spam.
        </p>
      </div>
    </div>
  );
};

export default AwaitingConfirmationPage;
