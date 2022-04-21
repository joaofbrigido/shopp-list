import { ReactNode } from "react";
import "./styles.scss";

type AuxProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export const Button = ({ children, onClick, disabled }: AuxProps) => {
  return (
    <button className="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
