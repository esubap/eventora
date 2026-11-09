import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline' | 'purple' | 'cyan';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
    error: 'bg-rose-950/80 text-rose-300 border-rose-500/30',
    outline: 'bg-transparent text-slate-300 border-slate-600',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
