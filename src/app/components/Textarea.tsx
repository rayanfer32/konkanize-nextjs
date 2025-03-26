import { FC } from "react";

export const Textarea: FC<any> = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  ...rest
}) => {
  const baseClass =
    "w-full resize-none rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const finalClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <textarea
      value={value}
      onInput={onChange}
      placeholder={placeholder}
      className={finalClass}
      {...rest}
    />
  );
};
