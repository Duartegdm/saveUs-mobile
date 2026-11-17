import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCountdown } from '@/hooks/use-countdown';
import { type CadastroForm, cadastroFormSchema } from '@/types/auth';
import { registrar } from '../auth.service';
import { aplicarErroDeAuth } from '../aplicar-erro-de-auth';
import { useAuth } from '../use-auth';

const MENSAGEM_LOGIN_AUTOMATICO_FALHOU = 'Sua conta foi criada. Volte e entre com seu e-mail e senha.';

export function useCadastroForm() {
  const { entrar } = useAuth();
  const bloqueio = useCountdown();
  const form = useForm<CadastroForm>({
    resolver: zodResolver(cadastroFormSchema),
    defaultValues: { nome: '', email: '', senha: '', confirmarSenha: '' },
    mode: 'onTouched',
  });

  const submeter = form.handleSubmit(async ({ nome, email, senha }) => {
    try {
      await registrar({ nome, email, senha });
    } catch (error) {
      aplicarErroDeAuth(error, form, { iniciarBloqueio: bloqueio.iniciar, fieldByStatus: { 409: 'email' } });
      return;
    }

    try {
      await entrar({ email, senha });
    } catch {
      form.setError('root', { type: 'server', message: MENSAGEM_LOGIN_AUTOMATICO_FALHOU });
    }
  });

  const enviar = () => void submeter();

  return { form, enviar, segundosBloqueado: bloqueio.segundosRestantes };
}
