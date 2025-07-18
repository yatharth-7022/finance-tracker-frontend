import React from "react";
import { motion } from "framer-motion";
import { LoginForm } from "../components/forms/LoginForm";

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
};
