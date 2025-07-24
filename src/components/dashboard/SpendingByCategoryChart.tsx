import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingDown,
  Package,
  AlertCircle,
  BarChart3,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardContent, Button, Modal } from "../ui";
import { formatCurrency } from "../../lib/utils";
import { useSpendingByCategory } from "../../hooks/useSpendingByCategory";
import { DetailedSpendingAnalysis } from "./DetailedSpendingAnalysis";
import type { SpendingByCategory } from "../../types";

// Modern color palette for categories
const CATEGORY_COLORS = [
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#84cc16", // lime-500
  "#f97316", // orange-500
  "#06b6d4", // cyan-500
  "#8b5a2b", // brown-500
  "#6b7280", // gray-500
];

interface SpendingByCategoryChartProps {
  className?: string;
}

interface ChartDataItem extends SpendingByCategory {
  color: string;
  percentage: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataItem;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {data.categoryName}
          </p>
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Amount:{" "}
            <span className="font-medium">
              {formatCurrency(data.totalAmount)}
            </span>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Transactions:{" "}
            <span className="font-medium">{data.transactionCount}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Percentage:{" "}
            <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const SpendingByCategoryChart: React.FC<
  SpendingByCategoryChartProps
> = ({ className }) => {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const { data: spendingData = [], isLoading, error } = useSpendingByCategory();

  // Calculate total spending for percentage calculations
  const totalSpending = spendingData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  // Prepare chart data with colors and percentages
  const chartData: ChartDataItem[] = spendingData.map((item, index) => ({
    ...item,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    percentage:
      totalSpending > 0 ? (item.totalAmount / totalSpending) * 100 : 0,
  }));

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Spending by Category
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 dark:border-gray-100 border-t-transparent mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading spending data...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Spending by Category
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-red-500 dark:text-red-400">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <p className="font-medium">Failed to load spending data</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Please try again later
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Spending by Category
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <TrendingDown className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="font-medium">No spending data yet</p>
              <p className="text-sm mt-2">
                Add transactions to see your spending breakdown
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Spending by Category
            </h3>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Spending
                </p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalSpending)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedAnalysis(true)}
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Details</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="totalAmount"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category breakdown list */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Category Breakdown
            </h4>
            {chartData
              .sort((a, b) => b.totalAmount - a.totalAmount)
              .slice(0, 5) // Show top 5 categories
              .map((category, index) => (
                <div
                  key={category.categoryId}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {category.categoryName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {category.transactionCount} transaction
                        {category.transactionCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(category.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {category.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            {chartData.length > 5 && (
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  +{chartData.length - 5} more categories
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Modal */}
      <Modal
        isOpen={showDetailedAnalysis}
        onClose={() => setShowDetailedAnalysis(false)}
        size="xl"
      >
        <DetailedSpendingAnalysis />
      </Modal>
    </motion.div>
  );
};
