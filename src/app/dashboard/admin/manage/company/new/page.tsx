// /app/dashboard/admin/manage/company/create/page.tsx ou le chemin approprié
"use client";
import React from "react";
import CompanyForm from "@/components/forms/company/CompanyForm";

const CreateCompany: React.FC = () => {
  return <CompanyForm mode="create" />;
};

export default CreateCompany;
