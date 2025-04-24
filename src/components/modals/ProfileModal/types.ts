// components/modals/ProfileModal/types.ts
import { CSSProperties } from "react";
import {
  User,
  UpdateUserRequest,
  ChangePasswordRequest,
} from "@/services/user.service";

// Interface pour les propriétés de la modale principale
export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    phoneNumber?: string;
    role?: string;
    avatar?: string;
  };
  onUserUpdate?: (updatedData: User) => void;
}

// Interface pour les propriétés des onglets
export interface TabProps {
  activeTab: "info" | "password" | "edit";
  setActiveTab: (tab: "info" | "password" | "edit") => void;
  tabStyle: (tab: "info" | "password" | "edit") => CSSProperties;
}

// Interface pour les propriétés de l'onglet d'informations
export interface ProfileInfoProps {
  userData: ProfileModalProps["userData"];
}

// Interface pour les propriétés de l'onglet d'édition
export interface ProfileEditProps {
  userData: ProfileModalProps["userData"];
  userId: string;
  updateUserData: (userId: string, data: UpdateUserRequest) => Promise<User>;
  onUserUpdate?: (updatedData: User) => void;
}

// Interface pour les propriétés de l'onglet de mot de passe
export interface ProfilePasswordProps {
  userId: string;
  changePassword: (
    userId: string,
    data: ChangePasswordRequest
  ) => Promise<void>;
}

// Interface pour les propriétés de l'état d'erreur
export interface ProfileErrorStateProps {
  onClose: () => void;
  getCloseButtonStyle: () => CSSProperties;
  isCloseHovered: boolean;
  setIsCloseHovered: (isHovered: boolean) => void;
  handleModalClick: (e: React.MouseEvent) => void;
}
