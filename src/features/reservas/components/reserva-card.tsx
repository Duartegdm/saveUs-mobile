import { CalendarDays, QrCode, X } from 'lucide-react-native';
import { View } from 'react-native';
import { Button, Card, Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import type { Reserva } from '@/types/reserva';
import { type DataApi, formatarDataLonga } from '@/utils/date';

type ReservaCardProps = {
  reserva: Reserva;
  hoje: DataApi;
  onVerComprovante: () => void;
  onCancelar: () => void;
};

export function ReservaCard({ reserva, hoje, onVerComprovante, onCancelar }: ReservaCardProps) {
  const quando = reserva.dataReserva === hoje ? 'Hoje' : formatarDataLonga(reserva.dataReserva);

  return (
    <Card className="gap-4">
      <View accessible accessibilityLabel={`${quando}. ${reserva.refugioNome}. ${reserva.refugioEndereco}`} className="flex-row gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-secondary-container">
          <CalendarDays color={colors['on-secondary-container']} size={22} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text variant="label" weight="bold" tone="secondary">
            {quando}
          </Text>
          <Text variant="headline" numberOfLines={2}>
            {reserva.refugioNome}
          </Text>
          <Text variant="bodySm" tone="muted" numberOfLines={2}>
            {reserva.refugioEndereco}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Button
          label="Comprovante"
          icon={QrCode}
          onPress={onVerComprovante}
          accessibilityLabel={`Ver comprovante da reserva em ${reserva.refugioNome}`}
          className="flex-1"
        />
        <Button
          label="Cancelar"
          icon={X}
          variant="danger"
          onPress={onCancelar}
          accessibilityLabel={`Cancelar a reserva em ${reserva.refugioNome}`}
          className="flex-1"
        />
      </View>
    </Card>
  );
}
