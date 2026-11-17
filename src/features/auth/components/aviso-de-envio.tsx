import { Alert } from '@/components/ui';

type AvisoDeEnvioProps = {
  segundosBloqueado: number;
  erro?: string;
};

export function AvisoDeEnvio({ segundosBloqueado, erro }: AvisoDeEnvioProps) {
  if (segundosBloqueado > 0) {
    return (
      <Alert
        tone="warning"
        title="Muitas tentativas seguidas"
        message={`Por segurança, aguarde ${segundosBloqueado} segundos para tentar de novo.`}
      />
    );
  }

  return erro ? <Alert tone="error" message={erro} /> : null;
}
