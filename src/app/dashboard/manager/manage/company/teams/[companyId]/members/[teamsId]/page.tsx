"use client";
import React, { use } from "react";
import TeamMembersManagement from "@/components/teams/TeamMembersManagement";

interface TeamMembersPageProps {
  params: Promise<{
    companyId: string;
    teamsId: string;
  }>;
}

export default function TeamMembersPage({ params }: TeamMembersPageProps) {
  return <TeamMembersManagement params={params} />;
}
