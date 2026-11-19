import { router } from 'expo-router';
import { PhoneCall, UserRound } from 'lucide-react-native';
import { View } from 'react-native';
import { Button, Text } from '@/components/ui';
import { usePerfil } from '@/features/perfil/hooks/use-perfil';
import { ligarPara } from '@/utils/ligar';

export function LigarParaContato() {
  const perfil = usePerfil();

  if (!perfil.isSuccess) return null;

  const { contatoEmergenciaNome: nome, contatoEmergenciaTelefone: telefone } = perfil.data;

  if (!telefone) {
    return (
      <View className="gap-2 border-t border-outline-variant/40 pt-4">
        <Text variant="bodySm" tone="muted">
          Cadastre um contato de emergência para ligar para ele com um toque.
        </Text>
        <Button
          label="Cadastrar contato"
          icon={UserRound}
          variant="tonal"
          onPress={() => router.navigate('/perfil')}
        />
      </View>
    );
  }

  const quem = nome ?? 'seu contato de emergência';

  return (
    <View className="gap-2 border-t border-outline-variant/40 pt-4">
      <Text variant="bodySm" tone="muted">
        Avise também alguém de confiança. Seu contato de emergência: {quem}, {telefone}.
      </Text>
      <Button
        label="Ligar para meu contato"
        icon={PhoneCall}
        variant="secondary"
        size="lg"
        accessibilityHint={`Liga para ${quem}`}
        onPress={() => ligarPara(telefone)}
      />
    </View>
  );
}
