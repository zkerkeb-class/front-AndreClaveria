import React from "react";
import { companyDetailsStyles as styles } from "@/styles/pages/dashboard/admin/companyDetailStyles";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface CompanyHeaderProps {
  companyId: string;
  navigateBack: () => void;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  companyId,
  navigateBack,
}) => {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.pageTitle}>
          <FaArrowLeft style={{ cursor: "pointer" }} onClick={navigateBack} />
          Détails de l'entreprise
        </h1>
        <div style={styles.pageSubtitle}>
          Gestion et informations de l'entreprise
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <ActionButton
          onClick={() =>
            (window.location.href = `/dashboard/admin/manage/company/edit/${companyId}`)
          }
          variant="secondary"
          size="medium"
        >
          <FaEdit style={{ marginRight: "8px" }} />
          Modifier
        </ActionButton>
      </div>
    </div>
  );
};

export default CompanyHeader;
