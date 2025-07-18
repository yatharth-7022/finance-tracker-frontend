import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-10 w-20 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900",
        isDark
          ? "bg-gray-700 hover:bg-gray-600"
          : "bg-gray-200 hover:bg-gray-300",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Track */}
      <span className="sr-only">Toggle theme</span>

      {/* Sliding circle */}
      <motion.span
        layout
        className={cn(
          "inline-block h-8 w-8 transform rounded-full shadow-lg transition-transform duration-300 ease-in-out",
          isDark ? "bg-gray-900 translate-x-11" : "bg-white translate-x-1"
        )}
        animate={{
          x: isDark ? 44 : 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Icon container */}
        <span className="flex h-full w-full items-center justify-center">
          {isDark ? (
            <Moon className="h-4 w-4 text-yellow-400" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500" />
          )}
        </span>
      </motion.span>
    </button>
  );
};
