import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Calendar,
  DollarSign,
  Target,
  Clock,
  Sparkles,
} from "lucide-react";
import { Modal, Card, CardContent, Button } from "../ui";
import { formatCurrency } from "../../lib/utils";
import type { MonthlyForecast } from "../../types";

interface AIForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  forecast: MonthlyForecast | null;
  hasMinimumTransactions?: boolean;
  transactionCount?: number;
}

const getPriorityColor = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200";
    case "medium":
      return "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";
    case "low":
      return "bg-sky-100 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200";
    default:
      return "bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200";
  }
};

export const AIForecastModal: React.FC<AIForecastModalProps> = ({
  isOpen,
  onClose,
  forecast,
  hasMinimumTransactions = true,
  transactionCount = 0,
}) => {
  // Handle minimum transaction requirement
  if (!hasMinimumTransactions) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="relative max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                  <Brain className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    AI Financial Insights
                  </h2>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    More data needed for analysis
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center mb-4">
                    <Brain className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Building Your Financial Profile
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We need at least <strong>5 transactions</strong> to generate
                    meaningful AI insights and forecasts for your spending
                    patterns.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {transactionCount}/5 transactions
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (transactionCount / 5) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add {5 - transactionCount} more transaction
                    {5 - transactionCount !== 1 ? "s" : ""} to unlock:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Spending forecasts</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span>Smart recommendations</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span>Spending alerts</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span>Budget insights</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <Button onClick={onClose} variant="secondary" className="w-full">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // Return early if no forecast data
  if (!forecast) {
    return null;
  }

  // Add safety checks for forecast data
  const totalSpent = forecast.totalSpentSoFar || 0;
  const estimatedSpending = forecast.estimatedSpending || 1; // Avoid division by zero

  // Calculate days remaining from API response
  const calculateDaysRemaining = () => {
    if (!forecast?.timeRange) return 0;

    // Handle both API response formats: {start, end} and {startDate, endDate}
    const endDate = forecast.timeRange.end || forecast.timeRange.endDate;
    if (!endDate) return 0;

    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays); // Don't return negative days
  };

  const daysRemaining = calculateDaysRemaining();

  const spendingProgress = (totalSpent / estimatedSpending) * 100;
  const timeProgress = ((30 - daysRemaining) / 30) * 100;
  const isOnTrack = spendingProgress <= timeProgress + 10; // 10% tolerance

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <span>AI Financial Forecast</span>
                <Sparkles className="h-5 w-5 text-purple-500" />
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generated{" "}
                {forecast?.generatedAt
                  ? new Date(forecast.generatedAt).toLocaleDateString()
                  : "Unknown"}{" "}
                at{" "}
                {forecast?.generatedAt
                  ? new Date(forecast.generatedAt).toLocaleTimeString()
                  : "Unknown"}
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Projected Spending
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {formatCurrency(estimatedSpending)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Spent So Far
                    </p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatCurrency(totalSpent)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                      Days Remaining
                    </p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {daysRemaining}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Tracking */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Spending Progress
                </h3>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isOnTrack
                      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                      : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                  }`}
                >
                  {isOnTrack ? "On Track" : "Over Budget"}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Spending Progress
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {spendingProgress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        spendingProgress > timeProgress + 10
                          ? "bg-red-500"
                          : spendingProgress > timeProgress
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(spendingProgress, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Time Progress
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {timeProgress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(timeProgress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {forecast.warnings && forecast.warnings.length > 0 && (
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                    Alerts & Warnings
                  </h3>
                </div>
                <div className="space-y-3">
                  {forecast.warnings.map((warning, index) => {
                    // Handle both string and object formats
                    const isString = typeof warning === "string";
                    const warningText = isString
                      ? warning
                      : warning.message || "No message available";
                    const warningType = isString
                      ? "Warning"
                      : warning.type
                      ? warning.type.replace(/_/g, " ")
                      : "Warning";

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      >
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800 dark:text-red-200 capitalize">
                            {warningType}
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            {warningText}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Tips */}
          {forecast.tipSummary && forecast.tipSummary.length > 0 && (
            <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    AI Recommendations
                  </h3>
                </div>
                <div className="space-y-3">
                  {forecast.tipSummary.map((tip, index) => {
                    // Handle both string and object formats
                    const isString = typeof tip === "string";
                    const tipText = isString
                      ? tip
                      : tip.message || "No recommendation available";
                    const tipCategory = isString
                      ? "Financial Tip"
                      : tip.category || "General";
                    const priority = isString
                      ? "medium"
                      : tip.priority || "medium";

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${getPriorityColor(
                          priority
                        )}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-200 dark:bg-blue-800 rounded-lg flex-shrink-0 mt-0.5">
                            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium capitalize mb-1">
                              {tipCategory}
                            </p>
                            <p className="text-sm">{tipText}</p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              priority === "high"
                                ? "bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200"
                                : priority === "medium"
                                ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                                : "bg-sky-200 dark:bg-sky-800 text-sky-800 dark:text-sky-200"
                            }`}
                          >
                            {priority}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>
                Forecast period:{" "}
                {(() => {
                  // Handle both API response formats: {start, end} and {startDate, endDate}
                  const startDate =
                    forecast?.timeRange?.start ||
                    forecast?.timeRange?.startDate;
                  const endDate =
                    forecast?.timeRange?.end || forecast?.timeRange?.endDate;

                  const startText = startDate
                    ? new Date(startDate).toLocaleDateString()
                    : "Unknown";
                  const endText = endDate
                    ? new Date(endDate).toLocaleDateString()
                    : "Unknown";

                  return `${startText} - ${endText}`;
                })()}
              </span>
            </div>
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
