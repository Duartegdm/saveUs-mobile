import { CircleAlert, Eye, EyeOff, type LucideIcon } from 'lucide-react-native';
import { type ComponentRef, type Ref, useState } from 'react';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';
import { colors } from '@/theme/colors';
import { cn } from '@/utils/cn';
import { Text } from './text';

export type InputProps = Omit<TextInputProps, 'style' | 'placeholderTextColor' | 'secureTextEntry'> & {
  label: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  required?: boolean;
  password?: boolean;
  showCounter?: boolean;
  hideErrorMessage?: boolean;
  ref?: Ref<ComponentRef<typeof TextInput>>;
};

export function Input({
  label,
  error,
  hint,
  icon: Icone,
  required = false,
  password = false,
  showCounter = false,
  hideErrorMessage = false,
  maxLength,
  value,
  editable = true,
  onFocus,
  onBlur,
  ref,
  ...props
}: InputProps) {
  const [focado, setFocado] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const corDoIcone = error ? colors.error : focado ? colors.secondary : colors.outline;
  const IconeDaSenha = senhaVisivel ? EyeOff : Eye;

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center justify-between">
        <Text variant="label">
          {label}
          {required && <Text variant="label" tone="error">{' *'}</Text>}
        </Text>
        {showCounter && maxLength !== undefined && (
          <Text variant="caption" tone="muted">
            {`${value?.length ?? 0}/${maxLength}`}
          </Text>
        )}
      </View>

      <View
        className={cn(
          'h-14 flex-row items-center gap-3 rounded-xl border-[1.5px] px-4',
          editable ? 'bg-surface-container-lowest' : 'bg-surface-container',
          error ? 'border-error' : focado ? 'border-secondary' : 'border-outline-variant',
        )}>
        {Icone && <Icone color={corDoIcone} size={20} />}
        <TextInput
          ref={ref}
          value={value}
          maxLength={maxLength}
          editable={editable}
          secureTextEntry={password && !senhaVisivel}
          placeholderTextColor={colors['on-surface-variant']}
          accessibilityLabel={required ? `${label}, obrigatório` : label}
          accessibilityHint={error ?? hint}
          accessibilityState={{ disabled: !editable }}
          className="flex-1 py-0 font-jakarta text-body-md text-on-surface"
          onFocus={(evento) => {
            setFocado(true);
            onFocus?.(evento);
          }}
          onBlur={(evento) => {
            setFocado(false);
            onBlur?.(evento);
          }}
          {...props}
        />
        {password && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            onPress={() => setSenhaVisivel((visivel) => !visivel)}
            className="-mr-4 h-14 w-14 items-center justify-center">
            <IconeDaSenha color={colors['on-surface-variant']} size={20} />
          </Pressable>
        )}
      </View>

      {error && !hideErrorMessage ? (
        <View className="flex-row items-center gap-1" accessibilityLiveRegion="polite">
          <CircleAlert color={colors.error} size={16} />
          <Text variant="bodySm" tone="error" className="flex-1">
            {error}
          </Text>
        </View>
      ) : (
        hint && (
          <Text variant="bodySm" tone="muted">
            {hint}
          </Text>
        )
      )}
    </View>
  );
}
