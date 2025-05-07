"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmEmailStyles as styles } from "@/styles/pages/confirm-email/confirmEmailStyles";

const API_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:3002/api/auth";

const ConfirmEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Vérification de votre email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token de confirmation manquant.");
      return;
    }

    const confirmEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage("Votre email a été vérifié avec succès!");
          // Rediriger vers getting-started après 3 secondes
          setTimeout(() => {
            router.push("/getting-started");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            data.message || "Une erreur est survenue lors de la vérification."
          );
        }
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
        setStatus("error");
        setMessage(
          "Une erreur est survenue lors de la vérification de votre email."
        );
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  const getHeadingStyle = () => {
    if (status === "success") return styles.headingSuccess;
    if (status === "error") return styles.headingError;
    return styles.headingLoading;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          {status === "loading" && <div style={styles.loadingIcon}></div>}

          {status === "success" && (
            <svg
              style={styles.successIcon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}

          {status === "error" && (
            <svg
              style={styles.errorIcon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        <h2 style={getHeadingStyle()}>
          {status === "success"
            ? "Email vérifié"
            : status === "error"
            ? "Erreur de vérification"
            : "Vérification en cours"}
        </h2>

        <p style={styles.message}>{message}</p>

        {status === "success" && (
          <p style={styles.redirectMessage}>
            Vous allez être redirigé vers l'étape suivante dans quelques
            secondes...
          </p>
        )}

        {status === "error" && (
          <button onClick={() => router.push("/auth")} style={styles.button}>
            Retour à l'authentification
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
