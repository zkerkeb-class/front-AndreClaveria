// /components/form/company/CompanyGeneralInfo.tsx
import React from "react";
import { companyFormStyles as styles } from "@/styles/components/forms/CompanyFormStyles";

interface CompanyGeneralInfoProps {
  name: string;
  industry: string;
  description: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const CompanyGeneralInfo: React.FC<CompanyGeneralInfoProps> = ({
  name,
  industry,
  description,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Informations générales</h2>

      <div style={styles.twoColumnGrid}>
        <div>
          <label style={styles.label}>
            Nom de l'entreprise <span style={styles.requiredField}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>Secteur d'activité</label>
          <input
            type="text"
            name="industry"
            value={industry}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formGroupMt}>
        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          rows={4}
          style={styles.textarea}
        />
      </div>
    </div>
  );
};

export default CompanyGeneralInfo;
