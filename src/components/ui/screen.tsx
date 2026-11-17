import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { cn } from '@/utils/cn';

export type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  className?: string;
};

export function Screen({ children, scroll = true, edges = ['top'], className }: ScreenProps) {
  const conteudo = (
    <View className={cn('flex-1 gap-space-md px-gutter-mobile py-space-md', className)}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.surface }}>
      {scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="flex-grow">
          {conteudo}
        </ScrollView>
      ) : (
        conteudo
      )}
    </SafeAreaView>
  );
}
