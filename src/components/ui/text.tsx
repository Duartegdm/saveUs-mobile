import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { cn } from '@/utils/cn';

const VARIANTES = {
  display: { tamanho: 'text-display-lg-mobile', peso: 'bold' },
  title: { tamanho: 'text-headline-lg', peso: 'semibold' },
  headline: { tamanho: 'text-headline-sm', peso: 'semibold' },
  bodyLg: { tamanho: 'text-body-lg', peso: 'regular' },
  body: { tamanho: 'text-body-md', peso: 'regular' },
  bodySm: { tamanho: 'text-body-sm', peso: 'regular' },
  label: { tamanho: 'text-label-md', peso: 'semibold' },
  caption: { tamanho: 'text-label-sm', peso: 'bold' },
  metric: { tamanho: 'text-numeric-metric-mobile', peso: 'extrabold' },
} as const;

const PESOS = {
  regular: 'font-jakarta',
  medium: 'font-jakarta-medium',
  semibold: 'font-jakarta-semibold',
  bold: 'font-jakarta-bold',
  extrabold: 'font-jakarta-extrabold',
} as const;

const TONS = {
  default: 'text-on-surface',
  muted: 'text-on-surface-variant',
  primary: 'text-primary',
  secondary: 'text-secondary',
  error: 'text-error',
  inverse: 'text-on-primary',
  onSecondaryContainer: 'text-on-secondary-container',
  onErrorContainer: 'text-on-error-container',
  onTertiaryFixed: 'text-on-tertiary-fixed',
} as const;

export type TextVariant = keyof typeof VARIANTES;
export type TextWeight = keyof typeof PESOS;
export type TextTone = keyof typeof TONS;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  weight?: TextWeight;
  tone?: TextTone;
  className?: string;
};

const VARIANTES_DE_TITULO: TextVariant[] = ['display', 'title'];

export function Text({
  variant = 'body',
  weight,
  tone = 'default',
  className,
  accessibilityRole,
  ...props
}: TextProps) {
  const { tamanho, peso } = VARIANTES[variant];

  return (
    <RNText
      accessibilityRole={accessibilityRole ?? (VARIANTES_DE_TITULO.includes(variant) ? 'header' : undefined)}
      className={cn(tamanho, PESOS[weight ?? peso], TONS[tone], className)}
      {...props}
    />
  );
}
