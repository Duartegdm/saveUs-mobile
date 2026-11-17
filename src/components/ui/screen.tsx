import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { cn } from '@/utils/cn';

export type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  rodape?: ReactNode;
  className?: string;
};

export function Screen({ children, scroll = true, edges = ['top'], rodape, className }: ScreenProps) {
  const conteudo = (
    <View className={cn('flex-1 gap-space-md px-gutter-mobile py-space-md', className)}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.surface }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        {scroll ? (
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="flex-grow">
            {conteudo}
          </ScrollView>
        ) : (
          conteudo
        )}
        {rodape && (
          <View className="gap-2 border-t border-outline-variant/40 bg-surface-container-lowest px-gutter-mobile pb-space-md pt-3">
            {rodape}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
