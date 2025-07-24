import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Header } from "../components/layout/Header";
import { StatsCard } from "../components/dashboard/StatsCard";
import { TransactionList } from "../components/dashboard/TransactionList";
import { FinancePieChart } from "../components/dashboard/FinancePieChart";
import { BudgetOverview } from "../components/dashboard/BudgetOverview";
import { AIForecastWidget } from "../components/dashboard/AIForecastWidget";
import { SpendingByCategoryChart } from "../components/dashboard/SpendingByCategoryChart";
import { AddTransactionForm } from "../components/forms/AddTransactionForm";
import { Card, CardHeader, CardContent, Button } from "../components/ui";
import { useDashboardStats, useDashboardSummary } from "../hooks/useDashboard";
import { useNavigate } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const { data: stats, isLoading, error } = useDashboardStats();
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"
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
              Failed to load dashboard data
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h2>
          <Button
            onClick={() => setShowAddTransaction(true)}
            className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Balance"
            value={summary?.balance || 0}
            icon={
              <Wallet className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            }
            trend={{ value: 12.5, isPositive: (summary?.balance || 0) >= 0 }}
            delay={0.1}
          />

          <StatsCard
            title="Total Income"
            value={summary?.totalIncome || 0}
            icon={
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            }
            trend={{ value: 8.2, isPositive: true }}
            delay={0.2}
          />

          <StatsCard
            title="Total Expenses"
            value={Math.abs(summary?.totalExpense || 0)}
            icon={
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            }
            trend={{ value: 3.1, isPositive: false }}
            delay={0.3}
          />

          {/* AI Forecasting Widget */}
          <AIForecastWidget />
        </div>

        {/* Financial Overview Chart */}
        {summary && (
          <div className="mb-8">
            <FinancePieChart data={summary} isLoading={summaryLoading} />
          </div>
        )}

        {/* Budget Overview */}
        <div className="mb-8">
          <BudgetOverview />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Recent Transactions
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/transactions")}
                    className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TransactionList limit={5} />
              </CardContent>
            </Card>
          </motion.div>

          <SpendingByCategoryChart />
        </div>
      </main>

      {/* Add Transaction Modal */}
      <AddTransactionForm
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onSuccess={() => {
          // Optional: Show success message or perform additional actions
        }}
      />
    </div>
  );
};
