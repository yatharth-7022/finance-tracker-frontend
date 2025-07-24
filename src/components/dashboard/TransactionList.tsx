import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Trash2,
  MoreVertical,
  CreditCard,
} from "lucide-react";
import {
  useTransactions,
  useDeleteTransaction,
} from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import { Button, Modal } from "../ui";
import { formatCurrency } from "../../lib/utils";
import { cn } from "../../lib/utils";
import type { Transaction } from "../../types";

interface TransactionListProps {
  className?: string;
  limit?: number;
  showAll?: boolean;
  transactions?: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({
  className,
  limit = 10,
  showAll = false,
  transactions: propTransactions,
}) => {
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(
    null
  );

  const {
    data: fetchedTransactions = [],
    isLoading,
    error,
  } = useTransactions();
  const { data: categories = [] } = useCategories();

  // Use provided transactions or fetch them, and apply limit if not showing all
  const transactions = propTransactions || fetchedTransactions;
  const displayTransactions = showAll
    ? transactions
    : transactions.slice(0, limit);
  const deleteTransaction = useDeleteTransaction();

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((cat) => cat?.id === categoryId);
    return category?.name || "Unknown Category";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown Date";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid Date";

      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    try {
      await deleteTransaction.mutateAsync(transactionId);
      setTransactionToDelete(null);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "text-center py-8 text-red-600 dark:text-red-400",
          className
        )}
      >
        <p>Failed to load transactions</p>
      </div>
    );
  }

  if (displayTransactions?.length === 0) {
    return (
      <div
        className={cn(
          "text-center py-12 text-gray-500 dark:text-gray-400",
          className
        )}
      >
        <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-lg font-medium">No transactions yet</p>
        <p className="text-sm">Start by adding your first transaction</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <AnimatePresence>
          {displayTransactions?.map((transaction, index) => (
            <motion.div
              key={transaction?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Transaction Type Icon */}
                  <div
                    className={cn(
                      "p-2 rounded-full flex-shrink-0",
                      transaction?.type === "INCOME"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    )}
                  >
                    {transaction?.type === "INCOME" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {getCategoryName(transaction?.categoryId)}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(transaction?.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount - Separate column */}
                <div className="text-right ml-4 flex-shrink-0">
                  <p
                    className={cn(
                      "font-semibold text-lg",
                      transaction?.type === "INCOME"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {transaction?.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(transaction?.amount || 0)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 ml-4">
                  {transaction?.description && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedTransaction(
                          expandedTransaction === transaction?.id
                            ? null
                            : transaction?.id
                        )
                      }
                      className="p-1 h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTransactionToDelete(transaction?.id)}
                    className="p-1 h-8 w-8 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              {transaction?.description && (
                <motion.div
                  initial={false}
                  animate={{
                    height:
                      expandedTransaction === transaction?.id ? "auto" : 0,
                    opacity: expandedTransaction === transaction?.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {transaction?.description}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={transactionToDelete !== null}
        onClose={() => setTransactionToDelete(null)}
        title="Delete Transaction"
        size="sm"
      >
        <div className="space-y-4 mt-4">
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </p>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setTransactionToDelete(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() =>
                transactionToDelete &&
                handleDeleteTransaction(transactionToDelete)
              }
              loading={deleteTransaction.isPending}
              className="flex-1 !bg-red-500 hover:!bg-red-600 !text-white dark:!bg-red-500 dark:hover:!bg-red-600 dark:!text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
