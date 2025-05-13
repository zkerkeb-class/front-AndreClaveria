// /app/dashboard/[role]/manage/company/clients/[companyId]/opportunities/[clientId]/edit/[opportunityId]/page.tsx
"use client";
import React, { use } from "react";
import OpportunityForm from "@/components/forms/opportunity/OpportunityForm";

interface EditOpportunityProps {
  params: {
    role: string;
    companyId: string;
    clientId: string;
    opportunityId: string;
  };
}

const EditOpportunity: React.FC<EditOpportunityProps> = ({ params }) => {
  const { companyId, clientId, opportunityId, role } = params;

  return (
    <OpportunityForm
      mode="edit"
      companyId={companyId}
      clientId={clientId}
      opportunityId={opportunityId}
    />
  );
};

export default EditOpportunity;
