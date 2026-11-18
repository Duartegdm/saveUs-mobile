import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Pressable, Switch, View } from 'react-native';
import { Text } from '@/components/ui';
import { colors } from '@/theme/colors';

type FormSwitchProps<T extends FieldValues, TSaida extends FieldValues = T> = {
  control: Control<T, unknown, TSaida>;
  name: Path<T>;
  label: string;
  descricao?: string;
};

export function FormSwitch<T extends FieldValues, TSaida extends FieldValues = T>({
  control,
  name,
  label,
  descricao,
}: FormSwitchProps<T, TSaida>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const ligado = field.value === true;

        return (
          <Pressable
            accessibilityRole="switch"
            accessibilityLabel={label}
            accessibilityHint={descricao}
            accessibilityState={{ checked: ligado }}
            onPress={() => field.onChange(!ligado)}
            className="min-h-14 flex-row items-center gap-3 rounded-xl border border-outline-variant/60 px-4 py-3">
            <View className="flex-1 gap-0.5">
              <Text variant="label" weight="bold">
                {label}
              </Text>
              {descricao && (
                <Text variant="bodySm" tone="muted">
                  {descricao}
                </Text>
              )}
            </View>
            <Switch
              value={ligado}
              onValueChange={field.onChange}
              trackColor={{ true: colors.secondary, false: colors['surface-container-highest'] }}
              thumbColor={colors['surface-container-lowest']}
              importantForAccessibility="no"
              accessibilityElementsHidden
            />
          </Pressable>
        );
      }}
    />
  );
}
