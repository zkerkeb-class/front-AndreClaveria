"use client";
import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  variant = "secondary",
  size = "medium",
  children,
}) => {
  // Définir les couleurs en fonction du variant
  const variantStyles = {
    primary: {
      backgroundColor: "#4c84ff",
      color: "white",
      border: "none",
    },
    secondary: {
      backgroundColor: "#f5f5f5",
      color: "#333",
      border: "1px solid #ddd",
    },
    success: {
      backgroundColor: "#e6f7e6",
      color: "#2e7d32",
      border: "none",
    },
    danger: {
      backgroundColor: "#ffebee",
      color: "#d32f2f",
      border: "none",
    },
    warning: {
      backgroundColor: "#fff8e1",
      color: "#ff8f00",
      border: "none",
    },
    info: {
      backgroundColor: "#e3f2fd",
      color: "#0277bd",
      border: "none",
    },
  };

  // Définir la taille du bouton
  const sizeStyles = {
    small: {
      padding: "4px 8px",
      fontSize: "12px",
    },
    medium: {
      padding: "6px 12px",
      fontSize: "14px",
    },
    large: {
      padding: "10px 16px",
      fontSize: "16px",
    },
  };

  const buttonStyle = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    fontWeight: 500,
  };

  return (
    <button onClick={onClick} disabled={disabled} style={buttonStyle}>
      {children}
    </button>
  );
};

export default ActionButton;
