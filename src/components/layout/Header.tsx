import React, { useState } from "react";
import { LogOut, User, BarChart3, Target, Menu, X } from "lucide-react";
import { Button } from "../ui";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useLogout, useCurrentUser } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/login");
    } catch (error) {
      // Error handling
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Finance Tracker
            </h1>

            {/* Navigation Links */}
            <nav className="hidden sm:flex items-center space-x-6">
              <button
                onClick={() => navigate("/dashboard")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => navigate("/budgets")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/budgets"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Target className="h-4 w-4" />
                <span>Budgets</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{user?.username}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              loading={logoutMutation.isPending}
              className="hidden sm:flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={() => {
                navigate("/dashboard");
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === "/dashboard"
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                navigate("/budgets");
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === "/budgets"
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <Target className="h-4 w-4" />
              <span>Budgets</span>
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                disabled={logoutMutation.isPending}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
