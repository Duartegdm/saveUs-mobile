import { type Href, Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui';

type LinkAlternativoProps = {
  pergunta: string;
  acao: string;
  href: Href;
  dismissTo?: boolean;
};

export function LinkAlternativo({ pergunta, acao, href, dismissTo = false }: LinkAlternativoProps) {
  return (
    <View className="flex-row flex-wrap items-center justify-center">
      <Text tone="muted">{pergunta}</Text>
      <Link href={href} dismissTo={dismissTo} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${pergunta} ${acao}`}
          className="min-h-12 justify-center px-2">
          <Text variant="label" weight="bold" tone="secondary">
            {acao}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
