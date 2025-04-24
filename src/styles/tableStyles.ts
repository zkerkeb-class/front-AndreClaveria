import { CSSProperties } from "react";

export interface TableStyleProps {
  variant?: "default" | "striped" | "bordered" | "compact";
  headerStyle?: "light" | "dark" | "primary";
  rounded?: boolean;
  borderless?: boolean;
  width?: string;
  maxWidth?: string;
  centered?: boolean;
}

export const tableStyles = (props: TableStyleProps = {}) => {
  const {
    variant = "striped",
    headerStyle = "light",
    rounded = true,
    borderless = false,
    width = "100%",
    maxWidth = "1200px",
    centered = true,
  } = props;

  // Styles de base du conteneur
  const containerStyle: CSSProperties = {
    width: width,
    maxWidth: maxWidth,
    margin: centered ? "0 auto" : undefined,
    overflowX: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    borderRadius: rounded ? "8px" : "0",
  };

  // Styles de base du tableau
  const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    overflow: "hidden",
    border: borderless ? "none" : "1px solid #e0e0e0",
  };

  // Styles d'en-tête selon le thème
  const getHeaderStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      padding: variant === "compact" ? "8px 12px" : "16px",
      textAlign: "left",
      fontWeight: 600,
      borderBottom: borderless ? "none" : "2px solid #e0e0e0",
    };

    switch (headerStyle) {
      case "dark":
        return {
          ...baseStyle,
          backgroundColor: "#333",
          color: "#fff",
        };
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: "#4c84ff",
          color: "#fff",
        };
      case "light":
      default:
        return {
          ...baseStyle,
          backgroundColor: "#f5f5f5",
          color: "#333",
        };
    }
  };

  // Styles des cellules
  const cellStyle = (isEven: boolean = false): CSSProperties => {
    const baseStyle: CSSProperties = {
      padding: variant === "compact" ? "8px 12px" : "14px 16px",
      borderBottom: borderless ? "none" : "1px solid #e0e0e0",
    };

    // Appliquer des couleurs alternées en fonction du variant
    if (variant === "striped" && isEven) {
      return {
        ...baseStyle,
        backgroundColor: "#f9f9f9",
      };
    }

    return baseStyle;
  };

  // Style pour les lignes
  const rowStyle = (isEven: boolean = false): CSSProperties => {
    return {
      transition: "background-color 0.2s",

      backgroundColor: variant === "striped" && isEven ? "#f9f9f9" : "white",
    };
  };

  // Styles pour les actions sur la dernière colonne
  const actionsCellStyle: CSSProperties = {
    padding: variant === "compact" ? "4px 8px" : "8px 12px",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  return {
    containerStyle,
    tableStyle,
    headerStyle: getHeaderStyle(),
    rowStyle,
    cellStyle,
    actionsCellStyle,
  };
};

// Pour faciliter l'utilisation avec les tables génériques
export const tableStyleProps: TableStyleProps = {
  variant: "striped",
  headerStyle: "light",
  rounded: true,
  borderless: false,
  width: "100%",
  maxWidth: "1200px",
  centered: true,
};
