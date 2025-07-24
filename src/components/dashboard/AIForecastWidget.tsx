import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, Button } from "../ui";
import { useForecast } from "../../hooks/useForecast";
import { formatCurrency } from "../../lib/utils";
import { AIForecastModal } from "./AIForecastModal";

export const AIForecastWidget: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: forecast,
    isLoading,
    error,
    hasMinimumTransactions,
    transactionCount,
    isCheckingRequirements,
  } = useForecast();

  // Show loading state while checking requirements
  if (isCheckingRequirements) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Insights
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Checking your transaction history...
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Show minimum transaction requirement message
  if (!hasMinimumTransactions) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                <Brain className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  AI Insights
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  More data needed
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                We need at least <strong>5 transactions</strong> to generate
                meaningful AI insights for you.
              </p>

              <div className="flex items-center space-x-2 text-sm">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((transactionCount / 5) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {transactionCount}/5
                </span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400">
                Add {5 - transactionCount} more transaction
                {5 - transactionCount !== 1 ? "s" : ""} to unlock AI-powered
                spending forecasts, personalized recommendations, and smart
                financial insights.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-purple-200 dark:bg-purple-700 rounded-lg"></div>
                <div className="h-6 bg-purple-200 dark:bg-purple-700 rounded w-32"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-purple-200 dark:bg-purple-700 rounded w-3/4"></div>
                <div className="h-4 bg-purple-200 dark:bg-purple-700 rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <Brain className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Insights
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Unable to generate forecast at the moment. Please try again later.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              size="sm"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!forecast) {
    return null;
  }

  const hasWarnings = forecast?.warnings && forecast.warnings.length > 0;
  const criticalWarnings =
    forecast?.warnings?.filter((w) => {
      // Handle both string and object formats
      if (typeof w === "string") {
        // For string warnings, consider them as medium severity
        return false; // No critical warnings for string format
      }
      return w?.severity === "critical";
    }) || [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 dark:from-purple-600/20 dark:to-blue-600/20 rounded-full -translate-y-16 translate-x-16"></div>

          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                    <span>AI Insights</span>
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    Powered by AI
                  </p>
                </div>
              </div>

              {hasWarnings && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      criticalWarnings.length > 0
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {forecast?.warnings?.length || 0} alert
                    {(forecast?.warnings?.length || 0) > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Projected Spending
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(forecast?.estimatedSpending || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Days Remaining
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {(() => {
                    // Calculate days remaining from API response
                    if (!forecast?.timeRange) return 0;

                    // Handle both API response formats: {start, end} and {startDate, endDate}
                    const endDate =
                      forecast.timeRange.end || forecast.timeRange.endDate;
                    if (!endDate) return 0;

                    const today = new Date();
                    const end = new Date(endDate);
                    const diffTime = end.getTime() - today.getTime();
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );

                    return Math.max(0, diffDays); // Don't return negative days
                  })()}{" "}
                  days
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Daily Average
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(forecast?.averageDailySpend || 0)}
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 group-hover:shadow-md transition-all duration-300"
              size="sm"
            >
              <span>View AI Analysis</span>
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <AIForecastModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        forecast={forecast}
        hasMinimumTransactions={hasMinimumTransactions}
        transactionCount={transactionCount}
      />
    </>
  );
};
