import React from "react";
import { cn } from "../../lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-semibold text-black dark:text-white"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none text-gray-900 dark:text-gray-100",
          error &&
            "border-red-500 dark:border-red-400 focus-visible:ring-red-500 dark:focus-visible:ring-red-400",
          className
        )}
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
