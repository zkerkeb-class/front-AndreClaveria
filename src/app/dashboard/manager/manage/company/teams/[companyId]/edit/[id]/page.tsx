// /app/dashboard/admin/manage/company/teams/[companyId]/edit/[id]/page.tsx ou le chemin approprié
"use client";
import React, { use } from "react";
import TeamForm from "@/components/forms/team/TeamForm";

interface EditTeamProps {
  params: Promise<{
    companyId: string;
    id: string;
  }>;
}

const EditTeam: React.FC<EditTeamProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;
  const teamId = unwrappedParams.id;

  return <TeamForm mode="edit" companyId={companyId} teamId={teamId} />;
};

export default EditTeam;
