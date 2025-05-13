// /app/dashboard/[role]/manage/company/clients/[companyId]/opportunities/[clientId]/add/page.tsx
"use client";
import React, { use } from "react";
import OpportunityForm from "@/components/forms/opportunity/OpportunityForm";

interface CreateOpportunityProps {
  params: Promise<{
    role: string;
    companyId: string;
    clientId: string;
  }>;
}

const CreateOpportunity: React.FC<CreateOpportunityProps> = ({ params }) => {
  const unwrappedParams = use(params);
  // Déballer les paramètres
  // const { companyId, clientId, role } = unwrappedParams;
  const companyId = unwrappedParams.companyId;
  const clientId = unwrappedParams.clientId;
  // const role = unwrappedParams.role;

  return (
    <OpportunityForm mode="create" companyId={companyId} clientId={clientId} />
  );
};

export default CreateOpportunity;
