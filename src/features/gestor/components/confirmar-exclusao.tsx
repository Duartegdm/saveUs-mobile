import { Alert, Button, FolhaInferior, Text } from '@/components/ui';
import { ApiError } from '@/services/api';
import type { Refugio } from '@/types/refugio';
import { useExcluirRefugio } from '../hooks/use-acoes-do-refugio';

type ConfirmarExclusaoProps = {
  refugio: Refugio;
  visivel: boolean;
  onFechar: () => void;
  onExcluido: () => void;
};

export function ConfirmarExclusao({ refugio, visivel, onFechar, onExcluido }: ConfirmarExclusaoProps) {
  const exclusao = useExcluirRefugio();
  const erro = exclusao.error;

  const fechar = () => {
    exclusao.reset();
    onFechar();
  };

  return (
    <FolhaInferior visivel={visivel} titulo="Excluir este refúgio?" onFechar={fechar}>
      <Text tone="muted">
        {refugio.nome} será removido do app. Esta ação não pode ser desfeita. Para parar de receber reservas por um
        tempo, prefira pausar o refúgio.
      </Text>
      {erro && <Alert tone="error" title={erro instanceof ApiError ? erro.title : undefined} message={erro.message} />}
      <Button
        label="Sim, excluir refúgio"
        variant="danger"
        loading={exclusao.isPending}
        onPress={() => exclusao.mutate(refugio.id, { onSuccess: onExcluido })}
      />
      <Button label="Manter refúgio" variant="tonal" disabled={exclusao.isPending} onPress={fechar} />
    </FolhaInferior>
  );
}
