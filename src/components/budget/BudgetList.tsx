import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  Trash2,
  MoreVertical,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardHeader, CardContent, Button, Modal } from "../ui";
import { useBudgets, useDeleteBudget } from "../../hooks/useBudgets";
import { useTransactions } from "../../hooks/useTransactions";
import { formatCurrency } from "../../lib/utils";
import { cn } from "../../lib/utils";
import type { Budget } from "../../types";

interface BudgetListProps {
  className?: string;
  onEditBudget?: (budget: Budget) => void;
}

export const BudgetList: React.FC<BudgetListProps> = ({
  className,
  onEditBudget,
}) => {
  const [budgetToDelete, setBudgetToDelete] = useState<number | null>(null);
  const [showActions, setShowActions] = useState<number | null>(null);

  const { data: budgets = [], isLoading, error } = useBudgets();
  const { data: transactions = [] } = useTransactions();
  const deleteBudget = useDeleteBudget();

  // Calculate spent amount for each budget
  const calculateSpentAmount = (budget: Budget) => {
    const budgetDate = new Date(budget.year, budget.month - 1);
    const startOfMonth = new Date(
      budgetDate.getFullYear(),
      budgetDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      budgetDate.getFullYear(),
      budgetDate.getMonth() + 1,
      0
    );

    return transactions
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
  };

  const handleDeleteBudget = async (budgetId: number) => {
    try {
      await deleteBudget.mutateAsync(budgetId);
      setBudgetToDelete(null);
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  const formatMonthYear = (month: number, year: number) => {
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">
          Failed to load budgets. Please try again.
        </p>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("text-center py-12", className)}
      >
        <Card>
          <CardContent className="py-12">
            <Target className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No budgets yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first budget to start tracking your spending goals
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        <AnimatePresence>
          {budgets.map((budget, index) => {
            const spentAmount = calculateSpentAmount(budget);
            const remainingAmount = budget.amount - spentAmount;
            const progressPercentage = Math.min(
              (spentAmount / budget.amount) * 100,
              100
            );
            const isOverBudget = spentAmount > budget.amount;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                layout
              >
                <Card className="hover:shadow-lg transition-shadow duration-200 relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {budget.categoryName}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatMonthYear(budget.month, budget.year)}
                        </span>

                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActions(
                                showActions === budget.id ? null : budget.id
                              )
                            }
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          <AnimatePresence>
                            {showActions === budget.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-8 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[120px]"
                              >
                                <button
                                  onClick={() => {
                                    onEditBudget?.(budget);
                                    setShowActions(null);
                                  }}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setBudgetToDelete(budget.id);
                                    setShowActions(null);
                                  }}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Budget Amount
                        </span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(budget.amount)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              isOverBudget
                                ? "bg-red-500"
                                : progressPercentage > 80
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            )}
                            style={{
                              width: `${Math.min(progressPercentage, 100)}%`,
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            {progressPercentage.toFixed(1)}% used
                          </span>
                          {isOverBudget && (
                            <span className="text-red-500 font-medium">
                              Over budget!
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              Spent
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {formatCurrency(spentAmount)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <TrendingUp
                            className={cn(
                              "h-4 w-4",
                              remainingAmount >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            )}
                          />
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {remainingAmount >= 0 ? "Remaining" : "Over"}
                            </p>
                            <p
                              className={cn(
                                "font-semibold",
                                remainingAmount >= 0
                                  ? "text-gray-900 dark:text-gray-100"
                                  : "text-red-600 dark:text-red-400"
                              )}
                            >
                              {formatCurrency(Math.abs(remainingAmount))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={budgetToDelete !== null}
        onClose={() => setBudgetToDelete(null)}
        title="Delete Budget"
        size="sm"
      >
        <div className="space-y-4 mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this budget? This action cannot be
            undone.
          </p>

          <div className="flex items-center justify-end space-x-3">
            <Button variant="secondary" onClick={() => setBudgetToDelete(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                budgetToDelete && handleDeleteBudget(budgetToDelete)
              }
              loading={deleteBudget.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Budget
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
