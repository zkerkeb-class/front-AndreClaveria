import React, { useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import { updateClient } from "@/services/client.service";

interface ToggleClientStatusProps {
  clientId: string;
  isActive: boolean;
  onStatusChange: (newStatus: boolean) => void;
}

const ToggleClientStatus: React.FC<ToggleClientStatusProps> = ({
  clientId,
  isActive,
  onStatusChange,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleStatus = async () => {
    setIsUpdating(true);
    try {
      await updateClient(clientId, { isActive: !isActive });
      onStatusChange(!isActive);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("Erreur lors de la mise à jour du statut du client");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ActionButton
      onClick={toggleStatus}
      variant={isActive ? "warning" : "success"}
      size="medium"
      disabled={isUpdating}
    >
      {isUpdating ? "Mise à jour..." : isActive ? "Désactiver" : "Activer"}
    </ActionButton>
  );
};

export default ToggleClientStatus;
