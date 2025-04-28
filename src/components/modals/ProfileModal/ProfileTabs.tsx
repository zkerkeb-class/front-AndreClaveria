// components/modals/ProfileModal/ProfileTabs.tsx
import React from "react";
import { profileModalStyles } from "@/styles/components/profileModalStyles";
import { TabProps } from "./types";

const ProfileTabs: React.FC<TabProps> = ({
  activeTab,
  setActiveTab,
  tabStyle,
}) => {
  const handleTabClick = (tab: "info" | "password" | "edit") => {
    setActiveTab(tab);
  };

  return (
    <div style={profileModalStyles.sidebar}>
      <button style={tabStyle("info")} onClick={() => handleTabClick("info")}>
        <div style={profileModalStyles.tabIconContainer}>
          <span>ℹ️</span>
        </div>
        <span style={profileModalStyles.tabText}>
          Informations personnelles
        </span>
      </button>

      <button style={tabStyle("edit")} onClick={() => handleTabClick("edit")}>
        <div style={profileModalStyles.tabIconContainer}>
          <span>✏️</span>
        </div>
        <span style={profileModalStyles.tabText}>
          Modifier mes informations
        </span>
      </button>

      <button
        style={tabStyle("password")}
        onClick={() => handleTabClick("password")}
      >
        <div style={profileModalStyles.tabIconContainer}>
          <span>🔒</span>
        </div>
        <span style={profileModalStyles.tabText}>Mot de passe</span>
      </button>
    </div>
  );
};

export default ProfileTabs;
