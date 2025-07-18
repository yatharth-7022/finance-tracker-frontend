import { useState, useCallback } from 'react'
import type { ToastType } from '../components/ui/Toast'

interface ToastState {
  isVisible: boolean
  type: ToastType
  title: string
  message?: string
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    type: 'success',
    title: '',
    message: '',
  })

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    setToast({
      isVisible: true,
      type,
      title,
      message,
    })
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }, [])

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast('success', title, message)
  }, [showToast])

  const showError = useCallback((title: string, message?: string) => {
    showToast('error', title, message)
  }, [showToast])

  const showWarning = useCallback((title: string, message?: string) => {
    showToast('warning', title, message)
  }, [showToast])

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
  }
}
