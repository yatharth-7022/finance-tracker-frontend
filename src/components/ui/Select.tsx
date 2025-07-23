import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  tooltip?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-black dark:text-white">
          {label}
        </label>
      )}

      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-gray-100",
            error &&
              "border-red-500 dark:border-red-400 focus-visible:ring-red-500 dark:focus-visible:ring-red-400",
            className
          )}
        >
          <span
            className={cn(
              selectedOption
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-xl max-h-60 overflow-auto"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  disabled={option.disabled}
                  title={option.tooltip}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100",
                    value === option.value &&
                      "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                    option.disabled &&
                      "hover:bg-transparent dark:hover:bg-transparent"
                  )}
                >
                  <span
                    className={cn(
                      option.disabled && "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {option.label}
                    {option.disabled && option.tooltip && (
                      <span className="block text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {option.tooltip}
                      </span>
                    )}
                  </span>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down">
          {error}
        </p>
      )}
    </div>
  );
};
