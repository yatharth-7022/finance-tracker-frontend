import type {
  AuthResponse,
  AuthApiResponse,
  LoginCredentials,
  SignupCredentials,
  User,
  DashboardStats,
  DashboardSummary,
  Transaction,
  TransactionRequest,
  Category,
  CategoryRequest,
  Budget,
  BudgetRequest,
  ApiResponse,
  MonthlyForecast,
} from "../types/index.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || "An error occurred",
        errorData.code
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, "Network error occurred");
  }
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiRequest<AuthApiResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Transform the API response to match our internal AuthResponse format
    return {
      user: {
        id: "1", // API doesn't return user ID, using placeholder
        email: "", // API doesn't return email, using placeholder
        username: response.data.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: response.data.token,
    };
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    // Remove confirmPassword from the payload as it's not sent to API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...signupPayload } = credentials;

    const response = await apiRequest<AuthApiResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(signupPayload),
    });

    // Transform the API response to match our internal AuthResponse format
    return {
      user: {
        id: "1", // API doesn't return user ID, using placeholder
        email: credentials.email,
        username: response.data.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: response.data.token,
    };
  },

  logout: async (): Promise<void> => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Actual implementation would be:
    // return apiRequest<void>('/auth/logout', {
    //   method: 'POST',
    // })
  },

  getCurrentUser: async (): Promise<User> => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser: User = {
      id: "1",
      email: "demo@example.com",
      username: "Demo",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return mockUser;

    // Actual implementation would be:
    // return apiRequest<User>('/auth/me')
  },
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockStats: DashboardStats = {
      totalIncome: 5420.5,
      totalExpenses: 3280.75,
      balance: 2139.75,
      transactionCount: 47,
    };
    return mockStats;

    // Actual implementation would be:
    // return apiRequest<DashboardStats>('/dashboard/stats')
  },

  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiRequest<ApiResponse<DashboardSummary>>(
      "/dashboard/summary"
    );
    return response.data;
  },
};

export const transactionApi = {
  create: async (transaction: TransactionRequest): Promise<Transaction> => {
    const response = await apiRequest<ApiResponse<Transaction>>(
      "/transaction/create",
      {
        method: "POST",
        body: JSON.stringify(transaction),
      }
    );
    return response.data;
  },

  getAll: async (): Promise<Transaction[]> => {
    const response = await apiRequest<ApiResponse<Transaction[]>>(
      "/transaction"
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest<ApiResponse<null>>(`/transaction/delete/${id}`, {
      method: "DELETE",
    });
  },
};

export const categoryApi = {
  create: async (category: CategoryRequest): Promise<Category> => {
    const response = await apiRequest<ApiResponse<Category>>(
      "/category/create",
      {
        method: "POST",
        body: JSON.stringify(category),
      }
    );
    return response.data;
  },

  getAll: async (): Promise<Category[]> => {
    const response = await apiRequest<ApiResponse<Category[]>>("/category");
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest<ApiResponse<null>>(`/category/delete/${id}`, {
      method: "DELETE",
    });
  },
};

export const budgetApi = {
  create: async (budget: BudgetRequest): Promise<Budget> => {
    const response = await apiRequest<ApiResponse<Budget>>("/budget", {
      method: "POST",
      body: JSON.stringify(budget),
    });
    return response.data;
  },

  update: async (id: number, budget: BudgetRequest): Promise<Budget> => {
    const response = await apiRequest<ApiResponse<Budget>>(`/budget`, {
      method: "POST",
      body: JSON.stringify({ ...budget, id }),
    });
    return response.data;
  },

  getAll: async (): Promise<Budget[]> => {
    const response = await apiRequest<ApiResponse<Budget[]>>("/budget");
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest<ApiResponse<null>>(`/budget/${id}`, {
      method: "DELETE",
    });
  },
};

export const forecastApi = {
  getMonthlyForecast: async (userId: string): Promise<MonthlyForecast> => {
    const response = await apiRequest<ApiResponse<MonthlyForecast>>(
      `/forecast/monthly/${userId}`
    );
    return response.data;
  },
};
