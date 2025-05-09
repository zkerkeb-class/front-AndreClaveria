// /app/dashboard/[role]/manage/company/clients/[companyId]/opportunities/[clientId]/add/page.tsx
"use client";
import React, { use } from "react";
import OpportunityForm from "@/components/forms/opportunity/OpportunityForm";

interface CreateOpportunityProps {
  params: {
    role: string;
    companyId: string;
    clientId: string;
  };
}

const CreateOpportunity: React.FC<CreateOpportunityProps> = ({ params }) => {
  const { companyId, clientId, role } = params;

  return (
    <OpportunityForm mode="create" companyId={companyId} clientId={clientId} />
  );
};

export default CreateOpportunity;
