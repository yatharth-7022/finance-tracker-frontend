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
}

export const TransactionList: React.FC<TransactionListProps> = ({
  className,
}) => {
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(
    null
  );

  const { data: transactions = [], isLoading, error } = useTransactions();
  const { data: categories = [] } = useCategories();
  const deleteTransaction = useDeleteTransaction();

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((cat) => cat?.id === categoryId);
    return category?.name || "Unknown Category";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
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

  if (transactions?.length === 0) {
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
          {transactions?.map((transaction, index) => (
            <motion.div
              key={transaction?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Transaction Type Icon */}
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      transaction?.type === "INCOME"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    )}
                  >
                    {transaction?.type === "INCOME" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {getCategoryName(transaction?.categoryId)}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(transaction?.createdAt)}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={cn(
                            "font-semibold text-lg",
                            transaction?.type === "INCOME"
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {transaction?.type === "INCOME" ? "+" : "-"}
                          {formatCurrency(transaction?.amount || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {transaction?.description && (
                      <motion.div
                        initial={false}
                        animate={{
                          height:
                            expandedTransaction === transaction?.id
                              ? "auto"
                              : 0,
                          opacity:
                            expandedTransaction === transaction?.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                          {transaction?.description}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
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
                    className="p-1 h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
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
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
