"use client"; // Si vous utilisez Next.js App Router

import UserDetails from "@/components/user/UserDetails";

// Définir l'interface pour les paramètres
interface UserPageParams {
  params: {
    userId: string;
  };
}

// Pour Next.js Pages Router
export default function UserDetailsPage({ params }: UserPageParams) {
  return <UserDetails params={Promise.resolve(params)} />;
}
