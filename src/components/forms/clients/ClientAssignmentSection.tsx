// /components/form/client/ClientAssignmentSection.tsx
import React from "react";
import { clientFormStyles as styles } from "@/styles/components/forms/ClientFormStyles";
import { User } from "@/services/user.service";
import { Team } from "@/services/team.service";

interface ClientAssignmentSectionProps {
  assignedTo: string;
  team: string;
  users: User[];
  teams: Team[];
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const ClientAssignmentSection: React.FC<ClientAssignmentSectionProps> = ({
  assignedTo,
  team,
  users,
  teams,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Attribution</h2>

      <div style={styles.flexRow}>
        <div style={styles.flexColumn}>
          <label style={styles.label}>Responsable</label>
          <select
            name="assignedTo"
            value={assignedTo}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Non assigné</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {`${user.firstName} ${user.lastName} (${user.email})`}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.flexColumn}>
          <label style={styles.label}>Équipe</label>
          <select
            name="team"
            value={team}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Aucune équipe</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ClientAssignmentSection;
