import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui';
import { cn } from '@/utils/cn';
import { type DataApi, formatarDataLonga, formatarRotuloDoDia } from '@/utils/date';

type FiltroDataProps = {
  hoje: DataApi;
  datas: DataApi[];
  selecionada: DataApi;
  onSelecionar: (data: DataApi) => void;
};

export function FiltroData({ hoje, datas, selecionada, onSelecionar }: FiltroDataProps) {
  return (
    <View accessibilityRole="tablist" className="flex-row gap-1 rounded-xl bg-surface-container p-1">
      {datas.map((data) => {
        const ativa = data === selecionada;

        return (
          <Pressable
            key={data}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativa }}
            accessibilityLabel={formatarDataLonga(data)}
            onPress={() => onSelecionar(data)}
            className={cn('min-h-12 flex-1 items-center justify-center rounded-lg px-2', ativa && 'bg-primary')}>
            <Text variant="label" tone={ativa ? 'inverse' : 'muted'}>
              {formatarRotuloDoDia(data, hoje)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
