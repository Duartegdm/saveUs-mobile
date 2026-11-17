import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { Text } from './text';

export type FolhaInferiorProps = {
  visivel: boolean;
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
};

export function FolhaInferior({ visivel, titulo, onFechar, children }: FolhaInferiorProps) {
  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
      <View className="flex-1 justify-end bg-primary/40">
        <Pressable accessibilityRole="button" accessibilityLabel="Fechar" className="flex-1" onPress={onFechar} />
        <SafeAreaView
          edges={['bottom']}
          style={{
            backgroundColor: colors['surface-container-lowest'],
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}>
          <View className="gap-space-md p-space-lg">
            <Text variant="title" weight="bold">
              {titulo}
            </Text>
            {children}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
