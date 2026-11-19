import { Pressable, View } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './text';

export type Segmento<T extends string> = {
  valor: T;
  rotulo: string;
  rotuloAcessivel?: string;
};

export type SegmentosProps<T extends string> = {
  segmentos: Segmento<T>[];
  selecionado: T;
  onSelecionar: (valor: T) => void;
};

export function Segmentos<T extends string>({ segmentos, selecionado, onSelecionar }: SegmentosProps<T>) {
  return (
    <View accessibilityRole="tablist" className="flex-row gap-1 rounded-xl bg-surface-container p-1">
      {segmentos.map(({ valor, rotulo, rotuloAcessivel }) => {
        const ativo = valor === selecionado;

        return (
          <Pressable
            key={valor}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={rotuloAcessivel ?? rotulo}
            onPress={() => onSelecionar(valor)}
            className={cn('min-h-12 flex-1 items-center justify-center rounded-lg px-2', ativo && 'bg-primary')}>
            <Text variant="label" tone={ativo ? 'inverse' : 'muted'} numberOfLines={1}>
              {rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
