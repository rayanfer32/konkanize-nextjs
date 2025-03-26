import { FC } from "react";

interface CardProps {
  children: any;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className }) => {
  const baseClass = "bg-white rounded-lg shadow-sm";
  const finalClass = className ? `${baseClass} ${className}` : baseClass;

  return <div className={finalClass}>{children}</div>;
};
