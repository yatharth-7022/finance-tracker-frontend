import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui";
import { formatCurrency } from "../../lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(value)}
              </p>
              {trend && (
                <div className="flex items-center space-x-1">
                  <span
                    className={`text-xs font-medium ${
                      trend.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {trend.isPositive ? "+" : "-"}
                    {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    vs last month
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
