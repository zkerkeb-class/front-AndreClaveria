"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { pageStyles } from "@/styles/pageStyles";
import { useAuth } from "@/contexts/AuthContext";
import Logo_Crew from "@public/img/logo/logo_crew.png";
import Background_Image from "@public/img/login/one_piece.jpg";
import Logo_User from "@public/img/login/email.svg";
import Logo_Password from "@public/img/login/password_img.svg";
import Logo_Google from "@public/img/login/google_img.svg";

const Login: React.FC = () => {
  const { login: authLogin, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Utilisation du contexte d'authentification
      await authLogin(email, password);
      // La redirection sera gérée automatiquement par le AuthProvider
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <main className="main">
      <div style={pageStyles.container}>
        <div style={pageStyles.imageWrapper}>
          <Image
            src={Background_Image}
            alt="One Piece Background"
            fill
            priority
            quality={100}
            style={pageStyles.image}
          />
          <div style={pageStyles.logoWrapper}>
            <Image
              src={Logo_Crew}
              alt="Logo Crew"
              width={80}
              height={80}
              style={pageStyles.logo}
            />
          </div>
          <div style={pageStyles.textWrapper}>
            <h1 style={pageStyles.title}>Crew</h1>
            <p style={pageStyles.subtitle}>Customer Relationship Management</p>
          </div>
        </div>

        <div style={pageStyles.formContainer}>
          <div style={pageStyles.wrapper}>
            <h2 style={pageStyles.title}>LOGIN</h2>
            <p
              style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}
            >
              Welcome on Board please connect to use the CRM
            </p>

            {error && (
              <div
                style={{
                  color: "#ff4d4f",
                  backgroundColor: "rgba(255, 77, 79, 0.1)",
                  padding: "10px",
                  borderRadius: "4px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <form style={pageStyles.form} onSubmit={handleSubmit}>
              <div style={pageStyles.inputContainer}>
                <Image
                  src={Logo_User}
                  alt="Email Icon"
                  width={20}
                  height={20}
                  style={pageStyles.logoInput}
                />
                <input
                  type="email"
                  placeholder="Email"
                  style={pageStyles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={pageStyles.inputContainer}>
                <Image
                  src={Logo_Password}
                  alt="Password Icon"
                  width={20}
                  height={20}
                  style={pageStyles.logoInput}
                />
                <input
                  type="password"
                  placeholder="Password"
                  style={pageStyles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  ...pageStyles.primaryButton,
                  opacity: loading || authLoading ? 0.7 : 1,
                  cursor: loading || authLoading ? "not-allowed" : "pointer",
                }}
                disabled={loading || authLoading}
              >
                {loading || authLoading ? "LOADING..." : "START"}
              </button>
            </form>

            <div style={pageStyles.loginOther}>Login with others</div>

            <button
              type="button"
              style={pageStyles.googleButton}
              onClick={handleGoogleLogin}
              disabled={loading || authLoading}
            >
              <Image
                src={Logo_Google}
                alt="Google Icon"
                width={20}
                height={20}
              />
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
