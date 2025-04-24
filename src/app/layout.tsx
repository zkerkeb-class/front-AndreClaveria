import { ReactNode } from "react";
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
