import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Calendar,
  IndianRupee,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { Button, Input, Select, Modal, Toast } from "../ui";
import {
  useCreateBudget,
  useUpdateBudget,
  useBudgets,
} from "../../hooks/useBudgets";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "../../hooks/useCategories";
import { useToast } from "../../hooks/useToast";
import {
  budgetSchema,
  categorySchema,
  type BudgetFormData,
  type CategoryFormData,
} from "../../lib/validations";
import type { Budget } from "../../types";

interface AddEditBudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingBudget?: Budget | null;
}

export const AddEditBudgetForm: React.FC<AddEditBudgetFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingBudget,
}) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const isEditing = !!editingBudget;
  const [showCategorySection, setShowCategorySection] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: editingBudget?.amount || undefined,
      month: editingBudget?.month || new Date().getMonth() + 1,
      year: editingBudget?.year || new Date().getFullYear(),
      categoryId: editingBudget?.categoryId || undefined,
    },
  });

  // Category form
  const {
    register: registerCategory,
    handleSubmit: handleCategorySubmit,
    formState: { errors: categoryErrors },
    reset: resetCategory,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: "EXPENSE", // Default to EXPENSE since budgets are for expenses
    },
  });

  // Hooks
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: budgets = [] } = useBudgets();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  // Reset form when editing budget changes
  useEffect(() => {
    if (editingBudget) {
      setValue("amount", editingBudget.amount);
      setValue("month", editingBudget.month);
      setValue("year", editingBudget.year);
      setValue("categoryId", editingBudget.categoryId);
    } else {
      reset({
        amount: undefined,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        categoryId: undefined,
      });
    }
  }, [editingBudget, setValue, reset]);

  // Get current date for validation
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
  const selectedYear = watch("year");
  const selectedMonth = watch("month");

  // Auto-adjust month when year changes to current year (prevent past month selection)
  useEffect(() => {
    if (
      !isEditing &&
      selectedYear === currentYear &&
      selectedMonth &&
      typeof selectedMonth === "number" &&
      selectedMonth < currentMonth
    ) {
      setValue("month", currentMonth);
    }
  }, [
    selectedYear,
    selectedMonth,
    currentYear,
    currentMonth,
    isEditing,
    setValue,
  ]);

  // Generate month options with disabled state for past months
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const monthValue = i + 1;
    const isPastMonth =
      !isEditing &&
      selectedYear === currentYear &&
      typeof selectedYear === "number" &&
      monthValue < currentMonth;

    return {
      value: monthValue,
      label: new Date(2024, i).toLocaleDateString("en-US", { month: "long" }),
      disabled: isPastMonth,
      tooltip: isPastMonth
        ? "Cannot create budgets for past months"
        : undefined,
    };
  });

  // Generate year options (current year and next 2 years) with disabled state for past years
  const yearOptions = Array.from({ length: 3 }, (_, i) => {
    const yearValue = currentYear + i;
    const isPastYear = !isEditing && yearValue < currentYear;

    return {
      value: yearValue,
      label: yearValue.toString(),
      disabled: isPastYear,
      tooltip: isPastYear ? "Cannot create budgets for past years" : undefined,
    };
  });

  // Filter categories to only show EXPENSE categories
  const expenseCategories = categories.filter(
    (category) => category.type === "EXPENSE"
  );

  // Get existing budgets for the selected month/year
  const existingBudgets = budgets.filter(
    (budget) =>
      selectedMonth &&
      selectedYear &&
      budget.month === selectedMonth &&
      budget.year === selectedYear &&
      (!isEditing || budget.id !== editingBudget?.id) // Exclude current budget when editing
  );

  const categoryOptions = expenseCategories.map((category) => {
    const hasExistingBudget = existingBudgets.some(
      (budget) => budget.categoryId === category.id
    );

    return {
      value: category.id,
      label: category.name,
      disabled: hasExistingBudget,
      tooltip: hasExistingBudget
        ? `You already have a budget for ${category.name} in ${new Date(
            selectedYear || new Date().getFullYear(),
            (selectedMonth || new Date().getMonth() + 1) - 1
          ).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
        : undefined,
    };
  });

  const onSubmit = async (data: BudgetFormData) => {
    try {
      if (isEditing && editingBudget) {
        await updateBudget.mutateAsync({
          id: editingBudget.id,
          budget: data,
        });
        showSuccess(
          "Budget Updated",
          "Your budget has been successfully updated."
        );
      } else {
        await createBudget.mutateAsync(data);
        showSuccess(
          "Budget Created",
          "Your budget has been successfully created."
        );
      }

      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save budget:", error);
      showError(
        isEditing ? "Failed to Update Budget" : "Failed to Create Budget",
        "Please try again."
      );
    }
  };

  const onCategorySubmit = async (data: CategoryFormData) => {
    try {
      await createCategory.mutateAsync(data);
      resetCategory();
      showSuccess(
        "Category Created",
        "Your category has been successfully created."
      );
    } catch (error) {
      console.error("Failed to create category:", error);
      showError("Failed to Create Category", "Please try again.");
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory.mutateAsync(categoryId);
      setCategoryToDelete(null);
      showSuccess(
        "Category Deleted",
        "The category has been successfully deleted."
      );
    } catch (error) {
      console.error("Failed to delete category:", error);
      showError("Failed to Delete Category", "Please try again.");
    }
  };

  const handleClose = () => {
    reset();
    resetCategory();
    setShowCategorySection(false);
    setCategoryToDelete(null);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isEditing ? "Edit Budget" : "Create Budget"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Category Selection */}
          <div>
            <Select
              label="Category"
              options={categoryOptions}
              value={watch("categoryId") || ""}
              onChange={(value) => setValue("categoryId", Number(value))}
              placeholder="Select a category"
              error={errors.categoryId?.message}
              disabled={categoriesLoading}
            />
            {expenseCategories.length === 0 && !categoriesLoading && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                No expense categories available. Create some categories first.
              </p>
            )}
          </div>

          {/* Category Management Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              type="button"
              onClick={() => setShowCategorySection(!showCategorySection)}
              className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Manage Categories
                </span>
              </div>
              {showCategorySection ? (
                <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {showCategorySection && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {/* Add New Category Form */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Add New Category
                      </h4>
                      <div className="space-y-3">
                        <Input
                          label="Category Name"
                          placeholder="Enter category name"
                          error={categoryErrors.name?.message}
                          {...registerCategory("name")}
                        />
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            loading={createCategory.isPending}
                            onClick={handleCategorySubmit(onCategorySubmit)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Category
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Existing Categories List */}
                    {expenseCategories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                          Existing Categories
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {expenseCategories.map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                            >
                              <span className="text-sm text-gray-900 dark:text-gray-100">
                                {category.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => setCategoryToDelete(category.id)}
                                className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Delete category"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Budget Amount */}
          <div>
            <Input
              label="Budget Amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              error={errors.amount?.message}
              {...register("amount", { valueAsNumber: true })}
              className="text-lg font-medium"
            />
          </div>

          {/* Month and Year Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                label="Month"
                options={monthOptions}
                value={watch("month") || ""}
                onChange={(value) => setValue("month", Number(value))}
                placeholder="Select month"
                error={errors.month?.message}
              />
            </div>

            <div>
              <Select
                label="Year"
                options={yearOptions}
                value={watch("year") || ""}
                onChange={(value) => setValue("year", Number(value))}
                placeholder="Select year"
                error={errors.year?.message}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={createBudget.isPending || updateBudget.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createBudget.isPending || updateBudget.isPending}
              className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <Target className="h-4 w-4 mr-2" />
              {isEditing ? "Update Budget" : "Create Budget"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Confirmation Modal */}
      <Modal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4 mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this category? This action cannot be
            undone and will affect any existing transactions using this
            category.
          </p>

          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setCategoryToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                categoryToDelete && handleDeleteCategory(categoryToDelete)
              }
              loading={deleteCategory.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
      />
    </>
  );
};
