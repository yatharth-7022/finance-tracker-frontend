import React from "react";
import { LogOut, User } from "lucide-react";
import { Button } from "../ui";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useLogout, useCurrentUser } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

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
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Finance Tracker
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{user?.username}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              loading={logoutMutation.isPending}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
