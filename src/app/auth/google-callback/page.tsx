// app/auth/google-callback/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingOverlay from "@/components/common/LoadingOverlay";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoadingWithMessage } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        setLoadingWithMessage(true, "Finalisation de la connexion Google...");

        // Récupérer les paramètres de l'URL
        const token = searchParams.get("token");
        const userStr = searchParams.get("user");

        if (!token || !userStr) {
          console.error("Token ou données utilisateur manquants");
          router.push("/auth?error=invalid_callback");
          return;
        }

        // Parser les données utilisateur
        const user = JSON.parse(decodeURIComponent(userStr));

        // Stocker dans localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Vérifier si le profil est complet
        if (user.firstName && user.lastName) {
          router.push("/dashboard");
        } else {
          router.push("/getting-started");
        }
      } catch (error) {
        console.error("Erreur lors du traitement du callback Google:", error);
        router.push("/auth?error=callback_processing");
      } finally {
        setLoadingWithMessage(false);
      }
    };

    handleGoogleCallback();
  }, [router, searchParams, setLoadingWithMessage]);

  return (
    <LoadingOverlay
      isVisible={true}
      message="Finalisation de la connexion Google..."
    />
  );
}
