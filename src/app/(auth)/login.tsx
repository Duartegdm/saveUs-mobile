import { Lock, Mail } from 'lucide-react-native';
import { FormInput } from '@/components/form/form-input';
import { Button } from '@/components/ui';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { AvisoDeEnvio } from '@/features/auth/components/aviso-de-envio';
import { LinkAlternativo } from '@/features/auth/components/link-alternativo';
import { useLoginForm } from '@/features/auth/hooks/use-login-form';

export default function LoginScreen() {
  const { form, enviar, segundosBloqueado } = useLoginForm();
  const {
    control,
    setFocus,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <AuthLayout
      titulo="Entre na sua conta"
      subtitulo="Encontre um refúgio fresco perto de você."
      rodape={<LinkAlternativo pergunta="Ainda não tem conta?" acao="Cadastre-se" href="/cadastro" />}>
      <FormInput
        control={control}
        name="email"
        label="E-mail"
        icon={Mail}
        placeholder="seuemail@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => setFocus('senha')}
      />
      <FormInput
        control={control}
        name="senha"
        label="Senha"
        icon={Lock}
        password
        placeholder="Sua senha"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={enviar}
      />

      <AvisoDeEnvio segundosBloqueado={segundosBloqueado} erro={errors.root?.message} />

      <Button
        label="Entrar"
        size="lg"
        loading={isSubmitting}
        disabled={segundosBloqueado > 0}
        onPress={enviar}
        className="mt-1"
      />
    </AuthLayout>
  );
}
