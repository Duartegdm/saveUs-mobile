import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { colors } from '@/theme/colors';
import { cn } from '@/utils/cn';
import { Text, type TextTone } from './text';

const TONS = {
  success: { fundo: 'bg-secondary-container', tom: 'onSecondaryContainer', cor: colors['on-secondary-container'] },
  warning: { fundo: 'bg-tertiary-fixed', tom: 'onTertiaryFixed', cor: colors['on-tertiary-fixed'] },
  danger: { fundo: 'bg-error-container', tom: 'onErrorContainer', cor: colors['on-error-container'] },
  neutral: { fundo: 'bg-surface-container', tom: 'muted', cor: colors['on-surface-variant'] },
} as const satisfies Record<string, { fundo: string; tom: TextTone; cor: string }>;

export type BadgeTone = keyof typeof TONS;

export type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  icon?: LucideIcon;
  className?: string;
};

export function Badge({ label, tone = 'neutral', icon: Icone, className }: BadgeProps) {
  const { fundo, tom, cor } = TONS[tone];

  return (
    <View className={cn('flex-row items-center gap-1 self-start rounded-full px-2.5 py-1', fundo, className)}>
      {Icone && <Icone color={cor} size={16} />}
      <Text variant="label" tone={tom}>
        {label}
      </Text>
    </View>
  );
}
