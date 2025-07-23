import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui";
import { BudgetList } from "../components/budget/BudgetList";
import { AddEditBudgetForm } from "../components/budget/AddEditBudgetForm";
import { useBudgets } from "../hooks/useBudgets";
import type { Budget } from "../types";

export const BudgetPage: React.FC = () => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const { data: budgets = [], isLoading, error } = useBudgets();

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowAddBudget(true);
  };

  const handleCloseForm = () => {
    setShowAddBudget(false);
    setEditingBudget(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">
              Failed to load budget data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Budget Management
            </h2>
          </div>
          <Button
            onClick={() => setShowAddBudget(true)}
            className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </motion.div>

        <BudgetList onEditBudget={handleEditBudget} />
      </main>

      {/* Budget Form Modal */}
      <AddEditBudgetForm
        isOpen={showAddBudget}
        onClose={handleCloseForm}
        editingBudget={editingBudget}
        onSuccess={() => {
          // Optional: Show success message or perform additional actions
        }}
      />
    </div>
  );
};
