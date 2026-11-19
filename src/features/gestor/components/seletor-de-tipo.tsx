import { type Control, Controller } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui';
import { TIPO_REFUGIO } from '@/constants/tipo-refugio';
import { colors } from '@/theme/colors';
import { type RefugioRequest, tipoRefugioSchema } from '@/types/refugio';
import { cn } from '@/utils/cn';
import type { RefugioForm } from '../refugio-form';

export function SeletorDeTipo({ control }: { control: Control<RefugioForm, unknown, RefugioRequest> }) {
  return (
    <Controller
      control={control}
      name="tipo"
      render={({ field, fieldState }) => (
        <View className="gap-1.5">
          <Text variant="label">
            Tipo de local
            <Text variant="label" tone="error">
              {' *'}
            </Text>
          </Text>
          <View accessibilityRole="radiogroup" className="flex-row flex-wrap gap-2">
            {tipoRefugioSchema.options.map((tipo) => {
              const { rotulo, Icone } = TIPO_REFUGIO[tipo];
              const selecionado = field.value === tipo;

              return (
                <Pressable
                  key={tipo}
                  accessibilityRole="radio"
                  accessibilityLabel={rotulo}
                  accessibilityState={{ checked: selecionado }}
                  onPress={() => field.onChange(tipo)}
                  className={cn(
                    'min-h-12 flex-row items-center gap-2 rounded-xl border-[1.5px] px-3',
                    selecionado ? 'border-secondary bg-secondary-container' : 'border-outline-variant',
                  )}>
                  <Icone
                    color={selecionado ? colors['on-secondary-container'] : colors['on-surface-variant']}
                    size={18}
                  />
                  <Text variant="label" tone={selecionado ? 'onSecondaryContainer' : 'default'}>
                    {rotulo}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {fieldState.error && (
            <Text variant="bodySm" tone="error" accessibilityLiveRegion="polite">
              {fieldState.error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}
