import { View } from 'react-native';
import { cn } from '@/utils/cn';

const TONS = {
  success: 'bg-secondary',
  warning: 'bg-on-tertiary-container',
  danger: 'bg-error',
} as const;

export type ProgressBarProps = {
  value: number;
  accessibilityLabel: string;
  tone?: keyof typeof TONS;
  className?: string;
};

export function ProgressBar({ value, accessibilityLabel, tone = 'success', className }: ProgressBarProps) {
  const porcentagem = Math.round(Math.min(Math.max(value, 0), 1) * 100);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: porcentagem }}
      className={cn('h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high', className)}>
      <View className={cn('h-full rounded-full', TONS[tone])} style={{ width: `${porcentagem}%` }} />
    </View>
  );
}
