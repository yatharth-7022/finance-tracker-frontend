import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Plus, Trash2, IndianRupee } from "lucide-react";
import { Button, Input, Select, Textarea, Modal, Toast } from "../ui";
import { useCreateTransaction } from "../../hooks/useTransactions";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "../../hooks/useCategories";
import { useToast } from "../../hooks/useToast";
import {
  transactionSchema,
  categorySchema,
  type TransactionFormData,
  type CategoryFormData,
} from "../../lib/validations";
import { cn } from "../../lib/utils";

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Transaction form
  const {
    register: registerTransaction,
    handleSubmit: handleTransactionSubmit,
    formState: { errors: transactionErrors },
    watch,
    setValue,
    reset: resetTransaction,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  });

  // Category form
  const {
    register: registerCategory,
    handleSubmit: handleCategorySubmit,
    formState: { errors: categoryErrors },
    watch: watchCategory,
    setValue: setCategoryValue,
    reset: resetCategory,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  // Hooks
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const createTransaction = useCreateTransaction();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const watchedType = watch("type");

  // Filter categories based on transaction type
  const filteredCategories =
    categories?.filter((category) => {
      if (!watchedType) return true;
      return category?.type === watchedType;
    }) || [];

  const categoryOptions =
    filteredCategories?.map((category) => ({
      value: category?.id,
      label: category?.name,
    })) || [];

  const typeOptions = [
    { value: "INCOME", label: "Income" },
    { value: "EXPENSE", label: "Expense" },
  ];

  const onTransactionSubmit = async (data: TransactionFormData) => {
    try {
      await createTransaction.mutateAsync(data);
      resetTransaction();
      onClose();
      showSuccess(
        "Transaction Added",
        "Your transaction has been successfully created."
      );
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create transaction:", error);
      showError("Failed to Add Transaction", "Please try again.");
    }
  };

  const onCategorySubmit = async (data: CategoryFormData) => {
    try {
      const newCategory = await createCategory.mutateAsync(data);
      resetCategory();
      setShowAddCategory(false);

      // Auto-select the newly created category
      setValue("categoryId", newCategory.id);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory.mutateAsync(categoryId);
      setCategoryToDelete(null);

      // Clear selection if deleted category was selected
      const currentCategoryId = watch("categoryId");
      if (currentCategoryId === categoryId) {
        setValue("categoryId", undefined as any);
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleClose = () => {
    resetTransaction();
    resetCategory();
    setShowAddCategory(false);
    setCategoryToDelete(null);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Add Transaction"
        size="md"
      >
        <form
          onSubmit={handleTransactionSubmit(onTransactionSubmit)}
          className="space-y-6 mt-6"
        >
          {/* Amount */}
          <div>
            <Input
              label="Amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              error={transactionErrors.amount?.message}
              {...registerTransaction("amount", { valueAsNumber: true })}
              className="text-lg font-medium"
            />
          </div>

          {/* Type */}
          <div>
            <Select
              label="Type"
              options={typeOptions}
              value={watch("type") || ""}
              onChange={(value) => {
                setValue("type", value as string);
                // Clear category selection when type changes
                setValue("categoryId", undefined as any);
              }}
              placeholder="Select transaction type"
              error={transactionErrors.type?.message}
            />
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-black dark:text-white">
                Category
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddCategory(true)}
                disabled={!watchedType}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Category
              </Button>
            </div>

            <Select
              options={categoryOptions}
              value={watch("categoryId") || ""}
              onChange={(value) => setValue("categoryId", value as number)}
              placeholder={
                !watchedType
                  ? "Select type first"
                  : categoriesLoading
                  ? "Loading categories..."
                  : "Select category"
              }
              disabled={!watchedType || categoriesLoading}
              error={transactionErrors.categoryId?.message}
            />

            {/* Category management */}
            {filteredCategories?.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Existing categories:
                </p>
                <div className="flex flex-wrap gap-1">
                  {filteredCategories?.map((category) => (
                    <div
                      key={category?.id}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-900 dark:text-gray-100"
                    >
                      <span>{category?.name}</span>
                      <button
                        type="button"
                        onClick={() => setCategoryToDelete(category?.id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <Textarea
              label="Description (Optional)"
              placeholder="Enter transaction description..."
              rows={3}
              error={transactionErrors.description?.message}
              {...registerTransaction("description")}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createTransaction.isPending}
              className="flex-1"
            >
              <IndianRupee className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddCategory}
        onClose={() => {
          setShowAddCategory(false);
          resetCategory();
        }}
        title="Add Category"
        size="sm"
      >
        <form
          onSubmit={handleCategorySubmit(onCategorySubmit)}
          className="space-y-4 mt-6"
        >
          <Input
            label="Category Name"
            placeholder="Enter category name"
            error={categoryErrors.name?.message}
            {...registerCategory("name")}
          />

          <Select
            label="Category Type"
            options={typeOptions}
            value={watchCategory("type") || ""}
            onChange={(value) =>
              setCategoryValue("type", value as "INCOME" | "EXPENSE")
            }
            placeholder="Select category type"
            error={categoryErrors.type?.message}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddCategory(false);
                resetCategory();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createCategory.isPending}
              className="flex-1"
            >
              Add Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Confirmation */}
      <Modal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </p>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCategoryToDelete(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() =>
                categoryToDelete && handleDeleteCategory(categoryToDelete)
              }
              loading={deleteCategory.isPending}
              className="flex-1 !bg-red-500 hover:!bg-red-600 !text-white dark:!bg-red-500 dark:hover:!bg-red-600 dark:!text-white"
            >
              Delete
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
