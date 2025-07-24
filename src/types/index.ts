export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthApiResponse {
  status: number;
  message: string;
  data: {
    token: string;
    username: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Backend DTO structures
export interface TransactionRequest {
  description?: string;
  amount: number;
  type: string;
  categoryId: number;
}

export interface CategoryRequest {
  name: string;
  type: "INCOME" | "EXPENSE";
}

export interface BudgetRequest {
  amount: number;
  month: number;
  year: number;
  categoryId: number;
}

// API Response structures
export interface Transaction {
  id: number;
  amount: number;
  description?: string;
  type: string;
  categoryId: number;
  category?: Category;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface Category {
  id: number;
  name: string;
  type: "INCOME" | "EXPENSE";
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: number;
  amount: number;
  month: number;
  year: number;
  categoryId: number;
  categoryName: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// AI Forecasting interfaces
export interface ForecastTip {
  category: string;
  message: string;
  priority: "high" | "medium" | "low";
}

export interface ForecastWarning {
  type: "overspending" | "budget_exceeded" | "unusual_pattern";
  message: string;
  severity: "critical" | "warning" | "info";
}

export interface ForecastTimeRange {
  // Support both API response formats
  startDate?: string;
  endDate?: string;
  start?: string;
  end?: string;
  daysRemaining?: number; // Optional since we calculate it on frontend
}

export interface MonthlyForecast {
  estimatedSpending: number;
  averageDailySpend: number;
  timeRange: ForecastTimeRange;
  totalSpentSoFar: number;
  tipSummary: (ForecastTip | string)[]; // Support both object and string formats
  warnings: (ForecastWarning | string)[]; // Support both object and string formats
  generatedAt: string;
}
