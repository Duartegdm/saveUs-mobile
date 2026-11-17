import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, Pressable, type PressableProps, View } from 'react-native';
import { colors } from '@/theme/colors';
import { cn } from '@/utils/cn';
import { Text, type TextTone } from './text';

const VARIANTES = {
  primary: { fundo: 'bg-primary', tom: 'inverse', cor: colors['on-primary'] },
  secondary: { fundo: 'bg-secondary', tom: 'inverse', cor: colors['on-secondary'] },
  tonal: { fundo: 'bg-surface-container-high', tom: 'default', cor: colors['on-surface'] },
  danger: { fundo: 'bg-error-container', tom: 'onErrorContainer', cor: colors['on-error-container'] },
} as const satisfies Record<string, { fundo: string; tom: TextTone; cor: string }>;

const TAMANHOS = {
  md: 'min-h-12 px-space-md',
  lg: 'min-h-[52px] px-space-lg',
} as const;

export type ButtonVariant = keyof typeof VARIANTES;

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: keyof typeof TAMANHOS;
  icon?: LucideIcon;
  loading?: boolean;
  className?: string;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon: Icone,
  loading = false,
  disabled,
  className,
  accessibilityLabel,
  ...props
}: ButtonProps) {
  const { fundo, tom, cor } = VARIANTES[variant];
  const desabilitado = Boolean(disabled) || loading;
  const temIndicador = loading || Boolean(Icone);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: desabilitado, busy: loading }}
      disabled={desabilitado}
      className={cn(
        'flex-row items-center justify-center gap-space-sm rounded-lg active:opacity-90',
        fundo,
        TAMANHOS[size],
        desabilitado && 'opacity-60',
        className,
      )}
      {...props}>
      {temIndicador && (
        <View className="h-5 w-5 items-center justify-center">
          {loading ? <ActivityIndicator color={cor} /> : Icone && <Icone color={cor} size={20} />}
        </View>
      )}
      <Text variant={size === 'lg' ? 'headline' : 'label'} tone={tom}>
        {label}
      </Text>
      {temIndicador && <View className="h-5 w-5" />}
    </Pressable>
  );
}
