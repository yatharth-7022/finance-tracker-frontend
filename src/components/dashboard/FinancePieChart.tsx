import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardHeader, CardContent } from '../ui'
import { formatCurrency } from '../../lib/utils'
import type { DashboardSummary } from '../../types'

interface FinancePieChartProps {
  data: DashboardSummary
  isLoading?: boolean
  className?: string
}

const COLORS = {
  income: '#10b981', // green-500
  expense: '#ef4444', // red-500
  balance: '#6366f1', // indigo-500
}

export const FinancePieChart: React.FC<FinancePieChartProps> = ({
  data,
  isLoading = false,
  className,
}) => {
  // Prepare chart data
  const chartData = [
    {
      name: 'Total Income',
      value: data.totalIncome || 0,
      color: COLORS.income,
      percentage: data.totalIncome > 0 ? ((data.totalIncome / (data.totalIncome + Math.abs(data.totalExpense))) * 100) : 0,
    },
    {
      name: 'Total Expenses',
      value: Math.abs(data.totalExpense) || 0,
      color: COLORS.expense,
      percentage: data.totalExpense > 0 ? ((Math.abs(data.totalExpense) / (data.totalIncome + Math.abs(data.totalExpense))) * 100) : 0,
    },
  ].filter(item => item.value > 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Amount: <span className="font-semibold">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: <span className="font-semibold">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
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
    )
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Financial Overview
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Financial Overview
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-medium">No financial data</p>
              <p className="text-sm">Add some transactions to see your financial overview</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Financial Overview
            </h3>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
              <p className={`text-lg font-bold ${
                data.balance >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(data.balance)}
              </p>
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
                  paddingAngle={5}
                  dataKey="value"
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
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Income vs Expenses</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {data.totalIncome > 0 && Math.abs(data.totalExpense) > 0
                  ? `${(data.totalIncome / Math.abs(data.totalExpense)).toFixed(1)}:1`
                  : 'N/A'
                }
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {data.totalIncome > 0
                  ? `${((data.balance / data.totalIncome) * 100).toFixed(1)}%`
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
