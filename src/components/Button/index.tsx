import { ReactNode } from "react";
import "./styles.scss";

type AuxProps = {
  children: ReactNode;
  disabled?: boolean;
};

export const Button = ({ children, disabled, ...props }: AuxProps) => {
  return (
    <button className="button" disabled={disabled} {...props}>
      {children}
    </button>
  );
};
