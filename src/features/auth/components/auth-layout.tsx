import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import { sombraSuave } from '@/theme/sombras';

const logo = require('../../../../assets/images/logo.png');

type AuthLayoutProps = {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
  rodape: ReactNode;
};

export function AuthLayout({ titulo, subtitulo, children, rodape }: AuthLayoutProps) {
  return (
    <View className="flex-1 bg-surface-container-low">
      <OndasDeBrisa />
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="flex-grow justify-center px-gutter-mobile py-space-xl">
            <View
              className="w-full max-w-[420px] self-center rounded-[24px] border border-outline-variant/40 bg-surface-container-lowest px-space-lg py-7"
              style={sombraSuave}>
              <View className="items-center pb-7">
                <Image
                  source={logo}
                  style={{ width: 76, height: 76 }}
                  contentFit="contain"
                  accessibilityLabel="SaveUs"
                />
                <Text variant="title" weight="bold" tone="primary" className="mt-4 text-center">
                  {titulo}
                </Text>
                <Text tone="muted" className="mt-1.5 text-center">
                  {subtitulo}
                </Text>
              </View>

              <View className="gap-5">{children}</View>

              <View className="mt-6 border-t border-outline-variant/40 pt-4">{rodape}</View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function OndasDeBrisa() {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="absolute left-0 right-0 top-0 h-72">
      <Svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="none">
        <Path
          d="M0 0H400V168C352 206 300 140 222 168C144 196 86 132 0 178Z"
          fill={colors.breeze}
          opacity={0.18}
        />
        <Path
          d="M0 0H400V108C344 146 292 86 212 112C132 138 78 92 0 124Z"
          fill={colors.breeze}
          opacity={0.22}
        />
      </Svg>
    </View>
  );
}
