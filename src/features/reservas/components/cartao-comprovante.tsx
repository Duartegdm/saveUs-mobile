import { CalendarDays, Clock, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Alert, Badge, Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import { sombraSuave } from '@/theme/sombras';
import type { Refugio } from '@/types/refugio';
import type { Reserva } from '@/types/reserva';
import { formatarDataHora, formatarDataLonga, formatarHora } from '@/utils/date';

const TAMANHO_DO_QR = 176;

type CartaoComprovanteProps = {
  reserva: Reserva;
  refugio?: Refugio;
};

function Dado({ icone: Icone, titulo, valor }: { icone: LucideIcon; titulo: string; valor: string }) {
  return (
    <View accessible accessibilityLabel={`${titulo}: ${valor}`} className="flex-1 gap-1 rounded-xl bg-surface-container-low p-3">
      <View className="flex-row items-center gap-1.5">
        <Icone color={colors['on-surface-variant']} size={16} />
        <Text variant="caption" weight="regular" tone="muted">
          {titulo}
        </Text>
      </View>
      <Text variant="label" weight="bold">
        {valor}
      </Text>
    </View>
  );
}

function Picote() {
  return (
    <View className="relative my-1 h-6 justify-center" importantForAccessibility="no-hide-descendants">
      <View className="border-t border-dashed border-outline-variant" />
      <View className="absolute -left-9 top-0 h-6 w-6 rounded-full bg-surface" />
      <View className="absolute -right-9 top-0 h-6 w-6 rounded-full bg-surface" />
    </View>
  );
}

export function CartaoComprovante({ reserva, refugio }: CartaoComprovanteProps) {
  const ativa = reserva.status === 'ATIVA';
  const horario = refugio ? `${formatarHora(refugio.abre)} às ${formatarHora(refugio.fecha)}` : 'Consulte no local';

  return (
    <View className="overflow-hidden rounded-[24px] bg-surface-container-lowest" style={sombraSuave}>
      <View className="flex-row items-center justify-between bg-primary-container px-space-lg py-space-md">
        <View accessible accessibilityLabel={`Código da reserva: ${reserva.id}`}>
          <Text variant="caption" weight="regular" tone="inverse">
            Código da reserva
          </Text>
          <Text variant="title" weight="extrabold" tone="inverse">
            #{reserva.id}
          </Text>
        </View>
        <Badge label={ativa ? 'Confirmada' : 'Cancelada'} tone={ativa ? 'success' : 'danger'} />
      </View>

      <View className="gap-space-md px-space-lg py-space-lg">
        {ativa ? (
          <View className="items-center gap-3">
            <View
              accessible
              accessibilityRole="image"
              accessibilityLabel={`QR code da reserva número ${reserva.id}`}
              className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-3">
              <QRCode
                value={`SAVEUS-RESERVA-${reserva.id}`}
                size={TAMANHO_DO_QR}
                color={colors.primary}
                backgroundColor={colors['surface-container-lowest']}
              />
            </View>
            <View className="items-center gap-1">
              <Text variant="label" weight="bold">
                Mostre este código na entrada
              </Text>
              <Text variant="bodySm" tone="muted" className="text-center">
                Se preferir, diga o número {reserva.id} ao atendente.
              </Text>
            </View>
          </View>
        ) : (
          <Alert tone="error" title="Reserva cancelada" message="Este comprovante não vale mais para entrar no refúgio." />
        )}

        <Picote />

        <View className="gap-1">
          <Text variant="caption" weight="regular" tone="muted">
            Refúgio
          </Text>
          <Text variant="headline">{reserva.refugioNome}</Text>
          <Text variant="bodySm" tone="muted">
            {reserva.refugioEndereco}
          </Text>
        </View>

        <View className="flex-row gap-3">
          <Dado icone={CalendarDays} titulo="Data" valor={formatarDataLonga(reserva.dataReserva)} />
          <Dado icone={Clock} titulo="Horário" valor={horario} />
        </View>

        <Text variant="caption" weight="regular" tone="muted" className="text-center">
          Emitida em {formatarDataHora(reserva.criadoEm)}
        </Text>
      </View>
    </View>
  );
}
