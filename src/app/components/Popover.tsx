import { FC } from "react";

interface PopoverProps {
  trigger: any;
  content: any;
  isOpen?: boolean;
  className?: string;
}

export const Popover: FC<PopoverProps> = ({
  trigger,
  content,
  className = "bg-white p-3 rounded-lg shadow-lg",
  isOpen = false,
}) => {
  return (
    <div className="relative inline-block">
      {trigger}
      {isOpen && (
        <div
          className={`absolute z-50 mt-2 ${className}`}
          style={{ minWidth: "200px" }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
