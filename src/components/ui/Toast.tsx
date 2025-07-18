import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { cn } from "../../lib/utils";

export type ToastType = "success" | "error" | "warning";

interface ToastProps {
  isVisible: boolean;
  type: ToastType;
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  isVisible,
  type,
  title,
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className={cn("p-4 rounded-lg border shadow-lg", colors[type])}>
            <div className="flex items-start">
              <Icon
                className={cn(
                  "h-5 w-5 mt-0.5 mr-3 flex-shrink-0",
                  iconColors[type]
                )}
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{title}</p>
                {message && (
                  <p className="text-sm mt-1 opacity-90">{message}</p>
                )}
              </div>

              <button
                onClick={onClose}
                className="ml-3 flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
