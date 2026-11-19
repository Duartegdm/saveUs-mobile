import { Accessibility, Clock, type LucideIcon, MapPin } from 'lucide-react-native';
import { View } from 'react-native';
import { Card, Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import type { Refugio } from '@/types/refugio';
import { formatarHora } from '@/utils/date';

type LinhaProps = {
  icone: LucideIcon;
  titulo: string;
  valor: string;
  detalhe?: string;
};

function Linha({ icone: Icone, titulo, valor, detalhe }: LinhaProps) {
  return (
    <View
      accessible
      accessibilityLabel={[titulo, valor, detalhe].filter(Boolean).join('. ')}
      className="flex-row gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low">
        <Icone color={colors.secondary} size={20} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="caption" weight="regular" tone="muted">
          {titulo}
        </Text>
        <Text>{valor}</Text>
        {detalhe && (
          <Text variant="bodySm" tone="muted">
            {detalhe}
          </Text>
        )}
      </View>
    </View>
  );
}

export function InformacoesDoRefugio({ refugio }: { refugio: Refugio }) {
  return (
    <Card className="gap-4">
      <Text variant="headline" accessibilityRole="header">
        Informações do local
      </Text>
      <Linha
        icone={MapPin}
        titulo="Endereço"
        valor={refugio.endereco}
        detalhe={`${refugio.bairro}, CEP ${refugio.cep}`}
      />
      <Linha
        icone={Clock}
        titulo="Funcionamento"
        valor={`Das ${formatarHora(refugio.abre)} às ${formatarHora(refugio.fecha)}`}
      />
      <Linha
        icone={Accessibility}
        titulo="Acessibilidade"
        valor={refugio.acessivel ? 'Adaptado para cadeira de rodas' : 'Sem adaptação para cadeira de rodas'}
      />
    </Card>
  );
}
