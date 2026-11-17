import { View, type ViewProps } from 'react-native';
import { cn } from '@/utils/cn';

const VARIANTES = {
  elevated: 'bg-surface-container-lowest shadow-sm',
  filled: 'bg-surface-container-low',
} as const;

export type CardProps = ViewProps & {
  variant?: keyof typeof VARIANTES;
  className?: string;
};

export function Card({ variant = 'elevated', className, ...props }: CardProps) {
  return <View className={cn('gap-space-sm rounded-xl p-space-md', VARIANTES[variant], className)} {...props} />;
}
