import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'gold' | 'success' | 'warning';
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: StatCardProps) => {
  const variants = {
    default: 'bg-card',
    gold: 'bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20',
    success: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50',
    warning: 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50',
  };

  const iconVariants = {
    default: 'bg-secondary text-secondary-foreground',
    gold: 'bg-gold/20 text-gold-dark',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
  };

  return (
    <div 
      className={cn(
        "card-elevated card-hover relative overflow-hidden p-6",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-display text-3xl font-semibold tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.positive ? "text-emerald-600" : "text-red-500"
            )}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs hier</span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          iconVariants[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-gold/5 to-transparent opacity-50" />
    </div>
  );
};

export default StatCard;
