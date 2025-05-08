// /app/dashboard/admin/manage/company/teams/[companyId]/create/page.tsx ou le chemin approprié
"use client";
import React, { use } from "react";
import TeamForm from "@/components/forms/team/TeamForm";

interface CreateTeamProps {
  params: Promise<{
    companyId: string;
  }>;
}

const CreateTeam: React.FC<CreateTeamProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;

  return <TeamForm mode="create" companyId={companyId} />;
};

export default CreateTeam;
