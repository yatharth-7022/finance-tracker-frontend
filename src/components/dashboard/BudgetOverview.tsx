import React from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardContent, Button } from "../ui";
import { useBudgets } from "../../hooks/useBudgets";
import { useTransactions } from "../../hooks/useTransactions";
import { formatCurrency } from "../../lib/utils";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

interface BudgetOverviewProps {
  className?: string;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ className }) => {
  const navigate = useNavigate();
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const { data: transactions = [] } = useTransactions();

  // Calculate current month's budget data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const currentMonthBudgets = budgets.filter(
    (budget) => budget.month === currentMonth && budget.year === currentYear
  );

  // Calculate spending for current month budgets
  const budgetData = currentMonthBudgets.map((budget) => {
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const spent = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.categoryId === budget.categoryId &&
          transaction.type === "EXPENSE" &&
          transactionDate >= startOfMonth &&
          transactionDate <= endOfMonth
        );
      })
      .reduce((total, transaction) => total + transaction.amount, 0);

    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      percentage: (spent / budget.amount) * 100,
      isOverBudget: spent > budget.amount,
    };
  });

  // Calculate summary statistics
  const totalBudgeted = budgetData.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgetData.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overBudgetCount = budgetData.filter((budget) => budget.isOverBudget).length;
  const nearLimitCount = budgetData.filter(
    (budget) => !budget.isOverBudget && budget.percentage > 80
  ).length;

  if (budgetsLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (currentMonthBudgets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("space-y-4", className)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Budget Overview
          </h3>
          <Button
            onClick={() => navigate("/budgets")}
            variant="ghost"
            size="sm"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            View All Budgets
          </Button>
        </div>
        
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No budgets for this month
            </h4>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create budgets to track your spending goals
            </p>
            <Button
              onClick={() => navigate("/budgets")}
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Create Budget
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-4", className)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Budget Overview - {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <Button
          onClick={() => navigate("/budgets")}
          variant="ghost"
          size="sm"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          View All Budgets
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Budgeted
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalBudgeted)}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Spent
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Remaining
                </p>
                <p className={cn(
                  "text-xl font-bold",
                  totalRemaining >= 0 
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}>
                  {formatCurrency(Math.abs(totalRemaining))}
                </p>
              </div>
              <TrendingUp className={cn(
                "h-8 w-8",
                totalRemaining >= 0 
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(overBudgetCount > 0 || nearLimitCount > 0) && (
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Budget Alerts
                </h4>
                <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {overBudgetCount > 0 && (
                    <p>• {overBudgetCount} budget{overBudgetCount > 1 ? 's' : ''} over limit</p>
                  )}
                  {nearLimitCount > 0 && (
                    <p>• {nearLimitCount} budget{nearLimitCount > 1 ? 's' : ''} near limit (80%+)</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Budget Items */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Current Month Budgets
          </h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {budgetData.slice(0, 5).map((budget) => (
              <div key={budget.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {budget.categoryName}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {budget.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        budget.isOverBudget
                          ? "bg-red-500"
                          : budget.percentage > 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      )}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
                    <span>{formatCurrency(budget.spent)} spent</span>
                    <span>{formatCurrency(budget.amount)} budgeted</span>
                  </div>
                </div>
              </div>
            ))}
            
            {budgetData.length > 5 && (
              <div className="text-center pt-2">
                <Button
                  onClick={() => navigate("/budgets")}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400"
                >
                  View {budgetData.length - 5} more budget{budgetData.length - 5 > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
