import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Package,
  DollarSign,
  Hash,
} from "lucide-react";
import { Card, CardHeader, CardContent, Button } from "../ui";
import { formatCurrency } from "../../lib/utils";
import { useSpendingByCategory } from "../../hooks/useSpendingByCategory";
import type { SpendingByCategory } from "../../types";

// Modern color palette for categories
const CATEGORY_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6",
  "#ef4444", "#84cc16", "#f97316", "#06b6d4", "#8b5a2b", "#6b7280",
];

interface DetailedSpendingAnalysisProps {
  className?: string;
}

type ViewMode = "pie" | "bar";

interface ChartDataItem extends SpendingByCategory {
  color: string;
  percentage: number;
  avgPerTransaction: number;
}

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataItem;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Total: <span className="font-medium">{formatCurrency(data.totalAmount)}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Transactions: <span className="font-medium">{data.transactionCount}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Avg per transaction: <span className="font-medium">{formatCurrency(data.avgPerTransaction)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const DetailedSpendingAnalysis: React.FC<DetailedSpendingAnalysisProps> = ({
  className,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("pie");
  const { data: spendingData = [], isLoading, error } = useSpendingByCategory();

  // Calculate total spending and prepare enhanced chart data
  const totalSpending = spendingData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalTransactions = spendingData.reduce((sum, item) => sum + item.transactionCount, 0);

  const chartData: ChartDataItem[] = spendingData.map((item, index) => ({
    ...item,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    percentage: totalSpending > 0 ? (item.totalAmount / totalSpending) * 100 : 0,
    avgPerTransaction: item.transactionCount > 0 ? item.totalAmount / item.transactionCount : 0,
  }));

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Detailed Spending Analysis
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 dark:border-gray-100 border-t-transparent mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading detailed analysis...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Detailed Spending Analysis
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="font-medium">No spending data available</p>
              <p className="text-sm mt-2">
                Add transactions to see detailed analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Detailed Spending Analysis
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "pie" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("pie")}
                className="flex items-center space-x-1"
              >
                <PieChartIcon className="h-4 w-4" />
                <span>Pie</span>
              </Button>
              <Button
                variant={viewMode === "bar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("bar")}
                className="flex items-center space-x-1"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Bar</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Total Spending
                  </p>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(totalSpending)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <Hash className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Total Transactions
                  </p>
                  <p className="text-xl font-bold text-green-900 dark:text-green-100">
                    {totalTransactions}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Categories
                  </p>
                  <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                    {chartData.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === "pie" ? (
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
                  <Tooltip content={<CustomBarTooltip />} />
                </PieChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="categoryName" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} fontSize={12} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Detailed Category List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Complete Category Breakdown
            </h4>
            {chartData
              .sort((a, b) => b.totalAmount - a.totalAmount)
              .map((category, index) => (
                <div
                  key={category.categoryId}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                        #{index + 1}
                      </span>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {category.categoryName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''} • 
                        Avg: {formatCurrency(category.avgPerTransaction)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(category.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {category.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
