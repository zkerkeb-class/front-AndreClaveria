"use client";
import React from "react";
import TeamMembersManagement from "@/components/teams/TeamMembersManagement";

interface TeamMembersPageProps {
  params: {
    companyId: string;
    teamId: string;
  };
}

export default function TeamMembersPage({ params }: TeamMembersPageProps) {
  return <TeamMembersManagement params={params} />;
}
