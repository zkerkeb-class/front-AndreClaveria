// pages/dashboard/company/[companyId].tsx ou app/dashboard/company/[companyId]/page.tsx
"use client"; // Si vous utilisez Next.js App Router

import CompanyDetails from "@/components/company/CompanyDetails";

// Définir l'interface pour les paramètres
interface CompanyPageParams {
  params: {
    companyId: string;
  };
}

// Pour Next.js Pages Router
export default function CompanyDetailsPage({ params }: CompanyPageParams) {
  return <CompanyDetails params={Promise.resolve(params)} />;
}
