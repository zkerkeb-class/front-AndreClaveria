import { useEffect } from "react";
import { useRouter } from "next/router";
import { pageStyles } from "../../styles/pageStyles";

const GoogleCallback: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Cette fonction s'exécute côté client après le rendu
    const handleCallback = async () => {
      const { code, state } = router.query;

      if (!code) return; // Attendre que la query soit disponible

      try {
        // Récupérer le token à partir de l'API backend
        // Le backend doit avoir une route qui échange le code contre un token
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, state }),
          }
        );

        if (!response.ok) {
          throw new Error("Échec de l'authentification");
        }

        const data = await response.json();

        // Stocker le token JWT et les informations utilisateur
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Rediriger vers le dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Erreur d'authentification Google:", error);
        router.push("/login?error=auth_failed");
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

  return (
    <div style={pageStyles.loadingContainer}>
      <h2 style={pageStyles.loadingText}>Authentification en cours...</h2>
      <div style={pageStyles.spinner}></div>
    </div>
  );
};

export default GoogleCallback;
