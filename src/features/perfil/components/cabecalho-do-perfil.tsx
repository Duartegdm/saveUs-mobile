import { View } from 'react-native';
import { Badge, Card, Text } from '@/components/ui';
import type { Usuario } from '@/types/usuario';

const ROTULO_DO_PAPEL = { IDOSO: 'Cidadão', GESTOR: 'Gestor' } as const;

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes.at(0)?.charAt(0) ?? '';
  const ultima = partes.length > 1 ? (partes.at(-1)?.charAt(0) ?? '') : '';
  return `${primeira}${ultima}`.toUpperCase();
}

export function CabecalhoDoPerfil({ usuario }: { usuario: Usuario }) {
  return (
    <Card className="flex-row items-center gap-4">
      <View
        importantForAccessibility="no-hide-descendants"
        className="h-16 w-16 items-center justify-center rounded-full bg-primary-container">
        <Text variant="title" weight="bold" tone="inverse">
          {iniciais(usuario.nome)}
        </Text>
      </View>
      <View className="flex-1 gap-1">
        <Text variant="headline" numberOfLines={2}>
          {usuario.nome}
        </Text>
        <Text variant="bodySm" tone="muted" numberOfLines={1}>
          {usuario.email}
        </Text>
        <Badge label={ROTULO_DO_PAPEL[usuario.papel]} tone="success" className="mt-1" />
      </View>
    </Card>
  );
}
