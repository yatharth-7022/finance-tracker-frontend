import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn('card', className)}>
      {children}
    </div>
  )
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('card-header', className)}>
      {children}
    </div>
  )
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('card-content', className)}>
      {children}
    </div>
  )
}
