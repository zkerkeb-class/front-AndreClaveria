"use client";

import ClientDetails from "@/components/clients/ClientDetails";

// Définir l'interface pour les paramètres
interface ClientPageParams {
  params: {
    clientId: string;
  };
}

// Pour Next.js Pages Router
export default function ClientDetailsPage({ params }: ClientPageParams) {
  return <ClientDetails params={Promise.resolve(params)} />;
}
