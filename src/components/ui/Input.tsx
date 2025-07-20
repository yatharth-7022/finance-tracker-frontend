import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  forceLight?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  forceLight = false,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-semibold",
            forceLight ? "text-black" : "text-black dark:text-white"
          )}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          forceLight
            ? "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-black ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            : "input",
          error && "input-error",
          className
        )}
        {...props}
      />
      {error && (
        <p
          className={cn(
            "text-sm animate-slide-down",
            forceLight ? "text-red-600" : "text-red-600 dark:text-red-400"
          )}
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          className={cn(
            "text-sm",
            forceLight ? "text-gray-500" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};
