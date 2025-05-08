// /app/dashboard/admin/manage/company/edit/[id]/page.tsx ou le chemin approprié
"use client";
import React from "react";
import CompanyForm from "@/components/forms/company/CompanyForm";
import { use } from "react";

interface EditCompanyPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditCompany: React.FC<EditCompanyPageProps> = ({ params }) => {
  // Déballer les paramètres avec React.use()
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.id;

  return <CompanyForm mode="edit" companyId={companyId} />;
};

export default EditCompany;
