import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCountdown } from '@/hooks/use-countdown';
import { type LoginRequest, loginRequestSchema } from '@/types/auth';
import { aplicarErroDeAuth } from '../aplicar-erro-de-auth';
import { useAuth } from '../use-auth';

export function useLoginForm() {
  const { entrar } = useAuth();
  const bloqueio = useCountdown();
  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: { email: '', senha: '' },
  });

  const submeter = form.handleSubmit(async (dados) => {
    try {
      await entrar(dados);
    } catch (error) {
      aplicarErroDeAuth(error, form, { iniciarBloqueio: bloqueio.iniciar });
    }
  });

  const enviar = () => void submeter();

  return { form, enviar, segundosBloqueado: bloqueio.segundosRestantes };
}
