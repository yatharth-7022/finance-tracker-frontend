import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-black dark:text-white"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn("input", error && "input-error", className)}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};
