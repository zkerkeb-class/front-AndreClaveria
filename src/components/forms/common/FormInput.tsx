// components/forms/common/IconInput.tsx
import { ChangeEvent } from "react";
import Image from "next/image";
import { pageStyles } from "@/styles/pageStyles";

interface IconInputProps {
  type: string;
  placeholder: string;
  icon: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const IconInput: React.FC<IconInputProps> = ({
  type,
  placeholder,
  icon,
  value,
  onChange,
  required,
}) => {
  return (
    <div style={pageStyles.inputContainer}>
      <Image
        src={icon}
        alt={`${placeholder} Icon`}
        width={20}
        height={20}
        style={pageStyles.logoInput}
      />
      <input
        type={type}
        placeholder={placeholder}
        style={pageStyles.input}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default IconInput;
