import { ReactNode } from "react";
import Navbar from "../components/NavBar/page";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Crew CRM",
  description: "Customer Relation Management",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          {/* Navbar sera rendue conditionnellement dans chaque page en fonction 
              de l'état d'authentification depuis le contexte */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
