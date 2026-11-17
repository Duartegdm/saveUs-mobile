import { MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Button, FolhaInferior, Input, Text } from '@/components/ui';
import { colors } from '@/theme/colors';

type SeletorBairroProps = {
  bairro: string | null;
  onEscolher: (bairro: string | null) => void;
};

export function SeletorBairro({ bairro, onEscolher }: SeletorBairroProps) {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState('');

  const abrir = () => {
    setTexto(bairro ?? '');
    setAberto(true);
  };

  const escolher = (novo: string | null) => {
    onEscolher(novo);
    setAberto(false);
  };

  return (
    <>
      <View className="flex-row items-center gap-3 rounded-xl bg-surface-container-lowest p-3 shadow-sm">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low">
          <MapPin color={colors.secondary} size={20} />
        </View>
        <View className="flex-1">
          <Text variant="caption" weight="regular" tone="muted">
            Bairro
          </Text>
          <Text variant="label" weight="bold" numberOfLines={1}>
            {bairro ?? 'Todos os bairros'}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Alterar bairro"
          onPress={abrir}
          className="min-h-12 justify-center px-3">
          <Text variant="label" weight="bold" tone="secondary">
            Alterar
          </Text>
        </Pressable>
      </View>

      <FolhaInferior visivel={aberto} titulo="Escolher bairro" onFechar={() => setAberto(false)}>
        <Input
          label="Bairro"
          icon={MapPin}
          placeholder="Ex.: Penha"
          value={texto}
          onChangeText={setTexto}
          autoCapitalize="words"
          returnKeyType="search"
          onSubmitEditing={() => escolher(texto)}
          maxLength={100}
          autoFocus
        />
        <Button label="Ver refúgios deste bairro" disabled={!texto.trim()} onPress={() => escolher(texto)} />
        <Button label="Ver todos os bairros" variant="tonal" onPress={() => escolher(null)} />
      </FolhaInferior>
    </>
  );
}
