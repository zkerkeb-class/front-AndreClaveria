// /components/forms/opportunities/OpportunityAssignmentSection.tsx
import React from "react";
import { opportunityFormStyles as styles } from "@/styles/components/forms/OpportunityFormStyles";
import { User } from "@/services/user.service";

interface OpportunityAssignmentSectionProps {
  assignedTo: string;
  users: User[];
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const OpportunityAssignmentSection: React.FC<
  OpportunityAssignmentSectionProps
> = ({ assignedTo, users, handleChange }) => {
  return (
    <div style={styles.sectionContainer}>
      <h3 style={styles.subSectionTitle}>Responsable</h3>

      <div style={styles.formGroup}>
        <label htmlFor="assignedTo" style={styles.label}>
          Personne en charge
        </label>
        <select
          id="assignedTo"
          name="assignedTo"
          value={assignedTo}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Sélectionner un responsable</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName} - {user.role}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OpportunityAssignmentSection;
