import { CircleAlert, CircleCheck, Info, type LucideIcon, TriangleAlert, X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { colors } from '@/theme/colors';
import { cn } from '@/utils/cn';
import { Text, type TextTone } from './text';

const TONS = {
  info: { fundo: 'bg-surface-container-low', tom: 'default', cor: colors.primary, Icone: Info },
  success: {
    fundo: 'bg-secondary-container',
    tom: 'onSecondaryContainer',
    cor: colors['on-secondary-container'],
    Icone: CircleCheck,
  },
  warning: {
    fundo: 'bg-tertiary-fixed',
    tom: 'onTertiaryFixed',
    cor: colors['on-tertiary-fixed'],
    Icone: TriangleAlert,
  },
  error: {
    fundo: 'bg-error-container',
    tom: 'onErrorContainer',
    cor: colors['on-error-container'],
    Icone: CircleAlert,
  },
} as const satisfies Record<string, { fundo: string; tom: TextTone; cor: string; Icone: LucideIcon }>;

export type AlertTone = keyof typeof TONS;

export type AlertProps = {
  message: string;
  title?: string;
  tone?: AlertTone;
  onDismiss?: () => void;
  children?: ReactNode;
  className?: string;
};

export function Alert({ message, title, tone = 'info', onDismiss, children, className }: AlertProps) {
  const { fundo, tom, cor, Icone } = TONS[tone];

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className={cn('flex-row items-start gap-space-sm rounded-xl p-space-md', fundo, className)}>
      <Icone color={cor} size={22} />
      <View className="flex-1 gap-1">
        {title && (
          <Text variant="label" weight="bold" tone={tom}>
            {title}
          </Text>
        )}
        <Text variant="bodySm" tone={tom}>
          {message}
        </Text>
        {children}
      </View>
      {onDismiss && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar aviso"
          onPress={onDismiss}
          className="-m-3 h-12 w-12 items-center justify-center">
          <X color={cor} size={18} />
        </Pressable>
      )}
    </View>
  );
}
