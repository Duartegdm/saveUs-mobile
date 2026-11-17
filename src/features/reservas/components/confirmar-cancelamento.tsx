import { Alert, Button, FolhaInferior, Text } from '@/components/ui';
import { ApiError } from '@/services/api';
import type { Reserva } from '@/types/reserva';
import { formatarDataLonga } from '@/utils/date';
import { useCancelarReserva } from '../hooks/use-cancelar-reserva';

type ConfirmarCancelamentoProps = {
  reserva: Reserva | null;
  onFechar: () => void;
};

export function ConfirmarCancelamento({ reserva, onFechar }: ConfirmarCancelamentoProps) {
  const cancelamento = useCancelarReserva();
  const erro = cancelamento.error;

  const fechar = () => {
    cancelamento.reset();
    onFechar();
  };

  const confirmar = () => {
    if (reserva) cancelamento.mutate(reserva, { onSuccess: fechar });
  };

  return (
    <FolhaInferior visivel={reserva !== null} titulo="Cancelar esta reserva?" onFechar={fechar}>
      {reserva && (
        <Text tone="muted">
          Sua vaga em {reserva.refugioNome} para {formatarDataLonga(reserva.dataReserva).toLowerCase()} será liberada
          para outra pessoa.
        </Text>
      )}
      {erro && <Alert tone="error" title={erro instanceof ApiError ? erro.title : undefined} message={erro.message} />}
      <Button label="Sim, cancelar reserva" variant="danger" loading={cancelamento.isPending} onPress={confirmar} />
      <Button label="Manter reserva" variant="tonal" disabled={cancelamento.isPending} onPress={fechar} />
    </FolhaInferior>
  );
}
